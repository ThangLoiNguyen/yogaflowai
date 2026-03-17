import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/dashboard-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Search, 
  Filter, 
  ArrowRight, 
  TrendingUp, 
  Activity, 
  Calendar,
  MoreVertical,
  Mail,
  UserCircle
} from "lucide-react";
import Link from "next/link";

export default async function MyStudentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Verify role
  const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (userData?.role !== 'teacher') redirect("/student-dashboard");

  // Fetch all students with their profiles and user data
  const { data: students } = await supabase
    .from("student_profiles")
    .select(`
      *,
      users:user_id (name, email)
    `)
    .order('created_at', { ascending: false });

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfdfd]">
      <DashboardNav role="teacher" />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10 animate-soft-fade">
          
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div className="space-y-2">
              <Badge className="bg-sky-50 text-sky-700 border-none font-black uppercase tracking-widest text-[9px] px-3 py-1 mb-2">Quản lý mạng lưới</Badge>
              <h1 className="text-5xl font-black tracking-tighter text-slate-900 leading-none">Học viên của tôi</h1>
              <p className="text-slate-400 font-medium italic">Theo dõi tiến trình và tối ưu hóa lộ trình tập luyện cho {students?.length || 0} học viên.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
               <div className="relative group w-full sm:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                  <Input 
                    placeholder="Tìm kiếm học viên..." 
                    className="h-14 pl-12 pr-6 rounded-2xl border-slate-100 bg-white shadow-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all font-bold"
                  />
               </div>
               <Button variant="outline" className="h-14 px-6 border-slate-100 rounded-2xl font-black uppercase tracking-widest text-[10px] text-slate-500 hover:bg-slate-50">
                  <Filter className="w-4 h-4 mr-2" /> Lọc danh sách
               </Button>
            </div>
          </header>

          {/* Student Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {students?.map((student) => {
              const name = (student.users as any)?.name || "Học viên";
              const email = (student.users as any)?.email || "";
              
              return (
                <Card key={student.id} className="group rounded-[3rem] border-none shadow-sm hover:shadow-xl transition-all duration-500 bg-white overflow-hidden p-8 flex flex-col items-center text-center">
                   <div className="relative mb-6">
                      <div className="w-24 h-24 rounded-[2.5rem] bg-slate-50 flex items-center justify-center text-3xl font-black text-slate-200 uppercase shadow-inner group-hover:bg-indigo-50 group-hover:text-indigo-200 transition-all duration-500">
                         {name.charAt(0)}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-2xl bg-emerald-500 border-4 border-white flex items-center justify-center">
                         <Activity className="w-3.5 h-3.5 text-white" />
                      </div>
                   </div>

                   <div className="space-y-1 mb-6">
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">{name}</h3>
                      <p className="text-xs font-bold text-slate-400 flex items-center justify-center gap-1.5">
                         <Mail className="w-3.5 h-3.5" /> {email}
                      </p>
                   </div>

                   <div className="w-full grid grid-cols-2 gap-4 mb-8 pt-8 border-t border-slate-50">
                      <div className="space-y-0.5">
                         <p className="text-[9px] font-black text-slate-300 uppercase">Trình độ</p>
                         <p className="text-xs font-black text-slate-900">{student.experience_level}</p>
                      </div>
                      <div className="space-y-0.5">
                         <p className="text-[9px] font-black text-slate-300 uppercase">Tăng trưởng</p>
                         <p className="text-xs font-black text-emerald-600">+12%</p>
                      </div>
                   </div>

                   <div className="w-full space-y-3">
                      <Link href={`/teacher/students/${student.id}`} className="block">
                         <Button className="w-full h-12 bg-slate-900 text-white hover:bg-slate-800 border-none rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-slate-200 transition-all">
                            Xem hồ sơ đầy đủ
                         </Button>
                      </Link>
                      <Button variant="ghost" className="w-full h-10 text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 hover:text-indigo-600">
                         Gửi tin nhắn <ArrowRight className="w-3.5 h-3.5 ml-2" />
                      </Button>
                   </div>
                </Card>
              );
            })}
            
            {(!students || students.length === 0) && (
              <div className="col-span-full py-20 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center space-y-4">
                 <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                    <Users className="w-8 h-8 text-slate-200" />
                 </div>
                 <div className="space-y-1">
                    <p className="text-sm font-black text-slate-900 uppercase tracking-widest">Chưa có học viên</p>
                    <p className="text-xs font-medium text-slate-400 italic">Học viên sẽ xuất hiện ở đây sau khi đăng ký lớp của bạn.</p>
                 </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
