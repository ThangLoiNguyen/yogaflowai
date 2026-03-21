"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2, Plus, Trash2, Camera, CheckCircle2, AlertCircle, Sparkles, Award, BookOpen, User, ShieldCheck, ChevronRight
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";

type TeacherSection = "basic" | "professional" | "certificates";

export function TeacherProfileForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter();
  const supabaseClient = createClient();
  const [activeTab, setActiveTab] = useState<TeacherSection>("basic");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ name: "", avatar_url: "", bio: "", specialties: [] as string[], certifications: [] as string[], years_experience: 0 });
  const [newSpecialty, setNewSpecialty] = useState("");
  const [newCert, setNewCert] = useState("");

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      if (data.user) {
        setForm({
          name: data.user.full_name || data.user.name || "",
          avatar_url: data.user.avatar_url || "",
          bio: data.profile?.bio || "",
          specialties: data.profile?.specialties || [],
          certifications: data.profile?.certifications || [],
          years_experience: data.profile?.years_experience || 0,
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
    } catch (err) { console.error(err); } finally { setUploading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const { name, avatar_url, ...profileData } = form;
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
    } catch (err) { console.error(err); } finally { setSaving(false); }
  };

  const SidebarItem = ({ id, icon: Icon, label, desc }: { id: TeacherSection, icon: any, label: string, desc: string }) => (
    <button type="button" onClick={() => setActiveTab(id)} className={cn("w-full p-3 rounded-2xl flex items-center gap-3 transition-all text-left border-2", activeTab === id ? "bg-white border-emerald-100 shadow-md translate-x-1" : "bg-emerald-50/10 border-transparent opacity-60")}>
      <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center transition-all", activeTab === id ? "bg-emerald-600 text-white" : "bg-white text-emerald-400")}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="txt-action text-slate-800 leading-none mb-1">{label}</div>
        <div className="txt-action text-slate-400 opacity-70 truncate">{desc}</div>
      </div>
    </button>
  );

  if (loading) return <div className="p-10 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-emerald-500" /></div>;

  return (
    <div className="flex h-[360px] w-full overflow-hidden bg-white gap-4">
      <div className="w-[180px] shrink-0 space-y-2 border-r border-slate-50 pr-4">
         <SidebarItem id="basic" icon={User} label="Hồ sơ" desc="Info chính" />
         <SidebarItem id="professional" icon={Award} label="Kỹ năng" desc="Kinh nghiệm" />
         <SidebarItem id="certificates" icon={BookOpen} label="Bằng cấp" desc="Chứng chỉ" />
         <div className="mt-8 p-4 bg-slate-900 rounded-2xl text-center text-white shrink-0">
            <ShieldCheck className="w-5 h-5 text-emerald-400 mx-auto opacity-80" />
            <div className="txt-action text-emerald-300 mt-1">Verified</div>
         </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-2 space-y-4 pb-4 custom-scrollbar">
            {activeTab === "basic" && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-emerald-50/5 p-4 rounded-3xl border border-emerald-50">
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-white border-2 border-white shadow-lg overflow-hidden flex items-center justify-center">
                       <img src={form.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=expert"} className="w-full h-full object-cover" />
                    </div>
                    <label className="absolute -bottom-1 -right-1 w-5 h-5 rounded-lg bg-emerald-600 text-white flex items-center justify-center cursor-pointer border-2 border-white shadow-sm"><Camera className="w-3 h-3" /><input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" /></label>
                  </div>
                   <div className="flex-1">
                     <Label className="txt-action text-emerald-400 px-1">Chuyên gia</Label>
                     <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-8 txt-content font-bold mb-2" />
                   </div>
                 </div>
                <div className="space-y-1">
                   <Label className="txt-action text-emerald-400 px-1">Tiểu sử</Label>
                   <Textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="min-h-[120px] txt-content italic focus:bg-white transition-all shadow-inner rounded-xl" placeholder="Bio..." />
                </div>
              </div>
            )}

            {activeTab === "professional" && (
              <div className="space-y-4">
                <div className="bg-emerald-50/5 p-4 rounded-3xl flex items-center justify-between">
                   <Label className="txt-action text-emerald-600">Thâm niên</Label>
                   <div className="flex items-center gap-2">
                      <Input type="number" value={form.years_experience} onChange={(e) => setForm({ ...form, years_experience: parseInt(e.target.value) || 0 })} className="w-20 h-8 txt-content text-center font-bold" />
                      <span className="txt-action text-emerald-400">Năm</span>
                   </div>
                </div>
                <div className="space-y-2">
                   <Label className="txt-action text-emerald-600 px-1">Chuyên môn</Label>
                   <div className="flex gap-1.5">
                      <Input value={newSpecialty} onChange={(e) => setNewSpecialty(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), setNewSpecialty(""), setForm({ ...form, specialties: [...form.specialties, newSpecialty.trim()] }))} className="h-8 txt-content" />
                      <Button type="button" onClick={() => (setNewSpecialty(""), setForm({ ...form, specialties: [...form.specialties, newSpecialty.trim()] }))} className="bg-emerald-600 h-8"><Plus className="w-4 h-4" /></Button>
                   </div>
                   <div className="flex flex-wrap gap-1.5">
                      {form.specialties.map((s, i) => (
                        <div key={i} className="flex items-center gap-1.5 px-3 py-1 bg-white text-emerald-700 rounded-lg txt-action border border-emerald-50 group">
                          {s} <button type="button" onClick={() => setForm({ ...form, specialties: form.specialties.filter((_, idx) => idx !== i) })} className="opacity-0 group-hover:opacity-100 text-rose-500"><Trash2 className="w-3 h-3" /></button>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            )}

            {activeTab === "certificates" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="txt-action text-indigo-500 px-1">Bằng cấp</Label>
                  <div className="flex gap-1.5">
                     <Input value={newCert} onChange={(e) => setNewCert(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), setNewCert(""), setForm({ ...form, certifications: [...form.certifications, newCert.trim()] }))} className="h-8 txt-content" />
                     <Button type="button" onClick={() => (setNewCert(""), setForm({ ...form, certifications: [...form.certifications, newCert.trim()] }))} className="bg-indigo-600 h-8"><Plus className="w-4 h-4" /></Button>
                  </div>
                  <div className="grid grid-cols-1 gap-1.5">
                     {form.certifications.map((c, i) => (
                       <div key={i} className="flex justify-between items-center p-2 bg-white rounded-xl border border-indigo-50 txt-action text-slate-600 group">
                         <div className="truncate pr-4 flex items-center gap-2"><BookOpen className="w-3 h-3" />{c}</div>
                         <button type="button" onClick={() => setForm({ ...form, certifications: form.certifications.filter((_, idx) => idx !== i) })} className="opacity-0 group-hover:opacity-100 text-rose-500"><Trash2 className="w-3 h-3" /></button>
                       </div>
                     ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-50 flex items-center justify-between shrink-0">
             <div className="flex-1">
                {success && <div className="txt-action text-emerald-600 animate-pulse"><CheckCircle2 className="w-4 h-4 inline mr-1" /> Ready</div>}
             </div>
             <Button type="submit" disabled={saving} className="h-9 px-10 bg-slate-900 text-white hover:bg-emerald-600 rounded-2xl txt-action shadow-lg">
               {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Xác nhận</span>}
             </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
