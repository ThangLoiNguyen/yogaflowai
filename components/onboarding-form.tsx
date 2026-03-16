"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Activity,
  Calendar,
  HeartPulse,
  UserCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Zap,
  Dumbbell,
  Camera,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";
import { toast } from "@/components/ui/toast";
import { ErrorMessage } from "@/components/ui/error-message";
import { FormError } from "@/components/ui/form-error";

const GOALS = [
  { id: "lose_weight", label: "Giảm cân" },
  { id: "flexibility", label: "Dẻo dai" },
  { id: "stress_relief", label: "Giảm căng thẳng" },
  { id: "rehabilitation", label: "Phục hồi" },
  { id: "strength", label: "Sức mạnh" },
];

const EXPERIENCES = [
  { id: "beginner", label: "Mới bắt đầu", desc: "Chưa có kinh nghiệm" },
  { id: "intermediate", label: "Trung bình", desc: "Đã tập trên 6 tháng" },
  { id: "advanced", label: "Nâng cao", desc: "Tập luyện hàng ngày" },
];

const HEALTH_CONDITIONS = [
  { id: "back_pain", label: "Đau lưng" },
  { id: "knee_pain", label: "Đau đầu gối" },
  { id: "neck_pain", label: "Đau cổ" },
  { id: "injury_history", label: "Tiền sử chấn thương" },
  { id: "none", label: "Không có" },
];

const DAYS = ["Th2", "Th3", "Th4", "Th5", "Th6", "Th7", "CN"];

import { Badge } from "@/components/ui/badge";
import { createClient } from "@/utils/supabase/client";

export function OnboardingForm() {
  const router = useRouter();
  const supabaseClient = createClient();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    avatar_url: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    experience_level: "beginner",
    goals: [] as string[],
    injuries: [] as string[],
    available_days: [] as string[],
    available_time: "",
    preferred_intensity: "Moderate",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [initialized, setInitialized] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setIsEditing(typeof window !== "undefined" && window.location.pathname !== "/onboarding");
    const fetchExisting = async () => {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();
        if (data.user) {
          setForm(prev => ({
            ...prev,
            name: data.user.name || "",
            avatar_url: data.user.avatar_url || "",
            age: data.profile?.age?.toString() || "",
            gender: data.profile?.gender || "",
            height: data.profile?.height?.toString() || "",
            weight: data.profile?.weight?.toString() || "",
            experience_level: data.profile?.experience_level || "beginner",
            goals: data.profile?.goals || [],
            injuries: data.profile?.injuries || [],
            available_days: data.profile?.schedule?.available_days || [],
            available_time: data.profile?.schedule?.available_time || "",
            preferred_intensity: data.profile?.schedule?.preferred_intensity || "Moderate",
          }));
          setInitialized(true);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchExisting();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("Tập tin vượt quá giới hạn băng thông (Tối đa 2MB).");
      toast.warning("Tệp quá lớn", "Vui lòng chọn ảnh có kích thước dưới 2MB.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (!user) {
        setError("Yêu cầu xác thực danh tính để truy cập bộ nhớ đám mây.");
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
    } catch (err: any) {
      console.error("Error uploading image:", err);
      setError("Giao thức tải ảnh lên hệ thống lưu trữ trung tâm thất bại.");
    } finally {
      setUploading(false);
    }
  };

  const toggleGoal = (id: string) => {
    setForm((prev) => ({
      ...prev,
      goals: prev.goals.includes(id)
        ? prev.goals.filter((g) => g !== id)
        : [...prev.goals, id],
    }));
  };

  const toggleInjury = (id: string) => {
    setForm((prev) => ({
      ...prev,
      injuries: prev.injuries.includes(id)
        ? prev.injuries.filter((i) => i !== id)
        : [...prev.injuries, id],
    }));
  };

  const toggleDay = (day: string) => {
    setForm((prev) => ({
      ...prev,
      available_days: prev.available_days.includes(day)
        ? prev.available_days.filter((d) => d !== day)
        : [...prev.available_days, day],
    }));
  };

  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const errors: Record<string, string> = {};
    if (!form.name || form.name.trim().length === 0) {
      errors.name = "Vui lòng nhập họ và tên.";
    }
    if (!form.age) errors.age = "Vui lòng nhập tuổi.";
    if (!form.height) errors.height = "Vui lòng nhập chiều cao.";
    if (!form.weight) errors.weight = "Vui lòng nhập cân nặng.";
    if (!form.gender) errors.gender = "Vui lòng chọn giới tính.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setStep(1);
      setError("Vui lòng hoàn thiện các thông tin cơ bản.");
      return;
    }

    setLoading(true);
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
        toast.success("Hành trình bắt đầu", isEditing ? "Thông tin cá nhân đã được đồng bộ." : "Chào mừng bạn đến với kỷ nguyên Yoga mới.");
        router.refresh();
        if (window.location.pathname === "/onboarding") {
          setTimeout(() => router.push("/student-dashboard"), 1500);
        }
      } else {
        const data = await res.json();
        setError(data.error || "Không thể lưu thông tin. Vui lòng thử lại sau.");
        toast.error("Giao thức thất bại", data.error || "Không thể kết nối với hệ thống trung tâm.");
      }
    } catch (error) {
      console.error(error);
      setError("Mất kết nối với máy chủ. Vui lòng kiểm tra internet.");
      toast.error("Lỗi mạng", "Vui lòng kiểm tra lại kết nối internet của bạn.");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    if (step === 1) return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Họ và tên</Label>
            <Input
              placeholder="Vd: Nguyễn Văn A"
              className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold px-6 shadow-sm"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              error={!!fieldErrors.name}
            />
            <FormError message={fieldErrors.name} />
          </div>

          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Ảnh đại diện</Label>
            <div className="flex items-center gap-6 p-6 rounded-3xl bg-slate-50/50 border border-slate-100/50 relative overflow-hidden group">
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-2xl bg-white overflow-hidden border-2 border-white shadow-xl group-hover:scale-105 transition-transform">
                  {form.avatar_url ? (
                    <img src={form.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-50">
                      <UserCircle2 className="w-8 h-8 text-slate-200" />
                    </div>
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 space-y-3">
                <Label
                  htmlFor="avatar-upload"
                  className="h-11 px-6 rounded-xl bg-white border border-slate-100 text-slate-900 text-[10px] font-black uppercase tracking-widest flex items-center justify-center cursor-pointer hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm"
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
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest text-center">JPG, PNG hoặc WebP. Tối đa 2MB.</p>
              </div>

              {error && (
                <div className="absolute bottom-0 left-0 w-full bg-rose-500 py-1 text-[8px] font-black text-white text-center uppercase tracking-widest">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 pt-2">
          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Tuổi</Label>
            <Input 
              type="number" 
              placeholder="25" 
              className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold px-6" 
              value={form.age} 
              onChange={(e) => setForm({ ...form, age: e.target.value })} 
              error={!!fieldErrors.age}
            />
            <FormError message={fieldErrors.age} />
          </div>
          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Giới tính</Label>
            <div className="relative">
              <select className={`w-full h-14 px-6 rounded-2xl border transition-all font-bold appearance-none cursor-pointer ${fieldErrors.gender ? "border-rose-500 bg-rose-50/50" : "border-slate-100 bg-slate-50/50 focus:bg-white"}`}
                value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                <option value="">Chọn</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
                <ArrowRight className="w-4 h-4 rotate-90" />
              </div>
            </div>
            <FormError message={fieldErrors.gender} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Chiều cao (cm)</Label>
            <Input 
              type="number" 
              placeholder="170" 
              className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold px-6" 
              value={form.height} 
              onChange={(e) => setForm({ ...form, height: e.target.value })} 
              error={!!fieldErrors.height}
            />
            <FormError message={fieldErrors.height} />
          </div>
          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Cân nặng (kg)</Label>
            <Input 
              type="number" 
              placeholder="65" 
              className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold px-6" 
              value={form.weight} 
              onChange={(e) => setForm({ ...form, weight: e.target.value })} 
              error={!!fieldErrors.weight}
            />
            <FormError message={fieldErrors.weight} />
          </div>
        </div>
        <div className="flex justify-end pt-4">
          <Button 
            type="button" 
            onClick={() => {
              const errors: Record<string, string> = {};
              if (!form.name) errors.name = "Vui lòng nhập họ và tên.";
              if (!form.age) errors.age = "Vui lòng nhập tuổi.";
              if (!form.gender) errors.gender = "Vui lòng chọn giới tính.";
              
              if (Object.keys(errors).length > 0) {
                setFieldErrors(errors);
                return;
              }
              setFieldErrors({});
              setStep(2);
            }} 
            className="h-14 px-8 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-indigo-100 transition-transform active:scale-95"
          >
            Tiếp tục <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    );

    if (step === 2) return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="space-y-4">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Trình độ của bạn</Label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {EXPERIENCES.map((exp) => (
              <button
                key={exp.id}
                type="button"
                onClick={() => setForm({ ...form, experience_level: exp.id })}
                className={`p-5 text-left rounded-2xl border-2 transition-all ${form.experience_level === exp.id
                    ? "border-indigo-600 bg-white shadow-lg shadow-indigo-50"
                    : "border-slate-50 bg-slate-50/50 hover:bg-white hover:border-slate-100"
                  }`}
              >
                <p className={`font-black text-sm ${form.experience_level === exp.id ? "text-indigo-600" : "text-slate-900"}`}>{exp.label}</p>
                <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-tight">{exp.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Tình trạng sức khỏe</Label>
          <div className="flex flex-wrap gap-3">
            {HEALTH_CONDITIONS.map((cond) => (
              <button
                key={cond.id}
                type="button"
                onClick={() => toggleInjury(cond.id)}
                className={`px-6 py-3 rounded-2xl border-2 text-xs font-black uppercase tracking-wider transition-all ${form.injuries.includes(cond.id)
                    ? "border-rose-500 bg-white text-rose-600 shadow-md shadow-rose-50"
                    : "border-slate-50 bg-slate-50/50 hover:bg-white"
                  }`}
              >
                {cond.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button type="button" variant="ghost" onClick={() => setStep(1)} className="h-14 font-black uppercase tracking-[0.2em] text-[10px] text-slate-400">
            <ArrowLeft className="mr-2 w-4 h-4" /> Quay lại
          </Button>
          <Button type="button" onClick={() => setStep(3)} className="h-14 px-8 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-indigo-100 transition-transform active:scale-95">
            Tiếp tục <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    );

    if (step === 3) return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="space-y-4">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Mục tiêu tập luyện</Label>
          <div className="flex flex-wrap gap-3">
            {GOALS.map((goal) => (
              <button
                key={goal.id}
                type="button"
                onClick={() => toggleGoal(goal.id)}
                className={`px-6 py-3 rounded-2xl border-2 text-xs font-black uppercase tracking-wider transition-all animate-soft-fade ${form.goals.includes(goal.id)
                    ? "border-emerald-500 bg-white text-emerald-600 shadow-md shadow-emerald-50"
                    : "border-slate-50 bg-slate-50/50 hover:bg-white"
                  }`}
              >
                {goal.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1 flex items-center gap-2">
            <Calendar className="w-3 h-3" /> Lịch rảnh của bạn
          </Label>
          <div className="flex justify-between gap-2">
            {DAYS.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center text-[10px] font-black transition-all ${form.available_days.includes(day)
                    ? "border-indigo-600 bg-white text-indigo-600 shadow-md shadow-indigo-50"
                    : "border-slate-50 bg-slate-50/50 hover:bg-white"
                  }`}
              >
                {day}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Khung giờ rảnh</Label>
              <Input placeholder="Vd: 6:00 - 8:00 sáng" className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold px-6" value={form.available_time} onChange={(e) => setForm({ ...form, available_time: e.target.value })} />
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Cường độ mong muốn</Label>
              <select className="w-full h-14 px-6 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold appearance-none"
                value={form.preferred_intensity} onChange={(e) => setForm({ ...form, preferred_intensity: e.target.value })}>
                <option value="Gentle">Nhẹ nhàng</option>
                <option value="Moderate">Vừa phải</option>
                <option value="Vigorous">Mạnh mẽ</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-6 border-t border-slate-50 items-center">
          <Button type="button" variant="ghost" onClick={() => setStep(2)} className="h-14 font-black uppercase tracking-[0.2em] text-[10px] text-slate-400">
            <ArrowLeft className="mr-2 w-4 h-4" /> Quay lại
          </Button>

          <div className="flex flex-col md:flex-row md:items-center justify-end gap-4 flex-1">
            {error && (
              <div className="flex-1 max-w-sm">
                <ErrorMessage message={error} onClose={() => setError("")} />
              </div>
            )}
            
            <div className="flex items-center gap-4">
              {success && (
                <div className="flex items-center gap-2 text-emerald-600 animate-in fade-in slide-in-from-right-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">Dữ liệu đã được đồng bộ</span>
                </div>
              )}
              <Button type="submit" disabled={loading} className="h-14 px-8 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-slate-200 transition-all active:scale-95 disabled:grayscale">
                {loading ? (
                  <div className="flex items-center gap-2">
                     <Loader2 className="w-4 h-4 animate-spin" />
                     <span>Đang đồng bộ...</span>
                  </div>
                ) : (
                  <>{isEditing ? "Cập nhật hồ sơ" : "Xác nhận & Khởi tạo"} <Sparkles className="ml-2 w-4 h-4" /></>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-12 overflow-hidden h-1.5 w-full bg-slate-100 rounded-full">
        <div className="h-full bg-indigo-600 transition-all duration-700 ease-in-out" style={{ width: `${(step / 3) * 100}%` }} />
      </div>
      <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[2.5rem] p-10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.06)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0" />
        <form onSubmit={handleSubmit} noValidate>
          {renderStep()}
        </form>
      </div>
    </div>
  );
}
