import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardNav } from "@/components/dashboard-nav";
import { recommendClass } from "@/lib/ai/recommendClass";
import { Sparkles, Activity, TrendingUp, History, User, Heart, Zap, MapPin } from "lucide-react";
import { ProgressChart } from "@/components/progress-chart";

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
  const recommendedClassName = recommendClass(profile as any);

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
        <div className="max-w-6xl mx-auto space-y-10 animate-soft-fade">

          <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-1.5">
              <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-none">Tổng quan hành trình</h1>
              <p className="text-slate-400 font-medium">Chào mừng trở lại, <span className="text-indigo-600 font-black">{studentName}</span>! YogAI đã cập nhật tiến độ của bạn.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold">
                    {i === 1 ? "🧘‍♀️" : i === 2 ? "✨" : "🔥"}
                  </div>
                ))}
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">3 Ngày liên tiếp</span>
            </div>
          </header>

          <div className="grid gap-8 lg:grid-cols-12">
            {/* AI Recommendation Highlight */}
            <Card className="lg:col-span-5 relative overflow-hidden border-indigo-100 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white shadow-2xl shadow-indigo-200 border-none rounded-[2rem]">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Sparkles className="w-32 h-32 rotate-12" />
              </div>
              <CardHeader className="relative z-10 pt-10 px-8 pb-4">
                <Badge className="w-fit mb-4 bg-white/20 text-white border-white/20 backdrop-blur-md font-black uppercase tracking-widest text-[10px] py-1.5 px-3">
                  <Sparkles className="w-3 h-3 mr-2" /> AI Đề xuất hôm nay
                </Badge>
                <CardTitle className="text-3xl font-black leading-tight">
                  {recommendedClassName}
                </CardTitle>
                <CardDescription className="text-indigo-100/80 font-medium text-base">
                  Dựa trên sức khỏe hôm nay, lớp học này sẽ giúp bạn phục hồi năng lượng tối ưu.
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 px-8 pb-10 space-y-6">
                <div className="flex gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/10">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Thời gian</p>
                    <p className="font-bold">45 Phút</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/10">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Cấp độ</p>
                    <p className="font-bold capitalize">{profile.experience_level}</p>
                  </div>
                </div>
                <Button className="w-full h-14 text-indigo-700 hover:bg-slate-50 font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl shadow-xl transition-transform active:scale-95">
                  Bắt đầu luyện tập <Zap className="w-4 h-4 ml-2 fill-indigo-700" />
                </Button>
              </CardContent>
            </Card>

            {/* Profile Metrics Grid */}
            <div className="lg:col-span-7 grid grid-cols-2 gap-6">
              <MetricCard 
                icon={User} 
                label="Cấp độ học viên" 
                value={profile.experience_level} 
                detail="Đã hoàn thành 12 buổi"
                color="text-sky-500"
                bg="bg-sky-50"
              />
              <MetricCard 
                icon={Heart} 
                label="Chỉ số BMI" 
                value={profile.weight && profile.height ? (profile.weight / ((profile.height / 100) ** 2)).toFixed(1) : "--"} 
                detail="● Trạng thái: Bình thường"
                color="text-rose-500"
                bg="bg-rose-50"
                detailColor="text-emerald-500"
              />
              <MetricCard 
                icon={Zap} 
                label="Mục tiêu ưu tiên" 
                value={(profile.goals as string[])?.[0] || "Dẻo dai"} 
                detail="1/3 Mục tiêu đã đạt"
                color="text-amber-500"
                bg="bg-amber-50"
              />
              <MetricCard 
                icon={MapPin} 
                label="Studio gần nhất" 
                value="District 1" 
                detail="Cách bạn 1.2 km"
                color="text-emerald-500"
                bg="bg-emerald-50"
              />
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-12 items-start">
            {/* Weekly Progress Chart */}
            <Card className="md:col-span-8 rounded-[2rem] border-slate-100 shadow-sm overflow-hidden">
              <CardHeader className="px-8 pt-8">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-black text-slate-900">Tiến độ tuần này</CardTitle>
                    <CardDescription className="font-medium">Chỉ số sức mạnh và sự dẻo dai</CardDescription>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-600 border-none px-3 font-bold">+12% vs tuần trước</Badge>
                </div>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <div className="h-[340px] w-full flex items-center justify-center">
                  {progressData.length > 0 ? (
                    <ProgressChart data={progressData} />
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                        <Activity className="w-10 h-10 text-slate-200" />
                      </div>
                      <p className="text-sm text-slate-400 font-medium">Chưa có dữ liệu buổi tập. Hãy bắt đầu ngay!</p>
                      <Button variant="outline" className="rounded-xl border-slate-100 font-bold">Khám phá lớp học</Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Sessions */}
            <Card className="md:col-span-4 rounded-[2rem] border-slate-100 shadow-sm overflow-hidden">
              <CardHeader className="px-8 pt-8">
                <CardTitle className="text-2xl font-black text-slate-900">Lịch sử tập</CardTitle>
                <CardDescription className="font-medium">4 buổi gần nhất của bạn</CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-8 space-y-6">
                {sessions?.length ? sessions.slice(0, 4).map((session) => (
                  <div key={session.id} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                        <History className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                      </div>
                      <div>
                        <p className="font-black text-sm tracking-tight text-slate-900">{session.class_type}</p>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tighter">{new Date(session.date).toLocaleDateString("vi-VN")}</p>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <Badge className="bg-indigo-50 text-indigo-600 border-none text-[10px] font-black">F:{session.flexibility_score}</Badge>
                      <Badge className="bg-sky-50 text-sky-600 border-none text-[10px] font-black">S:{session.strength_score}</Badge>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-slate-400 text-center py-10 font-medium">Bạn chưa hoàn thành buổi tập nào.</p>
                )}
                <Button variant="ghost" className="w-full h-12 rounded-2xl bg-slate-50 text-slate-600 hover:bg-slate-100 font-black uppercase tracking-[0.2em] text-[10px] mt-2">
                  Xem tất cả lịch sử
                </Button>
              </CardContent>
            </Card>
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
    <Card className="rounded-[2.5rem] border-none bg-white shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-8 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500 group flex flex-col justify-between">
      <div>
        <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500`}>
          <Icon className={`w-7 h-7 ${color}`} />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-1">{label}</p>
        <p className="text-2xl font-black text-slate-900 tracking-tight capitalize leading-none">{value}</p>
      </div>
      <p className={`text-[11px] font-bold mt-4 uppercase tracking-tighter ${detailColor}`}>{detail}</p>
    </Card>
  );
}
