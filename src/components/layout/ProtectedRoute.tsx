import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useUserStore } from "@/stores/userStore";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, initialized, initialize } = useUserStore();

  useEffect(() => {
    void initialize();
  }, [initialize]);

  if (loading || !initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white">
        <div className="glass-card flex items-center gap-3 px-5 py-4">
          <Loader2 className="h-5 w-5 animate-spin text-emerald-200" />
          <span className="text-sm text-white/70">Securing your workspace</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
