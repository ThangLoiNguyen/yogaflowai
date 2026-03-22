"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, ArrowLeft, UserCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/app/actions/auth";
import { toast } from "sonner";

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const data = new FormData();
      data.append("email", formData.email);
      data.append("password", formData.password);

      const result = await login(data);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Đăng nhập thành công!");
      }
    });
  };

  return (
    <>
      {isPending && (
        <div className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500">
          <div className="w-16 h-16 border-4 border-slate-100 border-t-[var(--accent)] rounded-full animate-spin mb-6 shadow-xl" />
          <h3 className="text-2xl font-display text-[var(--accent)] animate-pulse mb-2">Đang thiết lập không gian...</h3>
          <p className="text-sm font-ui text-[var(--text-secondary)]">Vui lòng đợi giây lát</p>
        </div>
      )}
      <div className="min-h-screen bg-[var(--bg-sky)] flex flex-col items-center justify-center p-4 hero-section relative">
      <Link href="/" className="mb-8 flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-all txt-action group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Về trang chủ
      </Link>
      <div className="max-w-md w-full bg-white rounded-[var(--r-xl)] shadow-lg border border-[var(--border)] overflow-hidden">
        
        <div className="p-5 border-b border-[var(--border)] bg-white/50 backdrop-blur-sm">
          <Link href="/" className="flex items-center justify-center gap-0.5 mb-8">
             <span className="font-display text-2xl text-[var(--text-primary)]">Yog</span>
             <span className="font-ui font-medium text-2xl text-[var(--accent)]">AI</span>
          </Link>
          <div className="text-center">
            <h2 className="text-2xl mb-2">Chào mừng trở lại</h2>
            <p className="text-sm text-[var(--text-secondary)]">
               Tiếp tục hành trình thấu hiểu cơ thể cùng AI
            </p>
          </div>
        </div>

        <div className="p-10">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="label-mono">Email</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-hint)]" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="vi-du@email.com" 
                  className="h-10 pl-12 rounded-[var(--r-md)] border-[var(--border-medium)] focus:border-[var(--accent)]"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="label-mono">Mật khẩu</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-hint)]" />
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Mật khẩu của bạn" 
                  className="h-10 pl-12 pr-12 rounded-[var(--r-md)] border-[var(--border-medium)] focus:border-[var(--accent)]"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-hint)] hover:text-[var(--accent)] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="flex justify-end mt-1">
                <Link href="/reset-password" className="text-xs text-[var(--accent)] hover:underline font-medium">Quên mật khẩu?</Link>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isPending}
              className={`btn-primary w-full h-11 text-base font-medium mt-6 items-center justify-center gap-2 transition-all ${isPending ? 'opacity-80 cursor-not-allowed bg-[var(--accent)]/90' : 'hover:shadow-sky'}`}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang xác thực...
                </>
              ) : (
                <>
                  Đăng nhập ngay
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-10 text-center">
             <p className="text-sm text-[var(--text-secondary)]">
               Chưa có tài khoản?{" "}
               <Link href="/register" className="text-[var(--accent)] font-medium hover:underline">Đăng ký tham gia</Link>
             </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
