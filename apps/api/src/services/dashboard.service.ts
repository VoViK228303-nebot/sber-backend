import { prisma } from '../lib/prisma';
import { DashboardData } from '../types';
import { maskAccountNumber } from '../utils/formatters';

export class DashboardService {
  /**
   * Get dashboard data for user
   */
  async getDashboardData(userId: string): Promise<DashboardData> {
    // Get all active accounts
    const accounts = await prisma.account.findMany({
      where: {
        userId,
        isClosed: false,
      },
      include: {
        cards: {
          where: { isActive: true },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate total balance (in RUB for simplicity)
    const totalBalance = accounts.reduce((sum, account) => {
      // In real app, would convert currencies
      return sum + account.balance.toNumber();
    }, 0);

    // Get recent transactions
    const recentTransactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    // Get spending by category for current month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const spendingByCategory = await prisma.transaction.groupBy({
      by: ['category'],
      where: {
        userId,
        createdAt: { gte: startOfMonth },
        type: { in: ['DEBIT', 'TRANSFER_OUT'] },
        category: { not: null },
      },
      _sum: { amount: true },
      orderBy: { _sum: { amount: 'desc' } },
      take: 5,
    });

    return {
      totalBalance: {
        amount: totalBalance,
        currency: 'RUB',
      },
      accounts: accounts.map((account) => ({
        id: account.id,
        type: account.type.toLowerCase(),
        maskedNumber: maskAccountNumber(account.number),
        balance: account.balance.toNumber(),
        currency: account.currency,
      })),
      quickActions: [
        {
          id: 'transfer',
          name: 'Перевод',
          icon: 'arrow-left-right',
          route: '/transfers',
        },
        {
          id: 'payment',
          name: 'Оплата',
          icon: 'credit-card',
          route: '/payments',
        },
        {
          id: 'history',
          name: 'История',
          icon: 'history',
          route: '/history',
        },
      ],
      recentTransactions: recentTransactions.map((tx) => ({
        id: tx.id,
        type: tx.type.toLowerCase(),
        amount: tx.amount.toNumber(),
        description: tx.description || 'Без описания',
        createdAt: tx.createdAt,
      })),
      spendingChart: {
        period: 'month',
        data: spendingByCategory.map((item) => ({
          category: item.category || 'other',
          amount: item._sum.amount?.toNumber() || 0,
        })),
      },
    };
  }
}

export const dashboardService = new DashboardService();
