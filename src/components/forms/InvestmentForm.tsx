import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { todayIso } from "@/lib/utils";
import { useInvestmentsStore } from "@/stores/investmentsStore";
import { useUserStore } from "@/stores/userStore";

type InvestmentFormProps = {
  onSuccess?: () => void;
};

export function InvestmentForm({ onSuccess }: InvestmentFormProps) {
  const user = useUserStore((state) => state.user);
  const addInvestment = useInvestmentsStore((state) => state.addInvestment);
  const [name, setName] = useState("");
  const [type, setType] = useState("Stocks");
  const [investedAmount, setInvestedAmount] = useState("");
  const [currentValue, setCurrentValue] = useState("");
  const [date, setDate] = useState(todayIso());
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      await addInvestment({
        user_id: user.id,
        name,
        type,
        invested_amount: Number(investedAmount),
        current_value: Number(currentValue),
        date
      });
      toast.success("Investment added");
      setName("");
      setInvestedAmount("");
      setCurrentValue("");
      setDate(todayIso());
      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not add investment");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <Label htmlFor="investment-name">Name</Label>
        <Input id="investment-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="S&P 500 ETF" required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label>Type</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Stocks">Stocks</SelectItem>
              <SelectItem value="Mutual Fund">Mutual Fund</SelectItem>
              <SelectItem value="Crypto">Crypto</SelectItem>
              <SelectItem value="Real Estate">Real Estate</SelectItem>
              <SelectItem value="Bonds">Bonds</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="investment-date">Date</Label>
          <Input id="investment-date" type="date" value={date} onChange={(event) => setDate(event.target.value)} required />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="invested">Invested Amount</Label>
          <Input id="invested" type="number" min="0" step="0.01" value={investedAmount} onChange={(event) => setInvestedAmount(event.target.value)} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="current">Current Value</Label>
          <Input id="current" type="number" min="0" step="0.01" value={currentValue} onChange={(event) => setCurrentValue(event.target.value)} required />
        </div>
      </div>
      <Button type="submit" disabled={saving}>
        {saving && <Loader2 className="h-4 w-4 animate-spin" />}
        Save investment
      </Button>
    </form>
  );
}
