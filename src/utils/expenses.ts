import dayjs from "dayjs";
import type { Expense } from "../types/domain";
import { validators } from "./validators";

export const expensesManager = {
  createExpenseId(): string {
    if (
      typeof crypto !== "undefined" &&
      typeof crypto.randomUUID === "function"
    ) {
      return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  },

  addExpense(
    expenses: Expense[],
    payer: string,
    amount: string | number,
    desc: string,
  ): Expense[] {
    const validatedExpense = validators.expense(payer, amount, desc);
    const expense: Expense = {
      id: this.createExpenseId(),
      ...validatedExpense,
      timestamp: dayjs().toISOString(),
    };

    return [...expenses, expense];
  },
};
