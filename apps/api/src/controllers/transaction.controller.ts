import { Request, Response, NextFunction } from 'express';
import { transactionService } from '../services/transaction.service';
import { ApiResponse } from '../types';
import {
  transactionFiltersSchema,
  paginationSchema,
  uuidSchema,
} from '../utils/validation';

export class TransactionController {
  /**
   * Get transactions
   */
  async getTransactions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const filters = transactionFiltersSchema.parse(req.query);
      const pagination = paginationSchema.parse(req.query);

      const result = await transactionService.getTransactions(
        userId,
        filters,
        pagination
      );

      const response: ApiResponse = {
        success: true,
        data: {
          transactions: result.transactions.map((tx) => ({
            id: tx.id,
            accountId: tx.fromAccountId || tx.toAccountId,
            type: tx.type.toLowerCase(),
            amount: tx.amount.toNumber(),
            currency: tx.currency,
            description: tx.description,
            category: tx.category,
            merchant: tx.merchantName
              ? {
                  name: tx.merchantName,
                  logo: tx.merchantLogo,
                }
              : null,
            balanceAfter: tx.balanceAfter?.toNumber(),
            createdAt: tx.createdAt,
          })),
          summary: result.summary,
          pagination: {
            total: result.total,
            limit: pagination.limit,
            offset: pagination.offset,
            hasMore: result.hasMore,
          },
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get transaction by ID
   */
  async getTransactionById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      uuidSchema.parse(id);

      const tx = await transactionService.getTransactionById(userId, id);

      const response: ApiResponse = {
        success: true,
        data: {
          transaction: {
            id: tx.id,
            accountId: tx.fromAccountId || tx.toAccountId,
            type: tx.type.toLowerCase(),
            amount: tx.amount.toNumber(),
            currency: tx.currency,
            description: tx.description,
            category: tx.category,
            merchant: tx.merchantName
              ? {
                  name: tx.merchantName,
                  address: undefined, // Not stored in DB
                  logo: tx.merchantLogo,
                }
              : null,
            receipt: null, // TODO: Implement receipts
            balanceAfter: tx.balanceAfter?.toNumber(),
            createdAt: tx.createdAt,
          },
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get transaction summary
   */
  async getSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { period } = req.query;

      const summary = await transactionService.getSummary(
        userId,
        (period as 'day' | 'week' | 'month' | 'year') || 'month'
      );

      const response: ApiResponse = {
        success: true,
        data: summary,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get transaction categories
   */
  async getCategories(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = transactionService.getCategories();

      const response: ApiResponse = {
        success: true,
        data: {
          categories,
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const transactionController = new TransactionController();
