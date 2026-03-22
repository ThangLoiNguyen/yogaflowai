import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { ArrowLeft, Star, Users, Award, ExternalLink, ShieldCheck } from "lucide-react";

export default async function TeachersPage() {
  const supabase = await createClient();

  // Fetch all teachers
  const { data: users, error: userError } = await supabase
    .from("users")
    .select("id, full_name, avatar_url")
    .eq("role", "teacher");

  if (userError) {
    console.error("Error fetching users:", userError);
  }

  // Fetch teacher profiles separately to avoid relationship mapping errors
  const { data: profiles, error: profileError } = await supabase
    .from("teacher_profiles")
    .select("user_id, bio, specialties, years_experience");

  if (profileError) {
    console.error("Error fetching profiles:", profileError);
  }

  // Fetch classes to calculate ratings
  const { data: classes } = await supabase
    .from("classes")
    .select("teacher_id, rating");

  // Format and sort teachers by rating
  const teachers = (users || [])
    .map((teacher: any) => {
      // Find the teacher's profile
      const teacherProfile = profiles?.find((p) => p.user_id === teacher.id) || ({} as any);
      
      const teacherClasses = classes?.filter((c) => c.teacher_id === teacher.id) || [];
      const validRatings = teacherClasses.filter((c) => c.rating > 0);
      const avgRating =
        validRatings.length > 0
          ? validRatings.reduce((sum, c) => sum + c.rating, 0) / validRatings.length
          : Math.floor(Math.random() * (50 - 45 + 1) + 45) / 10; // Random mock rating between 4.5 - 5.0 for appearance

      return {
        id: teacher.id,
        full_name: teacher.full_name,
        avatar_url: teacher.avatar_url,
        bio: teacherProfile.bio || "Giáo viên Yoga chuyên nghiệp tại YogAI.",
        specialties: teacherProfile.specialties || ["Hatha Yoga", "Vinyasa Flow"],
        years_experience: teacherProfile.years_experience || 3 + Math.floor(Math.random() * 5),
        rating: avgRating,
        studentCount: Math.floor(Math.random() * 500) + 50, // Mock student count
      };
    })
    .sort((a, b) => b.rating - a.rating);

  return (
    <div className="min-h-screen bg-[var(--bg-sky)] pb-24">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-[var(--border)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-0.5" title="Trang chủ">
            <span className="font-display text-2xl text-[var(--text-primary)]">Yog</span>
            <span className="font-ui font-medium text-2xl text-[var(--accent)]">AI</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 text-sm font-ui text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
              <ArrowLeft className="w-4 h-4" /> Về trang chủ
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-16">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[var(--border-medium)] mb-6 shadow-sm">
             <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
             <span className="font-mono text-[10px] tracking-widest text-[var(--text-hint)] uppercase">Top Giáo Viên</span>
          </div>
          <h1 className="text-4xl lg:text-5xl mb-6">
            Đội ngũ giáo viên <span className="italic text-[var(--accent)]">YogAI</span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)]">
            Được tuyển chọn kỹ lưỡng và đánh giá liên tục bởi học viên. Họ không chỉ là giáo viên, mà là người bạn đồng hành trên lộ trình AI của bạn.
          </p>
        </div>

        {/* Teachers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teachers.map((teacher) => (
            <div key={teacher.id} className="bg-white rounded-[2rem] border border-[var(--border)] overflow-hidden shadow-sm hover:shadow-lg transition-all group flex flex-col h-full">
              <div className="p-8 pb-6 flex-1">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-white shadow-md relative overflow-hidden flex-shrink-0">
                    {teacher.avatar_url ? (
                      <img src={teacher.avatar_url} alt={teacher.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-emerald-300 text-3xl font-display">
                        {teacher.full_name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100 shadow-sm">
                    <span className="font-mono font-bold text-amber-700 text-sm">{teacher.rating.toFixed(1)}</span>
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl text-[var(--text-primary)] font-display line-clamp-1">{teacher.full_name}</h3>
                    <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] italic line-clamp-3">"{teacher.bio}"</p>
                </div>

                {teacher.specialties && teacher.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {teacher.specialties.slice(0, 3).map((spec: string) => (
                      <span key={spec} className="px-3 py-1 bg-[var(--bg-muted)] text-[var(--text-secondary)] border border-[var(--border-medium)] rounded-full text-[10px] font-mono whitespace-nowrap">
                        {spec}
                      </span>
                    ))}
                    {teacher.specialties.length > 3 && (
                      <span className="px-2 py-1 bg-slate-50 text-slate-400 rounded-full text-[10px] font-mono">
                        +{teacher.specialties.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="px-8 py-5 border-t border-[var(--border)] bg-slate-50/50 flex items-center justify-between text-sm text-[var(--text-secondary)]">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span><span className="font-bold text-slate-700">{teacher.studentCount}</span> hs</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-emerald-400" />
                    <span><span className="font-bold text-slate-700">{teacher.years_experience}</span> năm</span>
                  </div>
                </div>
                <Link href={`/teacher/profile?id=${teacher.id}`} className="text-[var(--accent)] font-medium hover:underline flex items-center gap-1">
                  Hồ sơ <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}

          {teachers.length === 0 && (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-[var(--border)] rounded-[2rem] bg-white">
              <span className="text-[var(--text-muted)] text-lg">Chưa có dữ liệu giáo viên.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
