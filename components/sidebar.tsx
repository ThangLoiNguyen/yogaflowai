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
  ClipboardList,
  MessageCircle
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
    { icon: MessageCircle, label: "Thảo luận", href: "/student/messages" },
    { icon: User, label: "Hồ sơ", href: "/student/profile" },
  ];

  const teacherLinks = [
    { icon: LayoutDashboard, label: "Bảng tin", href: "/teacher" },
    { icon: Users, label: "Học viên", href: "/teacher/students" },
    { icon: ClipboardList, label: "Quản lý lớp", href: "/teacher/classes" },
    { icon: MessageCircle, label: "Thảo luận", href: "/teacher/messages" },
    { icon: User, label: "Cá nhân", href: "/teacher/profile" },
  ];

  const navItems = role === "student" ? studentLinks : teacherLinks;

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-[240px] bg-white border-r border-[var(--border)] flex-col z-50">
      <div className="p-5 pb-10">
        <Link href="/" className="flex items-center gap-0.5">
          <span className="font-display text-2xl text-[var(--text-primary)]">Yog</span>
          <span className="font-ui font-medium text-2xl text-[var(--accent)]">AI</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto min-h-0">
        <div className="label-mono mb-4 px-4 text-[10px] uppercase">
          {role === "student" ? "Dành cho Học viên" : "Dành cho giáo viên"}
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

      <div className="p-4 shrink-0 mt-auto border-t border-[var(--border-subtle)]">
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

