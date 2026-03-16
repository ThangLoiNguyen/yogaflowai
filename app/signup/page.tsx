"use client";

import { signup } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/password-input'
import Link from 'next/link'
import { Sparkles, ArrowRight, UserCheck, GraduationCap, ArrowLeft, AlertCircle } from 'lucide-react'
import { useState, useTransition } from 'react'

export default function SignupPage({
  searchParams,
}: {
  searchParams?: { error?: string }
}) {
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [isPending, startTransition] = useTransition();
  const [localError, setLocalError] = useState("");
  const error = searchParams?.error || localError;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError("");
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !password) {
      setLocalError("Yêu cầu cung cấp định danh và thiết lập mật mã bảo mật.");
      return;
    }

    if (name.trim().length < 2) {
      setLocalError("Hệ thống yêu cầu định danh tối thiểu 2 ký tự.");
      return;
    }

    if (password.length < 6) {
      setLocalError("Mật mã bảo mật yêu cầu tối thiểu 6 ký tự để đảm bảo an toàn.");
      return;
    }

    startTransition(async () => {
      await signup(formData);
    });
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-[#fdfdfd] relative overflow-hidden">
      
      {/* Dynamic Background */}
      <div className={`absolute top-0 right-0 w-full h-[800px] transition-colors duration-1000 -z-10 ${
        role === "student" 
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

      <div className="w-full max-w-md space-y-12 animate-soft-fade">
        <div className="flex flex-col gap-6 items-center text-center">
           <Link href="/" className="relative group">
            <div className="absolute inset-0 bg-indigo-600/20 blur-xl rounded-full scale-110 group-hover:scale-125 transition-transform" />
            <div className="relative overflow-hidden flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-2xl shadow-slate-200 transition-transform group-hover:scale-110">
               <img src="/YogAI-logo.png" alt="YogAI Logo" className="w-full h-full object-cover" />
            </div>
          </Link>
          <div className="space-y-4">
            <h1 className="text-4xl font-black tracking-tighter text-slate-900 leading-none">Bắt đầu ngay hôm nay.</h1>
            <p className="text-sm font-medium text-slate-400 max-w-[300px] mx-auto leading-relaxed">
              Kiến tạo hành trình luyện tập cá nhân hóa cùng YogAI.
            </p>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-2xl rounded-[3rem] border border-white p-10 shadow-[0_60px_100px_-20px_rgba(0,0,0,0.05)] relative overflow-hidden transition-all duration-300">
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-10">
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
                  placeholder="Vd: Nguyễn Văn A"
                  className="h-16 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold px-8 shadow-sm"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 pl-1 block text-left">Địa chỉ Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="ten@vidu.com"
                  className="h-16 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold px-8 shadow-sm"
                />
              </div>
              
              <PasswordInput id="password" name="password" required={false} label="Mật khẩu bảo mật" placeholder="Nhập ít nhất 8 ký tự" />
            </div>

            {error && (
              <div className="rounded-[2.5rem] cyber-error-glow p-8 text-rose-600 animate-glitch relative group">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500 shadow-[0_0_20px_rgba(225,29,72,0.6)]" />
                <div className="flex items-center gap-5">
                   <div className="h-12 w-12 rounded-2xl bg-rose-100/50 flex items-center justify-center shrink-0 border border-rose-200/50">
                      <AlertCircle className="w-6 h-6 animate-pulse" />
                   </div>
                   <div className="flex flex-col">
                      <span className="uppercase tracking-[0.4em] text-[9px] font-black opacity-30 mb-1">Alert: Registration_Failure // Sector_X</span>
                      <span className="text-[13px] font-bold leading-tight">{error}</span>
                   </div>
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={isPending}
              className="h-16 bg-slate-900 text-white hover:bg-slate-800 font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl shadow-2xl shadow-slate-200 mt-2 transition-all active:scale-[0.98] disabled:opacity-50"
            >
               {isPending ? (
                <div className="flex items-center gap-2">
                  <span className="animate-pulse">Đang định cấu hình...</span>
                  <Sparkles className="w-4 h-4 animate-spin" />
                </div>
              ) : (
                <span className="flex items-center gap-3">
                  Tiếp tục hành trình <ArrowRight className="w-4 h-4 ml-1" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-12 pt-10 border-t border-slate-50 text-center">
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
               Bạn đã là thành viên?{' '}
              <Link className="text-indigo-600 hover:text-indigo-700 transition-colors ml-2" href="/login">Đăng nhập</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
