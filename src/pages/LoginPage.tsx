import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, WalletCards } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserStore } from "@/stores/userStore";

export function LoginPage() {
  const { user, loading, initialize, signIn, signUp } = useUserStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "login") {
        await signIn(email, password);
        toast.success("Welcome back");
      } else {
        await signUp(email, password);
        toast.success("Account created. Check your email if confirmation is enabled.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute left-1/2 top-[-14rem] h-[34rem] w-[54rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-teal-300/25 via-emerald-300/20 to-blue-400/25 blur-3xl" />
      <div className="relative grid w-full max-w-5xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <section>
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-200/20 bg-emerald-300/15 shadow-button-glow">
              <WalletCards className="h-6 w-6 text-emerald-100" />
            </div>
            <div>
              <p className="text-xl font-extrabold text-white">ExpenseFlow</p>
              <p className="text-sm text-white/50">Premium flow for everyday money.</p>
            </div>
          </div>
          <h1 className="max-w-2xl text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
            See spending, rules, and investments in one calm cockpit.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/60">
            Categorize expenses as they land, watch monthly charts update, and keep your portfolio signal close without leaving the app.
          </p>
        </section>
        <Card>
          <CardHeader>
            <CardTitle>{mode === "login" ? "Sign in" : "Create account"}</CardTitle>
            <CardDescription>Use your Supabase email and password credentials.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Minimum 6 characters" required />
              </div>
              <Button type="submit" disabled={submitting || loading}>
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {mode === "login" ? "Sign in" : "Sign up"}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setMode((value) => (value === "login" ? "signup" : "login"))}>
                {mode === "login" ? "Need an account?" : "Already have an account?"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
