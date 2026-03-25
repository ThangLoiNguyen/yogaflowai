import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { submitSessionQuiz } from "@/app/actions/quiz";
import { Star, MessageSquare, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function SessionSummaryPage({
  searchParams,
}: {
  searchParams: Promise<{ sessionId?: string }>;
}) {
  const { sessionId } = await searchParams;
  if (!sessionId) redirect("/student");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch session details for the recap
  const { data: session } = await supabase
    .from("class_sessions")
    .select("*, courses(title)")
    .eq("id", sessionId)
    .single();

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[28px] shadow-sky p-8 border border-white/50 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-100 shadow-sm animate-pulse">
            <Flame className="w-8 h-8 fill-emerald-500" />
          </div>
          <h1 className="mb-2">Hoàn thành buổi học!</h1>
          <p className="text-[var(--text-secondary)] text-sm font-medium">
             Chúc mừng bạn đã hoàn thành buổi <span className="text-[var(--text-primary)] font-bold">{session?.courses?.title || "Yoga"}</span>. Hãy để lại cảm nhận nhé!
          </p>
        </div>

        <form action={submitSessionQuiz} className="space-y-8">
          <input type="hidden" name="sessionId" value={sessionId} />

          {/* Difficulty / Fatigue Level */}
          <div className="space-y-4">
            <label className="label-mono flex items-center gap-2">
              <Star className="w-3.5 h-3.5" /> Mức độ mệt mỏi (1-10)
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[2, 4, 6, 8, 10].map((num) => (
                <label key={num} className="relative group cursor-pointer">
                  <input type="radio" name="difficulty" value={num} required className="peer sr-only" />
                  <div className="h-10 rounded-xl border border-[var(--border-medium)] flex items-center justify-center text-xs font-bold text-[var(--text-secondary)] group-hover:border-[var(--accent)] peer-checked:bg-[var(--accent)] peer-checked:text-white peer-checked:border-[var(--accent)] transition-all shadow-sm">
                    {num}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Satisfaction / Motivation */}
          <div className="space-y-4">
            <label className="label-mono flex items-center gap-2">
               Mức độ hài lòng (1-5)
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <label key={num} className="relative group cursor-pointer">
                  <input type="radio" name="satisfaction" value={num} required className="peer sr-only" />
                  <div className="h-10 rounded-xl border border-[var(--border-medium)] flex items-center justify-center text-xs font-bold text-[var(--text-secondary)] group-hover:border-[var(--accent)] peer-checked:bg-[var(--accent)] peer-checked:text-white peer-checked:border-[var(--accent)] transition-all shadow-sm">
                    {num}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <label className="label-mono flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5" /> Ghi chú thêm (Không bắt buộc)
            </label>
            <textarea 
              name="notes"
              placeholder="Hôm nay bạn thấy thế nào? Có động tác nào khó không?"
              className="w-full h-24 bg-[var(--bg-muted)] border border-[var(--border-medium)] rounded-2xl p-4 text-sm outline-none focus:border-[var(--accent-light)] transition-all resize-none placeholder:text-[var(--text-muted)]"
            />
          </div>

          <Button type="submit" className="w-full btn-primary h-14 rounded-full text-base font-bold shadow-lg shadow-emerald-500/20 mt-4">
            Gửi phản hồi & Hoàn tất
          </Button>
        </form>
      </div>
    </div>
  );
}
