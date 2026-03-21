"use client";

import { AlertCircle, X } from "lucide-react";

interface ErrorMessageProps {
  title?: string;
  message: string;
  onClose?: () => void;
}

export function ErrorMessage({ title = "Lỗi hệ thống", message, onClose }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div className="relative group animate-in slide-in-from-top-2 duration-500">
      <div className="absolute -inset-0.5 bg-red-500/10 rounded-[var(--r-xl)] blur transition duration-700 group-hover:bg-red-500/20" />
      <div className="relative flex items-start gap-5 p-4 bg-white border border-red-100 rounded-[var(--r-xl)] shadow-lg shadow-red-900/5">
        <div className="w-9 h-9 rounded-2xl bg-red-50 flex items-center justify-center shrink-0">
          <AlertCircle className="w-6 h-6 text-red-500" />
        </div>
        <div className="flex-1 space-y-1 pt-1">
          <h4 className="text-base font-bold text-[var(--text-primary)] tracking-tight leading-none">{title}</h4>
          <p className="text-sm text-[var(--text-secondary)] font-medium leading-relaxed">{message}</p>
        </div>
        {onClose && (
          <button 
            type="button"
            onClick={onClose}
            className="p-2 -mr-2 text-[var(--text-hint)] hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
