"use client";

import { Toaster as SonnerToaster, toast as sonnerToast } from "sonner";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        className: "rounded-[2rem] border-none bg-white/80 backdrop-blur-xl p-4 shadow-2xl shadow-indigo-100/50 flex gap-4 min-w-[350px]",
        duration: 4000,
      }}
    />
  );
}

export const toast = {
  success: (title: string, message: string) => {
    sonnerToast.custom((t) => (
      <div className="flex items-start gap-4">
        <div className="w-9 h-9 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Thành công</p>
          <h4 className="text-sm font-black text-slate-900 leading-tight">{title}</h4>
          <p className="text-xs text-slate-400 font-medium leading-relaxed">{message}</p>
        </div>
        <button onClick={() => sonnerToast.dismiss(t)} className="text-slate-200 hover:text-slate-400">
           <X className="w-4 h-4" />
        </button>
      </div>
    ));
  },
  error: (title: string, message: string) => {
    sonnerToast.custom((t) => (
      <div className="flex items-start gap-4">
        <div className="w-9 h-9 rounded-2xl bg-rose-50 flex items-center justify-center shrink-0">
          <AlertCircle className="w-6 h-6 text-rose-500" />
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-600">Lỗi hệ thống</p>
          <h4 className="text-sm font-black text-slate-900 leading-tight">{title}</h4>
          <p className="text-xs text-slate-400 font-medium leading-relaxed">{message}</p>
        </div>
        <button onClick={() => sonnerToast.dismiss(t)} className="text-slate-200 hover:text-slate-400">
           <X className="w-4 h-4" />
        </button>
      </div>
    ));
  },
  warning: (title: string, message: string) => {
    sonnerToast.custom((t) => (
      <div className="flex items-start gap-4">
        <div className="w-9 h-9 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-6 h-6 text-amber-500" />
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600">Cảnh báo</p>
          <h4 className="text-sm font-black text-slate-900 leading-tight">{title}</h4>
          <p className="text-xs text-slate-400 font-medium leading-relaxed">{message}</p>
        </div>
        <button onClick={() => sonnerToast.dismiss(t)} className="text-slate-200 hover:text-slate-400">
           <X className="w-4 h-4" />
        </button>
      </div>
    ));
  },
  info: (title: string, message: string) => {
    sonnerToast.custom((t) => (
      <div className="flex items-start gap-4">
        <div className="w-9 h-9 rounded-2xl bg-sky-50 flex items-center justify-center shrink-0">
          <Info className="w-6 h-6 text-sky-500" />
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-600">Thông báo</p>
          <h4 className="text-sm font-black text-slate-900 leading-tight">{title}</h4>
          <p className="text-xs text-slate-400 font-medium leading-relaxed">{message}</p>
        </div>
        <button onClick={() => sonnerToast.dismiss(t)} className="text-slate-200 hover:text-slate-400">
           <X className="w-4 h-4" />
        </button>
      </div>
    ));
  },
};
