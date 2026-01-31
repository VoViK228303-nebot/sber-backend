import { prisma } from '../lib/prisma';
import { Transaction, Prisma } from '@prisma/client';
import { NotFoundError } from '../utils/errors';
import { TransactionFilters, PaginationInput } from '../types';

export class TransactionService {
  /**
   * Get transactions for user
   */
  async getTransactions(
    userId: string,
    filters: TransactionFilters,
    pagination: PaginationInput
  ): Promise<{
    transactions: Transaction[];
    total: number;
    hasMore: boolean;
    summary: { income: number; expense: number };
  }> {
    const where: Prisma.TransactionWhereInput = {
      userId,
    };

    if (filters.accountId) {
      where.OR = [
        { fromAccountId: filters.accountId },
        { toAccountId: filters.accountId },
      ];
    }

    if (filters.category) {
      where.category = filters.category;
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

    if (filters.minAmount !== undefined || filters.maxAmount !== undefined) {
      where.amount = {};
      if (filters.minAmount !== undefined) {
        where.amount.gte = filters.minAmount;
      }
      if (filters.maxAmount !== undefined) {
        where.amount.lte = filters.maxAmount;
      }
    }

    const [transactions, total, incomeAgg, expenseAgg] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: pagination.limit,
        skip: pagination.offset,
      }),
      prisma.transaction.count({ where }),
      prisma.transaction.aggregate({
        where: {
          ...where,
          type: { in: ['CREDIT', 'TRANSFER_IN', 'DEPOSIT'] },
        },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: {
          ...where,
          type: { in: ['DEBIT', 'TRANSFER_OUT', 'WITHDRAWAL', 'FEE'] },
        },
        _sum: { amount: true },
      }),
    ]);

    return {
      transactions,
      total,
      hasMore: pagination.offset + pagination.limit < total,
      summary: {
        income: incomeAgg._sum.amount?.toNumber() || 0,
        expense: expenseAgg._sum.amount?.toNumber() || 0,
      },
    };
  }

  /**
   * Get transaction by ID
   */
  async getTransactionById(
    userId: string,
    transactionId: string
  ): Promise<Transaction> {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId,
      },
    });

    if (!transaction) {
      throw new NotFoundError('Transaction');
    }

    return transaction;
  }

  /**
   * Get transaction summary (income/expense)
   */
  async getSummary(
    userId: string,
    period: 'day' | 'week' | 'month' | 'year' = 'month'
  ): Promise<{
    period: string;
    income: number;
    expense: number;
    net: number;
    byCategory: Array<{ category: string; amount: number; type: string }>;
  }> {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'day':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const [incomeAgg, expenseAgg, byCategory] = await Promise.all([
      prisma.transaction.aggregate({
        where: {
          userId,
          createdAt: { gte: startDate },
          type: { in: ['CREDIT', 'TRANSFER_IN', 'DEPOSIT'] },
        },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: {
          userId,
          createdAt: { gte: startDate },
          type: { in: ['DEBIT', 'TRANSFER_OUT', 'WITHDRAWAL', 'FEE'] },
        },
        _sum: { amount: true },
      }),
      prisma.transaction.groupBy({
        by: ['category', 'type'],
        where: {
          userId,
          createdAt: { gte: startDate },
          category: { not: null },
        },
        _sum: { amount: true },
        orderBy: { _sum: { amount: 'desc' } },
      }),
    ]);

    const income = incomeAgg._sum.amount?.toNumber() || 0;
    const expense = expenseAgg._sum.amount?.toNumber() || 0;

    return {
      period,
      income,
      expense,
      net: income - expense,
      byCategory: byCategory.map((item) => ({
        category: item.category || 'uncategorized',
        amount: item._sum.amount?.toNumber() || 0,
        type: item.type,
      })),
    };
  }

  /**
   * Get categories
   */
  getCategories(): Array<{ id: string; name: string; icon: string; color: string }> {
    return [
      { id: 'groceries', name: 'Продукты', icon: 'shopping-cart', color: '#21A038' },
      { id: 'transport', name: 'Транспорт', icon: 'bus', color: '#007AFF' },
      { id: 'entertainment', name: 'Развлечения', icon: 'film', color: '#FF9F0A' },
      { id: 'restaurants', name: 'Рестораны', icon: 'utensils', color: '#FF3B30' },
      { id: 'health', name: 'Здоровье', icon: 'heart', color: '#FF2D55' },
      { id: 'shopping', name: 'Покупки', icon: 'shopping-bag', color: '#5856D6' },
      { id: 'utilities', name: 'Коммунальные услуги', icon: 'home', color: '#8E8E93' },
      { id: 'salary', name: 'Зарплата', icon: 'briefcase', color: '#34C759' },
      { id: 'transfer', name: 'Перевод', icon: 'arrow-left-right', color: '#5AC8FA' },
      { id: 'other', name: 'Другое', icon: 'more-horizontal', color: '#C7C7CC' },
    ];
  }

  /**
   * Create a transaction (used internally)
   */
  async createTransaction(data: {
    userId: string;
    fromAccountId?: string;
    toAccountId?: string;
    amount: number;
    currency: string;
    type: string;
    description?: string;
    category?: string;
    balanceAfter?: number;
  }): Promise<Transaction> {
    const transaction = await prisma.transaction.create({
      data: {
        userId: data.userId,
        fromAccountId: data.fromAccountId,
        toAccountId: data.toAccountId,
        amount: data.amount,
        currency: data.currency,
        type: data.type as Prisma.TransactionCreateInput['type'],
        description: data.description,
        category: data.category,
        balanceAfter: data.balanceAfter,
      },
    });

    return transaction;
  }
}

export const transactionService = new TransactionService();
