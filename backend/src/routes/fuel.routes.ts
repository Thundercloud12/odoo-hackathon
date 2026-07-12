import { Router } from 'express';
import { FuelController } from '../controllers/fuel.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { roleMiddleware } from '../middleware/authorize.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { fuelLogSchema } from '../schemas/fuel.schema.js';

const router = Router();
const fuelController = new FuelController();

// Require authentication for all fuel routes
router.use(authMiddleware);

// POST /api/v1/fuel - Record a new fuel log
router.post(
  '/',
  roleMiddleware(['ADMIN', 'FLEET_MANAGER']),
  validate(fuelLogSchema),
  fuelController.recordFuelLog
);

// GET /api/v1/fuel/:reg_no/operational-cost - Get computed total operational cost
router.get(
  '/:reg_no/operational-cost',
  roleMiddleware(['ADMIN', 'FLEET_MANAGER', 'FINANCIAL_ANALYST']),
  fuelController.getOperationalCost
);

export default router;
