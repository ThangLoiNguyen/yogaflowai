import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/dashboard-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  Calendar, 
  Clock, 
  TrendingUp, 
  Activity,
  Filter,
  ArrowRight,
  Download,
  History as HistoryIcon
} from "lucide-react";
import Link from "next/link";

export default async function StudentHistoryPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Verify role
  const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (userData?.role !== 'teacher') redirect("/student-dashboard");

  // Fetch student profile basic info
  const { data: profile } = await supabase
    .from("student_profiles")
    .select("users:user_id(name)")
    .eq("id", params.id)
    .single();

  if (!profile) redirect("/teacher/students");

  // Fetch full training history
  const { data: sessions } = await supabase
    .from("training_sessions")
    .select("*")
    .eq("student_id", params.id)
    .order("date", { ascending: false });

  const name = (profile.users as any)?.name || "Học viên";

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfdfd]">
      <DashboardNav role="teacher" />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-10 animate-soft-fade">
          
          {/* Header */}
          <div className="space-y-6">
            <Link href={`/teacher/students/${params.id}`} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors group">
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Hồ sơ học viên
            </Link>
            
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
               <div className="space-y-2">
                  <h1 className="text-5xl font-black tracking-tighter text-slate-900">Lịch sử rèn luyện.</h1>
                  <p className="text-slate-400 font-medium italic">Báo cáo chi tiết quá trình tập luyện của <span className="text-slate-900 font-bold">{name}</span></p>
               </div>
               <div className="flex gap-3">
                  <Button variant="outline" className="h-12 border-slate-100 rounded-xl font-black uppercase tracking-widest text-[9px] text-slate-500 hover:bg-slate-50">
                    <Filter className="w-4 h-4 mr-2" /> Lọc dữ liệu
                  </Button>
                  <Button className="h-12 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-[9px] shadow-xl shadow-slate-200">
                    <Download className="w-4 h-4 mr-2" /> Xuất báo cáo
                  </Button>
               </div>
            </div>
          </div>

          {/* History List */}
          <div className="space-y-6">
            {sessions?.map((session) => (
              <Card key={session.id} className="group rounded-[2.5rem] border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white overflow-hidden p-8">
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                       <div className="w-20 h-20 rounded-[2rem] bg-slate-50 flex flex-col items-center justify-center shadow-inner group-hover:bg-white transition-colors">
                          <span className="text-xs font-black text-slate-300 uppercase">{new Date(session.date).toLocaleDateString('vi-VN', { month: 'short' })}</span>
                          <span className="text-2xl font-black text-slate-900 leading-none">{new Date(session.date).getDate()}</span>
                       </div>
                       <div className="space-y-2">
                          <Badge className="bg-sky-50 text-sky-600 border-none font-black text-[9px] uppercase px-3 py-1">Hoàn thành</Badge>
                          <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">{session.class_type}</h3>
                          <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest text-slate-300">
                             <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-indigo-400" /> {session.duration} Phút</span>
                             <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-indigo-400" /> Cường độ: Vừa</span>
                          </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 md:px-12 md:border-l border-slate-50">
                       <div className="space-y-1">
                          <p className="text-[10px] font-black tracking-[0.2em] text-slate-300 uppercase">Dẻo dai</p>
                          <div className="flex items-center gap-2">
                             <span className="text-2xl font-black text-slate-900">{session.flexibility_score}%</span>
                             <TrendingUp className="w-4 h-4 text-emerald-500" />
                          </div>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[10px] font-black tracking-[0.2em] text-slate-300 uppercase">Sức mạnh</p>
                          <div className="flex items-center gap-2">
                             <span className="text-2xl font-black text-slate-900">{session.strength_score}%</span>
                             <TrendingUp className="w-4 h-4 text-emerald-500" />
                          </div>
                       </div>
                    </div>

                    <Button variant="ghost" className="h-12 w-12 p-0 hover:bg-slate-50 text-slate-300 hover:text-indigo-600 rounded-2xl transition-all">
                       <ArrowRight className="w-5 h-5" />
                    </Button>
                 </div>
                 
                 {/* AI Feedback Snippet */}
                 <div className="mt-8 pt-8 border-t border-slate-50">
                    <p className="text-xs font-medium text-slate-400 leading-relaxed italic">
                       "Buổi tập cho thấy học viên đã có sự kiểm soát tốt hơn đối với nhịp thở. Các tư thế vặn người được thực hiện với biên độ lớn hơn 10% so với buổi trước."
                    </p>
                 </div>
              </Card>
            ))}

            {(!sessions || sessions.length === 0) && (
              <div className="py-32 bg-white rounded-[4rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center space-y-4">
                 <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center">
                    <HistoryIcon className="w-10 h-10 text-slate-200" />
                 </div>
                 <div className="space-y-1">
                    <p className="text-sm font-black text-slate-900 uppercase tracking-widest">Không có dữ liệu lịch sử</p>
                    <p className="text-xs font-medium text-slate-400 italic">Dữ liệu sẽ xuất hiện sau khi học viên hoàn thành các buổi tập đầu tiên.</p>
                 </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
