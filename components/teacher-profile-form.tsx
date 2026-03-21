"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  Loader2,
  Plus,
  Trash2,
  Sparkles,
  Award,
  BookOpen,
  History,
  CheckCircle2,
  AlertCircle,
  UserCircle,
  Camera
} from "lucide-react";
import { toast } from "@/components/ui/toast";
import { ErrorMessage } from "@/components/ui/error-message";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/utils/supabase/client";
import { FormError } from "@/components/ui/form-error";

export function TeacherProfileForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter();
  const supabaseClient = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    avatar_url: "",
    bio: "",
    specialties: [] as string[],
    certifications: [] as string[],
    years_experience: 0,
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [newSpecialty, setNewSpecialty] = useState("");
  const [newCert, setNewCert] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      if (data.user) {
        setForm({
          name: data.user.name || "",
          avatar_url: data.user.avatar_url || "",
          bio: data.profile?.bio || "",
          specialties: data.profile?.specialties || [],
          certifications: data.profile?.certifications || [],
          years_experience: data.profile?.years_experience || 0,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError("Dung lượng ảnh quá lớn. Vui lòng chọn ảnh dưới 2MB.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (!user) {
        setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabaseClient.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabaseClient.storage
        .from('avatars')
        .getPublicUrl(fileName);

      setForm(prev => ({ ...prev, avatar_url: publicUrl }));
      toast.info("Ảnh đại diện", "Ảnh của bạn đã được tải lên và đồng bộ.");
    } catch (err: any) {
      console.error("Error uploading image:", err);
      const msg = "Không thể tải ảnh lên hệ thống. Vui lòng thử lại sau.";
      setError(msg);
      toast.error("Lỗi tải ảnh", msg);
    } finally {
      setUploading(false);
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
    setError("");
    setFieldErrors({});

    if (!form.name || form.name.trim().length === 0) {
      setFieldErrors({ name: "Vui lòng nhập họ và tên của bạn." });
      setError("Vui lòng kiểm tra lại thông tin hồ sơ.");
      return;
    }

    setSaving(true);
    setSuccess(false);

    try {
      const { name, avatar_url, ...profileData } = form;
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), avatar_url, profileData }),
      });

      if (res.ok) {
        setSuccess(true);
        router.refresh();
        if (onSuccess) {
          setTimeout(onSuccess, 1500);
        }
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Có lỗi xảy ra khi cập nhật hồ sơ.");
      }
    } catch (err) {
      setError("Mất kết nối với máy chủ. Vui lòng kiểm tra internet.");
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
    <form onSubmit={handleSubmit} noValidate className="space-y-12 animate-soft-fade select-none">

      {/* Basic Info Section */}
      <div className="grid md:grid-cols-2 gap-12 pt-4">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <UserCircle className="w-5 h-5 text-slate-600" />
            </div>
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Họ và tên</Label>
          </div>
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Nhập tên hiển thị của bạn..."
            className={`h-14 rounded-2xl border-slate-100 bg-white px-6 font-bold text-sm shadow-sm ${fieldErrors.name ? 'border-rose-200 bg-rose-50/20' : ''}`}
          />
          <FormError message={fieldErrors.name} />
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <Camera className="w-5 h-5 text-slate-600" />
            </div>
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ảnh đại diện</Label>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-[1.8rem] bg-slate-100 overflow-hidden border-4 border-white shadow-xl relative transition-transform group-hover:scale-105">
                {form.avatar_url ? (
                  <img src={form.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-50"><UserCircle className="w-10 h-10 text-slate-200" /></div>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                    <div className="w-6 h-6 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="avatar-upload"
                className="inline-flex items-center justify-center px-6 h-12 rounded-xl text-[11px] font-black uppercase tracking-widest cursor-pointer bg-indigo-600 text-white hover:bg-indigo-500 hover:scale-[101%] transition-all shadow-sm"
              >
                {uploading ? "Đang tải..." : "Chọn ảnh từ máy"}
              </Label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">JPG, PNG hoặc WebP. Tối đa 2MB.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Giới thiệu bản thân</Label>
          </div>
        </div>
        <Textarea
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
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
            onChange={(e) => setForm({ ...form, years_experience: parseInt(e.target.value) || 0 })}
            className="h-16 rounded-[1.5rem] border-slate-100 bg-white px-8 font-black text-lg shadow-sm w-full lg:max-w-[120px]"
          />
        </div>

        <div className="flex flex-col justify-end">
          {error && (
            <div className="mb-8">
              <ErrorMessage message={error} onClose={() => setError("")} />
            </div>
          )}
          <div className="flex items-center gap-6 justify-end">
            {success && (
              <div className="flex items-center gap-3 text-emerald-600 animate-in fade-in slide-in-from-right-4">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Sync Complete</span>
                  <span className="text-[11px] font-black uppercase tracking-widest">Đã đồng bộ hồ sơ</span>
                </div>
              </div>
            )}
            <Button
              type="submit"
              disabled={saving}
              className="h-16 px-12 bg-slate-900 text-white hover:bg-slate-800 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {saving ? (
                <div className="flex items-center gap-2">
                   <Loader2 className="w-4 h-4 animate-spin" />
                   <span>Đang đồng bộ...</span>
                </div>
              ) : (
                <span className="flex items-center gap-3">
                  Cập nhật hồ sơ <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

    </form>
  );
}
