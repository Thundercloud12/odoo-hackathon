import { Router, type Router as ExpressRouter } from 'express';
import roleRoutes from './role.routes.js';
import kpiRoutes from './kpi.routes.js';

const router: ExpressRouter = Router();

router.use('/roles', roleRoutes);
router.use('/kpi', kpiRoutes);

export default router;
