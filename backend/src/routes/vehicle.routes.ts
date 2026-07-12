import { Router, type Router as ExpressRouter } from 'express';
import { VehicleController } from '../controllers/vehicle.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { CreateVehicleSchema, UpdateVehicleSchema } from '../validators/vehicle.validator.js';

const router: ExpressRouter = Router();
const controller = new VehicleController();

router.use(authMiddleware);

router.get('/', controller.getAll);
router.get('/:regNo', controller.getOne);
router.post('/', validate(CreateVehicleSchema), controller.create);
router.patch('/:regNo', validate(UpdateVehicleSchema), controller.update);
router.delete('/:regNo', controller.remove);

export default router;
