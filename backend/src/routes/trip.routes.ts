import { Router, type Router as ExpressRouter } from 'express';
import {
  getTrips,
  getTripById,
  createTrip,
  updateTripStatus,
  getRecentTrips,
} from '../controllers/trip.controller.js';

const router: ExpressRouter = Router();

router.get('/recent/:companyId', getRecentTrips);
router.get('/', getTrips);
router.get('/:id', getTripById);
router.post('/', createTrip);
router.put('/:id/status', updateTripStatus);

export default router;
