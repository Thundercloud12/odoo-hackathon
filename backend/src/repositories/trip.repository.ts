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

  async getRecentTripsByCompany(companyId: number) {
    return prisma.trip.findMany({
      where: {
        vehicle: {
          company_id: companyId,
        },
      },
      orderBy: {
        created_at: 'desc',
      },
      take: 8,
      select: {
        id: true,
        trip_status: true,
        created_at: true,
        start_trip_at: true,
        vehicle: {
          select: {
            vehicle_model: true,
          },
        },
        driver: {
          select: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }
}
