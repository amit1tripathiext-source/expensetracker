import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { cn } from "@/lib/utils";

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen">
      <div className="pointer-events-none fixed left-1/2 top-[-18rem] h-[32rem] w-[48rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-teal-300/25 via-emerald-300/20 to-blue-400/25 blur-3xl" />
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} />
      <main className={cn("relative pb-28 transition-all md:pb-0", collapsed ? "md:pl-24" : "md:pl-72")}>
        <Outlet />
      </main>
      <MobileNav />
    </div>
  );
}
