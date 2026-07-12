import { prisma } from '../config/prisma.js';
import type { Prisma, Expenses } from '@prisma/client';

export class ExpenseRepository {
  async create(data: Prisma.ExpensesUncheckedCreateInput): Promise<Expenses> {
    return prisma.expenses.create({ data });
  }
}
