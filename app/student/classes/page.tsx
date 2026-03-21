"use client";

import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  Map, 
  Clock, 
  ChevronRight, 
  ChevronDown,
  PlayCircle,
  CheckCircle,
  Video,
  Award,
  MessageCircle,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

export default function StudentClassesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [coursesGroup, setCoursesGroup] = useState<any[]>([]);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch all bookings for the user, bringing along session and course details
    const { data, error } = await supabase
      .from("bookings")
      .select(`
        id,
        status,
        session_id,
        booked_at,
        class_sessions!inner (
          id,
          title,
          scheduled_at,
          status,
          course_id,
          courses!course_id(id, title),
          users!teacher_id (full_name)
        )
      `)
      .eq("student_id", user.id)
      .order("booked_at", { ascending: false });

    if (error) {
      console.error(error);
      toast.error("Không thể tải danh sách lớp học.");
    } else {
      // Group sessions by Course
      const grouped = (data || []).reduce((acc: any, b: any) => {
        const cId = b.class_sessions.course_id;
        if (!cId) return acc; // Skip sessions not part of a course or orphan ones if any
        
        if (!acc[cId]) {
          acc[cId] = {
            courseId: cId,
            courseTitle: (b.class_sessions.courses as any)?.title || "Khoá học",
            teacherName: (b.class_sessions.users as any)?.full_name || "Giảng viên",
            sessions: []
          };
        }
        acc[cId].sessions.push(b);
        return acc;
      }, {});

      // Convert to array and sort sessions inside each course by scheduled_at
      const coursesArr = Object.values(grouped).map((group: any) => {
        group.sessions.sort((a: any, b: any) => {
          return new Date(a.class_sessions.scheduled_at).getTime() - new Date(b.class_sessions.scheduled_at).getTime();
        });
        // Determine course overall status based on sessions
        const total = group.sessions.length;
        const completed = group.sessions.filter((s: any) => s.class_sessions.status === 'completed').length;
        group.progress = total > 0 ? Math.round((completed / total) * 100) : 0;
        return group;
      });

      setCoursesGroup(coursesArr);
      // Auto-expand first course
      if (coursesArr.length > 0) {
        setExpandedCourse(coursesArr[0].courseId);
      }
    }
    setLoading(false);
  };

  const toggleCourse = (cId: string) => {
    setExpandedCourse(prev => prev === cId ? null : cId);
  };

  return (
    <div className="space-y-12 pb-24">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[var(--border-medium)] mb-4 shadow-sm">
             <Calendar className="w-4 h-4 text-[var(--accent)]" /> 
             <span className="font-mono text-[9px] tracking-widest text-[var(--text-hint)] uppercase">Lượt học của bạn</span>
          </div>
          <h1 className="txt-title text-[var(--text-primary)] border-none mb-0">Lớp học của tôi</h1>
          <p className="txt-content text-[var(--text-secondary)] mt-1">Quản lý các khoá học và lộ trình của bạn.</p>
        </div>
        <Link href="/student/explore">
          <Button className="btn-primary h-10 px-5 rounded-full shadow-sky txt-action">
            Đăng ký khoá mới
          </Button>
        </Link>
      </header>

      {/* Tabs / Filters */}
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-1">
        <div className="flex gap-10">
           {["all", "active", "completed"].map(tab => (
             <button 
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`pb-4 px-1 txt-action transition-all relative ${activeTab === tab ? "text-[var(--accent)]" : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"}`}
             >
               {tab === "all" ? "Tất cả" : tab === "active" ? "Đang học" : "Đã hoàn thành"}
               {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-[var(--accent)] rounded-t-full" />}
             </button>
           ))}
        </div>
        <Button variant="ghost" className="h-10 text-[var(--text-muted)] txt-action">
          <Filter className="w-4 h-4 mr-2" /> Lọc
        </Button>
      </div>

      {/* Course List & Sessions List */}
      <div className="space-y-6">
        {loading ? (
           [1,2].map(n => <div key={n} className="h-40 bg-slate-100 rounded-[var(--r-xl)] animate-pulse" />)
        ) : coursesGroup.length === 0 ? (
          <div className="py-32 text-center rounded-[var(--r-xl)] border-2 border-dashed border-[var(--border-medium)] bg-white/50">
             <div className="mb-6 opacity-20">
                <Calendar className="w-16 h-16 mx-auto" />
             </div>
             <h3 className="txt-title mb-2 text-[var(--text-secondary)] border-none">Bạn chưa đăng ký khoá học nào</h3>
             <p className="text-[var(--text-hint)] mb-8">Hãy tìm một lộ trình phù hợp và bắt đầu hành trình của bạn.</p>
             <Link href="/student/explore">
                <Button className="btn-primary h-10 px-6">Khám phá ngay</Button>
             </Link>
          </div>
        ) : (
          coursesGroup.filter(c => {
            if (activeTab === "active") return c.progress < 100;
            if (activeTab === "completed") return c.progress === 100;
            return true;
          }).map((course, idx) => (
            <div key={course.courseId} className="bg-white rounded-[var(--r-xl)] border border-[var(--border)] shadow-sm overflow-hidden transition-all duration-300">
              {/* Course Header summary */}
              <div 
                className="p-5 cursor-pointer hover:bg-slate-50 transition-colors flex flex-col md:flex-row gap-4 md:items-center justify-between"
                onClick={() => toggleCourse(course.courseId)}
              >
                 <div>
                    <div className="txt-action text-[var(--text-hint)] mb-2 flex items-center gap-2">
                      <Award className="w-3.5 h-3.5" />
                      Lộ trình {course.sessions.length} buổi
                    </div>
                    <h2 className="txt-title text-[var(--text-primary)] mb-1 border-none">{course.courseTitle}</h2>
                    <p className="txt-content text-[var(--text-secondary)] flex items-center gap-2">
                      GV: {course.teacherName}
                    </p>
                 </div>
                 
                 <div className="flex items-center gap-4 min-w-[200px]">
                    <div className="flex-1">
                     <div className="flex justify-between txt-action mb-2">
                       <span className={course.progress === 100 ? "text-emerald-500" : "text-[var(--accent)]"}>Hoàn thành</span>
                       <span>{course.progress}%</span>
                     </div>
                       <div className="h-2 w-full bg-[var(--bg-muted)] rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${course.progress === 100 ? 'bg-emerald-500' : 'bg-[var(--accent)]'}`} 
                            style={{width: `${course.progress}%`}} 
                          />
                       </div>
                    </div>
                    <div className={`p-2 rounded-full transition-transform ${expandedCourse === course.courseId ? 'bg-[var(--bg-muted)] rotate-180' : 'hover:bg-slate-100'}`}>
                       <ChevronDown className="w-5 h-5 text-[var(--text-muted)]" />
                    </div>
                 </div>
              </div>

              {/* Course Sessions List */}
              <div 
                className={`transition-all duration-500 overflow-hidden border-t border-[var(--border)] bg-slate-50/50 ${expandedCourse === course.courseId ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0 border-t-0'}`}
              >
                 <div className="p-5 space-y-4">
                    {course.sessions.map((b: any, bIdx: number) => {
                      const s = b.class_sessions;
                      const isLive = s.status === 'live';
                      const isCompleted = s.status === 'completed';
                      
                      return (
                        <div key={s.id} className={`flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-[var(--r-lg)] bg-white border ${isLive ? 'border-red-200 shadow-sm' : 'border-[var(--border)]'} transition-all`}>
                           {/* Session Left: Date & Status */}
                           <div className="flex items-center gap-4 md:w-1/4 shrink-0">
                              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${isCompleted ? 'bg-emerald-100 text-emerald-600' : isLive ? 'bg-red-100 animate-pulse text-red-600' : 'bg-slate-100 text-slate-400'}`}>
                                 {isCompleted ? <CheckCircle className="w-5 h-5" /> : isLive ? <Video className="w-5 h-5" /> : <span className="font-bold">{bIdx+1}</span>}
                              </div>
                              <div>
                                 <div className="txt-action text-[var(--text-hint)]">{new Date(s.scheduled_at).toLocaleDateString('vi-VN')}</div>
                               <div className={`txt-content font-bold ${isLive ? 'text-red-500' : 'text-[var(--text-primary)]'}`}>
                                 {new Date(s.scheduled_at).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
                               </div>
                              </div>
                           </div>
                           
                           {/* Session Middle: Info */}
                           <div className="flex-1 min-w-0">
                               <h4 className={`txt-content font-bold mb-1 truncate ${isCompleted ? 'text-[var(--text-hint)] line-through' : 'text-[var(--text-primary)]'}`}>
                                 {s.title}
                               </h4>
                               {isLive && <span className="txt-action text-red-500 bg-red-50 px-2 py-0.5 rounded-full inline-block">Đang diễn ra</span>}
                           </div>

                           {/* Session Right: Actions */}
                           <div className="flex gap-3 md:w-auto w-full shrink-0">
                              {!isCompleted ? (
                                <Link href={`/student/session/${s.id}`} className="flex-1 md:flex-none">
                                   <Button className={`w-full md:w-auto h-10 px-6 txt-action rounded-full transition-all ${isLive ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-slate-800 text-white hover:bg-slate-900 border border-slate-700'}`}>
                                      {isLive ? 'Vào lớp ngay' : 'Tham gia'}
                                   </Button>
                                </Link>
                              ) : (
                                <Link href={`/student/session/${s.id}/quiz`} className="flex-1 md:flex-none">
                                  <Button className="w-full md:w-auto h-10 px-6 txt-action rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200">
                                     <MessageCircle className="w-4 h-4 mr-2" /> Feedback & Quiz
                                  </Button>
                                </Link>
                              )}
                           </div>
                        </div>
                      );
                    })}
                 </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
