import { useEffect, useState } from "react";
import { Plus, TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { InvestmentForm } from "@/components/forms/InvestmentForm";
import { PageHeader } from "@/components/layout/PageHeader";
import { formatCurrency } from "@/lib/utils";
import { useInvestmentsStore } from "@/stores/investmentsStore";
import { useUserStore } from "@/stores/userStore";

export function InvestmentsPage() {
  const user = useUserStore((state) => state.user);
  const { investments, fetchInvestments } = useInvestmentsStore();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    void fetchInvestments(user.id);
  }, [fetchInvestments, user]);

  const totalInvested = investments.reduce((sum, item) => sum + Number(item.invested_amount), 0);
  const totalCurrent = investments.reduce((sum, item) => sum + Number(item.current_value), 0);
  const profitLoss = totalCurrent - totalInvested;

  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Investments"
        title="Portfolio signal beside spending reality."
        description="Track committed capital, current value, and profit/loss with the same quiet workspace."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4" />
                Add investment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add investment</DialogTitle>
                <DialogDescription>Log a position with its current value.</DialogDescription>
              </DialogHeader>
              <InvestmentForm onSuccess={() => setOpen(false)} />
            </DialogContent>
          </Dialog>
        }
      />

      <section className="grid gap-5 md:grid-cols-3">
        <SummaryCard label="Total Invested" value={formatCurrency(totalInvested)} tone="neutral" />
        <SummaryCard label="Current Value" value={formatCurrency(totalCurrent)} tone="positive" />
        <SummaryCard label="Profit / Loss" value={formatCurrency(profitLoss)} tone={profitLoss >= 0 ? "positive" : "negative"} />
      </section>

      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          {investments.length === 0 ? (
            <EmptyState title="No investments yet" description="Add a position to start tracking portfolio value." />
          ) : (
            <div className="grid gap-3">
              {investments.map((investment) => {
                const delta = Number(investment.current_value) - Number(investment.invested_amount);
                return (
                  <div key={investment.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-white">{investment.name}</h3>
                          <Badge variant="secondary">{investment.type}</Badge>
                        </div>
                        <p className="mt-1 text-sm text-white/45">{investment.date}</p>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-right">
                        <Value label="Invested" value={formatCurrency(Number(investment.invested_amount))} />
                        <Value label="Current" value={formatCurrency(Number(investment.current_value))} />
                        <Value label="P/L" value={formatCurrency(delta)} className={delta >= 0 ? "text-emerald-100" : "text-red-100"} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryCard({ label, value, tone }: { label: string; value: string; tone: "neutral" | "positive" | "negative" }) {
  const Icon = tone === "negative" ? TrendingDown : TrendingUp;
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-white/50">{label}</p>
          <Icon className={tone === "negative" ? "h-5 w-5 text-red-200" : "h-5 w-5 text-emerald-100"} />
        </div>
        <p className="mt-5 text-3xl font-extrabold tracking-tight text-white">{value}</p>
      </CardContent>
    </Card>
  );
}

function Value({ label, value, className = "text-white" }: { label: string; value: string; className?: string }) {
  return (
    <div>
      <p className="text-xs text-white/40">{label}</p>
      <p className={`mt-1 font-semibold ${className}`}>{value}</p>
    </div>
  );
}
