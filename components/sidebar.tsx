"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Search, 
  Calendar, 
  User, 
  Settings, 
  LogOut,
  Sparkles,
  Users,
  ClipboardList
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/app/actions/auth";
import { createClient } from "@/utils/supabase/client";

export function Sidebar() {
  const pathname = usePathname();
  const [role, setRole] = useState<"student" | "teacher">("student");
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setRole(user.user_metadata?.role || "student");
      }
    };
    fetchUser();
  }, []);

  const studentLinks = [
    { icon: LayoutDashboard, label: "Tổng quan", href: "/student" },
    { icon: Search, label: "Khám phá", href: "/student/explore" },
    { icon: Calendar, label: "Lớp học", href: "/student/classes" },
    { icon: User, label: "Hồ sơ", href: "/student/profile" },
  ];

  const teacherLinks = [
    { icon: LayoutDashboard, label: "Bảng tin", href: "/teacher" },
    { icon: Users, label: "Học viên", href: "/teacher/students" },
    { icon: ClipboardList, label: "Quản lý lớp", href: "/teacher/classes" },
    { icon: User, label: "Cá nhân", href: "/teacher/profile" },
  ];

  const navItems = role === "student" ? studentLinks : teacherLinks;

  return (
    <aside className="fixed left-0 top-0 h-screen w-[240px] bg-white border-r border-[var(--border)] flex flex-col z-50">
      <div className="p-8 pb-12">
        <Link href="/" className="flex items-center gap-0.5">
          <span className="font-display text-2xl text-[var(--text-primary)]">Yog</span>
          <span className="font-ui font-medium text-2xl text-[var(--accent)]">AI</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <div className="label-mono mb-4 px-4 text-[10px] uppercase">
          {role === "student" ? "Dành cho Học viên" : "Giảng viên Panel"}
        </div>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3.5 rounded-[var(--r-md)] transition-all font-ui text-sm group",
              pathname === item.href 
                ? "bg-[var(--accent-tint)] text-[var(--accent)] font-semibold" 
                : "text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)]"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5 transition-colors",
              pathname === item.href ? "text-[var(--accent)]" : "text-[var(--text-hint)] group-hover:text-[var(--text-primary)]"
            )} />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-6">
        {role === "student" && (
          <div className="bg-[var(--bg-sky)] rounded-[var(--r-lg)] p-5 border border-[var(--accent-light)] mb-8">
             <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-[var(--accent)]" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--accent)]">Pro Member</span>
             </div>
             <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed mb-4">Mở khóa full AI Feedback Loop.</p>
             <Link href="/pricing" className="text-[10px] font-bold text-[var(--accent)] hover:underline">Nâng cấp ngay</Link>
          </div>
        )}

        <button 
          onClick={() => logout()}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-[var(--r-md)] text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 transition-all font-ui text-sm group"
        >
          <LogOut className="w-5 h-5" />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}

