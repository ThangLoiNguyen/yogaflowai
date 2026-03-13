import { TeacherAnalytics } from "@/components/teacher-analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  mockTeacherAnalytics,
  mockStudents,
  mockClassesPerformance,
} from "@/lib/mock-data";

export default function TeacherDashboard() {
  return (
    <main className="flex-1 bg-slate-950">
      <div className="mx-auto flex w-full max-w-6xl flex-col px-4 pb-14 pt-8 sm:px-6 lg:px-8">
        <header className="mb-6 space-y-2">
          <Badge className="bg-sky-500/15 text-sky-200 border-sky-400/40">
            Teacher dashboard
          </Badge>
          <h1 className="text-xl font-semibold text-slate-50">
            Studio health at a glance
          </h1>
          <p className="text-xs text-slate-300">
            See how your students are progressing, which classes are working,
            and where support is needed.
          </p>
        </header>

        <TeacherAnalytics data={mockTeacherAnalytics} />

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1.4fr)]">
          <Card className="border-slate-800 bg-slate-900/80">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-sm font-medium text-slate-200">
                Student list
                <span className="text-[11px] text-slate-400">
                  {mockStudents.length} active students
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-3 pb-2 text-[11px] text-slate-400">
                <span>Name</span>
                <span>Level</span>
                <span>Focus</span>
                <span className="text-right">Attendance</span>
              </div>
              {mockStudents.map((student) => (
                <div
                  key={student.id}
                  className="grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] items-center gap-3 rounded-md border border-slate-800 bg-slate-900 px-3 py-2"
                >
                  <div>
                    <p className="text-xs font-medium text-slate-100">
                      {student.name}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {student.recentClass}
                    </p>
                  </div>
                  <span className="text-[11px] text-slate-300">
                    {student.level}
                  </span>
                  <span className="text-[11px] text-slate-300">
                    {student.focus}
                  </span>
                  <span className="text-right text-[11px] text-slate-300">
                    {student.attendance}%
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-slate-800 bg-slate-900/80">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-sm font-medium text-slate-200">
                  Class performance
                  <span className="text-[11px] text-slate-400">
                    Last 7 days
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                {mockClassesPerformance.map((cls) => (
                  <div
                    key={cls.id}
                    className="space-y-1 rounded-md border border-slate-800 bg-slate-900 px-3 py-2"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-slate-100">
                        {cls.name}
                      </p>
                      <span className="text-[11px] text-slate-400">
                        {cls.occurrences} classes
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-300">
                      <span>Avg. fill</span>
                      <span>{cls.fill}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-emerald-400"
                        style={{ width: `${cls.fill}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}

