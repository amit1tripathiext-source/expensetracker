import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={cn(
      "flex h-11 w-full rounded-full border px-4 py-2 text-sm outline-none transition placeholder:text-white/40 disabled:cursor-not-allowed disabled:opacity-50",
      "border-white/10 bg-white/10 text-white focus-visible:ring-2 focus-visible:ring-emerald-300/50",
      className
    )}
    ref={ref}
    {...props}
  />
));
Input.displayName = "Input";

export { Input };
