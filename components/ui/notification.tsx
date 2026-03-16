"use client";

import React, { useEffect, useState } from 'react';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationProps {
  type: NotificationType;
  title: string;
  description?: string;
  onClose: () => void;
  duration?: number;
}

export function Notification({ 
  type, 
  title, 
  description, 
  onClose, 
  duration = 5000 
}: NotificationProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300); // Wait for fade out animation
  };

  const icons = {
    success: <CheckCircle2 className="w-6 h-6 text-emerald-500" />,
    error: <AlertCircle className="w-6 h-6 text-rose-500" />,
    warning: <AlertTriangle className="w-6 h-6 text-amber-500" />,
    info: <Info className="w-6 h-6 text-sky-500" />,
  };

  const backgrounds = {
    success: "bg-emerald-50 border-emerald-100",
    error: "bg-rose-50 border-rose-100",
    warning: "bg-amber-50 border-amber-100",
    info: "bg-sky-50 border-sky-100",
  };

  const titles = {
    success: "text-emerald-900",
    error: "text-rose-900",
    warning: "text-amber-900",
    info: "text-sky-900",
  };

  return (
    <div 
      className={cn(
        "fixed top-6 right-6 z-[100] w-full max-w-sm overflow-hidden rounded-[2rem] border bg-white p-6 shadow-2xl transition-all duration-300",
        backgrounds[type],
        isExiting ? "opacity-0 translate-x-2 scale-95" : "opacity-100 translate-x-0 scale-100 animate-in slide-in-from-right-4 fade-in"
      )}
    >
      <div className="flex items-start gap-4">
        <div className="shrink-0 p-1">
          {icons[type]}
        </div>
        <div className="flex-1 space-y-1">
          <h4 className={cn("text-sm font-black leading-tight", titles[type])}>{title}</h4>
          {description && (
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              {description}
            </p>
          )}
        </div>
        <button 
          onClick={handleClose}
          className="shrink-0 text-slate-400 hover:text-slate-600 transition-colors p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
