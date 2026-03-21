"use client";

import React from "react";
import {
  Users,
  MessageCircle,
  ArrowRight,
  Flame,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Student {
  id: string;
  name: string;
  avatar: string;
  email: string;
  joinDate: string;
  streak: number;
  health: string | null;
  goals: string[];
  experience: number;
  fitness: number;
  lastClass: string;
  classCount: number;
}

export function TeacherStudentList({ students }: { students: Student[] }) {
  return (
    <div className="flex flex-col h-full gap-4">
      {/* Student List */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3 pb-20">
        {students.length > 0 ? students.map((s) => (
          <Link
            key={s.id}
            href={`/teacher/ai-insights?student=${s.id}`}
            className="group flex items-center justify-between p-4 bg-white border border-slate-50 rounded-[1.5rem] shadow-sm hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer relative z-0"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 txt-title border-none shadow-sm">
                {s.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <h3 className="txt-content font-bold text-slate-700 leading-none mb-1 group-hover:text-emerald-600 transition-colors uppercase truncate">{s.name}</h3>
                <div className="txt-action text-slate-300 opacity-80 flex items-center gap-1 truncate">
                  <Clock className="w-3 h-3 shrink-0" /> {s.lastClass.length > 25 ? s.lastClass.substring(0, 25) + '...' : s.lastClass}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-4">
                <div className="text-center">
                  <div className="txt-content font-bold text-slate-700 leading-tight">{s.classCount}</div>
                  <div className="txt-action text-slate-200" style={{ fontSize: '8px' }}>Số lớp</div>
                </div>
                <div className="text-center">
                  <div className="txt-content font-bold text-orange-500 leading-tight flex items-center justify-center gap-1">
                    <Flame className="w-3 h-3 fill-orange-500" /> {s.streak}
                  </div>
                  <div className="txt-action text-slate-200" style={{ fontSize: '8px' }}>Streak</div>
                </div>
              </div>
              <div className={`px-3 py-1.5 rounded-xl border txt-action ${s.health ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                {s.health ? 'ALERT' : 'HEALTHY'}
              </div>
            </div>
          </Link>
        )) : (
          <div className="py-20 text-center text-slate-300 italic">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-10" />
            <p className="txt-content">Chưa có học viên nào tham gia.</p>
          </div>
        )}
      </div>
    </div>
  );
}
