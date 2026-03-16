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
      <div className="absolute -inset-0.5 bg-rose-500/10 rounded-[2rem] blur group-hover:bg-rose-500/20 transition duration-700" />
      <div className="relative flex items-start gap-5 p-8 bg-white border border-rose-100 rounded-[2rem] shadow-xl shadow-rose-900/5">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center shrink-0">
          <AlertCircle className="w-7 h-7 text-rose-500" />
        </div>
        <div className="flex-1 space-y-1.5 pt-1">
          <h4 className="text-lg font-black text-slate-900 tracking-tight leading-none">{title}</h4>
          <p className="text-sm text-slate-400 font-medium leading-relaxed">{message}</p>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="p-2 -mr-2 text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
