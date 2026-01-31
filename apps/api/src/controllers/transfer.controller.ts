import { Request, Response, NextFunction } from 'express';
import { transferService } from '../services/transfer.service';
import { ApiResponse } from '../types';
import {
  createTransferSchema,
  createTransferTemplateSchema,
  transferFiltersSchema,
  paginationSchema,
  uuidSchema,
} from '../utils/validation';
import { maskAccountNumber } from '../utils/formatters';

export class TransferController {
  /**
   * Create a new transfer
   */
  async createTransfer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const data = createTransferSchema.parse(req.body);

      const result = await transferService.createTransfer(userId, data);

      const response: ApiResponse = {
        success: true,
        data: {
          transfer: {
            id: result.transfer.id,
            fromAccountId: result.transfer.fromAccountId,
            toAccountNumber: result.transfer.toAccountNumber,
            amount: result.transfer.amount.toNumber(),
            currency: result.transfer.currency,
            description: result.transfer.description,
            recipientName: result.transfer.recipientName,
            status: result.transfer.status.toLowerCase(),
            createdAt: result.transfer.createdAt,
            completedAt: result.transfer.completedAt,
          },
          newBalance: result.newBalance,
        },
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get transfer history
   */
  async getTransfers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const filters = transferFiltersSchema.parse(req.query);
      const pagination = paginationSchema.parse(req.query);

      const result = await transferService.getTransfers(userId, filters, pagination);

      const response: ApiResponse = {
        success: true,
        data: {
          transfers: result.transfers.map((transfer) => ({
            id: transfer.id,
            type: transfer.userId === userId ? 'outgoing' : 'incoming',
            amount: transfer.amount.toNumber(),
            currency: transfer.currency,
            description: transfer.description,
            recipientName: transfer.recipientName,
            status: transfer.status.toLowerCase(),
            createdAt: transfer.createdAt,
          })),
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
   * Get transfer by ID
   */
  async getTransferById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      uuidSchema.parse(id);

      const transfer = await transferService.getTransferById(userId, id);

      const response: ApiResponse = {
        success: true,
        data: {
          transfer: {
            id: transfer.id,
            fromAccount: transfer.fromAccount
              ? {
                  id: transfer.fromAccount.id,
                  maskedNumber: maskAccountNumber(transfer.fromAccount.number),
                }
              : null,
            toAccountNumber: transfer.toAccountNumber,
            recipientName: transfer.recipientName,
            amount: transfer.amount.toNumber(),
            currency: transfer.currency,
            description: transfer.description,
            status: transfer.status.toLowerCase(),
            commission: transfer.commission.toNumber(),
            createdAt: transfer.createdAt,
            completedAt: transfer.completedAt,
          },
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get transfer templates
   */
  async getTemplates(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;

      const templates = await transferService.getTemplates(userId);

      const response: ApiResponse = {
        success: true,
        data: {
          templates: templates.map((template) => ({
            id: template.id,
            name: template.name,
            toAccountNumber: template.toAccountNumber,
            recipientName: template.recipientName,
            amount: template.amount?.toNumber(),
            currency: template.currency,
            description: template.description,
          })),
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create transfer template
   */
  async createTemplate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const data = createTransferTemplateSchema.parse(req.body);

      const template = await transferService.createTemplate(userId, data);

      const response: ApiResponse = {
        success: true,
        data: {
          template: {
            id: template.id,
            name: template.name,
            toAccountNumber: template.toAccountNumber,
            recipientName: template.recipientName,
            amount: template.amount?.toNumber(),
            currency: template.currency,
            description: template.description,
          },
        },
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete transfer template
   */
  async deleteTemplate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      uuidSchema.parse(id);

      await transferService.deleteTemplate(userId, id);

      const response: ApiResponse = {
        success: true,
        data: {
          message: 'Template deleted',
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const transferController = new TransferController();
