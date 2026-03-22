"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, GraduationCap, ArrowRight, ArrowLeft, Mail, Lock, UserCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup } from "@/app/actions/auth";
import { toast } from "sonner";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
  });

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const data = new FormData();
      data.append("full_name", formData.full_name);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("role", role);

      const result = await signup(data);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Đăng ký thành công!");
        // Redirect is handled by the server action
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
               <button onClick={() => setStep(1)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                 <ArrowLeft className="w-5 h-5" />
               </button>
             )}
             <Link href="/" className="flex items-center gap-0.5 mx-auto">
                <span className="font-display text-2xl text-[var(--text-primary)]">Yog</span>
                <span className="font-ui font-medium text-2xl text-[var(--accent)]">AI</span>
             </Link>
          </div>
          
          <div className="text-center">
            <h2 className="text-2xl mb-2">{step === 1 ? "Chào mừng bạn" : "Thông tin tài khoản"}</h2>
            <p className="text-sm text-[var(--text-secondary)]">
              {step === 1 ? "Chọn vai trò bạn muốn tham gia" : "Hoàn tất đăng ký để bắt đầu"}
            </p>
          </div>
        </div>

        <div className="p-10">
          {step === 1 ? (
             <div className="space-y-6">
                <button 
                  onClick={() => { setRole("student"); setStep(2); }}
                  className={`w-full p-5 rounded-[var(--r-lg)] border-2 transition-all flex items-center gap-4 group ${role === "student" ? "border-[var(--accent)] bg-[var(--bg-muted)]" : "border-[var(--border)] hover:border-[var(--accent-light)] bg-white"}`}
                >
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${role === "student" ? "bg-[var(--accent)] text-white" : "bg-[var(--bg-base)] text-[var(--text-muted)] group-hover:bg-[var(--accent-tint)] group-hover:text-[var(--accent)]"}`}>
                    <User className="w-7 h-7" />
                  </div>
                  <div className="text-left">
                    <div className="font-ui font-bold text-[var(--text-primary)] mb-1">Tôi muốn học yoga</div>
                    <div className="text-xs text-[var(--text-secondary)]">Duy trì sức khỏe với lộ trình AI riêng biệt.</div>
                  </div>
                </button>

                <button 
                  onClick={() => { setRole("teacher"); setStep(2); }}
                  className={`w-full p-5 rounded-[var(--r-lg)] border-2 transition-all flex items-center gap-4 group ${role === "teacher" ? "border-[var(--accent)] bg-[var(--bg-muted)]" : "border-[var(--border)] hover:border-[var(--accent-light)] bg-white"}`}
                >
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${role === "teacher" ? "bg-[var(--accent)] text-white" : "bg-[var(--bg-base)] text-[var(--text-muted)] group-hover:bg-[var(--accent-tint)] group-hover:text-[var(--accent)]"}`}>
                    <GraduationCap className="w-7 h-7" />
                  </div>
                  <div className="text-left">
                    <div className="font-ui font-bold text-[var(--text-primary)] mb-1">Tôi muốn dạy yoga</div>
                    <div className="text-xs text-[var(--text-secondary)]">Quản lý lớp và thấu hiểu học viên bằng data.</div>
                  </div>
                </button>
             </div>
          ) : (
             <form onSubmit={handleSignup} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="full_name" className="label-mono">Họ và tên</Label>
                  <div className="relative">
                    <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-hint)]" />
                    <Input 
                      id="full_name" 
                      placeholder="Nguyễn Văn A" 
                      className="h-10 pl-12 rounded-[var(--r-md)] border-[var(--border-medium)] focus:border-[var(--accent)]"
                      required
                      value={formData.full_name}
                      onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    />
                  </div>
                </div>

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
                      placeholder="Ít nhất 8 ký tự" 
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
                </div>

                <Button 
                  type="submit" 
                  disabled={isPending}
                  className="btn-primary w-full h-10 text-base font-medium mt-4 items-center justify-center gap-2"
                >
                  {isPending ? "Đang tạo tài khoản..." : (
                    <>
                      Hoàn tất đăng ký
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </Button>
             </form>
          )}

          <div className="mt-10 text-center">
             <p className="text-sm text-[var(--text-secondary)]">
               Đã có tài khoản?{" "}
               <Link href="/login" className="text-[var(--accent)] font-medium hover:underline">Đăng nhập</Link>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
