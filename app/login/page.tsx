"use client";

import { login } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/password-input'
import Link from 'next/link'
import { Sparkles, ArrowRight, Fingerprint, ArrowLeft, AlertCircle } from 'lucide-react'
import { useState, useTransition } from 'react'

export default function LoginPage({
  searchParams,
}: {
  searchParams?: { error?: string }
}) {
  const [isPending, startTransition] = useTransition()
  const [localError, setLocalError] = useState("")
  const error = searchParams?.error || localError

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLocalError("")
    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
      setLocalError("Yêu cầu nhập đầy đủ thông tin định danh và mật mã.")
      return
    }

    startTransition(async () => {
      await login(formData)
    })
  }

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
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-10">
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
                  className="h-16 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold px-8 shadow-sm"
                />
              </div>
              
              <PasswordInput 
                id="password" 
                name="password" 
                required={false}
                label="Mật khẩu bảo mật" 
                placeholder="Nhập mật khẩu của bạn" 
              />
            </div>

            {error && (
              <div className="rounded-[2.5rem] cyber-error-glow p-8 text-rose-600 animate-glitch relative group">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500 shadow-[0_0_20px_rgba(225,29,72,0.6)]" />
                <div className="flex items-center gap-5">
                   <div className="h-12 w-12 rounded-2xl bg-rose-100/50 flex items-center justify-center shrink-0 border border-rose-200/50">
                      <AlertCircle className="w-6 h-6 animate-pulse" />
                   </div>
                   <div className="flex flex-col">
                      <span className="uppercase tracking-[0.4em] text-[9px] font-black opacity-30 mb-1">Error: Auth_Protocol_Unauthorized</span>
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
                  <span className="animate-pulse">Đang xác thực...</span>
                  <Sparkles className="w-4 h-4 animate-spin" />
                </div>
              ) : (
                <span className="flex items-center gap-3">
                  Đăng nhập ngay <ArrowRight className="w-4 h-4 ml-1" />
                </span>
              )}
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
