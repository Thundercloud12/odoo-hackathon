import { z } from 'zod';
import { DriverStatus } from '@prisma/client';

export const CreateDriverSchema = z.object({
  body: z.object({
    license_no: z.string().min(1),
    driver_id: z.number().int().positive(),
    status: z.nativeEnum(DriverStatus),
    safety_score: z.number().nonnegative(),
    license_type: z.string().min(1),
    expiry_date: z.string().datetime(),
  }),
});

export const UpdateDriverSchema = z.object({
  body: z.object({
    status: z.nativeEnum(DriverStatus).optional(),
    safety_score: z.number().nonnegative().optional(),
    license_type: z.string().min(1).optional(),
    expiry_date: z.string().datetime().optional(),
  }),
  params: z.object({
    driverId: z.string().regex(/^\d+$/, 'Driver ID must be a number'),
  }),
});
