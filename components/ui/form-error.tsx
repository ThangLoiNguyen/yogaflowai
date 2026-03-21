"use client";

import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormErrorProps {
  message?: string;
  className?: string;
}

export function FormError({ message, className }: FormErrorProps) {
  if (!message) return null;

  return (
    <div 
      className={cn(
        "flex items-center gap-1.5 mt-2 text-[10px] font-bold uppercase tracking-wider text-red-500 animate-in fade-in slide-in-from-top-1 duration-300",
        className
      )}
    >
      <AlertCircle className="w-3 h-3" />
      <span>{message}</span>
    </div>
  );
}
