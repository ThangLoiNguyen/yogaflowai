import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardNav } from "@/components/dashboard-nav";
import { Users, History, TrendingUp, Search, PlusCircle, UserCircle, Activity, LayoutGrid, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function TeacherStudentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch all student profiles with user names
  const { data: students } = await supabase
    .from("student_profiles")
    .select(`
      *,
      users:user_id (name, email)
    `);

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfdfd]">
      <DashboardNav role="teacher" />
      
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12 animate-soft-fade">
          
          <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div className="space-y-2 text-left">
              <Badge className="bg-sky-50 text-sky-700 border-sky-200/50 font-black uppercase tracking-widest text-[10px] py-1.5 px-3 mb-2 rounded-full">
                <Users className="w-3 h-3 mr-2 inline" /> Quản trị học viên
              </Badge>
              <h1 className="text-5xl font-black tracking-tighter text-slate-900 leading-none">
                Danh sách học viên
              </h1>
              <p className="text-slate-400 font-medium max-w-xl">
                Dữ liệu học tập và lộ trình cá nhân hóa cho từng học viên. Theo dõi sự tiến bộ và tối ưu hóa kết quả giảng dạy.
              </p>
            </div>
            <div className="flex items-center gap-4">
               <div className="relative group">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                 <input 
                   placeholder="Tìm kiếm học viên..." 
                   className="pl-12 h-14 w-72 rounded-2xl border-slate-100 bg-white shadow-sm focus:shadow-xl focus:shadow-indigo-50 transition-all font-bold text-slate-700 outline-none" 
                 />
               </div>
            </div>
          </header>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
             {students?.map((student) => (
                <Card key={student.id} className="rounded-[2.5rem] p-4 bg-white border-slate-50 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-200/50 group border-transparent hover:border-white">
                  <Link href={`/teacher/students/${student.id}`} className="block">
                     <CardHeader className="pb-4 pt-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-[1.5rem] bg-slate-50 flex items-center justify-center shadow-inner group-hover:bg-indigo-50 transition-colors duration-500">
                             <UserCircle className="w-8 h-8 text-slate-300 group-hover:text-indigo-400" />
                          </div>
                          <div className="space-y-1">
                             <CardTitle className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                                {(student.users as any)?.name || (student.users as any)?.email?.split("@")[0] || "Ẩn danh"}
                             </CardTitle>
                             <Badge className="bg-sky-50 text-sky-600 border-none font-black uppercase tracking-widest text-[9px] px-2 py-0.5">
                                {student.experience_level}
                             </Badge>
                          </div>
                        </div>
                     </CardHeader>
                     <CardContent className="space-y-6 px-4">
                        <div className="grid grid-cols-2 gap-4">
                           <div className="p-3 rounded-2xl bg-slate-50/50 border border-slate-50 space-y-1">
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mục tiêu</p>
                              <p className="text-xs font-black text-slate-700">{(student.goals as string[])?.length || 0} Đã chọn</p>
                           </div>
                           <div className="p-3 rounded-2xl bg-slate-50/50 border border-slate-50 space-y-1">
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tuổi</p>
                              <p className="text-xs font-black text-slate-700">{student.age || "--"} Tuổi</p>
                           </div>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                           <span className="flex items-center gap-2 text-indigo-600 text-[10px] font-black uppercase tracking-widest transition-all group-hover:gap-3">
                              Xem chi tiết lộ trình <ArrowRight className="w-3.5 h-3.5" />
                           </span>
                        </div>
                     </CardContent>
                  </Link>
                </Card>
             ))}
             
             {students?.length === 0 && (
                <div className="col-span-full py-24 flex flex-col items-center justify-center gap-6 border-2 border-dashed border-slate-100 rounded-[3rem] bg-slate-50/30">
                   <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center">
                      <Users className="w-10 h-10 text-slate-200" />
                   </div>
                   <div className="text-center space-y-1">
                      <p className="text-xl font-black text-slate-900">Chưa có học viên nào đăng ký</p>
                      <p className="text-slate-400 font-medium">Danh sách của bạn sẽ xuất hiện tại đây khi học viên tham gia.</p>
                   </div>
                   <Button className="h-12 px-8 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-[10px]">Mời học viên</Button>
                </div>
             )}
          </div>
        </div>
      </main>
    </div>
  );
}
