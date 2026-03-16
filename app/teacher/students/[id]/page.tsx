import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardNav } from "@/components/dashboard-nav";
import { ArrowLeft, History, TrendingUp, Edit, MessageSquare, ClipboardCheck, Sparkles, UserCircle, Activity, PlusCircle } from "lucide-react";
import Link from "next/link";
import { TeacherSessionForm } from "@/components/teacher-session-form";
import { ProgressChart } from "@/components/progress-chart";

export default async function StudentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { id } = await params;
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch Student Profile
  const { data: profile } = await supabase
    .from("student_profiles")
    .select(`
      *,
      users:user_id (name, email)
    `)
    .eq("id", id)
    .single();

  if (!profile) notFound();

  // Fetch Session History
  const { data: sessions } = await supabase
    .from("training_sessions")
    .select("*")
    .eq("student_id", id)
    .order("date", { ascending: false });

  // Prepare Progress Data for Chart
  const progressData = sessions?.slice(0, 10).reverse().map((s) => ({
    date: new Date(s.date).toLocaleDateString(),
    flexibility: s.flexibility_score,
    strength: s.strength_score,
  })) || [];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardNav role="teacher" />
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <header className="flex items-start justify-between">
            <div className="space-y-2">
              <Link href="/teacher/students" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-indigo-600 transition-colors mb-4">
                 <ArrowLeft className="w-3.5 h-3.5" /> Back to Student List
              </Link>
              <div className="flex items-center gap-4">
                 <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                    <UserCircle className="w-10 h-10 text-slate-400" />
                 </div>
                 <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                      {(profile.users as any)?.name || (profile.users as any)?.email?.split("@")[0] || "Unknown"}
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="font-bold">{profile.experience_level}</Badge>
                      <span className="text-sm text-slate-400">·</span>
                      <span className="text-sm text-slate-400">Student ID: {profile.id.slice(0,8)}</span>
                    </div>
                 </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
               <Button variant="outline"><Edit className="w-4 h-4 mr-2" /> Edit Profile</Button>
               <Button className="bg-indigo-600 hover:bg-indigo-700 text-white"><MessageSquare className="w-4 h-4 mr-2" /> Message</Button>
            </div>
          </header>

          <div className="grid gap-8 lg:grid-cols-3">
             {/* Profile Highlights */}
             <Card className="lg:col-span-1 shadow-sm">
                <CardHeader>
                   <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-400">Medical & Goals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                   <div className="space-y-3">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                         <Activity className="w-3.5 h-3.5 text-emerald-500" /> Current Goals
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                         {(profile.goals as string[])?.map((goal) => (
                            <Badge key={goal} variant="outline" className="bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-900">
                               {goal.replace('_', ' ')}
                            </Badge>
                         ))}
                      </div>
                   </div>

                   <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                         <ClipboardCheck className="w-3.5 h-3.5 text-rose-500" /> Health & Injuries
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                         {(profile.injuries as string[])?.map((injury) => (
                            <Badge key={injury} variant="outline" className="bg-rose-50/50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300 border-rose-100 dark:border-rose-900">
                               {injury.replace('_', ' ')}
                            </Badge>
                         ))}
                         {(!profile.injuries || (profile.injuries as string[]).length === 0) && (
                            <p className="text-xs text-slate-400 italic">None reported.</p>
                         )}
                      </div>
                   </div>

                   <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                         <Sparkles className="w-3.5 h-3.5 text-sky-500" /> Stats
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                            <p className="text-[10px] text-slate-400 uppercase font-bold">Age</p>
                            <p className="text-lg font-bold">{profile.age || "--"}</p>
                         </div>
                         <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                            <p className="text-[10px] text-slate-400 uppercase font-bold">BMI</p>
                            <p className="text-lg font-bold">
                               {profile.weight && profile.height ? (profile.weight / ((profile.height/100)**2)).toFixed(1) : "--"}
                            </p>
                         </div>
                      </div>
                   </div>
                </CardContent>
             </Card>

             {/* Add session report & Progress Tracking */}
             <div className="lg:col-span-2 space-y-8">
                 {/* Progress Chart */}
                 <Card className="shadow-sm">
                    <CardHeader>
                       <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-indigo-500" /> Progress Chart
                       </CardTitle>
                    </CardHeader>
                    <CardContent className="min-h-[300px] flex items-center justify-center">
                       {progressData.length > 0 ? (
                         <ProgressChart data={progressData} />
                       ) : (
                         <div className="text-center space-y-2">
                            <Activity className="w-12 h-12 text-slate-200 mx-auto" />
                            <p className="text-sm text-slate-500">No session data for this student yet.</p>
                         </div>
                       )}
                    </CardContent>
                 </Card>

                 {/* Session Report Form */}
                 <Card className="shadow-lg border-emerald-100 dark:border-emerald-950 bg-emerald-50/20 dark:bg-emerald-950/20 overflow-hidden">
                    <CardHeader className="bg-emerald-50 dark:bg-emerald-900/10 border-b border-emerald-100 dark:border-emerald-900/30">
                       <CardTitle className="text-sm font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 flex items-center gap-2">
                          <PlusCircle className="w-4 h-4" /> Add New Session Report
                       </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                       <TeacherSessionForm studentId={profile.id} />
                    </CardContent>
                 </Card>

                 {/* History of sessions */}
                 <Card className="shadow-sm">
                    <CardHeader>
                       <CardTitle className="flex items-center gap-2">
                          <History className="w-5 h-5 text-amber-500" /> Session History
                       </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       {sessions?.length ? sessions.map((session) => (
                          <div key={session.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-slate-300 transition-colors">
                             <div className="space-y-1">
                                <p className="font-bold text-sm tracking-tight">{session.class_type}</p>
                                <p className="text-xs text-slate-500">{new Date(session.date).toLocaleDateString()}</p>
                                <p className="text-xs text-slate-400 mt-2 italic">"{session.notes || "No notes added."}"</p>
                             </div>
                             <div className="flex gap-2">
                                <ActivityBadge label="Flex" score={session.flexibility_score} />
                                <ActivityBadge label="Str" score={session.strength_score} />
                             </div>
                          </div>
                       )) : (
                          <p className="text-sm text-slate-500 text-center py-10 italic">No historical data available.</p>
                       )}
                    </CardContent>
                 </Card>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function ActivityBadge({ label, score }: { label: string, score: number }) {
   const color = score > 80 ? 'text-emerald-600' : score > 50 ? 'text-indigo-600' : 'text-amber-600';
   return (
      <div className="flex flex-col items-center px-3 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm min-w-[60px]">
         <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
         <span className={`text-sm font-black ${color}`}>{score}</span>
      </div>
   );
}
