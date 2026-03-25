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
  PlayCircle,
  X,
  Target,
  BrainCircuit,
  Zap,
  CheckCircle2
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
  const [isAiMode, setIsAiMode] = useState(false);
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
      const courseStats: Record<string, { total: number, completed: number }> = {};
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
      .select("*, users!teacher_id(full_name)")
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
      {/* Header & Improved Search */}
      <header className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 leading-tight mb-1 italic">Khám phá lộ trình</h1>
            <p className="text-[11px] text-slate-400 font-mono uppercase tracking-[0.2em] italic opacity-60">Tìm kiếm lớp tập phù hợp với mục tiêu của bạn.</p>
          </div>
          <div className="flex items-center gap-2">
             <Button 
               variant="ghost" 
               size="sm"
               onClick={() => setIsAiMode(!isAiMode)}
               className={cn(
                 "h-10 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all gap-2 border shadow-sm",
                 isAiMode ? "bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-200" : "bg-white border-slate-200 text-slate-400 font-bold"
               )}
             >
               <Sparkles className={cn("w-4 h-4", isAiMode ? "text-sky-400" : "text-slate-300")} />
               {isAiMode ? "Đang bật chế độ AI" : "Tìm kiếm bằng AI"}
             </Button>
             <Button variant="outline" size="sm" className="h-10 w-10 rounded-2xl border-slate-200 text-slate-300 p-0">
               <Filter className="w-4 h-4" />
             </Button>
          </div>
        </div>

        {/* Dynamic Search Interface */}
        <div className="relative group">
          {isAiMode ? (
            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
               <div className="bg-slate-900 rounded-[2.5rem] p-8 lg:p-12 text-white relative overflow-hidden shadow-2xl shadow-slate-200 border border-slate-800">
                  <div className="relative z-10 space-y-6">
                     <div className="flex items-center gap-2 text-sky-400">
                        <BrainCircuit className="w-6 h-6 border-none" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] font-mono text-white/40 leading-none">Trí tuệ nhân tạo</span>
                     </div>
                     <h2 className="text-2xl lg:text-3xl font-black leading-tight italic border-none shadow-none">Bạn đang cảm thấy thế nào?</h2>
                     <p className="text-[11px] lg:text-[13px] text-slate-400 max-w-md italic tracking-wide leading-relaxed">Hãy mô tả nhu cầu của bạn (Vd: Tôi bị mỏi cổ vai gáy và muốn bài tập phục hồi 30 phút...)</p>
                     
                     <div className="relative mt-8">
                        <textarea 
                           className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 lg:p-8 text-sm lg:text-lg outline-none focus:bg-white/[0.08] focus:border-sky-500/30 transition-all font-medium placeholder:text-white/10 min-h-[120px] shadow-inner"
                           placeholder="Nhập yêu cầu của bạn tại đây..."
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Button className="absolute right-4 bottom-4 h-9 lg:h-12 px-8 rounded-2xl bg-sky-500 text-white font-black uppercase tracking-widest text-[10px] hover:bg-sky-600 shadow-xl shadow-sky-900/40">
                           Phân tích & Tìm kiếm
                        </Button>
                     </div>
                  </div>
                  {/* Subtle Decorative Elements */}
                  <div className="absolute -right-20 -top-20 w-60 h-60 bg-sky-500/5 rounded-full blur-[100px]" />
                  <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-white/5 rounded-full blur-[120px]" />
               </div>
               <button 
                 onClick={() => setIsAiMode(false)}
                 className="mt-6 mx-auto block text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-sky-500 transition-colors font-mono"
               >
                 Quay về tìm kiếm cơ bản
               </button>
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <Input 
                  placeholder="Tìm tên lớp, giáo viên, hoặc kiểu tập..."
                  className="h-14 pl-16 rounded-[1.5rem] border-slate-100 bg-white shadow-sm focus:border-sky-500/50 focus:ring-4 focus:ring-sky-500/5 transition-all text-sm font-medium text-slate-900 italic border-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2.5">
                 {CATEGORIES.map(cat => (
                   <button 
                     key={cat} 
                     onClick={() => setActiveCategory(prev => prev === cat ? null : cat)}
                     className={cn(
                       "px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border font-mono",
                       activeCategory === cat ? 'bg-sky-500 border-sky-500 text-white shadow-xl shadow-sky-100' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'
                     )}
                   >
                      {cat}
                   </button>
                 ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Course Listing */}
      <section className="space-y-10">
         <div className="flex items-center justify-between border-b border-slate-50 pb-6">
            <h3 className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em] leading-none font-mono italic">Kết quả tìm kiếm ({filteredCourses.length})</h3>
            <div className="flex items-center gap-4">
               <span className="text-[10px] text-slate-300 font-bold italic uppercase tracking-widest opacity-60">Sắp xếp: Mới nhất</span>
            </div>
         </div>

         {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
               {[1,2,3].map(n => <div key={n} className="h-72 bg-slate-50 rounded-[2.5rem] animate-pulse" />)}
            </div>
         ) : filteredCourses.length === 0 ? (
            <div className="py-24 text-center space-y-4">
               <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto">
                  <Search className="w-8 h-8 text-slate-200" />
               </div>
               <p className="text-slate-400 text-xs italic tracking-wide">Không tìm thấy lộ trình nào phù hợp với yêu cầu của bạn.</p>
            </div>
         ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
               {filteredCourses.map((course) => (
                  <Link href={`/student/course/${course.id}`} key={course.id}>
                    <div className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 hover:border-slate-200 transition-all duration-700 cursor-pointer h-full flex flex-col">
                       {/* Card Top: Visual */}
                       <div className="aspect-[16/11] bg-slate-50 relative overflow-hidden shrink-0 border-b border-slate-100">
                          <div className="absolute top-5 left-5 z-10">
                            <div className="px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-100 shadow-sm flex items-center gap-2">
                               <Zap className="w-3.5 h-3.5 text-slate-300" />
                               <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono leading-none">Lvl {course.level || 1}</span>
                            </div>
                          </div>
                          <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-200 group-hover:bg-slate-900 group-hover:text-white transition-all duration-700">
                             <PlayCircle className="w-14 h-14 opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                          </div>
                          {/* Tags floating */}
                          <div className="absolute bottom-5 left-5 right-5 flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 delay-100">
                             {course.tags?.slice(0, 2).map((tag: string) => (
                                <span key={tag} className="px-3 py-1.5 rounded-xl bg-white text-slate-900 text-[9px] font-black uppercase tracking-widest font-mono shadow-md">{tag}</span>
                             ))}
                          </div>
                       </div>

                       {/* Card Bottom: Info */}
                       <div className="p-8 flex-1 flex flex-col">
                          <div className="text-[10px] text-slate-300 uppercase tracking-[0.3em] font-mono mb-3 leading-none">{course.style || "Yoga Flow"}</div>
                          <h4 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-sky-600 transition-colors line-clamp-2 leading-tight italic border-none shadow-none">{course.title}</h4>
                          
                          <div className="flex items-center gap-4 mb-8">
                            <div className="flex items-center gap-2 py-1.5 px-3.5 rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-white group-hover:border-slate-200 transition-all">
                               <Clock className="w-3.5 h-3.5 text-slate-400" />
                               <span className="text-[11px] font-bold text-slate-400 font-mono uppercase tracking-tight">60m</span>
                            </div>
                            <div className="flex items-center gap-1.5 font-bold text-slate-400 group-hover:text-sky-500 text-[11px] transition-all">
                               <Star className="w-3.5 h-3.5 text-slate-200 group-hover:text-sky-400 transition-all" /> 5.0
                            </div>
                          </div>

                          <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 shrink-0" />
                                <span className="text-[11px] font-bold text-slate-400 italic">{(course.users as any)?.full_name || "Giảng viên"}</span>
                             </div>
                             <ChevronRight className="w-5 h-5 text-slate-100 group-hover:text-sky-500 group-hover:translate-x-1 transition-all duration-300" />
                          </div>
                       </div>
                    </div>
                  </Link>
               ))}
            </div>
         )}
      </section>

      {/* Info Banner */}
      <footer className="bg-slate-900 rounded-[3rem] p-12 lg:p-16 flex flex-col md:flex-row items-center gap-10 border border-slate-800 shadow-2xl shadow-slate-200 transition-all group overflow-hidden relative">
         <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-lg relative z-10 group-hover:bg-sky-500 group-hover:text-white transition-all duration-500">
            <Target className="w-10 h-10 text-white group-hover:scale-110 transition-all duration-500" />
         </div>
         <div className="flex-1 text-center md:text-left relative z-10 px-4">
            <h4 className="text-xl lg:text-2xl font-black text-white mb-2 leading-none italic uppercase tracking-tight border-none shadow-none">Kế hoạch cá nhân hoá</h4>
            <p className="text-sm lg:text-base text-slate-400 font-medium italic opacity-80 leading-relaxed max-w-xl">Học viên đã hoàn thành lộ trình sẽ tự động được ẩn khỏi danh sách để tập trung vào mục tiêu mới.</p>
         </div>
         <div className="flex items-center gap-4 px-8 py-4 rounded-3xl bg-white/10 border border-white/20 shadow-xl relative z-10 transition-all group-hover:bg-white group-hover:border-white">
            <CheckCircle2 className="w-6 h-6 text-sky-400 group-hover:text-sky-500" />
            <span className="text-[11px] lg:text-xs font-black uppercase tracking-[0.2em] text-white group-hover:text-slate-900 font-mono leading-none">Tính năng đang bật</span>
         </div>
         {/* Decoration */}
         <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-sky-500/5 rounded-full blur-[120px]" />
      </footer>
    </div>
  );
}
