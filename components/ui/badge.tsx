import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "warning" | "destructive";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants: Record<NonNullable<BadgeProps["variant"]>, string> = {
    default: "border-[var(--border)] bg-[var(--bg-muted)] text-[var(--accent)]",
    secondary: "border-[var(--bg-sky)] bg-[var(--bg-base)] text-[var(--text-primary)]",
    outline: "border-[var(--border-medium)] bg-transparent text-[var(--text-secondary)]",
    success: "border-emerald-200/60 bg-emerald-50 text-emerald-700",
    warning: "border-amber-200/60 bg-amber-50 text-amber-700",
    destructive: "border-red-200/60 bg-red-50 text-red-700",
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
