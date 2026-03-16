import { DashboardNav } from "@/components/dashboard-nav";
import { TeacherClassForm } from "@/components/teacher-class-form";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Sparkles, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function NewClassPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  let { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single();
  
  // Fallback to metadata if user record is missing
  const role = userData?.role || user.user_metadata?.role;
  
  if (role !== 'teacher') {
    redirect("/student-dashboard");
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfdfd]">
      <DashboardNav role="teacher" />
      
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-12">
          
          <header className="space-y-6">
            <Link href="/teacher-dashboard" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-600 transition-colors">
               <ArrowLeft className="w-4 h-4" /> Quay lại Dashboard
            </Link>
            
            <div className="space-y-4">
              <Badge className="bg-sky-50 text-sky-700 border-none font-black uppercase tracking-widest text-[10px] py-1.5 px-4 rounded-xl">
                 Hệ thống quản lý giảng dạy
              </Badge>
              <h1 className="text-5xl font-black tracking-tighter text-slate-900 leading-none">
                Khởi tạo <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600">lớp học mới</span>
              </h1>
              <p className="text-lg text-slate-400 font-medium leading-relaxed">
                Thiết lập thông tin và lộ trình cho không gian rèn luyện mới của bạn.
              </p>
            </div>
          </header>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-sky-400 to-indigo-400 rounded-[3.1rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
            <div className="relative bg-white rounded-[3rem] p-10 md:p-14 border border-slate-50 shadow-2xl shadow-slate-200/50">
              <TeacherClassForm />
            </div>
          </div>

          <div className="p-10 rounded-[3rem] bg-indigo-50/50 border border-indigo-100/50 flex flex-col md:flex-row items-center gap-8">
             <div className="w-16 h-16 rounded-[1.5rem] bg-white flex items-center justify-center shadow-lg shrink-0">
                <Sparkles className="w-8 h-8 text-indigo-600" />
             </div>
             <div>
                <h4 className="text-lg font-black text-slate-900 mb-1">Tối ưu bởi AI</h4>
                <p className="text-sm font-medium text-slate-500 leading-relaxed">
                  Dữ liệu lớp học sẽ được hệ thống AI sử dụng để kết nối bạn với những học viên có mục tiêu và trình độ phù hợp nhất.
                </p>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
