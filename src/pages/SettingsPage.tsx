import { useEffect, useState } from "react";
import { Edit2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { RuleForm } from "@/components/forms/RuleForm";
import { PageHeader } from "@/components/layout/PageHeader";
import { useExpensesStore } from "@/stores/expensesStore";
import { useUserStore } from "@/stores/userStore";
import type { CategoryRule } from "@/types/database";

export function SettingsPage() {
  const user = useUserStore((state) => state.user);
  const { rules, fetchRules, deleteRule } = useExpensesStore();
  const [open, setOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<CategoryRule | null>(null);

  useEffect(() => {
    if (!user) return;
    void fetchRules(user.id);
  }, [fetchRules, user]);

  async function handleDelete(id: string) {
    try {
      await deleteRule(id);
      toast.success("Rule deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not delete rule");
    }
  }

  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Settings"
        title="Teach ExpenseFlow your vocabulary."
        description="Category rules match keywords inside item names, case-insensitively. No match falls back to Others."
        actions={
          <Dialog open={open} onOpenChange={(value) => { setOpen(value); if (!value) setEditingRule(null); }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4" />
                Add rule
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingRule ? "Edit rule" : "Add category rule"}</DialogTitle>
                <DialogDescription>Example: uber maps to Transport, swiggy maps to Food.</DialogDescription>
              </DialogHeader>
              <RuleForm rule={editingRule} onSuccess={() => { setOpen(false); setEditingRule(null); }} />
            </DialogContent>
          </Dialog>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Category Rules</CardTitle>
        </CardHeader>
        <CardContent>
          {rules.length === 0 ? (
            <EmptyState title="No rules configured" description="Add rules to automate expense categories." />
          ) : (
            <div className="grid gap-3">
              {rules.map((rule) => (
                <div key={rule.id} className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="secondary">{rule.keyword}</Badge>
                    <span className="text-white/35">maps to</span>
                    <Badge>{rule.category}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setEditingRule(rule);
                        setOpen(true);
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => void handleDelete(rule.id)}>
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
