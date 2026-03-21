"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Clock, Calendar } from "lucide-react";

interface DateTimePickerProps {
  value: string; // ISO string 
  onChange: (value: string) => void;
}

export function DateTimePicker({ value, onChange }: DateTimePickerProps) {
  // Use a local date object for internal calculations
  const [internalDate, setInternalDate] = useState<Date>(() => {
    return value ? new Date(value) : new Date(new Date().getTime() + 60 * 60 * 1000);
  });

  // Sync with value prop if it changes from outside (e.g. after API load)
  useEffect(() => {
    if (value) {
      const d = new Date(value);
      if (d.getTime() !== internalDate.getTime()) {
        setInternalDate(d);
      }
    }
  }, [value]);

  const selectedHour = internalDate.getHours();
  // Round to nearest 15 mins for cleaner UI
  const selectedMinute = Math.floor(internalDate.getMinutes() / 15) * 15;

  const handleDateChange = (date: Date) => {
    const newDate = new Date(date);
    newDate.setHours(selectedHour);
    newDate.setMinutes(selectedMinute);
    newDate.setSeconds(0);
    newDate.setMilliseconds(0);
    setInternalDate(newDate);
    onChange(newDate.toISOString());
  };

  const handleHourChange = (h: number) => {
    const newDate = new Date(internalDate);
    newDate.setHours(h);
    setInternalDate(newDate);
    onChange(newDate.toISOString());
  };

  const handleMinuteChange = (m: number) => {
    const newDate = new Date(internalDate);
    newDate.setMinutes(m);
    setInternalDate(newDate);
    onChange(newDate.toISOString());
  };

  // Generate next 14 days
  const nextDays = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  const hours = Array.from({ length: 16 }).map((_, i) => i + 6); // 6 AM to 9 PM
  const minutes = [0, 15, 30, 45];

  const isToday = (d: Date) => {
    const today = new Date();
    return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
  };

  return (
    <div className="space-y-8 bg-white p-4 rounded-[var(--r-xl)] border-2 border-slate-100 overflow-hidden shadow-sm">
      {/* Date Picker */}
      <div className="space-y-4">
        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 px-1">
           <Calendar className="w-3.5 h-3.5" /> 1. Chọn ngày giảng dạy
        </label>
        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar -mx-2 px-2">
           {nextDays.map((date, i) => (
             <button
               key={i}
               type="button"
               onClick={() => handleDateChange(date)}
               className={`shrink-0 min-w-[90px] h-[90px] flex flex-col items-center justify-center rounded-2xl border-2 transition-all duration-300 ${
                 isSameDay(date, internalDate)
                   ? "bg-emerald-600 border-emerald-600 text-white shadow-xl shadow-emerald-200 -translate-y-1"
                   : "bg-slate-50 border-slate-50 text-slate-400 hover:border-emerald-200 hover:bg-white"
               }`}
             >
               <span className="text-[9px] font-bold uppercase tracking-wider mb-1 opacity-70">
                 {isToday(date) ? "Hôm nay" : date.toLocaleDateString("vi-VN", { weekday: "short" })}
               </span>
               <span className="text-2xl font-display leading-none">{date.getDate()}</span>
               <span className="text-[9px] font-medium mt-1 opacity-70">Tháng {date.getMonth() + 1}</span>
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Hour Picker */}
        <div className="space-y-4">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 px-1">
             <Clock className="w-3.5 h-3.5" /> 2. Chọn giờ bắt đầu
          </label>
          <div className="grid grid-cols-4 gap-2">
             {hours.map(h => (
               <button
                 key={h}
                 type="button"
                 onClick={() => handleHourChange(h)}
                 className={`h-11 rounded-xl border-2 font-bold text-sm transition-all duration-200 ${
                   selectedHour === h
                     ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-100"
                     : "bg-slate-50 border-slate-50 text-slate-400 hover:border-emerald-100 hover:bg-white"
                 }`}
               >
                 {h.toString().padStart(2, "0")}h
               </button>
             ))}
          </div>
        </div>

        {/* Minute Picker */}
        <div className="space-y-4">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 h-3.5" />
          <div className="grid grid-cols-2 gap-3">
             {minutes.map(m => (
               <button
                 key={m}
                 type="button"
                 onClick={() => handleMinuteChange(m)}
                 className={`h-11 rounded-xl border-2 font-bold text-sm transition-all duration-200 ${
                   selectedMinute === m
                     ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-100"
                     : "bg-slate-50 border-slate-50 text-slate-400 hover:border-emerald-100 hover:bg-white"
                 }`}
               >
                 {m.toString().padStart(2, "0")} phút
               </button>
             ))}
          </div>
        </div>
      </div>

      {/* Confirmation Area */}
      <div className="relative mt-4">
        <div className="absolute inset-0 bg-emerald-600 blur-2xl opacity-5 rounded-full" />
        <div className="relative p-5 bg-emerald-50/50 rounded-2xl flex items-center justify-between border border-emerald-100/50">
           <div className="flex flex-col">
              <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Lịch dạy dự kiến</span>
              <span className="text-sm font-medium text-emerald-900">
                 {internalDate.toLocaleDateString("vi-VN", { weekday: 'long', day: 'numeric', month: 'numeric' })}
              </span>
           </div>
           <div className="text-right">
              <span className="text-2xl font-display text-emerald-700">
                 {selectedHour.toString().padStart(2, "0")}:{selectedMinute.toString().padStart(2, "0")}
              </span>
           </div>
        </div>
      </div>
    </div>
  );
}
