"use client";

import { signup } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/password-input'
import Link from 'next/link'
import { Sparkles, ArrowRight, ChevronLeft, UserCheck, GraduationCap, Leaf, ArrowLeft, AlertCircle } from 'lucide-react'
import React, { useState, useTransition, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ErrorMessage } from '@/components/ui/error-message'
import { FormError } from '@/components/ui/form-error'

import { toast } from '@/components/ui/toast';

function SignupForm() {
  const [role, setRole] = useState<"student" | "teacher">("student");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const validate = () => {
    const errors: { name?: string; email?: string; password?: string } = {};
    if (!formData.name || formData.name.trim().length < 2) {
      errors.name = "Vui lòng nhập đầy đủ họ và tên.";
    }

    if (!formData.email) {
      errors.email = "Vui lòng nhập địa chỉ email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Định dạng email không hợp lệ.";
    }

    if (!formData.password || formData.password.length < 6) {
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setError(null);
    setFieldErrors({});

    startTransition(async () => {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("role", role);

      const result = await signup(data);

      if (result?.error) {
        if (result.field && result.field !== 'general') {
          setFieldErrors({ [result.field]: result.error });
        } else {
          setError(result.error);
        }
      } else {
        toast.success("Tạo tài khoản thành công", "Chào mừng bạn gia nhập YogAI.");
      }
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-[#fdfdfd] relative overflow-hidden">

      {/* Dynamic Background */}
      <div className={`absolute top-0 right-0 w-full h-[800px] transition-colors duration-1000 -z-10 ${role === "student"
        ? "bg-[radial-gradient(circle_at_100%_0%,rgba(99,102,241,0.06),transparent_60%)]"
        : "bg-[radial-gradient(circle_at_100%_0%,rgba(16,185,129,0.04),transparent_60%)]"
        }`} />

      <div className="absolute top-1/4 -right-24 w-96 h-96 bg-indigo-50/50 rounded-full blur-[120px] -z-10 animate-float" />

      {/* Home Navigation */}
      <div className="absolute top-8 left-8 sm:left-12 opacity-0 animate-soft-fade fill-mode-both" style={{ animationDelay: '0.2s' }}>
        <Link href="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 hover:text-slate-900 transition-all group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Về trang chủ</span>
        </Link>
      </div>

      <div className="w-full max-w-md animate-soft-fade">
        <div className="flex flex-col gap-6 items-center text-center">
          <Link href="/" className="relative group">
            <div className="absolute inset-0 bg-indigo-600/20 blur-xl rounded-full scale-110 group-hover:scale-125 transition-transform" />
            <div className="flex h-26 w-26 items-center justify-center overflow-hidden rounded-2xl group-hover:scale-105 transition-transform duration-500">
              <img src="/YogAI-logo.png" alt="YogAI Logo" className="w-full h-full object-contain" />
            </div>
          </Link>
          <div className="space-y-4">
            <h1 className="text-4xl font-black tracking-tighter text-slate-900 leading-none">Bắt đầu ngay hôm nay</h1>
            <p className="text-sm font-medium text-slate-400 max-w-[300px] mx-auto leading-relaxed">
              Kiến tạo hành trình luyện tập cá nhân hóa cùng YogAI.
            </p>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-2xl rounded-[3rem] border border-white p-10 shadow-[0_60px_100px_-20px_rgba(0,0,0,0.05)] relative overflow-hidden transition-all duration-300">

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6 select-none">
            {/* Role Selection */}
            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 pl-1 block">Bạn muốn tham gia với vai trò</Label>
              <div className="p-1.5 bg-slate-50 rounded-[1.8rem] grid grid-cols-2 gap-1.5 relative">

                {/* Active Indicator Slot */}
                <div
                  className={`absolute h-[calc(100%-12px)] top-1.5 rounded-[1.4rem] bg-white shadow-xl transition-all duration-500 ease-out border-slate-100 border`}
                  style={{
                    width: 'calc(50% - 9px)',
                    left: role === "student" ? '6px' : 'calc(50% + 3px)'
                  }}
                />

                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`relative flex items-center justify-center gap-2 h-14 transition-colors duration-500 ${role === "student" ? "text-indigo-600" : "text-slate-400"}`}
                >
                  <UserCheck className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Học viên</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("teacher")}
                  className={`relative flex items-center justify-center gap-2 h-14 transition-colors duration-500 ${role === "teacher" ? "text-emerald-600" : "text-slate-400"}`}
                >
                  <GraduationCap className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Giáo viên</span>
                </button>

                <input type="hidden" name="role" value={role} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 pl-1 block text-left">Họ và tên</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  error={!!fieldErrors.name}
                  placeholder="Nhập họ và tên của bạn"
                  className="h-16 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold px-6 shadow-sm"
                />
                <FormError message={fieldErrors.name} />
              </div>

              <div className="space-y-3">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 pl-1 block text-left">Địa chỉ Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  error={!!fieldErrors.email}
                  placeholder="Nhập email của bạn"
                  className="h-16 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold px-6 shadow-sm"
                />
                <FormError message={fieldErrors.email} />
              </div>

              <div className="space-y-1">
                <PasswordInput
                  id="password"
                  name="password"
                  label="Mật khẩu bảo mật"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  error={!!fieldErrors.password}
                  placeholder="Nhập ít nhất 8 ký tự"
                  required={false}
                />
                <FormError message={fieldErrors.password} />
              </div>
            </div>

            {error && (
              <ErrorMessage
                title="Lỗi Đăng Ký"
                message={error}
                onClose={() => setError(null)}
              />
            )}

            <Button
              type="submit"
              disabled={isPending}
              className="h-16 bg-slate-900 text-white hover:bg-slate-800 font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl shadow-2xl shadow-slate-200 mt-2 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isPending ? "Đang xử lý..." : "Tiếp tục hành trình"} <ArrowRight className="w-4 h-4 ml-3" />
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-50 text-center">
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
              Bạn đã là thành viên?{' '}
              <Link className="text-indigo-600 hover:text-indigo-700 transition-colors ml-2" href="/login">Đăng nhập</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#fdfdfd]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SignupForm />
    </Suspense>
  );
}
