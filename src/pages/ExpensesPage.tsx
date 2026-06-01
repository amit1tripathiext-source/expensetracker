import { useEffect, useMemo, useState } from "react";
import { Download, Plus, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExpenseForm } from "@/components/forms/ExpenseForm";
import { PageHeader } from "@/components/layout/PageHeader";
import { formatCurrency } from "@/lib/utils";
import { useExpensesStore } from "@/stores/expensesStore";
import { useUserStore } from "@/stores/userStore";

export function ExpensesPage() {
  const user = useUserStore((state) => state.user);
  const { expenses, fetchExpenses, fetchRules } = useExpensesStore();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!user) return;
    void fetchExpenses(user.id);
    void fetchRules(user.id);
  }, [fetchExpenses, fetchRules, user]);

  const filteredExpenses = useMemo(() => {
    const normalized = query.toLowerCase();
    return expenses.filter((expense) =>
      [expense.item, expense.category, expense.description ?? ""].some((value) => value.toLowerCase().includes(normalized))
    );
  }, [expenses, query]);

  function exportCsv() {
    const header = ["item", "amount", "date", "description", "category"];
    const rows = filteredExpenses.map((expense) =>
      [expense.item, expense.amount, expense.date, expense.description ?? "", expense.category]
        .map((value) => `"${String(value).replaceAll('"', '""')}"`)
        .join(",")
    );
    const blob = new Blob([[header.join(","), ...rows].join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "expenseflow-expenses.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Expenses"
        title="Every transaction gets a lane."
        description="Add expenses with item names and ExpenseFlow applies your keyword rules automatically."
        actions={
          <>
            <Button variant="secondary" onClick={exportCsv} disabled={filteredExpenses.length === 0}>
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4" />
                  Add expense
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add expense</DialogTitle>
                  <DialogDescription>Keyword rules will assign a category before saving.</DialogDescription>
                </DialogHeader>
                <ExpenseForm onSuccess={() => setOpen(false)} />
              </DialogContent>
            </Dialog>
          </>
        }
      />

      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Expense Ledger</CardTitle>
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <Input className="pl-10" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search item, note, category" />
          </div>
        </CardHeader>
        <CardContent>
          {filteredExpenses.length === 0 ? (
            <EmptyState title="No matching expenses" description="Add an expense or adjust your search filter." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium text-white">{expense.item}</TableCell>
                    <TableCell className="max-w-xs truncate">{expense.description || "No note"}</TableCell>
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
