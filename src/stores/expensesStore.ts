import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { categorizeExpense } from "@/lib/categorization";
import type { CategoryRule, Expense } from "@/types/database";

type ExpensesState = {
  expenses: Expense[];
  rules: CategoryRule[];
  loading: boolean;
  fetchExpenses: (userId: string) => Promise<void>;
  fetchRules: (userId: string) => Promise<void>;
  addExpense: (payload: { userId: string; item: string; amount: number; date: string; description: string }) => Promise<void>;
  addRule: (userId: string, keyword: string, category: string) => Promise<void>;
  updateRule: (id: string, keyword: string, category: string) => Promise<void>;
  deleteRule: (id: string) => Promise<void>;
};

export const useExpensesStore = create<ExpensesState>((set, get) => ({
  expenses: [],
  rules: [],
  loading: false,
  fetchExpenses: async (userId) => {
    set({ loading: true });
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });
    if (error) throw error;
    set({ expenses: (data ?? []) as Expense[], loading: false });
  },
  fetchRules: async (userId) => {
    const { data, error } = await supabase
      .from("category_rules")
      .select("*")
      .eq("user_id", userId)
      .order("keyword");
    if (error) throw error;
    set({ rules: (data ?? []) as CategoryRule[] });
  },
  addExpense: async ({ userId, item, amount, date, description }) => {
    if (get().rules.length === 0) {
      await get().fetchRules(userId);
    }
    const category = categorizeExpense(item, get().rules);
    const { data, error } = await supabase
      .from("expenses")
      .insert({ user_id: userId, item, amount, date, description, category })
      .select("*")
      .single();
    if (error) throw error;
    set({ expenses: [data as Expense, ...get().expenses] });
  },
  addRule: async (userId, keyword, category) => {
    const { data, error } = await supabase
      .from("category_rules")
      .insert({ user_id: userId, keyword, category })
      .select("*")
      .single();
    if (error) throw error;
    set({ rules: [...get().rules, data as CategoryRule].sort((a, b) => a.keyword.localeCompare(b.keyword)) });
  },
  updateRule: async (id, keyword, category) => {
    const { data, error } = await supabase
      .from("category_rules")
      .update({ keyword, category })
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    set({ rules: get().rules.map((rule) => (rule.id === id ? (data as CategoryRule) : rule)) });
  },
  deleteRule: async (id) => {
    const { error } = await supabase.from("category_rules").delete().eq("id", id);
    if (error) throw error;
    set({ rules: get().rules.filter((rule) => rule.id !== id) });
  }
}));
