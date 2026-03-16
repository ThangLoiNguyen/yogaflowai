"use client";

import { login } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/password-input'
import Link from 'next/link'
import { Sparkles, ArrowRight, ChevronLeft, Fingerprint, Leaf, ArrowLeft, AlertCircle } from 'lucide-react'

import React, { useTransition } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ErrorMessage } from '@/components/ui/error-message';
import { FormError } from '@/components/ui/form-error';
import { useState } from 'react';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get('error');
  const [isPending, startTransition] = useTransition();
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const validate = (formData: FormData) => {
    const errors: { email?: string; password?: string } = {};
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email) {
      errors.email = "Vui lòng nhập địa chỉ email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Định dạng email không hợp lệ.";
    }

    if (!password) {
      errors.password = "Vui lòng nhập mật khẩu.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (formData: FormData) => {
    if (!validate(formData)) return;

    startTransition(async () => {
      await login(formData);
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-[#fdfdfd] relative overflow-hidden">

      {/* Premium Background depth */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.06),transparent_70%)] -z-10 transition-opacity duration-1000" />
      <div className="absolute -bottom-32 -left-32 w-[600px] h-[600px] bg-indigo-50/40 rounded-full blur-[120px] -z-10 animate-float" />

      {/* Top Navigation */}
      <div className="absolute top-8 left-8 sm:left-12 opacity-0 animate-soft-fade fill-mode-both" style={{ animationDelay: '0.2s' }}>
        <Link href="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 hover:text-slate-900 transition-all group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Về trang chủ</span>
        </Link>
      </div>

      <div className="w-full max-w-md space-y-12 animate-soft-fade">
        <div className="flex flex-col gap-6 items-center text-center">
          <Link href="/" className="relative group">
            <div className="absolute inset-0 bg-indigo-600/20 blur-xl rounded-full scale-110 group-hover:scale-125 transition-transform" />
            <div className="relative overflow-hidden flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-2xl shadow-slate-200 transition-transform group-hover:scale-110 duration-500">
              <img src="/YogAI-logo.png" alt="YogAI Logo" className="w-full h-full object-cover" />
            </div>
          </Link>
          <div className="space-y-4">
            <h1 className="text-4xl font-black tracking-tighter text-slate-900 leading-none">Chào mừng trở lại.</h1>
            <p className="text-sm font-medium text-slate-400 max-w-[280px] mx-auto leading-relaxed">
              Tiếp tục chăm sóc cơ thể bạn cùng trí tuệ nhân tạo.
            </p>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-2xl rounded-[3rem] border border-white p-10 shadow-[0_60px_100px_-20px_rgba(0,0,0,0.05)] relative overflow-hidden">

          <form action={handleSubmit} noValidate className="flex flex-col gap-10">
            <div className="space-y-8">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 pl-1 block text-left">
                  Tài khoản Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="ten@vidu.com"
                  className={`h-16 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold px-8 shadow-sm ${fieldErrors.email ? 'border-rose-200 bg-rose-50/20' : ''}`}
                />
                <FormError message={fieldErrors.email} />
              </div>

              <div className="space-y-1">
                <PasswordInput
                  id="password"
                  name="password"
                  label="Mật khẩu bảo mật"
                  placeholder="Nhập mật khẩu của bạn"
                  required={false}
                />
                <FormError message={fieldErrors.password} />
              </div>
            </div>

            {error && (
              <ErrorMessage 
                title="Lỗi Đăng Nhập" 
                message={error} 
                onClose={() => router.push('/login')} 
              />
            )}

            <Button 
              type="submit" 
              disabled={isPending}
              className="h-16 bg-slate-900 text-white hover:bg-slate-800 font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl shadow-2xl shadow-slate-200 mt-2 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isPending ? "Đang xác thực..." : "Đăng nhập ngay"} <ArrowRight className="w-4 h-4 ml-3" />
            </Button>
          </form>

          <div className="mt-12 pt-10 border-t border-slate-50 flex flex-col items-center gap-8 text-center">
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
              Bạn mới chưa có tài khoản?{' '}
              <Link className="text-indigo-600 hover:text-indigo-700 transition-colors ml-2" href="/signup">Đăng ký mới</Link>
            </p>
            <div className="flex items-center gap-4 opacity-10 filter grayscale group cursor-help transition-all hover:opacity-100 hover:grayscale-0">
              <Fingerprint className="w-8 h-8 text-indigo-600" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-900">Bảo mật đa tầng YogAI™</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
