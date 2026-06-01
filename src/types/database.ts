export type Expense = {
  id: string;
  user_id: string;
  item: string;
  amount: number;
  date: string;
  description: string | null;
  category: string;
  created_at?: string;
};

export type CategoryRule = {
  id: string;
  user_id: string;
  keyword: string;
  category: string;
  created_at?: string;
};

export type Investment = {
  id: string;
  user_id: string;
  name: string;
  type: string;
  invested_amount: number;
  current_value: number;
  date: string;
  created_at?: string;
};

export type ExpenseInsert = Omit<Expense, "id" | "created_at">;
export type InvestmentInsert = Omit<Investment, "id" | "created_at">;
export type CategoryRuleInsert = Omit<CategoryRule, "id" | "created_at">;
