import { NavLink } from "react-router-dom";
import { BarChart3, CreditCard, LineChart, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/expenses", label: "Expenses", icon: CreditCard },
  { href: "/investments", label: "Investments", icon: LineChart },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function MobileNav() {
  return (
    <nav className="fixed bottom-3 left-3 right-3 z-40 grid grid-cols-4 rounded-full border border-white/10 bg-black/35 p-2 backdrop-blur-xl md:hidden">
      {navItems.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center gap-1 rounded-full px-2 py-2 text-[11px] font-semibold text-white/55",
              isActive && "bg-emerald-300/15 text-emerald-50"
            )
          }
        >
          <item.icon className="h-4 w-4" />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
