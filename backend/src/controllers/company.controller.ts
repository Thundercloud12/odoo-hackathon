import type { Request, Response, NextFunction } from 'express';
import { companyService } from '../services/company.service.js';

export const companyController = {
  inviteUser: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const companyId = req.user!.companyId;
      const result = await companyService.inviteUser(
        companyId,
        req.body as {
          name: string;
          email: string;
          roleId: number;
        }
      );
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  listUsers: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const companyId = req.user!.companyId;
      const users = await companyService.listUsers(companyId);
      res.status(200).json({ success: true, data: users });
    } catch (err) {
      next(err);
    }
  },
};
