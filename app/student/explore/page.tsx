"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  Sparkles, 
  Filter, 
  Clock, 
  Star,
  ChevronRight,
  PlayCircle,
  Zap,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const CATEGORIES = ["Hatha", "Vinyasa", "Ashtanga", "Yin Yoga", "Thiền định", "Phục hồi"];

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userFinishedCourseIds, setUserFinishedCourseIds] = useState<string[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const init = async () => {
      await fetchUserProgress();
      await fetchCourses();
    };
    init();
  }, []);

  const fetchUserProgress = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: bookings } = await supabase
      .from("bookings")
      .select(`
        class_sessions!inner (
          course_id,
          status
        )
      `)
      .eq("student_id", user.id);

    if (bookings) {
      const bookedCourseIds = Array.from(new Set(bookings.map(b => (b.class_sessions as any).course_id).filter(Boolean)));
      
      if (bookedCourseIds.length > 0) {
        const { data: sessionCounts } = await supabase
          .from("class_sessions")
          .select("course_id")
          .in("course_id", bookedCourseIds);
        
        const counts: Record<string, number> = {};
        sessionCounts?.forEach(s => {
          counts[s.course_id] = (counts[s.course_id] || 0) + 1;
        });

        const finishedIds: string[] = [];
        bookedCourseIds.forEach(cId => {
          const sessionsInCourse = bookings.filter(b => (b.class_sessions as any).course_id === cId);
          const completedInCourse = sessionsInCourse.filter(b => (b.class_sessions as any).status === 'completed');
          const totalInCourse = counts[cId as string] || 0;

          if (totalInCourse > 0 && completedInCourse.length >= totalInCourse) {
            finishedIds.push(cId as string);
          }
        });
        setUserFinishedCourseIds(finishedIds);
      }
    }
  };

  const fetchCourses = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("courses")
      .select("*, users!teacher_id(full_name, avatar_url)")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Không thể tải danh sách khoá học.");
    } else {
      setCourses(data || []);
    }
    setLoading(false);
  };

  const filteredCourses = courses.filter(c => {
    if (userFinishedCourseIds.includes(c.id)) return false;
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (c.users as any)?.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const tags = Array.isArray(c.tags) ? c.tags.map((t: string) => t.toLowerCase()) : [];
    const matchesCategory = activeCategory 
      ? tags.includes(activeCategory.toLowerCase()) || c.title.toLowerCase().includes(activeCategory.toLowerCase()) || c.description?.toLowerCase().includes(activeCategory.toLowerCase())
      : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      <header className="space-y-6 bg-white p-6 lg:p-8 rounded-[2rem] border border-slate-100 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-sky-100/30 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 bg-sky-50 text-sky-600 rounded-full text-[8px] font-black uppercase tracking-widest border border-sky-100 shadow-sm">
               <Sparkles className="w-3 h-3" /> Thư viện YogAI
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-slate-900 leading-tight border-none">Khám phá <span className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">lộ trình tập</span></h1>
          </div>
          <Button variant="outline" size="sm" className="h-10 w-10 rounded-xl border-slate-100 text-slate-400 p-0 shadow-sm">
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        <div className="relative z-10 space-y-5">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400" />
            <Input 
              placeholder="Tìm tên lớp, giáo viên, kiểu tập..."
              className="h-13 pl-14 rounded-2xl border-slate-100 bg-white shadow-md shadow-sky-900/[0.03] focus:border-sky-500 focus:ring-4 focus:ring-sky-500/5 transition-all text-sm font-bold text-slate-900"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
             {CATEGORIES.map(cat => (
               <button 
                 key={cat} 
                 onClick={() => setActiveCategory(prev => prev === cat ? null : cat)}
                 className={cn(
                   "px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border shadow-sm font-mono",
                   activeCategory === cat 
                    ? 'bg-sky-600 border-sky-600 text-white shadow-lg shadow-sky-300/30' 
                    : 'bg-white border-slate-100 text-slate-400 hover:border-sky-200'
                 )}
               >
                  {cat}
               </button>
             ))}
          </div>
        </div>
      </header>

      <section className="space-y-8">
         <div className="flex items-center justify-between border-b border-slate-50 pb-5 px-3">
            <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Đang hiển thị {filteredCourses.length} lộ trình</h3>
         </div>

         {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
               {[1,2,3,4].map(n => <div key={n} className="h-56 bg-slate-50 rounded-[1.5rem] animate-pulse" />)}
            </div>
         ) : filteredCourses.length === 0 ? (
            <div className="py-24 text-center space-y-4 bg-slate-50/30 rounded-[2rem] border border-dashed border-slate-100">
               <Search className="w-8 h-8 text-slate-200 mx-auto" />
               <p className="text-slate-400 text-xs text-balance">Không tìm thấy lộ trình phù hợp.</p>
            </div>
         ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6">
               {filteredCourses.map((course) => {
                  return (
                    <Link href={`/student/course/${course.id}`} key={course.id}>
                      <div className="group bg-white rounded-[1.75rem] border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-sky-900/5 hover:border-sky-100 transition-all duration-500 cursor-pointer h-full flex flex-col relative">
                         <div className="absolute top-4 left-4 z-20">
                            <div className="px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md border border-white shadow-md flex items-center gap-1 transition-transform group-hover:scale-105">
                               <Zap className="w-2.5 h-2.5 text-sky-500 fill-sky-500" />
                               <span className="text-[8px] font-black uppercase tracking-widest text-slate-700 font-mono">L{course.level || 1}</span>
                            </div>
                         </div>

                         {/* Image Area - Course Description */}
                         <div className="aspect-[16/11] relative overflow-hidden shrink-0 bg-slate-900 border-b border-slate-100 flex items-center justify-center p-5 text-center group-hover:bg-slate-800 transition-all duration-500">
                            <div className="space-y-2">
                               <p className="text-[10px] lg:text-[11px] font-medium text-slate-400 group-hover:text-white/60 line-clamp-4 leading-relaxed">
                                  {course.description || "Hãy bắt đầu hành trình cải thiện sức khỏe cùng YogAI ngay hôm nay."}
                               </p>
                               <div className="pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <PlayCircle className="w-8 h-8 text-sky-500 mx-auto" />
                               </div>
                            </div>
                         </div>

                         <div className="p-5 flex-1 flex flex-col items-center text-center">
                            <div className="text-[8px] text-sky-500 font-black uppercase tracking-[0.2em] mb-2 leading-none">{course.style || "Hatha Flow"}</div>
                            <h4 className="text-sm font-black text-slate-900 mb-4 group-hover:text-sky-600 transition-colors line-clamp-2 leading-tight uppercase tracking-tight border-none shadow-none">{course.title}</h4>
                            
                            <div className="flex items-center gap-4 mb-5 pt-1">
                              <div className="flex items-center gap-1 font-mono text-[9px] text-slate-400 font-black uppercase">
                                 <Clock className="w-3 h-3 text-slate-300" /> 60m
                              </div>
                              <div className="flex items-center gap-1 font-mono text-[9px] text-slate-400 font-black uppercase">
                                 <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> 5.0
                              </div>
                            </div>

                            <div className="mt-auto w-full pt-4 border-t border-slate-50 flex items-center justify-center gap-2">
                               <div className="w-6 h-6 rounded-full bg-slate-50 border border-slate-100 shrink-0 overflow-hidden">
                                  {(course.users as any)?.avatar_url && <img src={(course.users as any).avatar_url} className="w-full h-full object-cover" />}
                                </div>
                               <span className="text-[9px] font-bold text-slate-400 truncate max-w-[80px]">{(course.users as any)?.full_name || "YogAI"}</span>
                            </div>
                         </div>
                      </div>
                    </Link>
                  );
               })}
            </div>
         )}
      </section>
    </div>
  );
}
