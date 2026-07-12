import { Router, type Router as ExpressRouter } from 'express';
import {
  getTrips,
  getTripById,
  createTrip,
  updateTripStatus,
} from '../controllers/trip.controller.js';

const router: ExpressRouter = Router();

router.get('/', getTrips);
router.get('/:id', getTripById);
router.post('/', createTrip);
router.put('/:id/status', updateTripStatus);

export default router;
