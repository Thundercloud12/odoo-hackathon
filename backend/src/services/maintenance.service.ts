import { MaintenanceRepository } from '../repositories/maintenance.repository.js';
import { VehicleRepository } from '../repositories/vehicle.repository.js';
import { NotFoundError, ForbiddenError } from '../errors/index.js';
import type { Maintenance, ServiceType } from '@prisma/client';

const maintenanceRepository = new MaintenanceRepository();
const vehicleRepository = new VehicleRepository();

export class MaintenanceService {
  async recordMaintenance(
    companyId: number,
    data: {
      reg_no: string;
      service_type: ServiceType;
      cost: number;
      date: string;
      status: string;
    }
  ): Promise<Maintenance> {
    const vehicle = await vehicleRepository.findByRegistrationNumber(data.reg_no);
    if (!vehicle) {
      throw new NotFoundError(`Vehicle with registration number ${data.reg_no} not found`);
    }

    if (vehicle.company_id !== companyId) {
      throw new ForbiddenError('You do not have permission to access this vehicle');
    }

    return maintenanceRepository.create({
      reg_no: data.reg_no,
      service_type: data.service_type,
      cost: data.cost,
      date: new Date(data.date),
      status: data.status,
    });
  }
}
