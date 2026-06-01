import { useEffect } from "react";
import { ArrowUpRight, CalendarDays, Sparkles, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DashboardCharts } from "@/components/charts/DashboardCharts";
import { PageHeader } from "@/components/layout/PageHeader";
import { categoryBreakdown, dailyBreakdown, getCurrentMonthExpenses } from "@/lib/dashboard";
import { formatCurrency } from "@/lib/utils";
import { useExpensesStore } from "@/stores/expensesStore";
import { useUserStore } from "@/stores/userStore";

export function DashboardPage() {
  const user = useUserStore((state) => state.user);
  const { expenses, fetchExpenses, fetchRules } = useExpensesStore();

  useEffect(() => {
    if (!user) return;
    void fetchExpenses(user.id);
    void fetchRules(user.id);
  }, [fetchExpenses, fetchRules, user]);

  const monthExpenses = getCurrentMonthExpenses(expenses);
  const totalSpent = monthExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  const categories = categoryBreakdown(monthExpenses);
  const daily = dailyBreakdown(monthExpenses);
  const topCategory = categories[0]?.name ?? "None";
  const averageDaily = daily.length ? totalSpent / daily.length : 0;

  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Dashboard"
        title="Your month, cleanly decoded."
        description="ExpenseFlow turns raw transactions into patterns you can act on without spreadsheet spelunking."
      />

      <section className="grid gap-5 md:grid-cols-3">
        <MetricCard icon={<Wallet className="h-5 w-5" />} label="Total Spent" value={formatCurrency(totalSpent)} detail="Current month" />
        <MetricCard icon={<Sparkles className="h-5 w-5" />} label="Top Category" value={topCategory} detail={categories[0] ? formatCurrency(categories[0].value) : "No spend yet"} />
        <MetricCard icon={<CalendarDays className="h-5 w-5" />} label="Monthly Trend" value={formatCurrency(averageDaily)} detail="Average active day" />
      </section>

      <section className="mt-5">
        <DashboardCharts categoryData={categories} dailyData={daily} />
      </section>

      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {expenses.length === 0 ? (
            <EmptyState title="No expenses yet" description="Add your first expense to populate the dashboard." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.slice(0, 6).map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium text-white">{expense.item}</TableCell>
                    <TableCell><Badge>{expense.category}</Badge></TableCell>
                    <TableCell>{expense.date}</TableCell>
                    <TableCell className="text-right font-semibold text-white">{formatCurrency(Number(expense.amount))}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({ icon, label, value, detail }: { icon: React.ReactNode; label: string; value: string; detail: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="rounded-full border border-white/10 bg-white/10 p-3 text-emerald-100">{icon}</div>
          <ArrowUpRight className="h-5 w-5 text-white/30" />
        </div>
        <p className="mt-5 text-sm text-white/50">{label}</p>
        <p className="mt-2 text-3xl font-extrabold tracking-tight text-white">{value}</p>
        <p className="mt-2 text-sm text-emerald-100/70">{detail}</p>
      </CardContent>
    </Card>
  );
}
