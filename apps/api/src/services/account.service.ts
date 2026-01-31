import { prisma } from '../lib/prisma';
import { Account, Card, AccountType, Prisma } from '@prisma/client';
import {
  NotFoundError,
  ConflictError,
  AccountClosedError,
  InsufficientFundsError,
} from '../utils/errors';
import {
  CreateAccountInput,
  UpdateAccountInput,
  CloseAccountInput,
} from '../types';
import {
  generateAccountNumber,
  generateCardNumber,
  generateExpiryDate,
  generateCVV,
} from '../utils/formatters';

export class AccountService {
  /**
   * Get all accounts for a user
   */
  async getAccounts(userId: string, filters?: { type?: string; currency?: string }): Promise<
    Array<
      Account & {
        cards: Card[];
      }
    >
  > {
    const where: Prisma.AccountWhereInput = {
      userId,
      isClosed: false,
    };

    if (filters?.type) {
      where.type = filters.type as AccountType;
    }

    if (filters?.currency) {
      where.currency = filters.currency;
    }

    const accounts = await prisma.account.findMany({
      where,
      include: {
        cards: {
          where: { isActive: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return accounts;
  }

  /**
   * Get account by ID
   */
  async getAccountById(
    userId: string,
    accountId: string
  ): Promise<Account & { cards: Card[] }> {
    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
        userId,
      },
      include: {
        cards: {
          where: { isActive: true },
        },
      },
    });

    if (!account) {
      throw new NotFoundError('Account');
    }

    return account;
  }

  /**
   * Create a new account
   */
  async createAccount(
    userId: string,
    data: CreateAccountInput
  ): Promise<Account & { cards: Card[] }> {
    // Generate account number
    const accountNumber = generateAccountNumber();

    // Create account
    const account = await prisma.account.create({
      data: {
        userId,
        type: data.type as AccountType,
        number: accountNumber,
        currency: data.currency,
        name: data.name || this.getDefaultAccountName(data.type),
        balance: 0,
        availableBalance: 0,
      },
      include: {
        cards: true,
      },
    });

    // Create a card for the account
    const card = await this.createCard(userId, account.id, data.type === 'CREDIT');

    return {
      ...account,
      cards: [card],
    };
  }

  /**
   * Update account
   */
  async updateAccount(
    userId: string,
    accountId: string,
    data: UpdateAccountInput
  ): Promise<Account> {
    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
        userId,
      },
    });

    if (!account) {
      throw new NotFoundError('Account');
    }

    if (account.isClosed) {
      throw new AccountClosedError();
    }

    const updatedAccount = await prisma.account.update({
      where: { id: accountId },
      data: {
        name: data.name,
      },
    });

    return updatedAccount;
  }

  /**
   * Close account
   */
  async closeAccount(
    userId: string,
    accountId: string,
    data?: CloseAccountInput
  ): Promise<void> {
    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
        userId,
      },
    });

    if (!account) {
      throw new NotFoundError('Account');
    }

    if (account.isClosed) {
      throw new ConflictError('Account is already closed');
    }

    // If account has balance, transfer to another account
    if (account.balance.gt(0)) {
      if (!data?.transferToAccountId) {
        throw new ConflictError(
          'Account has remaining balance. Please specify an account to transfer funds to.'
        );
      }

      const targetAccount = await prisma.account.findFirst({
        where: {
          id: data.transferToAccountId,
          userId,
          isClosed: false,
        },
      });

      if (!targetAccount) {
        throw new NotFoundError('Target account');
      }

      // Transfer remaining balance
      await prisma.$transaction([
        prisma.account.update({
          where: { id: accountId },
          data: {
            balance: { set: 0 },
            availableBalance: { set: 0 },
          },
        }),
        prisma.account.update({
          where: { id: data.transferToAccountId },
          data: {
            balance: { increment: account.balance },
            availableBalance: { increment: account.balance },
          },
        }),
      ]);
    }

    // Close account
    await prisma.account.update({
      where: { id: accountId },
      data: {
        isClosed: true,
        isActive: false,
        closedAt: new Date(),
      },
    });

    // Deactivate all cards
    await prisma.card.updateMany({
      where: { accountId },
      data: { isActive: false },
    });
  }

  /**
   * Get account transactions
   */
  async getAccountTransactions(
    userId: string,
    accountId: string,
    pagination: { limit: number; offset: number }
  ) {
    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
        userId,
      },
    });

    if (!account) {
      throw new NotFoundError('Account');
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where: {
          OR: [{ fromAccountId: accountId }, { toAccountId: accountId }],
        },
        orderBy: { createdAt: 'desc' },
        take: pagination.limit,
        skip: pagination.offset,
      }),
      prisma.transaction.count({
        where: {
          OR: [{ fromAccountId: accountId }, { toAccountId: accountId }],
        },
      }),
    ]);

    return {
      transactions,
      pagination: {
        total,
        limit: pagination.limit,
        offset: pagination.offset,
        hasMore: pagination.offset + pagination.limit < total,
      },
    };
  }

  /**
   * Create a card for an account
   */
  private async createCard(
    userId: string,
    accountId: string,
    isCredit: boolean = false
  ): Promise<Card> {
    // Get user for card holder name
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    const holderName = user
      ? `${user.lastName} ${user.firstName}`.toUpperCase()
      : 'CARD HOLDER';

    const card = await prisma.card.create({
      data: {
        accountId,
        number: generateCardNumber(),
        expiryDate: generateExpiryDate(),
        cvv: generateCVV(),
        holderName,
        isVirtual: false,
      },
    });

    return card;
  }

  /**
   * Get default account name based on type
   */
  private getDefaultAccountName(type: string): string {
    const names: Record<string, string> = {
      DEBIT: 'Дебетовый счёт',
      CREDIT: 'Кредитный счёт',
      SAVINGS: 'Накопительный счёт',
      DEPOSIT: 'Депозитный счёт',
    };
    return names[type] || 'Счёт';
  }

  /**
   * Update daily limits usage
   */
  async resetDailyLimitsIfNeeded(accountId: string): Promise<void> {
    const account = await prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) return;

    const now = new Date();
    const resetDate = new Date(account.limitResetDate);

    // Check if we need to reset (new day)
    if (
      now.getDate() !== resetDate.getDate() ||
      now.getMonth() !== resetDate.getMonth() ||
      now.getFullYear() !== resetDate.getFullYear()
    ) {
      await prisma.account.update({
        where: { id: accountId },
        data: {
          dailyTransferUsed: 0,
          dailyWithdrawalUsed: 0,
          limitResetDate: now,
        },
      });
    }
  }
}

export const accountService = new AccountService();
