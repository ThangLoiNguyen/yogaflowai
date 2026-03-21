"use client";

import React, { useState } from "react";
import { 
  Users, 
  Search, 
  Filter, 
  Flame, 
  AlertTriangle, 
  CheckCircle, 
  ChevronRight,
  Sparkles,
  Zap,
  Clock,
  MessageCircle,
  MoreVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const STUDENTS = [
  { id: 1, name: "Minh Anh", classCount: 12, streak: 5, lastClass: "Vinyasa Core #4", health: ["Đau lưng"], status: "improving", aiAdvice: "Hạn chế tư thế cúi gập sâu." },
  { id: 2, name: "Quoc Huy", classCount: 34, streak: 12, lastClass: "Ashtanga Morning", health: [], status: "normal", aiAdvice: "Khuyến khích tập nâng cao." },
  { id: 3, name: "Thu Trang", classCount: 8, streak: 0, lastClass: "Hatha Basic", health: ["Chấn thương gối"], status: "warning", aiAdvice: "Chú ý gối khi tập tư thế đứng." },
  { id: 4, name: "Hoang Nam", classCount: 5, streak: 2, lastClass: "Yin Yoga", health: ["Huyết áp cao"], status: "normal", aiAdvice: "Tránh các tư thế đảo ngược lâu." },
];

export default function TeacherStudentsPage() {
  const [search, setSearch] = useState("");

  const filteredStudents = STUDENTS.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[var(--border-medium)] mb-4 shadow-sm">
             <Users className="w-4 h-4 text-emerald-600" /> 
             <span className="font-mono text-[9px] tracking-widest text-[var(--text-hint)] uppercase">Danh sách học viên</span>
          </div>
          <h1 className="text-4xl text-[var(--text-primary)] font-display">Học viên của tôi</h1>
          <p className="text-[var(--text-secondary)] mt-2">Quản lý và thấu hiểu trạng thái của học viên qua AI insights.</p>
        </div>
        <div className="flex gap-4">
           <Button variant="outline" className="h-14 px-8 rounded-full border-emerald-200 text-emerald-700 bg-emerald-50/30">
              Xuất báo cáo (CSV)
           </Button>
           <Button className="btn-primary bg-emerald-600 hover:bg-emerald-700 h-14 px-8 rounded-full shadow-lg">
              Nhắn tin toàn thể
           </Button>
        </div>
      </header>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4">
         <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-hint)]" />
            <Input 
              placeholder="Tìm tên học viên, bệnh trạng..."
              className="h-14 pl-12 rounded-[var(--r-md)] border-[var(--border-medium)] focus:border-emerald-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
         </div>
         <Button variant="outline" className="h-14 w-14 rounded-full border-[var(--border-medium)] p-0 flex items-center justify-center bg-white">
            <Filter className="w-5 h-5" />
         </Button>
      </div>

      {/* Students Table/Grid */}
      <div className="bg-white rounded-[var(--r-xl)] border border-[var(--border)] shadow-md overflow-hidden overflow-x-auto">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-slate-50/50 border-b border-[var(--border)]">
                  <th className="px-8 py-6 text-[10px] font-mono uppercase text-[var(--text-muted)] tracking-widest">Học viên</th>
                  <th className="px-8 py-6 text-[10px] font-mono uppercase text-[var(--text-muted)] tracking-widest">Thành tích</th>
                  <th className="px-8 py-6 text-[10px] font-mono uppercase text-[var(--text-muted)] tracking-widest text-center">Health Alert</th>
                  <th className="px-8 py-6 text-[10px] font-mono uppercase text-[var(--text-muted)] tracking-widest">AI Suggestion</th>
                  <th className="px-8 py-6 text-[10px] font-mono uppercase text-[var(--text-muted)] tracking-widest">Hành động</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
               {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors group">
                     <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                           <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ring-2 ring-white shadow-sm ${student.status === 'warning' ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'}`}>
                              {student.name.charAt(0)}
                           </div>
                           <div>
                              <div className="font-bold text-[var(--text-primary)] mb-1 group-hover:text-emerald-700 transition-colors">{student.name}</div>
                              <div className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                                 <Clock className="w-3 h-3" /> Lớp gần nhất: {student.lastClass}
                              </div>
                           </div>
                        </div>
                     </td>
                     <td className="px-8 py-6">
                        <div className="flex items-center gap-8">
                           <div>
                              <div className="text-lg font-bold text-[var(--text-primary)] leading-none mb-1">{student.classCount}</div>
                              <div className="text-[10px] label-mono uppercase text-[var(--text-muted)]">Số lớp</div>
                           </div>
                           <div>
                              <div className="text-lg font-bold text-orange-500 leading-none mb-1 flex items-center gap-1">
                                 <Flame className="w-4 h-4 fill-orange-500" /> {student.streak}
                              </div>
                              <div className="text-[10px] label-mono uppercase text-[var(--text-muted)]">Streak</div>
                           </div>
                        </div>
                     </td>
                     <td className="px-8 py-6">
                        <div className="flex justify-center flex-wrap gap-2">
                           {student.health.length > 0 ? student.health.map(h => (
                              <div key={h} className="px-3 py-1 bg-red-50 text-red-600 border border-red-100 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                 <AlertTriangle className="w-3 h-3" /> {h}
                              </div>
                           )) : (
                              <span className="text-[10px] label-mono text-[var(--text-hint)]">— Khỏe mạnh —</span>
                           )}
                        </div>
                     </td>
                     <td className="px-8 py-6 max-w-md">
                        <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/50 text-[12px] text-emerald-800 leading-relaxed italic relative">
                           <Sparkles className="absolute -top-2 -right-2 w-4 h-4 text-emerald-500 bg-white rounded-full p-0.5 shadow-sm" />
                           {student.aiAdvice}
                        </div>
                     </td>
                     <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                           <Button size="sm" variant="ghost" className="h-10 w-10 p-0 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg">
                              <MessageCircle className="w-5 h-5" />
                           </Button>
                           <Button size="sm" variant="ghost" className="h-10 w-10 p-0 text-slate-300 hover:text-emerald-600 rounded-lg">
                              <ChevronRight className="w-5 h-5" />
                           </Button>
                        </div>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
      
      {/* Quick Access Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
         <div className="p-8 bg-slate-900 rounded-[var(--r-xl)] text-white shadow-lg overflow-hidden relative">
            <div className="absolute top-[-20%] right-[-20%] w-48 h-48 bg-emerald-500/20 rounded-full blur-[60px]" />
            <div className="relative z-10">
               <div className="flex items-center gap-2 mb-6">
                  <Zap className="w-5 h-5 text-emerald-400 fill-emerald-400" />
                  <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-emerald-400">AI Alerts Today</span>
               </div>
               <h4 className="text-xl mb-4 font-display italic">"Bạn có 3 học viên gặp vấn đề về sức mỏi cổ vai gáy."</h4>
               <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-12 rounded-xl mt-6">Xem tất cả Alerts</Button>
            </div>
         </div>
      </div>
    </div>
  );
}
