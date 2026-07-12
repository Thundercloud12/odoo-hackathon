import type { Request, Response, NextFunction } from 'express';
import { getFleetKpis, type KpiFilters } from '../services/kpi.service.js';

/**
 * GET /api/v1/kpi
 *
 * Query params (all optional):
 *   - vehicleType  : Filter by vehicle type string (e.g. "Truck", "Van")
 *   - vehicleStatus: Informational filter; reserved for future filtering
 *   - region       : Reserved for future filtering (not in DB schema yet)
 */
export async function getKpiHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const filters: KpiFilters = {
      vehicleType: req.query['vehicleType'] as string | undefined,
      vehicleStatus: req.query['vehicleStatus'] as string | undefined,
      region: req.query['region'] as string | undefined,
    };

    const kpis = await getFleetKpis(filters);

    res.status(200).json({
      success: true,
      data: kpis,
      filters, // echo filters back for transparency
    });
  } catch (error) {
    next(error);
  }
}
