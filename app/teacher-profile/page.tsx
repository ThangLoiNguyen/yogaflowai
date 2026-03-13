import { DashboardNav } from "@/components/dashboard-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Calendar, Star, Users, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function TeacherProfilePage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardNav role="student" />
      <main className="flex-1">
        <div className="mx-auto flex w-full max-w-4xl flex-col px-4 pb-14 pt-10 sm:px-6 lg:px-8">
          
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden dark:border-slate-800 dark:bg-slate-900/50">
            <div className="h-40 sm:h-56 bg-gradient-to-tr from-sky-400 via-indigo-400 to-cyan-400 relative">
              <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
            </div>
            
            <div className="px-6 sm:px-10 pb-10">
              <div className="relative flex flex-col sm:flex-row gap-6 sm:items-end -mt-16 sm:-mt-20 mb-8">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 flex items-center justify-center text-5xl">
                   🧘‍♀️
                </div>
                
                <div className="flex-1 space-y-2 pb-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
                        Elena Trần
                      </h1>
                      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mt-1">
                        <Badge className="bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300 border-sky-200/50 dark:border-sky-400/20 px-2 py-0.5 whitespace-nowrap font-medium pointer-events-none">
                          Yoga & Pilates
                        </Badge>
                        <span className="flex items-center gap-1 font-medium text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-500" />
                          4.9 (128 Đánh giá)
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                       <Button size="lg" className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 font-medium whitespace-nowrap">
                         Theo dõi
                       </Button>
                       <Button size="lg" variant="outline" className="font-medium whitespace-nowrap">
                         Nhắn tin
                       </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-8 text-sm">
                <div className="sm:col-span-2 space-y-6 text-slate-600 dark:text-slate-300 leading-relaxed">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-indigo-500" />
                      Giới thiệu về Elena
                    </h3>
                    <p>
                      Elena đã có hơn 8 năm kinh nghiệm giảng dạy Yoga và Pilates cho mọi cấp độ.
                      Phong cách giảng dạy của cô tập trung vào việc tạo nhận thức cơ thể qua từng chuyển động (Mindful Movement), kết hợp hơi thở và sự linh hoạt để phục hồi cơ thể sau những ngày làm việc căng thẳng.
                    </p>
                    <p>
                      Chứng chỉ: 500-HR RYT, Chuyên khoa phục hồi Yoga trị liệu.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      Môn học chuyên sâu
                    </h3>
                    <div className="flex flex-wrap gap-2">
                       {['Vinyasa Flow', 'Yin Yoga', 'Pilates Core', 'Chữa lành chuỗi lưng'].map((tag) => (
                           <span key={tag} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md font-medium text-xs">
                               {tag}
                           </span>
                       ))}
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl p-5 border border-slate-100 dark:border-slate-800 space-y-5 h-fit">
                   <h3 className="font-semibold text-slate-900 dark:text-slate-100">Thống kê</h3>
                   <div className="space-y-4">
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg shrink-0">
                           <Users className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">4,200+</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">Học viên đã dạy</div>
                        </div>
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-lg shrink-0">
                           <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">860</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">Lớp học hoàn thành</div>
                        </div>
                     </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
