"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/app/actions/auth";
import { toast } from "sonner";

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

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
    <div className="min-h-screen bg-[var(--bg-sky)] flex flex-col items-center justify-center p-6 hero-section">
      <div className="max-w-md w-full bg-white rounded-[var(--r-xl)] shadow-lg border border-[var(--border)] overflow-hidden">
        
        <div className="p-8 border-b border-[var(--border)] bg-white/50 backdrop-blur-sm">
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
                  className="h-14 pl-12 rounded-[var(--r-md)] border-[var(--border-medium)] focus:border-[var(--accent)]"
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
                  type="password" 
                  placeholder="Mật khẩu của bạn" 
                  className="h-14 pl-12 rounded-[var(--r-md)] border-[var(--border-medium)] focus:border-[var(--accent)]"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isPending}
              className="btn-primary w-full h-14 text-base font-medium mt-4 items-center justify-center gap-2"
            >
              {isPending ? "Đang xác thực..." : (
                <>
                  Đăng nhập ngay
                  <ArrowRight className="w-5 h-5" />
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
  );
}
