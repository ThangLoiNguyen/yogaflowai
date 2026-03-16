import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/dashboard-nav";
import { RecordSessionForm } from "@/components/record-session-form";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Sparkles, UserCircle } from "lucide-react";
import Link from "next/link";

export default async function RecordSessionPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Verify role
  const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (userData?.role !== 'teacher') redirect("/student-dashboard");

  // Fetch student info
  const { data: student } = await supabase
    .from("student_profiles")
    .select("id, users:user_id(name)")
    .eq("id", params.id)
    .single();

  if (!student) redirect("/teacher/students");

  const studentName = (student.users as any)?.name || "Học viên";

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfdfd]">
      <DashboardNav role="teacher" />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-12 animate-soft-fade">
          
          <header className="space-y-6">
            <Link href={`/teacher/students/${params.id}`} className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors group">
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Quay lại Hồ sơ học viên
            </Link>
            
            <div className="space-y-4">
              <Badge className="bg-emerald-50 text-emerald-700 border-none font-black uppercase tracking-widest text-[10px] py-1.5 px-4 rounded-xl">
                 Quản lý đào tạo
              </Badge>
              <h1 className="text-5xl font-black tracking-tighter text-slate-900 leading-none">
                Ghi nhận <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-indigo-600">buổi tập</span>
              </h1>
              <p className="text-lg text-slate-400 font-medium leading-relaxed">
                Cập nhật chỉ số và nhật ký rèn luyện cho học viên <span className="text-slate-900 font-black">{studentName}</span>.
              </p>
            </div>
          </header>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-indigo-400 rounded-[3.1rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
            <div className="relative bg-white rounded-[3rem] p-10 md:p-14 border border-slate-50 shadow-2xl shadow-slate-200/50">
              <RecordSessionForm studentId={params.id} studentName={studentName} />
            </div>
          </div>

          <div className="p-10 rounded-[3rem] bg-indigo-50/50 border border-indigo-100/50 flex flex-col md:flex-row items-center gap-8">
             <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-600 flex items-center justify-center shadow-lg shrink-0">
                <Sparkles className="w-8 h-8 text-white" />
             </div>
             <div>
                <h4 className="text-lg font-black text-slate-900 mb-1">Dữ liệu thông minh</h4>
                <p className="text-sm font-medium text-slate-500 leading-relaxed">
                  Các chỉ số này sẽ giúp AI tinh chỉnh lộ trình tập luyện cá nhân hóa tiếp theo cho học viên một cách chính xác nhất.
                </p>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
