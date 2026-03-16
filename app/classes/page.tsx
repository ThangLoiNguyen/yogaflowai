
import { createClient } from "@/utils/supabase/server";
import { DashboardNav } from "@/components/dashboard-nav";
import { Badge } from "@/components/ui/badge";
import { LayoutGrid } from "lucide-react";
import { ClassesList } from "@/components/classes-list";

export default async function ClassesPage() {
  const supabase = await createClient();
  
  const { data: classes } = await supabase
    .from("classes")
    .select(`
      *,
      teacher:teacher_id (name, avatar_url)
    `)
    .order('created_at', { ascending: false });

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfdfd]">
      <DashboardNav role="student" />
      <main className="flex-1 py-12">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">

          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div className="space-y-2 text-left">
              <Badge className="bg-sky-50 text-sky-700 border-sky-200/50 font-black uppercase tracking-widest text-[10px] py-1.5 px-3 mb-2 rounded-full">
                <LayoutGrid className="w-3 h-3 mr-2 inline" /> Thư viện khóa học
              </Badge>
              <h1 className="text-5xl font-black tracking-tighter text-slate-900 leading-none">
                Khám phá lớp học
              </h1>
              <p className="text-slate-400 font-medium max-w-xl">
                YogAI đã phân loại và kết nối bạn với những giảng viên hàng đầu để đảm bảo bạn tìm thấy không gian luyện tập phù hợp nhất.
              </p>
            </div>
          </header>

          <ClassesList initialClasses={classes || []} />

        </div>
      </main>
    </div>
  );
}
