import type { CategoryRule } from "@/types/database";

export function categorizeExpense(item: string, rules: CategoryRule[]) {
  const normalizedItem = item.trim().toLowerCase();
  const match = rules.find((rule) => {
    const keyword = rule.keyword.trim().toLowerCase();
    return keyword.length > 0 && normalizedItem.includes(keyword);
  });

  return match?.category ?? "Others";
}

export const defaultCategoryRules = [
  { keyword: "uber", category: "Transport" },
  { keyword: "lyft", category: "Transport" },
  { keyword: "metro", category: "Transport" },
  { keyword: "swiggy", category: "Food" },
  { keyword: "zomato", category: "Food" },
  { keyword: "starbucks", category: "Food" },
  { keyword: "netflix", category: "Entertainment" },
  { keyword: "spotify", category: "Entertainment" },
  { keyword: "aws", category: "Software" },
  { keyword: "figma", category: "Software" }
];
