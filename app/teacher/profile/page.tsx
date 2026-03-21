import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { 
  Star, Users, Clock, Award, BookOpen, 
  CalendarCheck, MessageCircle, TrendingUp, ExternalLink, Sparkles, Heart,
  ArrowRight, ShieldCheck, Instagram, Edit3, UserCircle, Mail, MapPin, Plus,
  CheckCircle,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { TeacherEditDialog } from "@/components/profile/teacher-edit-dialog";

export default async function TeacherProfilePage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) { redirect("/login"); }

  const { id: searchId } = await searchParams;
  const targetId = searchId || user.id;

  const { data: userData } = await supabase.from("users").select("*").eq("id", targetId).single();
  if (!userData) { redirect("/teacher"); }

  const { data: profile } = await supabase.from("teacher_profiles").select("*").eq("user_id", targetId).single();

  const isOwnProfile = user.id === targetId;
  const fullName = userData?.full_name || "Giáo viên YogAI";

  return (
    <div className="space-y-4">
      <div className="grid lg:grid-cols-12 gap-8 items-start">
         {/* Left Col: Teacher Identity */}
         <div className="lg:col-span-4 space-y-4">
            <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm space-y-6">
               <div className="flex flex-col items-center text-center">
                  <div className="w-28 h-28 rounded-[3rem] bg-emerald-50 flex items-center justify-center mb-4 relative border-8 border-white shadow-xl overflow-hidden">
                     {userData?.avatar_url ? (
                       <img src={userData.avatar_url} className="w-full h-full object-cover" alt="Avatar" />
                     ) : <UserCircle className="w-24 h-24 text-emerald-100" />}
                     <div className="absolute top-2 right-2 bg-emerald-500 text-white p-2 rounded-xl shadow-lg border-2 border-white">
                        <ShieldCheck className="w-3.5 h-3.5" />
                     </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-700 leading-tight mb-2 tracking-tighter">{fullName}</h3>
                  <div className="px-5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[9px] font-black uppercase tracking-widest mb-4">Certified Instructor</div>
                  <div className="flex gap-2">
                     <button className="h-9 w-9 bg-slate-50 flex items-center justify-center rounded-xl hover:bg-emerald-50 transition-all text-slate-300 hover:text-emerald-600 shadow-sm">
                        <Instagram className="w-4 h-4" />
                     </button>
                     <button className="h-9 w-9 bg-slate-50 flex items-center justify-center rounded-xl hover:bg-emerald-50 transition-all text-slate-300 hover:text-emerald-600 shadow-sm">
                        <ExternalLink className="w-4 h-4" />
                     </button>
                  </div>
               </div>

               <div className="pt-8 border-t border-slate-50 grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                     <div className="text-sm font-black text-slate-700 tracking-tighter mb-0.5">142</div>
                     <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Học viên</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100 text-center">
                     <div className="text-sm font-black text-amber-600 tracking-tighter mb-0.5 flex items-center justify-center gap-1">4.9 <Star className="w-3 h-3 fill-amber-500 border-none" /></div>
                     <div className="text-[9px] font-black text-amber-300 uppercase tracking-widest">Rating</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
                     <div className="text-sm font-black text-emerald-600 tracking-tighter mb-0.5">{profile?.years_experience || 5} Năm</div>
                     <div className="text-[9px] font-black text-emerald-300 uppercase tracking-widest">Kinh nghiệm</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-blue-50 border border-blue-100 text-center">
                     <div className="text-sm font-black text-blue-600 tracking-tighter mb-0.5">98%</div>
                     <div className="text-[9px] font-black text-blue-300 uppercase tracking-widest">Retention</div>
                  </div>
               </div>

               {isOwnProfile && (
                 <div className="pt-4 border-t border-slate-50 flex justify-center">
                   <TeacherEditDialog />
                 </div>
               )}
            </div>
         </div>

         {/* Right Col: Bio & Specializations */}
         <div className="lg:col-span-8 space-y-6">
            <h2 className="text-base font-display px-4">Thông tin chuyên nghiệp</h2>
            
            <div className="p-6 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm space-y-6">
               <div className="flex items-start gap-4 p-5 bg-gradient-to-br from-emerald-50/50 to-white rounded-[2rem] border border-emerald-50 border-dashed">
                  <div className="w-9 h-9 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-emerald-50">
                     <TrendingUp className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                     <h4 className="font-bold text-sm mb-1 text-slate-700 uppercase tracking-widest">Tiểu sử giảng dạy</h4>
                     <p className="text-sm text-slate-500 leading-relaxed italic pr-4">
                        "{profile?.bio || "Một người đam mê chia sẻ sự bình an của Yoga..."}"
                     </p>
                  </div>
               </div>

               <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                     <div className="flex items-center gap-2 px-2">
                        <Award className="w-4 h-4 text-emerald-600" />
                        <h4 className="font-bold text-sm uppercase tracking-tighter text-slate-600">Chuyên môn cao</h4>
                     </div>
                     <div className="flex flex-wrap gap-2">
                        {profile?.specialties?.map((spec: string) => (
                           <div key={spec} className="px-4 py-2 bg-white text-emerald-700 border border-emerald-50 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm">
                              {spec}
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="space-y-4">
                     <div className="flex items-center gap-2 px-2">
                        <BookOpen className="w-4 h-4 text-emerald-600" />
                        <h4 className="font-bold text-sm uppercase tracking-tighter text-slate-600">Bằng cấp & Chứng chỉ</h4>
                     </div>
                     <div className="space-y-2">
                        {profile?.certifications?.map((cert: string) => (
                           <div key={cert} className="flex items-center gap-3 p-3 bg-slate-50/50 border border-slate-100 rounded-2xl">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">{cert}</span>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
