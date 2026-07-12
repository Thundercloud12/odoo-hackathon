import { Router, type Router as ExpressRouter } from 'express';
import roleRoutes from './role.routes.js';
import kpiRoutes from './kpi.routes.js';
import vehicleRoutes from './vehicle.routes.js';
import driverRoutes from './driver.routes.js';

import authRoutes from './auth.routes.js';
import companyRoutes from './company.routes.js';


const router: ExpressRouter = Router();

router.use('/roles', roleRoutes);

router.use('/kpi', kpiRoutes);
router.use('/auth', authRoutes);
router.use('/company', companyRoutes);

router.use('/vehicles', vehicleRoutes);
router.use('/drivers', driverRoutes);

export default router;
