import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useExpensesStore } from "@/stores/expensesStore";
import { useUserStore } from "@/stores/userStore";
import type { CategoryRule } from "@/types/database";

type RuleFormProps = {
  rule?: CategoryRule | null;
  onSuccess?: () => void;
};

export function RuleForm({ rule, onSuccess }: RuleFormProps) {
  const user = useUserStore((state) => state.user);
  const { addRule, updateRule } = useExpensesStore();
  const [keyword, setKeyword] = useState(rule?.keyword ?? "");
  const [category, setCategory] = useState(rule?.category ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setKeyword(rule?.keyword ?? "");
    setCategory(rule?.category ?? "");
  }, [rule]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      if (rule) {
        await updateRule(rule.id, keyword, category);
        toast.success("Rule updated");
      } else {
        await addRule(user.id, keyword, category);
        toast.success("Rule added");
      }
      setKeyword("");
      setCategory("");
      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save rule");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <Label htmlFor="keyword">Keyword</Label>
        <Input id="keyword" value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="uber" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="category">Category</Label>
        <Input id="category" value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Transport" required />
      </div>
      <Button type="submit" disabled={saving}>{rule ? "Update rule" : "Add rule"}</Button>
    </form>
  );
}
