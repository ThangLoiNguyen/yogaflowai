"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  Plus,
  Trash2,
  Camera,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Target,
  Heart,
  Calendar,
  User,
  Activity,
  ChevronRight,
  Settings,
  ShieldCheck
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { FormError } from "@/components/ui/form-error";
import { cn } from "@/lib/utils";

const GOALS = [{ id: "lose_weight", label: "Giảm cân" }, { id: "flexibility", label: "Dẻo dai" }, { id: "stress_relief", label: "Giảm stress" }, { id: "rehabilitation", label: "Phục hồi" }];
const EXPERIENCES = [{ id: "beginner", label: "Mới" }, { id: "intermediate", label: "TB" }, { id: "advanced", label: "Cao" }];
const HEALTH_CONDITIONS = [{ id: "back_pain", label: "Đau lưng" }, { id: "knee_pain", label: "Đầu gối" }, { id: "injury_history", label: "Chấn thương" }, { id: "none", label: "Không" }];
const DAYS = ["Th2", "Th3", "Th4", "Th5", "Th6", "Th7", "CN"];

type StudentSection = "account" | "goals" | "health";

export function OnboardingForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter();
  const supabaseClient = createClient();
  const [activeTab, setActiveTab] = useState<StudentSection>("account");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", avatar_url: "", experience_level: "beginner", goals: [] as string[], injuries: [] as string[], available_days: [] as string[], fitness_level: 3, expectations: "" });

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      if (data.user) {
        setForm(prev => ({
          ...prev,
          name: data.user.full_name || "",
          avatar_url: data.user.avatar_url || "",
          experience_level: data.profile?.experience_level || "beginner",
          goals: data.profile?.goals || [],
          injuries: data.profile?.health_issues ? data.profile.health_issues.split(",") : [],
          available_days: data.profile?.available_days || [],
          fitness_level: data.profile?.fitness_level || 3,
          expectations: data.profile?.expectations || "",
        }));
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
    } catch (err) { console.error(err); } finally { setUploading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const { name, avatar_url, goals, injuries, experience_level, available_days, fitness_level, expectations } = form;
      const profileData = { goals, health_issues: injuries.join(","), experience_level, available_days, fitness_level, expectations };
      const res = await fetch("/api/profile", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), avatar_url, profileData }),
      });
      if (res.ok) {
        setSuccess(true);
        router.refresh();
        if (onSuccess) setTimeout(onSuccess, 800);
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (err) { setError("Lỗi kết nối"); } finally { setSaving(false); }
  };

  if (loading) return <div className="p-10 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-indigo-500" /></div>;

  const SidebarItem = ({ id, icon: Icon, label, desc }: { id: StudentSection, icon: any, label: string, desc: string }) => (
    <button type="button" onClick={() => setActiveTab(id)} className={cn("w-full p-3 rounded-2xl flex items-center gap-3 transition-all text-left border-2", activeTab === id ? "bg-white border-indigo-100 shadow-md translate-x-1" : "bg-indigo-50/10 border-transparent opacity-60 hover:opacity-100")}>
      <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center transition-all", activeTab === id ? "bg-indigo-600 text-white shadow-sm" : "bg-white text-indigo-400 border border-indigo-50")}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-black uppercase text-slate-800 tracking-widest leading-none mb-1">{label}</div>
        <div className="text-[8px] text-slate-400 font-bold uppercase tracking-tight truncate">{desc}</div>
      </div>
    </button>
  );

  return (
    <div className="flex h-[380px] w-full overflow-hidden bg-white gap-4">
      <div className="w-[180px] shrink-0 space-y-2 pt-2 border-r border-slate-50 pr-4">
         <SidebarItem id="account" icon={User} label="Thông tin" desc="Cá nhân" />
         <SidebarItem id="goals" icon={Target} label="Mục tiêu" desc="Lộ trình tập" />
         <SidebarItem id="health" icon={Heart} label="Sức khỏe" desc="Chấn thương" />
         <div className="mt-8 p-4 bg-slate-900 rounded-2xl text-center text-white relative overflow-hidden shrink-0">
            <ShieldCheck className="w-6 h-6 text-indigo-400 mx-auto opacity-80" />
            <div className="text-[7px] font-black uppercase tracking-widest text-indigo-300">Secured</div>
         </div>
      </div>

      <div className="flex-1 flex flex-col pt-2 overflow-hidden">
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-2 space-y-4 pb-4 custom-scrollbar">
            {activeTab === "account" && (
              <div className="animate-in fade-in zoom-in-95 duration-300 space-y-4">
                 <div className="flex items-center gap-4 bg-indigo-50/5 p-4 rounded-3xl border border-indigo-50 border-dashed">
                    <div className="relative group shrink-0">
                      <div className="w-16 h-16 rounded-2xl bg-white border-2 border-white shadow-lg overflow-hidden flex items-center justify-center">
                         <img src={form.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=yogalover"} className="w-full h-full object-cover" />
                      </div>
                      <label className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center cursor-pointer border-2 border-white shadow-sm opacity-0 group-hover:opacity-100 transition-all"><Camera className="w-3 h-3" /><input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" /></label>
                    </div>
                    <div className="flex-1 space-y-1">
                       <Label className="text-[8px] font-black uppercase text-indigo-400 tracking-widest px-1">Tên của bạn</Label>
                       <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-9 rounded-xl border-indigo-50 font-bold bg-white text-xs" />
                    </div>
                 </div>
              </div>
            )}

            {activeTab === "goals" && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4">
                 <div className="space-y-2">
                    <Label className="text-[8px] font-black uppercase text-indigo-400 tracking-widest px-2">Lựa chọn mục tiêu</Label>
                    <div className="grid grid-cols-2 gap-1.5">
                       {GOALS.map(goal => (
                         <button key={goal.id} type="button" onClick={() => setForm(prev => ({ ...prev, goals: prev.goals.includes(goal.id) ? prev.goals.filter(g => g !== goal.id) : [...prev.goals, goal.id] }))} className={cn("py-3 text-center rounded-2xl border-2 text-[10px] font-black uppercase tracking-tighter transition-all", form.goals.includes(goal.id) ? "border-indigo-600 bg-white text-indigo-600 shadow-md" : "border-slate-50 bg-slate-50 text-slate-400")}>{goal.label}</button>
                       ))}
                    </div>
                 </div>
                 <div className="space-y-2">
                    <Label className="text-[8px] font-black uppercase text-indigo-400 tracking-widest px-2">Cấp độ</Label>
                    <div className="flex gap-1.5">
                       {EXPERIENCES.map(exp => (
                         <button key={exp.id} type="button" onClick={() => setForm({ ...form, experience_level: exp.id })} className={cn("flex-1 py-2 text-center rounded-xl border-2 text-[9px] font-black uppercase transition-all", form.experience_level === exp.id ? "border-indigo-600 bg-white text-indigo-600 shadow-md" : "border-slate-50 bg-slate-50 text-slate-400")}>{exp.label}</button>
                       ))}
                    </div>
                 </div>
              </div>
            )}

            {activeTab === "health" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-4">
                 <div className="bg-rose-50/5 p-4 rounded-3xl border border-rose-50 space-y-2.5">
                    <Label className="text-[8px] font-black uppercase text-rose-500 flex items-center gap-2 tracking-widest px-1">Sức khỏe</Label>
                    <div className="grid grid-cols-2 gap-1.5">
                       {HEALTH_CONDITIONS.map(cond => (
                         <button key={cond.id} type="button" onClick={() => setForm(prev => ({ ...prev, injuries: prev.injuries.includes(cond.id) ? prev.injuries.filter(i => i !== cond.id) : [...prev.injuries, cond.id] }))} className={cn("py-3 text-center rounded-2xl border-2 text-[9px] font-black uppercase tracking-tighter transition-all", form.injuries.includes(cond.id) ? "border-rose-500 bg-white text-rose-600 shadow-md" : "border-slate-50 bg-slate-50 text-slate-400")}>{cond.label}</button>
                       ))}
                    </div>
                 </div>
                 <div className="space-y-2">
                    <Label className="text-[8px] font-black uppercase text-indigo-400 flex items-center gap-2 px-1 tracking-widest">Lịch rảnh</Label>
                    <div className="flex justify-between gap-1">
                       {DAYS.map(day => (
                         <button key={day} type="button" onClick={() => setForm(prev => ({ ...prev, available_days: prev.available_days.includes(day) ? prev.available_days.filter(d => d !== day) : [...prev.available_days, day] }))} className={cn("flex-1 h-8 rounded-lg border flex items-center justify-center text-[9px] font-black transition-all", form.available_days.includes(day) ? "border-indigo-600 bg-white text-indigo-600 shadow-sm" : "border-slate-50 bg-slate-50 text-slate-400")}>{day}</button>
                       ))}
                    </div>
                 </div>
                 <div className="space-y-1.5">
                    <Label className="text-[8px] font-black uppercase text-slate-400 px-1 tracking-widest">Kỳ vọng AI</Label>
                    <Textarea value={form.expectations} onChange={(e) => setForm({ ...form, expectations: e.target.value })} className="min-h-[80px] rounded-2xl border-slate-50 bg-slate-50/10 p-4 text-[11px] italic focus:bg-white transition-all shadow-inner" placeholder="P/s..." />
                 </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-50 flex items-center justify-between shrink-0">
             <div className="flex-1">
                {success && <div className="flex items-center gap-2 text-emerald-600 text-[9px] font-black uppercase tracking-widest"><CheckCircle2 className="w-4 h-4" /> Ready</div>}
             </div>
             <Button type="submit" disabled={saving} className="h-10 px-10 bg-slate-900 text-white hover:bg-indigo-600 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-lg transition-all active:scale-95">
               {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <span className="flex items-center gap-2">Xác nhận <Sparkles className="w-3.5 h-3.5" /></span>}
             </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
