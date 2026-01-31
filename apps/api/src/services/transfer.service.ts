import { prisma } from '../lib/prisma';
import { Transfer, TransferStatus, Prisma } from '@prisma/client';
import {
  NotFoundError,
  InsufficientFundsError,
  InvalidAccountError,
  LimitExceededError,
  AccountClosedError,
} from '../utils/errors';
import {
  CreateTransferInput,
  CreateTransferTemplateInput,
  TransferFilters,
  PaginationInput,
} from '../types';
import { accountService } from './account.service';

export class TransferService {
  /**
   * Create a new transfer
   */
  async createTransfer(
    userId: string,
    data: CreateTransferInput
  ): Promise<{ transfer: Transfer; newBalance: number }> {
    // Get source account
    const fromAccount = await prisma.account.findFirst({
      where: {
        id: data.fromAccountId,
        userId,
        isClosed: false,
      },
    });

    if (!fromAccount) {
      throw new NotFoundError('Source account');
    }

    if (!fromAccount.isActive) {
      throw new AccountClosedError();
    }

    // Check if sufficient funds
    if (fromAccount.availableBalance.lt(data.amount)) {
      throw new InsufficientFundsError();
    }

    // Reset daily limits if needed
    await accountService.resetDailyLimitsIfNeeded(fromAccount.id);

    // Check daily transfer limit
    if (fromAccount.dailyTransferUsed.add(data.amount).gt(fromAccount.dailyTransferLimit)) {
      throw new LimitExceededError('Daily transfer limit exceeded');
    }

    // Find target account if it belongs to our system
    const toAccount = await prisma.account.findUnique({
      where: { number: data.toAccountNumber },
      include: { user: true },
    });

    // Create transfer record
    const transfer = await prisma.transfer.create({
      data: {
        userId,
        fromAccountId: data.fromAccountId,
        toAccountNumber: data.toAccountNumber,
        toAccountId: toAccount?.id,
        recipientName: data.recipientName,
        recipientUserId: toAccount?.userId,
        amount: data.amount,
        currency: data.currency,
        description: data.description,
        status: TransferStatus.COMPLETED,
        completedAt: new Date(),
      },
    });

    // Execute transfer in transaction
    await prisma.$transaction(async (tx) => {
      // Deduct from source account
      await tx.account.update({
        where: { id: data.fromAccountId },
        data: {
          balance: { decrement: data.amount },
          availableBalance: { decrement: data.amount },
          dailyTransferUsed: { increment: data.amount },
        },
      });

      // Add to target account if internal
      if (toAccount) {
        await tx.account.update({
          where: { id: toAccount.id },
          data: {
            balance: { increment: data.amount },
            availableBalance: { increment: data.amount },
          },
        });
      }

      // Create transaction records
      await tx.transaction.create({
        data: {
          userId,
          fromAccountId: data.fromAccountId,
          toAccountId: toAccount?.id,
          amount: data.amount,
          currency: data.currency,
          type: 'TRANSFER_OUT',
          status: 'COMPLETED',
          description: data.description || `Transfer to ${data.toAccountNumber}`,
          balanceAfter: fromAccount.balance.sub(data.amount),
        },
      });

      if (toAccount) {
        await tx.transaction.create({
          data: {
            userId: toAccount.userId,
            fromAccountId: data.fromAccountId,
            toAccountId: toAccount.id,
            amount: data.amount,
            currency: data.currency,
            type: 'TRANSFER_IN',
            status: 'COMPLETED',
            description: data.description || `Transfer from ${fromAccount.number}`,
            balanceAfter: toAccount.balance.add(data.amount),
          },
        });
      }
    });

    // Get updated balance
    const updatedAccount = await prisma.account.findUnique({
      where: { id: data.fromAccountId },
    });

    return {
      transfer,
      newBalance: updatedAccount?.balance.toNumber() || 0,
    };
  }

  /**
   * Get transfer history
   */
  async getTransfers(
    userId: string,
    filters: TransferFilters,
    pagination: PaginationInput
  ): Promise<{ transfers: Transfer[]; total: number; hasMore: boolean }> {
    const where: Prisma.TransferWhereInput = {
      userId,
    };

    if (filters.accountId) {
      where.fromAccountId = filters.accountId;
    }

    if (filters.from || filters.to) {
      where.createdAt = {};
      if (filters.from) {
        where.createdAt.gte = filters.from;
      }
      if (filters.to) {
        where.createdAt.lte = filters.to;
      }
    }

    if (filters.type) {
      if (filters.type === 'incoming') {
        where.recipientUserId = userId;
      } else {
        where.userId = userId;
      }
    }

    const [transfers, total] = await Promise.all([
      prisma.transfer.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: pagination.limit,
        skip: pagination.offset,
        include: {
          fromAccount: {
            select: {
              id: true,
              number: true,
            },
          },
        },
      }),
      prisma.transfer.count({ where }),
    ]);

    return {
      transfers,
      total,
      hasMore: pagination.offset + pagination.limit < total,
    };
  }

  /**
   * Get transfer by ID
   */
  async getTransferById(
    userId: string,
    transferId: string
  ): Promise<Transfer & { fromAccount: { id: string; number: string } | null }> {
    const transfer = await prisma.transfer.findFirst({
      where: {
        id: transferId,
        OR: [{ userId }, { recipientUserId: userId }],
      },
      include: {
        fromAccount: {
          select: {
            id: true,
            number: true,
          },
        },
      },
    });

    if (!transfer) {
      throw new NotFoundError('Transfer');
    }

    return transfer;
  }

  /**
   * Create transfer template
   */
  async createTemplate(
    userId: string,
    data: CreateTransferTemplateInput
  ) {
    const template = await prisma.transferTemplate.create({
      data: {
        userId,
        name: data.name,
        toAccountNumber: data.toAccountNumber,
        recipientName: data.recipientName,
        amount: data.amount,
        currency: data.currency,
        description: data.description,
      },
    });

    return template;
  }

  /**
   * Get transfer templates
   */
  async getTemplates(userId: string) {
    const templates = await prisma.transferTemplate.findMany({
      where: {
        userId,
        isActive: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return templates;
  }

  /**
   * Delete transfer template
   */
  async deleteTemplate(userId: string, templateId: string): Promise<void> {
    const template = await prisma.transferTemplate.findFirst({
      where: {
        id: templateId,
        userId,
      },
    });

    if (!template) {
      throw new NotFoundError('Template');
    }

    await prisma.transferTemplate.update({
      where: { id: templateId },
      data: { isActive: false },
    });
  }
}

export const transferService = new TransferService();
