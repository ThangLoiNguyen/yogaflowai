"use client";

import React, { useState } from "react";
import { 
  Search, 
  Sparkles, 
  Filter, 
  Clock, 
  Zap, 
  User,
  Star,
  ChevronRight,
  Plus,
  PlayCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const CATEGORIES = ["Hathas", "Vinyasa", "Ashtanga", "Yin Yoga", "Thiền định", "Phục hồi"];

const COURSES = [
  { id: 1, title: "Morning Vinyasa Flow", teacher: "Linh Nguyen", level: "Beginner", duration: "45m", intensity: "Moderate", rating: 4.8, students: 240, img_id: "yoga_1" },
  { id: 2, title: "Power Yoga Core", teacher: "Minh Tu", level: "Intermediate", duration: "60m", intensity: "Vigorous", rating: 4.9, students: 180, img_id: "yoga_2" },
  { id: 3, title: "Deep Stretching & Yin", teacher: "Hoang Anh", level: "All levels", duration: "75m", intensity: "Gentle", rating: 5.0, students: 320, img_id: "yoga_3" },
  { id: 4, title: "Ashtanga Primary Series", teacher: "Quoc Huy", level: "Advanced", duration: "90m", intensity: "Vigorous", rating: 4.7, students: 95, img_id: "yoga_4" },
];

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [aiMode, setAiMode] = useState(false);

  return (
    <div className="space-y-12">
      {/* Header & Search */}
      <header className="space-y-8">
        <div>
          <h1 className="text-4xl mb-2">Khám phá lớp học</h1>
          <p className="text-[var(--text-secondary)]">Tìm kiếm lớp tập phù hợp với trạng thái của bạn hôm nay.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-hint)]" />
             <Input 
               placeholder={aiMode ? "Mô tả trạng thái của bạn (Vd: Tôi thấy mỏi vai gáy sau khi ngồi làm việc lâu...)" : "Tìm tên lớp, giáo viên, phong cách..."}
               className={`h-14 pl-12 rounded-[var(--r-md)] border-2 transition-all ${aiMode ? "border-blue-400 bg-blue-50/50 focus:border-blue-500" : "border-[var(--border-medium)] focus:border-[var(--accent)]"}`}
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
          </div>
          <Button 
            onClick={() => setAiMode(!aiMode)}
            className={`h-14 px-8 rounded-full font-bold flex items-center gap-2 transition-all ${aiMode ? "bg-blue-600 text-white shadow-lg" : "bg-white border-2 border-[var(--border-medium)] text-[var(--accent)] hover:bg-blue-50"}`}
          >
            <Sparkles className="w-5 h-5" />
            {aiMode ? "AI Search ON" : "AI Search Mode"}
          </Button>
          <Button variant="outline" className="h-14 w-14 rounded-full border-2 border-[var(--border-medium)] p-0 flex items-center justify-center">
             <Filter className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
           {CATEGORIES.map(cat => (
             <button key={cat} className="px-5 py-2 rounded-full bg-white border border-[var(--border)] text-sm text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all">
                {cat}
             </button>
           ))}
        </div>
      </header>

      {/* AI Suggestions (Only if profile exists) */}
      <section className="space-y-6">
         <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-[var(--accent)]" />
            <h3 className="text-2xl">YogAI Gợi ý cho bạn</h3>
         </div>
         <div className="grid md:grid-cols-3 gap-8">
            {COURSES.slice(0, 3).map((course, i) => (
               <div key={i} className="p-8 rounded-[var(--r-xl)] bg-white border-2 border-[var(--accent-light)] shadow-sky relative group overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-[var(--accent)]" />
                  <div className="flex justify-between items-start mb-6">
                     <div className="px-3 py-1 rounded-full bg-[var(--accent-tint)] text-[var(--accent)] text-[10px] font-mono font-bold uppercase tracking-wider">
                        {i === 0 ? "Best Match" : "High Compatibility"}
                     </div>
                     <div className="text-[var(--accent)] font-bold">98%</div>
                  </div>
                  <h4 className="text-xl mb-2 group-hover:text-[var(--accent)] transition-colors">{course.title}</h4>
                  <p className="text-xs text-[var(--text-secondary)] mb-6 flex items-center gap-2">
                     <User className="w-3.5 h-3.5" /> {course.teacher}
                  </p>
                  <div className="p-4 rounded-[var(--r-md)] bg-blue-50 text-[11px] text-blue-700 leading-relaxed mb-8 italic">
                     "Lớp này tập trung vào mở rộng lồng ngực và cổ tay, rất tốt cho tình trạng mệt mỏi do làm việc văn phòng của bạn."
                  </div>
                  <Link href={`/student/course/${course.id}`}>
                    <Button className="w-full h-12 bg-[var(--accent)] text-white font-medium rounded-full shadow-md group-hover:shadow-lg transition-all">
                       Xem chi tiết
                    </Button>
                  </Link>
               </div>
            ))}
         </div>
      </section>

      {/* All Courses List */}
      <section className="space-y-8">
         <h3 className="text-2xl">Tất cả lớp học</h3>
         <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {COURSES.map(course => (
               <div key={course.id} className="bg-white rounded-[var(--r-lg)] border border-[var(--border)] overflow-hidden shadow-sm hover:shadow-lg transition-all group cursor-pointer">
                  <div className="aspect-[16/10] bg-slate-100 relative">
                     <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-[var(--text-primary)]">
                        {course.level}
                     </div>
                     <div className="w-full h-full flex items-center justify-center text-[var(--text-hint)] opacity-20 group-hover:scale-110 transition-transform duration-700">
                        <PlayCircle className="w-12 h-12" />
                     </div>
                  </div>
                  <div className="p-6">
                     <h4 className="font-bold text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent)] transition-colors">{course.title}</h4>
                     <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)] mb-6">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.duration}</span>
                        <span className="flex items-center gap-1 font-bold text-orange-500 fill-orange-500"><Star className="w-3.5 h-3.5" /> {course.rating}</span>
                     </div>
                     <div className="flex items-center justify-between pt-4 border-t border-[var(--bg-muted)]">
                        <div className="text-[10px] label-mono uppercase text-[var(--text-muted)]">Intensity: {course.intensity}</div>
                        <ChevronRight className="w-5 h-5 text-[var(--text-hint)] group-hover:translate-x-1 transition-transform" />
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </section>
    </div>
  );
}
