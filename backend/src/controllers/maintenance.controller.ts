import type { Request, Response, NextFunction } from 'express';
import { MaintenanceService } from '../services/maintenance.service.js';

const maintenanceService = new MaintenanceService();

export class MaintenanceController {
  async recordMaintenance(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.user!.companyId;
      const maintenance = await maintenanceService.recordMaintenance(companyId, req.body);
      res.status(201).json({
        success: true,
        message: 'Maintenance record created successfully',
        data: maintenance,
      });
    } catch (error) {
      next(error);
    }
  }
}
