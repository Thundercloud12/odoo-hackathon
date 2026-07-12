import { Router } from 'express';
import { MaintenanceController } from '../controllers/maintenance.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { roleMiddleware } from '../middleware/authorize.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { maintenanceSchema } from '../schemas/maintenance.schema.js';

const router = Router();
const maintenanceController = new MaintenanceController();

// Require authentication for all maintenance routes
router.use(authMiddleware);

// POST /api/v1/maintenances - Record a new vehicle maintenance event
router.post(
  '/',
  roleMiddleware(['ADMIN', 'FLEET_MANAGER']),
  validate(maintenanceSchema),
  maintenanceController.recordMaintenance
);

router.get(
  '/active/:regNo',
  roleMiddleware(['ADMIN', 'FLEET_MANAGER']),
  maintenanceController.getActiveByVehicle
);

router.patch(
  '/:id',
  roleMiddleware(['ADMIN', 'FLEET_MANAGER']),
  maintenanceController.updateMaintenance
);

export default router;
