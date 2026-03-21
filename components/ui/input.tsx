import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex h-12 w-full rounded-[var(--r-md)] border-2 border-[var(--border-medium)] bg-white px-4 py-2 text-sm text-[var(--text-primary)] shadow-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[var(--text-hint)] focus-visible:outline-none focus-visible:border-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-red-300 bg-red-50/20 focus-visible:border-red-500",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
