import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "warning" | "destructive";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants: Record<NonNullable<BadgeProps["variant"]>, string> = {
    default: "border-slate-200/60 bg-slate-100 text-slate-700",
    secondary: "border-indigo-200/60 bg-indigo-50 text-indigo-700",
    outline: "border-slate-300 bg-transparent text-slate-700",
    success: "border-emerald-200/60 bg-emerald-50 text-emerald-700",
    warning: "border-amber-200/60 bg-amber-50 text-amber-700",
    destructive: "border-rose-200/60 bg-rose-50 text-rose-700",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
