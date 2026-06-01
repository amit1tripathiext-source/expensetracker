import { NavLink } from "react-router-dom";
import { BarChart3, ChevronLeft, ChevronRight, CreditCard, LineChart, LogOut, Settings, WalletCards } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/stores/userStore";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/expenses", label: "Expenses", icon: CreditCard },
  { href: "/investments", label: "Investments", icon: LineChart },
  { href: "/settings", label: "Settings", icon: Settings }
];

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
};

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const signOut = useUserStore((state) => state.signOut);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 hidden h-screen border-r border-white/10 bg-black/15 p-4 backdrop-blur-xl transition-all md:flex md:flex-col",
        collapsed ? "w-24" : "w-72"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-200/20 bg-emerald-300/15 shadow-button-glow">
            <WalletCards className="h-5 w-5 text-emerald-100" />
          </div>
          {!collapsed && (
            <div>
              <p className="text-lg font-extrabold tracking-tight text-white">ExpenseFlow</p>
              <p className="text-xs text-white/45">Money in motion</p>
            </div>
          )}
        </div>
        <Button variant="ghost" size="icon" onClick={onToggle} aria-label="Toggle sidebar">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="mt-10 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex h-12 items-center gap-3 rounded-full px-4 text-sm font-semibold text-white/60 transition",
                "hover:bg-white/10 hover:text-white",
                isActive && "border border-emerald-200/20 bg-emerald-300/15 text-emerald-50 shadow-button-glow",
                collapsed && "justify-center px-0"
              )
            }
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto">
        <Button variant="secondary" className={cn("w-full", collapsed && "px-0")} onClick={() => void signOut()}>
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>Sign out</span>}
        </Button>
      </div>
    </aside>
  );
}
