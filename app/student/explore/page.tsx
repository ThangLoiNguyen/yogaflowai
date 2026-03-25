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

    // Fetch user bookings and session statuses
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
      // Group by course_id
      const courseStats: Record<string, { total: number, completed: number }> = {};
      
      // First, get all courses they booked
      const bookedCourseIds = Array.from(new Set(bookings.map(b => (b.class_sessions as any).course_id).filter(Boolean)));
      
      if (bookedCourseIds.length > 0) {
        // Fetch total session counts for these courses
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
    const { data: { user } } = await supabase.auth.getUser();
    
    // Fetch all courses
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
    // 1. Filter out finished courses for this user
    if (userFinishedCourseIds.includes(c.id)) return false;

    // 2. Search filter
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (c.users as any)?.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // 3. Category filter
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
            <h1 className="text-2xl font-black text-slate-900 leading-tight mb-1">Khám phá lộ trình</h1>
            <p className="text-xs text-slate-400 font-medium tracking-wide">Tìm kiếm lớp tập phù hợp với mục tiêu của bạn.</p>
          </div>
          <div className="flex items-center gap-2">
             <Button 
               variant="ghost" 
               size="sm"
               onClick={() => setIsAiMode(!isAiMode)}
               className={cn(
                 "h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all gap-2",
                 isAiMode ? "bg-sky-500 text-white hover:bg-sky-600 shadow-lg shadow-sky-100" : "bg-white border text-slate-400"
               )}
             >
               <Sparkles className="w-4 h-4" />
               {isAiMode ? "Đang bật chế độ AI" : "Tìm kiếm bằng AI"}
             </Button>
             <Button variant="outline" size="sm" className="h-9 w-9 rounded-xl border text-slate-400 p-0">
               <Filter className="w-4 h-4" />
             </Button>
          </div>
        </div>

        {/* Dynamic Search Interface */}
        <div className="relative group">
          {isAiMode ? (
            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
               <div className="bg-slate-900 rounded-[2rem] p-6 lg:p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-100 border border-slate-800">
                  <div className="relative z-10 space-y-4">
                     <div className="flex items-center gap-2 text-sky-400">
                        <BrainCircuit className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Trí tuệ nhân tạo</span>
                     </div>
                     <h2 className="text-xl lg:text-2xl font-black leading-tight">Bạn đang cảm thấy thế nào?</h2>
                     <p className="text-xs text-sky-100/70 max-w-md italic">Hãy mô tả nhu cầu của bạn (Vd: Tôi bị mỏi cổ vai gáy và muốn bài tập phục hồi 30 phút...)</p>
                     
                     <div className="relative mt-6">
                        <textarea 
                           className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 lg:p-6 text-sm lg:text-base outline-none focus:bg-white/20 transition-all font-medium placeholder:text-white/30 min-h-[100px]"
                           placeholder="Nhập yêu cầu của bạn tại đây..."
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Button className="absolute right-3 bottom-3 h-8 lg:h-10 px-6 rounded-xl bg-white text-slate-900 font-black uppercase tracking-widest text-[10px] hover:bg-slate-50">
                           Phân tích & Tìm kiếm
                        </Button>
                     </div>
                  </div>
                  {/* Decorative Elements */}
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-sky-500/10 rounded-full blur-3xl" />
                  <div className="absolute -left-10 -bottom-10 w-60 h-60 bg-slate-500/5 rounded-full blur-3xl" />
               </div>
               <button 
                 onClick={() => setIsAiMode(false)}
                 className="mt-4 mx-auto block text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 hover:text-sky-400 transition-colors"
               >
                 Quay về tìm kiếm cơ bản
               </button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <Input 
                  placeholder="Tìm tên lớp, giáo viên, hoặc kiểu tập..."
                  className="h-12 pl-14 rounded-2xl border-slate-100 bg-white shadow-sm focus:border-sky-500 transition-all font-medium text-sm"
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
                       "px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                       activeCategory === cat ? 'bg-sky-500 border-sky-500 text-white shadow-lg shadow-sky-100' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'
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
      <section className="space-y-8">
         <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none">Kết quả tìm kiếm ({filteredCourses.length})</h3>
            <div className="flex items-center gap-4">
               <span className="text-[10px] text-slate-300 font-black uppercase tracking-widest">Sắp xếp: Mới nhất</span>
            </div>
         </div>

         {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
               {[1,2,3].map(n => <div key={n} className="h-64 bg-slate-100 rounded-3xl animate-pulse" />)}
            </div>
         ) : filteredCourses.length === 0 ? (
            <div className="py-20 text-center space-y-4">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6 text-slate-200" />
               </div>
               <p className="text-slate-400 text-xs italic">Không tìm thấy lộ trình nào phù hợp.</p>
            </div>
         ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
               {filteredCourses.map((course, idx) => (
                  <Link href={`/student/course/${course.id}`} key={course.id}>
                    <div className="group bg-white rounded-[2rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 cursor-pointer h-full flex flex-col">
                       {/* Card Top: Visual */}
                       <div className="aspect-[16/10] bg-slate-50 relative overflow-hidden shrink-0">
                          <div className="absolute top-4 left-4 z-10">
                            <div className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-slate-100 shadow-sm flex items-center gap-1.5">
                               <Zap className="w-3 h-3 text-sky-500 fill-sky-500" />
                               <span className="text-[9px] font-black uppercase tracking-widest text-slate-700">Lvl {course.level || 1}</span>
                            </div>
                          </div>
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-sky-50 to-white text-sky-200">
                             <PlayCircle className="w-12 h-12 opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                          </div>
                          {/* Tags floating */}
                          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-1.5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                             {course.tags?.slice(0, 2).map((tag: string) => (
                                <span key={tag} className="px-2.5 py-1 rounded-lg bg-sky-500 text-white text-[8px] font-black uppercase tracking-widest">{tag}</span>
                             ))}
                          </div>
                       </div>

                       {/* Card Bottom: Info */}
                       <div className="p-6 flex-1 flex flex-col">
                          <div className="txt-action text-[9px] text-slate-300 uppercase tracking-[0.2em] mb-2">{course.style || "Yoga Flow"}</div>
                          <h4 className="text-base font-black text-slate-900 mb-2 group-hover:text-sky-600 transition-colors line-clamp-2 leading-tight">{course.title}</h4>
                          
                          <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-slate-50 border border-slate-100">
                               <Clock className="w-3 h-3 text-slate-400" />
                               <span className="text-[10px] font-bold text-slate-500">60m</span>
                            </div>
                            <div className="flex items-center gap-1 font-black text-sky-500 text-[10px]">
                               <Star className="w-3 h-3 fill-sky-500" /> 5.0
                            </div>
                          </div>

                          <div className="mt-auto pt-5 border-t border-slate-50 flex items-center justify-between">
                             <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-slate-100 shrink-0" />
                                <span className="text-[10px] font-bold text-slate-400">{(course.users as any)?.full_name || "Giảng viên"}</span>
                             </div>
                             <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-sky-600 group-hover:translate-x-1 transition-all" />
                          </div>
                       </div>
                    </div>
                  </Link>
               ))}
            </div>
         )}
      </section>

      {/* Info Banner */}
      <footer className="bg-sky-50 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-8 border border-sky-100 shadow-sm mt-10">
         <div className="w-16 h-16 rounded-[1.5rem] bg-sky-500 flex items-center justify-center shrink-0 shadow-lg shadow-sky-200">
            <Target className="w-8 h-8 text-white" />
         </div>
         <div className="flex-1 text-center md:text-left">
            <h4 className="text-lg font-black text-sky-900 mb-1 leading-none uppercase tracking-tight">Kế hoạch cá nhân hoá</h4>
            <p className="text-sm text-sky-700/70 font-medium">Học viên đã hoàn thành lộ trình sẽ tự động được ẩn khỏi danh sách để tập trung vào mục tiêu mới.</p>
         </div>
         <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white border border-sky-100 shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-sky-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-sky-900">Tính năng đang bật</span>
         </div>
      </footer>
    </div>
  );
}
