import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "secondary" | "destructive" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none hover:cursor-pointer active:scale-95";
    
    const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
      default: "bg-[var(--accent)] text-white shadow-[var(--shadow-sky)] hover:bg-[var(--accent-dark)] hover:shadow-lg",
      secondary: "bg-[var(--bg-muted)] text-[var(--accent)] hover:bg-[var(--accent-tint)] hover:shadow-sm",
      outline: "border-2 border-[var(--border-medium)] bg-white text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] hover:shadow-sm",
      ghost: "hover:bg-[var(--bg-muted)] hover:text-[var(--accent)] text-[var(--text-secondary)]",
      destructive: "bg-red-500 text-white shadow-sm hover:bg-red-600 hover:shadow-md",
      link: "text-[var(--accent)] underline-offset-4 hover:underline p-0 h-auto",
    };
    
    const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
      default: "h-12 px-6 py-2",
      sm: "h-9 px-4 text-xs",
      lg: "h-14 px-10 py-3 text-base",
      icon: "h-12 w-12",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
