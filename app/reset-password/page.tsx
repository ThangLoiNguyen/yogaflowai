"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Lock, Mail, ShieldCheck, KeyRound, CheckCircle2, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const [step, setStep] = useState(1);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Vui lòng nhập email đăng nhập");

    startTransition(async () => {
      const normalizedEmail = email.trim().toLowerCase();

      // Supabase Email OTP Logic
      const { error } = await supabase.auth.signInWithOtp({
        email: normalizedEmail,
        options: {
          shouldCreateUser: false, // Ensures we don't sign up new people here
        }
      });

      if (error) {
        console.error("OTP Send error:", error);
        toast.error("Không thể gửi mã. Vui lòng kiểm tra lại email.");
      } else {
        toast.success("Mã OTP đã được gửi vào Email của bạn!");
        setStep(2);
      }
    });
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return toast.error("Vui lòng nhập mã OTP");

    startTransition(async () => {
      const { error } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: otp,
        type: "email", // or "recovery" depending on Supabase config, but "email" is standard for OTP
      });

      if (error) {
        console.error("Verify error:", error);
        toast.error("Mã OTP không chính xác hoặc đã hết hạn.");
      } else {
        toast.success("Xác thực thành công!");
        setStep(3);
      }
    });
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) return toast.error("Mật khẩu phải từ 8 ký tự trở lên");

    startTransition(async () => {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Đổi mật khẩu thành công!");
        setTimeout(() => router.push("/login"), 1500);
      }
    });
  };

  return (
    <div className="min-h-screen bg-[var(--bg-sky)] flex flex-col items-center justify-center p-4 hero-section relative">
      <Link href="/" className="mb-8 flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-all txt-action group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Về trang chủ
      </Link>
      <div className="max-w-md w-full bg-white rounded-[var(--r-xl)] shadow-lg border border-[var(--border)] overflow-hidden">
        
        <div className="p-5 border-b border-[var(--border)] bg-white/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center justify-between mb-8">
             {step > 1 && (
               <button onClick={() => setStep(step - 1)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                 <ArrowLeft className="w-5 h-5" />
               </button>
             )}
             <Link href="/" className="flex items-center gap-0.5 mx-auto">
                <span className="font-display text-2xl text-[var(--text-primary)]">Yog</span>
                <span className="font-ui font-medium text-2xl text-[var(--accent)]">AI</span>
             </Link>
          </div>
          
          <div className="text-center">
            <h2 className="text-2xl mb-2">
              {step === 1 ? "Quên mật khẩu" : step === 2 ? "Xác thực OTP" : "Mật khẩu mới"}
            </h2>
            <p className="text-sm text-[var(--text-secondary)] px-4">
              {step === 1 ? "Nhập Email đã đăng ký để nhận mã khôi phục" : step === 2 ? `Nhập mã 6 số đã gửi tới ${email}` : "Thiết lập mật khẩu bảo mật mới cho tài khoản"}
            </p>
          </div>
        </div>

        <div className="p-10">
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="label-mono">Email đăng nhập</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-hint)]" />
                  <Input 
                    id="email" 
                    type="email"
                    placeholder="vi-du@email.com" 
                    className="h-10 pl-12 rounded-[var(--r-md)] border-[var(--border-medium)] focus:border-[var(--accent)]"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <Button type="submit" disabled={isPending} className="btn-primary w-full h-10 gap-2 font-bold tracking-tight">
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Gửi mã xác nhận <ArrowRight className="w-4 h-4" /></>}
              </Button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="otp" className="label-mono">Mã xác nhận (Email)</Label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-hint)]" />
                  <Input 
                    id="otp" 
                    type="text"
                    maxLength={6}
                    placeholder="xxxxxx" 
                    className="h-10 pl-12 rounded-[var(--r-md)] border-[var(--border-medium)] focus:border-[var(--accent)] text-center tracking-[1em] font-bold"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
              </div>
              <Button type="submit" disabled={isPending} className="btn-primary w-full h-10 gap-2 font-bold">
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Xác nhận mã <ShieldCheck className="w-4 h-4" /></>}
              </Button>
              <button 
                type="button" 
                onClick={handleSendOtp}
                className="w-full text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
              >
                Chưa nhận được mã? Gửi lại
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleUpdatePassword} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password" className="label-mono">Mật khẩu mới</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-hint)]" />
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Ít nhất 8 ký tự" 
                    className="h-10 pl-12 pr-12 rounded-[var(--r-md)] border-[var(--border-medium)] focus:border-[var(--accent)]"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-hint)] hover:text-[var(--accent)] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <Button type="submit" disabled={isPending} className="btn-primary w-full h-10 gap-2">
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Cập nhật mật khẩu <CheckCircle2 className="w-4 h-4" /></>}
              </Button>
            </form>
          )}

          <div className="mt-10 text-center">
             <p className="text-sm text-[var(--text-secondary)]">
               Quay lại {" "}
               <Link href="/login" className="text-[var(--accent)] font-medium hover:underline">Đăng nhập</Link>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
