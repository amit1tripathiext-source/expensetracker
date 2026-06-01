import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { todayIso } from "@/lib/utils";
import { useExpensesStore } from "@/stores/expensesStore";
import { useUserStore } from "@/stores/userStore";

type ExpenseFormProps = {
  onSuccess?: () => void;
};

export function ExpenseForm({ onSuccess }: ExpenseFormProps) {
  const user = useUserStore((state) => state.user);
  const addExpense = useExpensesStore((state) => state.addExpense);
  const [item, setItem] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(todayIso());
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      await addExpense({ userId: user.id, item, amount: Number(amount), date, description });
      toast.success("Expense added and categorized");
      setItem("");
      setAmount("");
      setDescription("");
      setDate(todayIso());
      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not add expense");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <Label htmlFor="item">Item</Label>
        <Input id="item" value={item} onChange={(event) => setItem(event.target.value)} placeholder="Uber ride" required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="amount">Amount</Label>
          <Input id="amount" type="number" min="0" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="42.00" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="date" value={date} onChange={(event) => setDate(event.target.value)} required />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Input id="description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Optional note" />
      </div>
      <Button type="submit" disabled={saving}>
        {saving && <Loader2 className="h-4 w-4 animate-spin" />}
        Save expense
      </Button>
    </form>
  );
}
