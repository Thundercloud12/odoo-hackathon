import { prisma } from '../config/prisma.js';
import type { Prisma, Maintenance } from '@prisma/client';

export class MaintenanceRepository {
  async create(data: Prisma.MaintenanceUncheckedCreateInput): Promise<Maintenance> {
    return prisma.maintenance.create({ data });
  }

  async sumMaintenanceCostsByVehicle(reg_no: string): Promise<number> {
    const aggregate = await prisma.maintenance.aggregate({
      where: { reg_no },
      _sum: {
        cost: true,
      },
    });
    return aggregate._sum.cost || 0;
  }
}
