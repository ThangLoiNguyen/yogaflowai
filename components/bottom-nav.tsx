"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  Calendar,
  User,
  MessageCircle,
  Users,
  ClipboardList
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";

export function BottomNav() {
  const pathname = usePathname();
  const [role, setRole] = useState<"student" | "teacher" | null>(null);
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

  if (!role) return null;

  const studentLinks = [
    { icon: LayoutDashboard, label: "Tổng quan", href: "/student" },
    { icon: Search, label: "Khám phá", href: "/student/explore" },
    { icon: Calendar, label: "Lớp học", href: "/student/classes" },
    { icon: MessageCircle, label: "Chat", href: "/student/messages" },
    { icon: User, label: "Hồ sơ", href: "/student/profile" },
  ];

  const teacherLinks = [
    { icon: LayoutDashboard, label: "Bảng tin", href: "/teacher" },
    { icon: Users, label: "Học viên", href: "/teacher/students" },
    { icon: ClipboardList, label: "Dạy học", href: "/teacher/classes" },
    { icon: MessageCircle, label: "Chat", href: "/teacher/messages" },
    { icon: User, label: "Cá nhân", href: "/teacher/profile" },
  ];

  const navItems = role === "teacher" ? teacherLinks : studentLinks;
  const activeColor = role === "teacher" ? "text-emerald-600" : "text-indigo-600";
  const activeBg = role === "teacher" ? "bg-emerald-50" : "bg-indigo-50";

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-2xl border-t border-slate-100/50 flex items-center justify-around px-2 pt-2 pb-6 lg:hidden z-50 shadow-[0_-8px_30px_-5px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/student" && item.href !== "/teacher" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1.5 min-w-[64px] transition-all duration-300 relative",
              isActive ? activeColor : "text-slate-400 hover:text-slate-600"
            )}
          >
            <div className={cn(
              "p-2 rounded-2xl transition-all duration-500 relative overflow-hidden group",
              isActive ? activeBg : "bg-transparent active:bg-slate-50"
            )}>
              <item.icon className={cn("w-5 h-5 lg:w-6 lg:h-6 transition-transform", isActive ? "scale-110" : "group-hover:scale-110")} />
              {isActive && <div className={cn("absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full", activeColor.replace('text-', 'bg-'))} />}
            </div>
            <span className={cn("text-[9px] tracking-widest font-black transition-all", isActive ? "opacity-100 translate-y-0" : "opacity-60")}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
