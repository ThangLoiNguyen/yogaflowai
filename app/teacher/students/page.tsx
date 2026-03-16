import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardNav } from "@/components/dashboard-nav";
import { Users, History, TrendingUp, Search, PlusCircle, UserCircle, Activity } from "lucide-react";
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
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardNav role="teacher" />
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <header className="flex items-end justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Student Management</h1>
              <p className="text-slate-500 dark:text-slate-400">Track and manage your student's progress and sessions.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  placeholder="Search students..." 
                  className="pl-9 h-10 w-64 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                />
              </div>
            </div>
          </header>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             {students?.map((student) => (
                <Card key={student.id} className="hover:border-indigo-400 dark:hover:border-indigo-600 transition-all shadow-sm group">
                  <Link href={`/teacher/students/${student.id}`}>
                    <CardHeader className="pb-3">
                       <div className="flex items-center gap-3">
                         <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <UserCircle className="w-8 h-8 text-slate-400" />
                         </div>
                         <div>
                            <CardTitle className="text-lg font-bold">{(student.users as any)?.name || (student.users as any)?.email?.split("@")[0] || "Unknown"}</CardTitle>
                            <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider">{student.experience_level}</Badge>
                         </div>
                       </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                             <p className="text-slate-400">Yoga Goals</p>
                             <p className="font-semibold text-slate-700 dark:text-slate-300">{(student.goals as string[])?.length || 0} selected</p>
                          </div>
                          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                             <p className="text-slate-400">Age</p>
                             <p className="font-semibold text-slate-700 dark:text-slate-300">{student.age || "--"}</p>
                          </div>
                       </div>
                       <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                          <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 text-xs font-bold group-hover:gap-2 transition-all">
                             View History <TrendingUp className="w-3.5 h-3.5" />
                          </span>
                       </div>
                    </CardContent>
                  </Link>
                </Card>
             ))}
             {students?.length === 0 && (
                <div className="col-span-full py-20 flex flex-col items-center justify-center gap-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                   <Users className="w-12 h-12 text-slate-300" />
                   <p className="text-slate-500 font-medium">No students registered yet.</p>
                </div>
             )}
          </div>
        </div>
      </main>
    </div>
  );
}
