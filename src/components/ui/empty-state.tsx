import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description: string;
  className?: string;
};

export function EmptyState({ title, description, className }: EmptyStateProps) {
  return (
    <div className={cn("rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-8 text-center", className)}>
      <p className="text-base font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm text-white/50">{description}</p>
    </div>
  );
}
