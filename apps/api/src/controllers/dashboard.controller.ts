import { Request, Response, NextFunction } from 'express';
import { dashboardService } from '../services/dashboard.service';
import { ApiResponse } from '../types';

export class DashboardController {
  /**
   * Get dashboard data
   */
  async getDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;

      const data = await dashboardService.getDashboardData(userId);

      const response: ApiResponse = {
        success: true,
        data,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const dashboardController = new DashboardController();
