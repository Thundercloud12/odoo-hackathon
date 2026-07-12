import { Router, type Router as ExpressRouter } from 'express';
import { DriverController } from '../controllers/driver.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { CreateDriverSchema, UpdateDriverSchema } from '../validators/driver.validator.js';

const router: ExpressRouter = Router();
const controller = new DriverController();

router.use(authMiddleware);

router.get('/', controller.getAll);
router.get('/:driverId', controller.getOne);
router.post('/', validate(CreateDriverSchema), controller.create);
router.patch('/:driverId', validate(UpdateDriverSchema), controller.update);
router.delete('/:driverId', controller.remove);

export default router;
