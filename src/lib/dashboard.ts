import { startOfMonth, isSameMonth, parseISO, format } from "date-fns";
import type { Expense } from "@/types/database";

export function getCurrentMonthExpenses(expenses: Expense[]) {
  const now = new Date();
  return expenses.filter((expense) => isSameMonth(parseISO(expense.date), startOfMonth(now)));
}

export function categoryBreakdown(expenses: Expense[]) {
  const totals = new Map<string, number>();
  expenses.forEach((expense) => {
    totals.set(expense.category, (totals.get(expense.category) ?? 0) + Number(expense.amount));
  });
  return Array.from(totals, ([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
}

export function dailyBreakdown(expenses: Expense[]) {
  const totals = new Map<string, number>();
  expenses.forEach((expense) => {
    const label = format(parseISO(expense.date), "MMM d");
    totals.set(label, (totals.get(label) ?? 0) + Number(expense.amount));
  });
  return Array.from(totals, ([date, amount]) => ({ date, amount }));
}
