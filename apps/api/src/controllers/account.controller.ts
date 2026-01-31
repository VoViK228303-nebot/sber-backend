import { Request, Response, NextFunction } from 'express';
import { accountService } from '../services/account.service';
import { ApiResponse } from '../types';
import {
  createAccountSchema,
  updateAccountSchema,
  closeAccountSchema,
  paginationSchema,
  uuidSchema,
} from '../utils/validation';
import { maskAccountNumber, maskCardNumber } from '../utils/formatters';

export class AccountController {
  /**
   * Get all accounts for user
   */
  async getAccounts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { type, currency } = req.query;

      const accounts = await accountService.getAccounts(userId, {
        type: type as string,
        currency: currency as string,
      });

      const response: ApiResponse = {
        success: true,
        data: {
          accounts: accounts.map((account) => ({
            id: account.id,
            type: account.type.toLowerCase(),
            number: account.number,
            maskedNumber: maskAccountNumber(account.number),
            balance: account.balance.toNumber(),
            currency: account.currency,
            name: account.name,
            isActive: account.isActive,
            createdAt: account.createdAt,
            cards: account.cards.map((card) => ({
              id: card.id,
              number: card.number,
              maskedNumber: maskCardNumber(card.number),
              expiryDate: card.expiryDate,
              holderName: card.holderName,
              isVirtual: card.isVirtual,
              isBlocked: card.isBlocked,
            })),
          })),
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new account
   */
  async createAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const data = createAccountSchema.parse(req.body);

      const account = await accountService.createAccount(userId, data);

      const response: ApiResponse = {
        success: true,
        data: {
          account: {
            id: account.id,
            type: account.type.toLowerCase(),
            number: account.number,
            maskedNumber: maskAccountNumber(account.number),
            balance: account.balance.toNumber(),
            currency: account.currency,
            name: account.name,
            isActive: account.isActive,
            createdAt: account.createdAt,
          },
        },
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get account by ID
   */
  async getAccountById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      uuidSchema.parse(id);

      const account = await accountService.getAccountById(userId, id);

      const response: ApiResponse = {
        success: true,
        data: {
          account: {
            id: account.id,
            type: account.type.toLowerCase(),
            number: account.number,
            maskedNumber: maskAccountNumber(account.number),
            balance: account.balance.toNumber(),
            availableBalance: account.availableBalance.toNumber(),
            currency: account.currency,
            name: account.name,
            isActive: account.isActive,
            openedAt: account.openedAt,
            cards: account.cards.map((card) => ({
              id: card.id,
              number: card.number,
              maskedNumber: maskCardNumber(card.number),
              expiryDate: card.expiryDate,
              holderName: card.holderName,
              isVirtual: card.isVirtual,
              isBlocked: card.isBlocked,
            })),
            limits: {
              dailyTransferLimit: account.dailyTransferLimit.toNumber(),
              dailyWithdrawalLimit: account.dailyWithdrawalLimit.toNumber(),
            },
          },
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update account
   */
  async updateAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const data = updateAccountSchema.parse(req.body);

      uuidSchema.parse(id);

      const account = await accountService.updateAccount(userId, id, data);

      const response: ApiResponse = {
        success: true,
        data: {
          account: {
            id: account.id,
            name: account.name,
          },
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Close account
   */
  async closeAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const data = closeAccountSchema.parse(req.body);

      uuidSchema.parse(id);

      await accountService.closeAccount(userId, id, data);

      const response: ApiResponse = {
        success: true,
        data: {
          message: 'Account successfully closed',
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get account transactions
   */
  async getAccountTransactions(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const pagination = paginationSchema.parse(req.query);

      uuidSchema.parse(id);

      const result = await accountService.getAccountTransactions(userId, id, {
        limit: pagination.limit,
        offset: pagination.offset,
      });

      const response: ApiResponse = {
        success: true,
        data: {
          transactions: result.transactions.map((tx) => ({
            id: tx.id,
            type: tx.type.toLowerCase(),
            amount: tx.amount.toNumber(),
            currency: tx.currency,
            description: tx.description,
            category: tx.category,
            balanceAfter: tx.balanceAfter?.toNumber(),
            createdAt: tx.createdAt,
          })),
          pagination: result.pagination,
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const accountController = new AccountController();
