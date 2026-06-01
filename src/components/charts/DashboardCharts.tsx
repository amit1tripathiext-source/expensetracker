import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency } from "@/lib/utils";

const COLORS = ["#5eead4", "#86efac", "#60a5fa", "#facc15", "#fb7185", "#c4b5fd"];

type DashboardChartsProps = {
  categoryData: { name: string; value: number }[];
  dailyData: { date: string; amount: number }[];
};

export function DashboardCharts({ categoryData, dailyData }: DashboardChartsProps) {
  return (
    <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Category Split</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          {categoryData.length === 0 ? (
            <EmptyState title="No categories yet" description="Add expenses to see your spending mix." />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={68} outerRadius={105} paddingAngle={4}>
                  {categoryData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} contentStyle={{ background: "#06251f", border: "1px solid rgba(255,255,255,.12)", borderRadius: 16 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Daily Spending</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          {dailyData.length === 0 ? (
            <EmptyState title="No daily trend yet" description="Your current month bars appear here." />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,.08)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,.45)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,.45)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} contentStyle={{ background: "#06251f", border: "1px solid rgba(255,255,255,.12)", borderRadius: 16 }} />
                <Bar dataKey="amount" fill="#5eead4" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
