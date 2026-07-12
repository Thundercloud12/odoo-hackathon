import { Router } from 'express';
import { ExpenseController } from '../controllers/expense.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { roleMiddleware } from '../middleware/authorize.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { expenseSchema } from '../schemas/expense.schema.js';

const router = Router();
const expenseController = new ExpenseController();

// Require authentication for all expense routes
router.use(authMiddleware);

// POST /api/v1/expenses - Record a new trip-related expense
router.post(
  '/',
  roleMiddleware(['ADMIN', 'FLEET_MANAGER']),
  validate(expenseSchema),
  expenseController.recordExpense
);

export default router;
