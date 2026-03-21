"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  Sparkles, 
  Filter, 
  Clock, 
  User,
  Star,
  ChevronRight,
  PlayCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

const CATEGORIES = ["Hathas", "Vinyasa", "Ashtanga", "Yin Yoga", "Thiền định", "Phục hồi"];

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [aiMode, setAiMode] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const { data, error } = await supabase
      .from("courses")
      .select("*, users!teacher_id(full_name)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      toast.error("Không thể tải danh sách khoá học.");
    } else {
      setCourses(data || []);
    }
    setLoading(false);
  };

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.users as any)?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12">
      {/* Header & Search */}
      <header className="space-y-8">
        <div>
          <h1 className="text-4xl mb-2 font-display">Khám phá lớp học</h1>
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

      {/* AI Suggestions Section */}
      {courses.length > 0 && (
        <section className="space-y-6">
           <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-[var(--accent)]" />
              <h3 className="text-2xl font-display">Nổi bật - Được đặt nhiều nhất</h3>
           </div>
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.slice(0, 3).map((course, i) => (
                 <div key={i} className="p-8 rounded-[var(--r-xl)] bg-white border-2 border-[var(--accent-light)] shadow-sky relative group overflow-hidden transition-all hover:-translate-y-1">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-[var(--accent)]" />
                    <div className="flex justify-between items-start mb-6">
                       <div className="px-3 py-1 rounded-full bg-[var(--accent-tint)] text-[var(--accent)] text-[10px] font-mono font-bold uppercase tracking-wider">
                          {i === 0 ? "Phổ biến nhất" : "Được yêu thích"}
                       </div>
                       <div className="text-[10px] font-mono text-[var(--text-hint)] uppercase">Cấp độ {course.level || 1}</div>
                    </div>
                    <h4 className="text-xl mb-2 group-hover:text-[var(--accent)] transition-colors font-bold">{course.title}</h4>
                    <p className="text-xs text-[var(--text-secondary)] mb-6 flex items-center gap-2">
                       <User className="w-3.5 h-3.5" /> {(course.users as any)?.full_name || "Giảng viên"}
                    </p>
                    {course.description && (
                      <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed mb-6 line-clamp-2">{course.description}</p>
                    )}
                    <Link href={`/student/course/${course.id}`}>
                      <Button className="w-full h-12 bg-[var(--accent)] text-white font-medium rounded-full shadow-md group-hover:shadow-lg transition-all">
                         Xem chi tiết
                      </Button>
                    </Link>
                 </div>
              ))}
           </div>
        </section>
      )}

      {/* All Courses List */}
      <section className="space-y-8">
         <h3 className="text-2xl font-display">Tất cả lớp học</h3>
         {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
               {[1,2,3,4].map(n => <div key={n} className="h-64 bg-slate-100 rounded-[var(--r-lg)] animate-pulse" />)}
            </div>
         ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
               {filteredCourses.map(course => (
                  <Link href={`/student/course/${course.id}`} key={course.id}>
                    <div className="bg-white rounded-[var(--r-lg)] border border-[var(--border)] overflow-hidden shadow-sm hover:shadow-lg transition-all group cursor-pointer h-full">
                       <div className="aspect-[16/10] bg-slate-50 relative border-b border-[var(--bg-muted)]">
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-[var(--text-primary)] border border-[var(--border)]">
                             Lvl {course.level || 1}
                          </div>
                          <div className="w-full h-full flex items-center justify-center text-[var(--text-hint)] opacity-20 group-hover:scale-110 transition-transform duration-700">
                             <PlayCircle className="w-12 h-12" />
                          </div>
                       </div>
                       <div className="p-6">
                          <h4 className="font-bold text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent)] transition-colors line-clamp-1">{course.title}</h4>
                          <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)] mb-6">
                             <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 60m</span>
                             <span className="flex items-center gap-1 font-bold text-orange-500 fill-orange-500"><Star className="w-3.5 h-3.5" /> 5.0</span>
                          </div>
                          <div className="flex items-center justify-between pt-4 border-t border-[var(--bg-muted)]">
                             <div className="text-[10px] label-mono uppercase text-[var(--text-muted)]">Cường độ: {course.intensity || 3}</div>
                             <ChevronRight className="w-5 h-5 text-[var(--text-hint)] group-hover:translate-x-1 transition-transform" />
                          </div>
                       </div>
                    </div>
                  </Link>
               ))}
            </div>
         )}
      </section>
    </div>
  );
}
