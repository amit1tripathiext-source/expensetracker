import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import type { Investment } from "@/types/database";

type InvestmentsState = {
  investments: Investment[];
  loading: boolean;
  fetchInvestments: (userId: string) => Promise<void>;
  addInvestment: (payload: Omit<Investment, "id" | "created_at">) => Promise<void>;
};

export const useInvestmentsStore = create<InvestmentsState>((set, get) => ({
  investments: [],
  loading: false,
  fetchInvestments: async (userId) => {
    set({ loading: true });
    const { data, error } = await supabase
      .from("investments")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });
    if (error) throw error;
    set({ investments: (data ?? []) as Investment[], loading: false });
  },
  addInvestment: async (payload) => {
    const { data, error } = await supabase.from("investments").insert(payload).select("*").single();
    if (error) throw error;
    set({ investments: [data as Investment, ...get().investments] });
  }
}));
