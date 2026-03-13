"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogoutButton } from "@/components/logout-button";
import { Sparkles, LayoutDashboard, Compass, CalendarCheck, Users, ClipboardList } from "lucide-react";

export function DashboardNav({ role = "student" }: { role?: "student" | "teacher" }) {
  const pathname = usePathname();

  const studentLinks = [
    { href: "/student-dashboard", label: "Tổng quan", icon: LayoutDashboard },
    { href: "/recommendation", label: "AI đề xuất", icon: Compass },
    { href: "/classes", label: "Lớp học", icon: CalendarCheck },
  ];

  const teacherLinks = [
    { href: "/teacher-dashboard", label: "Phân tích", icon: LayoutDashboard },
    { href: "/classes", label: "Quản lý lớp", icon: ClipboardList },
    { href: "/teacher-profile", label: "Hồ sơ", icon: Users },
  ];

  const links = role === "student" ? studentLinks : teacherLinks;

  return (
    <div className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-sky-500 via-indigo-500 to-cyan-500 shadow-sm">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="hidden sm:inline-block font-bold text-slate-900 dark:text-slate-50 tracking-tight">
              YogAI
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            {links.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              const Icon = link.icon;
              return (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-9 px-3 flex items-center gap-2 text-sm font-medium transition-all ${isActive
                      ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/70 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-100"
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline-block">{link.label}</span>
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
