import { DriverRepository } from '../repositories/driver.repository.js';
import { ConflictError, NotFoundError } from '../errors/index.js';
import type { Prisma, Driver } from '@prisma/client';

const driverRepository = new DriverRepository();

export class DriverService {
  async findAllDrivers(): Promise<Driver[]> {
    return driverRepository.findAll();
  }

  async findDriverById(driver_id: number): Promise<Driver> {
    const driver = await driverRepository.findById(driver_id);
    if (!driver) {
      throw new NotFoundError(`Driver with ID ${driver_id} not found`);
    }
    return driver;
  }

  async createDriver(data: Prisma.DriverUncheckedCreateInput): Promise<Driver> {
    const existingDriver = await driverRepository.findById(data.driver_id);
    if (existingDriver) {
      throw new ConflictError(`Driver with ID ${data.driver_id} already exists`);
    }
    // Note: If you want to check license_no uniqueness, you'd need another repo method,
    // but the prompt only asked for "driver existence checks".
    return driverRepository.create(data);
  }

  async updateDriver(driver_id: number, data: Prisma.DriverUncheckedUpdateInput): Promise<Driver> {
    await this.findDriverById(driver_id); // check existence
    return driverRepository.update(driver_id, data);
  }

  async deleteDriver(driver_id: number): Promise<void> {
    await this.findDriverById(driver_id); // check existence
    await driverRepository.delete(driver_id);
  }
}
