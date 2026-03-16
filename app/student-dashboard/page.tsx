import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardNav } from "@/components/dashboard-nav";
import { recommendYogaClass } from "@/lib/ai/recommendYogaClass";
import { Sparkles, Activity, TrendingUp, History, User, Heart, Zap, MapPin, Calendar, Clock, ChevronRight, Play } from "lucide-react";
import { ProgressChart } from "@/components/progress-chart";
import { mockRecommendations } from "@/lib/mock-data";
import { RecommendationCard } from "@/components/recommendation-card";
import Link from "next/link";

export default async function StudentDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch Student Profile with user name
  const { data: profile } = await supabase
    .from("student_profiles")
    .select("*, users:user_id(name)")
    .eq("user_id", user.id)
    .single();

  if (!profile) {
    redirect("/onboarding");
  }

  const studentName = (profile.users as any)?.name || user.user_metadata?.name || "bạn";

  // Fetch Session History
  const { data: sessions } = await supabase
    .from("training_sessions")
    .select("*")
    .eq("student_id", profile.id)
    .order("date", { ascending: false });

  // Get AI Recommendation
  const aiPlan = recommendYogaClass(profile as any);

  // Prepare Progress Data
  const progressData = sessions?.slice(0, 10).reverse().map((s) => ({
    date: new Date(s.date).toLocaleDateString("vi-VN"),
    flexibility: s.flexibility_score,
    strength: s.strength_score,
  })) || [];

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfdfd]">
      <DashboardNav role="student" />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12 animate-soft-fade">

          {/* Header */}
          <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-1.5">
               <Badge className="bg-indigo-50 text-indigo-600 border-none font-black uppercase tracking-widest text-[9px] px-3 py-1 mb-2">Học viên Platinum</Badge>
              <h1 className="text-5xl font-black tracking-tighter text-slate-900 leading-none">Trung tâm điều khiển.</h1>
              <p className="text-slate-400 font-medium">Hệ thống đang tối ưu lộ trình cho <span className="text-indigo-600 font-black">{studentName}</span>.</p>
            </div>
            <div className="flex items-center gap-6 p-4 bg-white rounded-3xl border border-slate-50 shadow-sm">
                <div className="flex flex-col items-center px-4 border-r border-slate-50">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Chuỗi tập</span>
                    <span className="text-2xl font-black text-slate-900">03</span>
                </div>
                <div className="flex flex-col items-center px-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Buổi tập</span>
                    <span className="text-2xl font-black text-slate-900">{sessions?.length || 0}</span>
                </div>
            </div>
          </header>

          <div className="grid gap-10 lg:grid-cols-12 items-start">
            
            {/* COLUMN 1: AI PLAN & PROGRESS */}
            <div className="lg:col-span-8 space-y-10">
                
                {/* 1. My Yoga Plan (AI Powered) */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-100">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900">Lộ trình của tôi</h2>
                        </div>
                        <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[10px] uppercase px-3 py-1">AI Đã cập nhật</Badge>
                    </div>

                    <Card className="relative overflow-hidden border-none bg-slate-900 text-white rounded-[3rem] p-10 shadow-2xl shadow-slate-200">
                        <div className="absolute top-0 right-0 p-10 opacity-10">
                            <Activity className="w-40 h-40 rotate-12" />
                        </div>
                        <div className="relative z-10 grid md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-2">LỚP HỌC KHUYÊN DÙNG</p>
                                    <h3 className="text-4xl font-black tracking-tight leading-none mb-4">{aiPlan.recommended_class}</h3>
                                    <div className="flex gap-3">
                                        <Badge className="bg-white/10 text-white border-none text-[10px] font-bold px-3 py-1 uppercase">{aiPlan.difficulty}</Badge>
                                        <Badge className="bg-white/10 text-white border-none text-[10px] font-bold px-3 py-1 uppercase">{aiPlan.focus_area}</Badge>
                                    </div>
                                </div>
                                <div className="p-6 rounded-[2rem] bg-indigo-600/20 border border-indigo-400/20 backdrop-blur-md">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-2">Kế hoạch tuần này</p>
                                    <p className="font-bold text-indigo-50 leading-relaxed">{aiPlan.weekly_plan}</p>
                                </div>
                                <Button className="h-14 w-full md:w-auto px-10 bg-white text-indigo-900 hover:bg-slate-50 font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-xl transition-all active:scale-95 group">
                                    BẮT ĐẦU NGAY <Play className="w-4 h-4 ml-3 fill-indigo-900" />
                                </Button>
                            </div>
                            <div className="hidden md:flex flex-col justify-center gap-4 border-l border-white/5 pl-10">
                               <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">THỜI LƯỢNG</p>
                                    <p className="text-xl font-black">45 Phút</p>
                               </div>
                               <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">XU THẾ SỨC KHỎE</p>
                                    <p className="text-xl font-black text-emerald-400">Tăng trưởng 12%</p>
                               </div>
                               <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">PHIÊN BẢN</p>
                                    <p className="text-xl font-black">YogAI Intelligence v2.0</p>
                               </div>
                            </div>
                        </div>
                    </Card>
                </section>

                {/* 2. Recommended Classes */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
                                <Zap className="w-5 h-5 text-sky-500" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900">Lớp học đề xuất</h2>
                        </div>
                        <Link href="/recommendation">
                            <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600">
                                Xem tất cả <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </Link>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-8">
                        {mockRecommendations.slice(0, 2).map((course) => (
                            <RecommendationCard key={course.id} recommendation={course} />
                        ))}
                    </div>
                </section>

                {/* 3. Progress Tracking */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-emerald-500" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900">Theo dõi tiến độ</h2>
                        </div>
                    </div>
                    <Card className="rounded-[3rem] border-none bg-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] p-10 overflow-hidden">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <CardTitle className="text-xl font-black text-slate-900">Biểu đồ rèn luyện</CardTitle>
                                <CardDescription className="font-medium">Chỉ số sức mạnh & dẻo dai theo thời gian</CardDescription>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                    <span className="text-[10px] font-black uppercase text-slate-400">Dẻo dai</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                                    <span className="text-[10px] font-black uppercase text-slate-400">Sức mạnh</span>
                                </div>
                            </div>
                        </div>
                        <div className="h-[350px]">
                            {progressData.length > 0 ? (
                                <ProgressChart data={progressData} />
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center space-y-4">
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                                        <Activity className="w-10 h-10 text-slate-200" />
                                    </div>
                                    <p className="text-sm text-slate-400 font-medium">Bạn chưa thực hiện buổi tập nào.</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </section>
            </div>

            {/* COLUMN 2: SIDEBAR METRICS & UPCOMING */}
            <div className="lg:col-span-4 space-y-10">
                
                {/* 4. Upcoming Sessions */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-amber-500" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900">Buổi tập sắp tới</h2>
                    </div>
                    <div className="space-y-4">
                        <UpcomingSessionCard 
                            title="Yoga Phục Hồi Vai"
                            teacher="Cơ Mai"
                            time="18:00 - 19:30"
                            date="Hôm nay, 18 Th3"
                            type="Online"
                        />
                        <UpcomingSessionCard 
                            title="Nâng Cao Linh Hoạt"
                            teacher="Thầy Nam"
                            time="08:00 - 09:30"
                            date="Ngày mai, 19 Th3"
                            type="Tại Studio"
                            isNext
                        />
                    </div>
                </section>

                {/* Profile Metrics Grid */}
                <div className="grid gap-6">
                    <MetricCard 
                        icon={User} 
                        label="Cấp độ" 
                        value={profile.experience_level} 
                        detail="Tiếp tục để thăng hạng"
                        color="text-sky-500"
                        bg="bg-sky-50"
                    />
                    <MetricCard 
                        icon={Heart} 
                        label="Chỉ số BMI" 
                        value={profile.weight && profile.height ? (profile.weight / ((profile.height / 100) ** 2)).toFixed(1) : "--"} 
                        detail="Trạng thái: Khỏe mạnh"
                        color="text-rose-500"
                        bg="bg-rose-50"
                        detailColor="text-emerald-500"
                    />
                    <MetricCard 
                        icon={MapPin} 
                        label="Gần bạn" 
                        value="Studio Q.1" 
                        detail="Cách 1.2km • Đang mở"
                        color="text-emerald-500"
                        bg="bg-emerald-50"
                    />
                </div>

                {/* Recent History Sidebar Widget */}
                <Card className="rounded-[2.5rem] border-none bg-white shadow-sm p-8">
                     <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                        <History className="w-4 h-4 text-slate-400" /> Lịch sử gần đây
                    </h3>
                    <div className="space-y-6">
                        {sessions?.length ? sessions.slice(0, 3).map((session) => (
                        <div key={session.id} className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                                <div className="text-[10px] font-black text-slate-400">01</div>
                            </div>
                            <div className="flex-1 space-y-0.5">
                                <p className="font-black text-sm text-slate-900">{session.class_type}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{new Date(session.date).toLocaleDateString("vi-VN")}</p>
                            </div>
                            <div className="text-[10px] font-black text-indigo-600">+{session.flexibility_score}%</div>
                        </div>
                        )) : (
                        <p className="text-xs text-slate-400 text-center py-4 font-medium italic">Chưa có lịch sử.</p>
                        )}
                    </div>
                </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function MetricCard({ 
  icon: Icon, 
  label, 
  value, 
  detail, 
  color, 
  bg,
  detailColor = "text-slate-400"
}: { 
  icon: any, 
  label: string, 
  value: string | number, 
  detail: string, 
  color: string, 
  bg: string,
  detailColor?: string
}) {
  return (
    <Card className="rounded-[2.5rem] border-none bg-white shadow-sm p-8 hover:shadow-md transition-all duration-300 group">
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-0.5">{label}</p>
            <p className="text-xl font-black text-slate-900 capitalize leading-none tracking-tight">{value}</p>
        </div>
      </div>
      <p className={`text-[10px] font-bold uppercase tracking-tighter ${detailColor} border-t border-slate-50 pt-3`}>{detail}</p>
    </Card>
  );
}

function UpcomingSessionCard({ title, teacher, time, date, type, isNext = false }: { title: string, teacher: string, time: string, date: string, type: string, isNext?: boolean }) {
    return (
        <Card className={`rounded-3xl border-none p-6 ${isNext ? 'bg-indigo-50/50 ring-1 ring-indigo-100' : 'bg-white shadow-sm'} transition-all hover:scale-[1.02] cursor-pointer group`}>
            <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                    <h4 className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{title}</h4>
                    <p className="text-xs text-slate-400 font-medium">Giáo viên: <span className="text-slate-900 font-bold">{teacher}</span></p>
                </div>
                <Badge className={`border-none text-[9px] font-black uppercase ${type === 'Online' ? 'bg-sky-50 text-sky-600' : 'bg-amber-50 text-amber-600'}`}>{type}</Badge>
            </div>
            <div className="flex items-center gap-4 border-t border-slate-50 pt-4 mt-2">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" /> {time}
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" /> {date}
                </div>
            </div>
        </Card>
    );
}
