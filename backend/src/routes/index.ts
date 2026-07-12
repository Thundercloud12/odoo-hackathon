import { Router, type Router as ExpressRouter } from 'express';
import roleRoutes from './role.routes.js';

const router: ExpressRouter = Router();

router.use('/roles', roleRoutes);
export default router;
