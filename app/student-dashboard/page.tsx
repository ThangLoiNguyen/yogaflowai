import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardNav } from "@/components/dashboard-nav";
import { recommendClass } from "@/lib/ai/recommendClass";
import { Sparkles, Calendar, Activity, TrendingUp, History, User } from "lucide-react";
import { ProgressChart } from "@/components/progress-chart";

export default async function StudentDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch Student Profile
  const { data: profile } = await supabase
    .from("student_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!profile) {
    redirect("/onboarding");
  }

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
    date: new Date(s.date).toLocaleDateString(),
    flexibility: s.flexibility_score,
    strength: s.strength_score,
  })) || [];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardNav role="student" />
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <header className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Student Dashboard</h1>
            <p className="text-slate-500 dark:text-slate-400">Welcome back! Here's your personalized progress.</p>
          </header>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* AI Recommendation */}
            <Card className="lg:col-span-1 border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
                  <Sparkles className="w-5 h-5" /> Recommended Class
                </CardTitle>
                <CardDescription>AI picked this just for you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-indigo-100 dark:border-indigo-800 shadow-sm">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{recommendedClassName}</h3>
                  <Badge className="mt-2 bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">High Match</Badge>
                </div>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">Join Now</Button>
              </CardContent>
            </Card>

            {/* Student Profile Info */}
            <Card className="lg:col-span-2 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-sky-500" /> Student Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800">
                  <p className="text-xs text-slate-500">Level</p>
                  <p className="font-bold capitalize">{profile.experience_level}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800">
                  <p className="text-xs text-slate-500">Goals</p>
                  <p className="font-bold">{(profile.goals as string[])?.length || 0} selected</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800">
                  <p className="text-xs text-slate-500">Age</p>
                  <p className="font-bold">{profile.age || "--"}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800">
                  <p className="text-xs text-slate-500">BMI</p>
                  <p className="font-bold">
                    {profile.weight && profile.height ? (profile.weight / ((profile.height/100)**2)).toFixed(1) : "--"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
             {/* Weekly Progress Chart */}
             <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-500" /> Weekly Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="min-h-[300px] flex items-center justify-center">
                  {progressData.length > 0 ? (
                    <ProgressChart data={progressData} />
                  ) : (
                    <div className="text-center space-y-2">
                      <Activity className="w-12 h-12 text-slate-200 mx-auto" />
                      <p className="text-sm text-slate-500">No session data yet. Start training!</p>
                    </div>
                  )}
                </CardContent>
             </Card>

             {/* Recent Sessions */}
             <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="w-5 h-5 text-amber-500" /> Progress History
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sessions?.length ? sessions.slice(0, 4).map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div>
                        <p className="font-bold text-sm tracking-tight">{session.class_type}</p>
                        <p className="text-xs text-slate-500">{new Date(session.date).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="secondary">F:{session.flexibility_score}</Badge>
                        <Badge variant="secondary">S:{session.strength_score}</Badge>
                      </div>
                    </div>
                  )) : (
                    <p className="text-sm text-slate-500 text-center py-10">You haven't completed any sessions yet.</p>
                  )}
                  <Button variant="outline" className="w-full">View all sessions</Button>
                </CardContent>
             </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
