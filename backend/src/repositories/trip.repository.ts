import { prisma } from '../config/prisma.js';

export class TripRepository {
  async findByIdWithOwner(id: number) {
    return prisma.trip.findUnique({
      where: { id },
      include: {
        vehicle: true,
      },
    });
  }
}
