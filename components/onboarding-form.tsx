"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2, Camera, CheckCircle2, ShieldCheck, 
  User, Target, Heart, Activity, Zap, Clock, 
  Calendar, Waves, Ruler, ListChecks, Sparkles, Plus
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const AGE_OPTIONS = [
  { value: "under_18", label: "Dưới 18" },
  { value: "18_25", label: "18 – 25" },
  { value: "26_35", label: "26 – 35" },
  { value: "36_45", label: "36 – 45" },
  { value: "above_45", label: "Trên 45" }
];

const GENDER_OPTIONS = [
  { value: "male", label: "Nam" },
  { value: "female", label: "Nữ" },
  { value: "other", label: "Khác" }
];

const HEALTH_OPTIONS = [
  { value: "back_pain", label: "Đau lưng" },
  { value: "joint_issues", label: "Khớp" },
  { value: "high_blood_pressure", label: "Huyết áp" },
  { value: "pregnancy", label: "Mới sinh" },
  { value: "none", label: "Bình thường" }
];

const EXPERIENCE_OPTIONS = [
  { value: "never", label: "Chưa tập" },
  { value: "a_few", label: "Mới tập" },
  { value: "1_6_months", label: "1–6 tháng" },
  { value: "above_6_months", label: "Trên 6Th" },
  { value: "above_2_years", label: "Trên 2N" }
];

const FITNESS_OPTIONS = [
  { value: "very_weak", label: "Yêu" },
  { value: "average", label: "Vừa" },
  { value: "quite_good", label: "Tốt" },
  { value: "good", label: "Rất tốt" }
];

const FLEXIBILITY_OPTIONS = [
  { value: "very_stiff", label: "Cứng" },
  { value: "average", label: "Vừa" },
  { value: "quite_flexible", label: "Dẻo" },
  { value: "very_flexible", label: "Rất dẻo" }
];

const GOAL_OPTIONS = [
  { value: "stress_relief", label: "Giảm stress" },
  { value: "weight_loss", label: "Giảm cân" },
  { value: "flexibility", label: "Linh hoạt" },
  { value: "back_pain_relief", label: "Đau lưng" },
  { value: "stamina", label: "Sức bền" },
  { value: "mindfulness", label: "Thiền định" }
];

const STYLE_OPTIONS = [
  { value: "yin_restorative", label: "Nhẹ nhàng (Yin)" },
  { value: "vinyasa_power", label: "Năng động (Vinyasa)" },
  { value: "hatha_breathwork", label: "Chậm (Hatha)" },
  { value: "consult", label: "Cần tư vấn" }
];

const DAYS = ["Th2", "Th3", "Th4", "Th5", "Th6", "Th7", "CN"];

const TIME_OPTIONS = [
  { value: "morning", label: "Sáng" },
  { value: "noon", label: "Trưa" },
  { value: "afternoon", label: "Chiều" },
  { value: "evening", label: "Tối" }
];

type StudentSection = "basic" | "experience" | "goals" | "schedule";

export function OnboardingForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter();
  const supabaseClient = createClient();
  const [activeTab, setActiveTab] = useState<StudentSection>("basic");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [form, setForm] = useState({
    name: "",
    avatar_url: "",
    age: "",
    gender: "",
    health_issues: [] as string[],
    health_issues_other: "",
    experience_level: "",
    fitness_level: "",
    flexibility: "",
    goals: [] as string[],
    style: "",
    available_days: [] as string[],
    preferred_time: "",
    expectations: ""
  });

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      if (data.user) {
        const p = data.profile || {};
        
        // --- 🧹 CLEAN DATA: Tự động dọn dẹp data cũ không tương thích ---
        const rawHealth = p.health_issues ? p.health_issues.split(", ").map((i: string) => i.trim()).filter(Boolean) : [];
        const validHealthValues = HEALTH_OPTIONS.map(opt => opt.value);
        const selectedHealth: string[] = [];
        const extraHealthNotes: string[] = [];

        rawHealth.forEach((item: string) => {
          if (item.startsWith("Lưu ý khác:")) {
            extraHealthNotes.push(item.replace("Lưu ý khác: ", ""));
          } else if (validHealthValues.includes(item)) {
            selectedHealth.push(item);
          } else {
            // Trường hợp dữ liệu cũ là Label (Ví dụ "Đau lưng") hoặc mô tả tự do
            extraHealthNotes.push(item);
          }
        });

        const rawGoals = Array.isArray(p.goals) ? p.goals : (p.goals ? p.goals.split(", ") : []);
        const validGoalValues = GOAL_OPTIONS.map(opt => opt.value);
        const selectedGoals = rawGoals.filter((g: string) => validGoalValues.includes(g));
        // -----------------------------------------------------------------

        setForm({
          name: data.user.full_name || "",
          avatar_url: data.user.avatar_url || "",
          age: p.age || "",
          gender: p.gender || "",
          health_issues: selectedHealth,
          health_issues_other: extraHealthNotes.join(", "),
          experience_level: p.experience_level || "",
          fitness_level: p.fitness_level || "",
          flexibility: p.flexibility || "",
          goals: selectedGoals,
          style: p.style || "",
          available_days: Array.isArray(p.available_days) ? p.available_days : [],
          preferred_time: p.preferred_time || "",
          expectations: p.expectations || ""
        });
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (!user) return;
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabaseClient.storage.from('avatars').upload(fileName, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabaseClient.storage.from('avatars').getPublicUrl(fileName);
      setForm(prev => ({ ...prev, avatar_url: publicUrl }));
      toast.success("Ảnh đại diện đã được cập nhật.");
    } catch (err) { console.error(err); toast.error("Không thể tải ảnh lên."); } finally { setUploading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Vui lòng nhập tên của bạn.");
      return;
    }
    setSaving(true);
    
    // Process health issues to join "other" text
    const cleanHealthIssues = [...form.health_issues];
    if (form.health_issues_other.trim()) {
      cleanHealthIssues.push(`Lưu ý khác: ${form.health_issues_other.trim()}`);
    }

    try {
      const res = await fetch("/api/profile", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: form.name.trim(), 
          avatar_url: form.avatar_url, 
          profileData: {
            ...form,
            health_issues: cleanHealthIssues.join(", ")
          }
        }),
      });
      if (res.ok) {
        setSuccess(true);
        toast.success("Hồ sơ đã được cập nhật!");
        router.refresh();
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
            window.location.reload(); 
          }, 800);
        } else {
          setTimeout(() => window.location.reload(), 1000);
        }
      } else {
        const err = await res.json();
        toast.error(err.error || "Lỗi khi cập nhật hồ sơ.");
      }
    } catch (err) { console.error(err); toast.error("Lỗi kết nối."); } finally { setSaving(false); }
  };

  const SidebarItem = ({ id, icon: Icon, label, desc }: { id: StudentSection, icon: any, label: string, desc: string }) => (
    <button type="button" onClick={() => setActiveTab(id)} className={cn("w-full p-4 rounded-2xl flex items-center gap-4 transition-all text-left border-2", activeTab === id ? "bg-white border-indigo-100 shadow-md translate-x-1" : "bg-transparent border-transparent opacity-60 hover:opacity-100")}>
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-all", activeTab === id ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "bg-white text-indigo-400 border border-indigo-50")}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-bold text-slate-900 leading-none mb-1.5">{label}</div>
        <div className="text-[10px] text-slate-400 font-medium truncate uppercase tracking-widest">{desc}</div>
      </div>
    </button>
  );

  const ChoiceGrid = ({ options, value, onChange, isMulti = false, max = 99 }: { options: any[], value: any, onChange: (v: any) => void, isMulti?: boolean, max?: number }) => (
    <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
      {options.map(opt => {
        const selected = isMulti ? (value as string[]).includes(opt.value) : value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => {
              if (isMulti) {
                const current = value as string[];
                if (current.includes(opt.value)) onChange(current.filter(v => v !== opt.value));
                else if (current.length < max) onChange([...current, opt.value]);
                else toast.info(`Tối đa ${max} lựa chọn`);
              } else {
                onChange(opt.value);
              }
            }}
            className={cn(
              "p-3 text-[13px] font-bold rounded-2xl border-2 transition-all flex items-center justify-center text-center",
              selected ? "border-indigo-600 bg-indigo-50/30 text-indigo-700 shadow-sm" : "border-slate-100 bg-white text-slate-500 hover:border-slate-200"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );

  if (loading) return <div className="p-20 flex flex-col items-center gap-4"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /><div className="text-slate-400 text-sm font-medium">Đang tải hồ sơ...</div></div>;

  return (
    <div className="flex flex-col md:flex-row h-full w-full bg-white gap-8 font-sans">
      {/* Sidebar Navigation */}
      <div className="md:w-[220px] shrink-0 space-y-1.5 p-1">
         <SidebarItem id="basic" icon={User} label="Cơ bản" desc="Cá nhân & Sức khỏe" />
         <SidebarItem id="experience" icon={Zap} label="Trình độ" desc="Thể lực & Linh hoạt" />
         <SidebarItem id="goals" icon={Target} label="Mục tiêu" desc="Định hướng tập" />
         <SidebarItem id="schedule" icon={Calendar} label="Lịch trình" desc="Thời gian rảnh" />
         
         <div className="mt-8 p-6 bg-slate-900 rounded-3xl text-center text-white shrink-0 relative overflow-hidden group">
            <div className="absolute inset-0 bg-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity" />
            <ShieldCheck className="w-6 h-6 text-indigo-400 mx-auto mb-2 opacity-80" />
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300">Data Secured</div>
         </div>
      </div>

      {/* Form Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-[450px]">
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-1 space-y-8 pb-6 custom-scrollbar pr-2">
            
            {activeTab === "basic" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                 <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-[2rem] bg-indigo-50/30 border border-indigo-100/50">
                    <div className="relative group">
                      <div className="w-20 h-20 rounded-[1.75rem] border-4 border-white shadow-2xl overflow-hidden bg-slate-100 flex items-center justify-center">
                         {form.avatar_url ? (
                           <img src={form.avatar_url} className="w-full h-full object-cover" />
                         ) : (
                           <User className="w-8 h-8 text-slate-300" />
                         )}
                      </div>
                      <label className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center cursor-pointer border-2 border-white shadow-lg hover:scale-110 transition-transform">
                        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                      </label>
                    </div>
                    <div className="flex-1 w-full space-y-4">
                       <div className="space-y-1.5">
                         <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-indigo-400/80 px-1">Họ và tên</Label>
                         <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-11 rounded-2xl border-indigo-50 bg-white shadow-sm font-bold text-slate-700 focus:ring-2 ring-indigo-100 outline-none transition-all" />
                       </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-indigo-400 px-1">Độ tuổi</Label>
                      <ChoiceGrid options={AGE_OPTIONS} value={form.age} onChange={(v) => setForm({...form, age: v})} />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-indigo-400 px-1">Giới tính</Label>
                      <ChoiceGrid options={GENDER_OPTIONS} value={form.gender} onChange={(v) => setForm({...form, gender: v})} />
                    </div>
                 </div>

                 <div className="space-y-4 p-6 rounded-[2rem] bg-rose-50/30 border border-rose-100/50">
                    <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-rose-500 px-1">Sức khỏe & Thương tật</Label>
                    <ChoiceGrid 
                      options={HEALTH_OPTIONS} 
                      value={form.health_issues} 
                      onChange={(v: string[]) => {
                        if (v.includes("none") && !form.health_issues.includes("none")) {
                          setForm({...form, health_issues: ["none"]});
                        } else {
                          const filtered = v.filter(i => i !== "none");
                          setForm({...form, health_issues: filtered});
                        }
                      }} 
                      isMulti 
                    />
                    
                    <div className="flex flex-col items-center gap-3 pt-1">
                      <button 
                        type="button" 
                        onClick={() => setForm(prev => ({...prev, health_issues_other: prev.health_issues_other ? "" : " "}))}
                        className={cn(
                          "w-10 h-10 rounded-2xl flex items-center justify-center transition-all shadow-md group hover:scale-105 active:scale-95", 
                          form.health_issues_other ? "bg-amber-500 text-white rotate-45" : "bg-emerald-500 text-white"
                        )}
                      >
                         <Plus className="w-6 h-6" />
                      </button>
                    </div>

                    {form.health_issues_other !== "" && (
                      <div className="pt-2 animate-in fade-in slide-in-from-top-2">
                        <Textarea 
                          autoFocus
                          value={form.health_issues_other} 
                          onChange={(e) => setForm({...form, health_issues_other: e.target.value})}
                          placeholder="Chia sẻ chi tiết vấn đề sức khỏe khác..."
                          className="min-h-[100px] rounded-2xl border-amber-100 bg-white shadow-xl shadow-amber-900/5 text-sm font-medium focus:ring-4 ring-amber-50 outline-none p-4"
                        />
                      </div>
                    )}
                 </div>
              </div>
            )}

            {activeTab === "experience" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                 <div className="space-y-4">
                    <Label className="text-[11px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                       <Activity className="w-4 h-4" /> Kinh nghiệm tập Yoga
                    </Label>
                    <ChoiceGrid options={EXPERIENCE_OPTIONS} value={form.experience_level} onChange={(v) => setForm({...form, experience_level: v})} />
                 </div>

                 <div className="grid grid-cols-2 gap-8 pt-4">
                    <div className="space-y-4">
                       <Label className="text-[11px] font-black uppercase tracking-widest text-amber-500 flex items-center gap-2">
                          <Zap className="w-4 h-4" /> Thể lực hiện tại
                       </Label>
                       <ChoiceGrid options={FITNESS_OPTIONS} value={form.fitness_level} onChange={(v) => setForm({...form, fitness_level: v})} />
                    </div>
                    <div className="space-y-4">
                       <Label className="text-[11px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2">
                          <Waves className="w-4 h-4" /> Độ linh hoạt
                       </Label>
                       <ChoiceGrid options={FLEXIBILITY_OPTIONS} value={form.flexibility} onChange={(v) => setForm({...form, flexibility: v})} />
                    </div>
                 </div>
              </div>
            )}

            {activeTab === "goals" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                 <div className="space-y-4">
                    <Label className="text-[11px] font-black uppercase tracking-widest text-indigo-600 flex items-center gap-2">
                       <Target className="w-4 h-4" /> Mục tiêu chính (Chọn tối đa 2)
                    </Label>
                    <ChoiceGrid options={GOAL_OPTIONS} value={form.goals} onChange={(v) => setForm({...form, goals: v})} isMulti max={2} />
                 </div>
                 
                 <div className="space-y-4">
                    <Label className="text-[11px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                       <Ruler className="w-4 h-4" /> Phong cách ưa thích
                    </Label>
                    <ChoiceGrid options={STYLE_OPTIONS} value={form.style} onChange={(v) => setForm({...form, style: v})} />
                 </div>

                 <div className="space-y-3 pt-2">
                    <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400 px-1">Kỳ vọng / Ghi chú cho giáo viên</Label>
                    <Textarea 
                      value={form.expectations} 
                      onChange={(e) => setForm({ ...form, expectations: e.target.value })} 
                      className="min-h-[100px] rounded-2xl border-slate-100 bg-slate-50/50 p-4 font-medium text-slate-600 placeholder:text-slate-300 focus:bg-white transition-all resize-none italic"
                      placeholder="Chia sẻ thêm về mục tiêu của bạn..."
                    />
                 </div>
              </div>
            )}

            {activeTab === "schedule" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                 <div className="space-y-4">
                    <Label className="text-[11px] font-black uppercase tracking-widest text-indigo-600 flex items-center gap-2">
                       <Calendar className="w-4 h-4" /> Lịch rảnh trong tuần
                    </Label>
                    <div className="flex justify-between gap-1">
                      {DAYS.map(day => (
                        <button 
                          key={day} 
                          type="button" 
                          onClick={() => setForm(prev => ({ 
                            ...prev, 
                            available_days: prev.available_days.includes(day) ? prev.available_days.filter(d => d !== day) : [...prev.available_days, day] 
                          }))} 
                          className={cn(
                            "flex-1 h-10 rounded-xl border-2 flex items-center justify-center text-[11px] font-black transition-all", 
                            form.available_days.includes(day) ? "border-indigo-600 bg-indigo-50 text-indigo-600 shadow-sm" : "border-slate-50 bg-slate-50 text-slate-400"
                          )}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                 </div>

                 <div className="space-y-4">
                    <Label className="text-[11px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                       <Clock className="w-4 h-4" /> Thời điểm tập luyện tốt nhất
                    </Label>
                    <ChoiceGrid options={TIME_OPTIONS} value={form.preferred_time} onChange={(v) => setForm({...form, preferred_time: v})} />
                 </div>

                 <div className="p-6 rounded-[2rem] bg-indigo-900 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
                    <Sparkles className="absolute -right-2 -top-2 w-20 h-20 opacity-10 rotate-12" />
                    <div className="relative z-10 flex items-start gap-4">
                       <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                          <ListChecks className="w-5 h-5 text-indigo-400" />
                       </div>
                       <div>
                          <div className="text-[13px] font-black uppercase tracking-widest mb-1.5 text-indigo-300">Hoàn thiện hồ sơ</div>
                          <p className="text-[12px] leading-relaxed text-indigo-100/70 font-medium">Việc cung cấp đầy đủ thông tin giúp YogAI thiết kế lộ trình luyện tập dành riêng cho cơ địa và mục tiêu của bạn.</p>
                       </div>
                    </div>
                 </div>
              </div>
            )}

          </div>

          <div className="p-6 border-t border-slate-100 bg-white/80 backdrop-blur flex items-center justify-between shrink-0">
             <div className="flex-1">
                {success && <div className="text-[12px] font-black uppercase tracking-widest text-emerald-500 animate-pulse flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Đã cập nhật xong</div>}
             </div>
             <Button 
                type="submit" 
                disabled={saving || uploading} 
                className="h-12 px-12 bg-slate-900 text-white hover:bg-indigo-600 active:scale-95 rounded-[1.25rem] text-[13px] font-black uppercase tracking-widest shadow-xl shadow-slate-200 transition-all"
             >
               {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Xác nhận lưu</span>}
             </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
