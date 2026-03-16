"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Save, 
  Plus, 
  Trash2, 
  Sparkles, 
  Award, 
  BookOpen, 
  History,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function TeacherProfileForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    bio: "",
    specialties: [] as string[],
    certifications: [] as string[],
    years_experience: 0,
  });

  const [newSpecialty, setNewSpecialty] = useState("");
  const [newCert, setNewCert] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/teacher/profile");
      const data = await res.json();
      if (data.profile) {
        setForm({
          bio: data.profile.bio || "",
          specialties: data.profile.specialties || [],
          certifications: data.profile.certifications || [],
          years_experience: data.profile.years_experience || 0,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addSpecialty = () => {
    if (newSpecialty.trim()) {
      setForm(prev => ({ ...prev, specialties: [...prev.specialties, newSpecialty.trim()] }));
      setNewSpecialty("");
    }
  };

  const removeSpecialty = (index: number) => {
    setForm(prev => ({ ...prev, specialties: prev.specialties.filter((_, i) => i !== index) }));
  };

  const addCert = () => {
    if (newCert.trim()) {
      setForm(prev => ({ ...prev, certifications: [...prev.certifications, newCert.trim()] }));
      setNewCert("");
    }
  };

  const removeCert = (index: number) => {
    setForm(prev => ({ ...prev, certifications: prev.certifications.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError("");

    try {
      const res = await fetch("/api/teacher/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSuccess(true);
        router.refresh();
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Có lỗi xảy ra khi lưu hồ sơ.");
      }
    } catch (err) {
      setError("Không thể kết nối với máy chủ.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 animate-pulse">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
           <Sparkles className="w-6 h-6 text-indigo-400" />
        </div>
        <p className="text-sm font-black text-slate-300 uppercase tracking-widest">Đang tải hồ sơ...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-12 animate-soft-fade">
      
      {/* Bio Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-indigo-600" />
           </div>
           <div>
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Giới thiệu bản thân</Label>
              <h3 className="text-lg font-black text-slate-900 leading-none">Bio & Câu chuyện</h3>
           </div>
        </div>
        <Textarea 
          value={form.bio}
          onChange={(e) => setForm({...form, bio: e.target.value})}
          placeholder="Chia sẻ kinh nghiệm, triết lý dạy Yoga và hành trình của bạn với học viên..."
          className="min-h-[160px] rounded-[2rem] border-slate-100 bg-white shadow-sm focus:shadow-xl focus:shadow-indigo-50/50 transition-all font-medium p-8 leading-relaxed"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Specialties */}
        <div className="space-y-6">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                 <Sparkles className="w-5 h-5 text-emerald-600" />
              </div>
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Chuyên môn giảng dạy</Label>
           </div>
           
           <div className="bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-50 space-y-6">
              <div className="flex flex-wrap gap-2">
                 {form.specialties.map((s, i) => (
                   <Badge key={i} className="bg-white text-slate-600 border border-slate-100 font-bold px-4 py-2 rounded-xl text-xs uppercase group">
                      {s}
                      <button type="button" onClick={() => removeSpecialty(i)} className="ml-2 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Trash2 className="w-3 h-3" />
                      </button>
                   </Badge>
                 ))}
                 {form.specialties.length === 0 && <p className="text-[11px] text-slate-300 font-bold uppercase tracking-widest">Chưa có chuyên môn nào</p>}
              </div>
              
              <div className="relative group">
                 <Input 
                   value={newSpecialty}
                   onChange={(e) => setNewSpecialty(e.target.value)}
                   onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSpecialty())}
                   placeholder="Thêm chuyên môn mới (Vd: Hatha, Vinyasa...)" 
                   className="h-14 rounded-2xl border-slate-100 bg-white pr-14 pl-6 font-bold text-sm shadow-sm"
                 />
                 <button 
                  type="button" 
                  onClick={addSpecialty}
                  className="absolute right-2 top-2 h-10 w-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-100 hover:scale-105 active:scale-90 transition-all"
                >
                    <Plus className="w-5 h-5" />
                 </button>
              </div>
           </div>
        </div>

        {/* Certifications */}
        <div className="space-y-6">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                 <Award className="w-5 h-5 text-amber-600" />
              </div>
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Bằng cấp & Chứng chỉ</Label>
           </div>
           
           <div className="bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-50 space-y-6">
              <div className="flex flex-wrap gap-2">
                 {form.certifications.map((c, i) => (
                   <Badge key={i} className="bg-white text-slate-600 border border-slate-100 font-bold px-4 py-2 rounded-xl text-xs uppercase group">
                      {c}
                      <button type="button" onClick={() => removeCert(i)} className="ml-2 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Trash2 className="w-3 h-3" />
                      </button>
                   </Badge>
                 ))}
                 {form.certifications.length === 0 && <p className="text-[11px] text-slate-300 font-bold uppercase tracking-widest">Chưa có bằng cấp nào</p>}
              </div>
              
              <div className="relative group">
                 <Input 
                   value={newCert}
                   onChange={(e) => setNewCert(e.target.value)}
                   onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCert())}
                   placeholder="Thêm chứng chỉ mới (Vd: RYT-200...)" 
                   className="h-14 rounded-2xl border-slate-100 bg-white pr-14 pl-6 font-bold text-sm shadow-sm"
                 />
                 <button 
                  type="button" 
                  onClick={addCert}
                  className="absolute right-2 top-2 h-10 w-10 bg-amber-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-amber-100 hover:scale-105 active:scale-90 transition-all"
                >
                    <Plus className="w-5 h-5" />
                 </button>
              </div>
           </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-6">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
                 <History className="w-5 h-5 text-sky-600" />
              </div>
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Kinh nghiệm giảng dạy (Năm)</Label>
           </div>
           <Input 
             type="number" 
             value={form.years_experience} 
             onChange={(e) => setForm({...form, years_experience: parseInt(e.target.value) || 0})}
             className="h-16 rounded-[1.5rem] border-slate-100 bg-white px-8 font-black text-lg shadow-sm w-full lg:max-w-[120px]"
           />
        </div>

        <div className="flex flex-col justify-end">
           {error && (
             <div className="mb-6 p-4 rounded-2xl bg-rose-50 text-rose-600 text-[11px] font-black uppercase tracking-widest flex items-center gap-3 animate-in slide-in-from-top-2">
                <AlertCircle className="w-4 h-4" /> {error}
             </div>
           )}
           <div className="flex items-center gap-6">
              {success && (
                <div className="flex items-center gap-2 text-emerald-600 animate-in fade-in slide-in-from-right-4">
                   <CheckCircle2 className="w-5 h-5" />
                   <span className="text-[11px] font-black uppercase tracking-widest">Cập nhật hồ sơ thành công!</span>
                </div>
              )}
              <Button 
                disabled={saving} 
                className="h-16 px-12 bg-slate-900 text-white hover:bg-slate-800 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] transition-all active:scale-95 ml-auto"
              >
                {saving ? "ĐANG LƯU..." : <span className="flex items-center gap-2"><Save className="w-4 h-4" /> LƯU THÔNG TIN HỒ SƠ</span>}
              </Button>
           </div>
        </div>
      </div>

    </form>
  );
}
