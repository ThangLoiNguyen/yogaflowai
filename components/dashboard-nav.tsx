"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";
import { Leaf, LayoutDashboard, Compass, CalendarCheck, Users, ClipboardList, UserCircle } from "lucide-react";

export function DashboardNav({ role = "student" }: { role?: "student" | "teacher" }) {
  const pathname = usePathname();

  const studentLinks = [
    { href: "/student-dashboard", label: "Tổng quan", icon: LayoutDashboard },
    { href: "/recommendation", label: "Gợi ý AI", icon: Compass },
    { href: "/classes", label: "Khám phá", icon: CalendarCheck },
  ];

  const teacherLinks = [
    { href: "/teacher-dashboard", label: "Bảng tin", icon: LayoutDashboard },
    { href: "/teacher/students", label: "Học viên", icon: Users },
    { href: "/teacher-profile", label: "Hồ sơ dạy", icon: UserCircle },
  ];

  const links = role === "student" ? studentLinks : teacherLinks;

  return (
    <div className="sticky top-0 z-50 w-full border-b border-slate-50 bg-white/70 backdrop-blur-2xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 group-hover:scale-105 transition-transform duration-500 shadow-xl shadow-slate-200">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="hidden sm:inline-block font-black text-slate-900 text-lg tracking-tighter">
              YogaFlow AI
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            {links.map((link) => {
              const isActive = pathname === link.href || (pathname.startsWith(link.href + "/") && link.href !== "/");
              const Icon = link.icon;
              return (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant="ghost"
                    className={`h-11 px-5 flex items-center gap-2.5 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl ${isActive
                      ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                      : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <LogoutButton />
          <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group cursor-pointer hover:border-indigo-100 transition-colors">
             <UserCircle className="w-6 h-6 group-hover:text-indigo-600 transition-colors" />
          </div>
        </div>
      </div>
      
      {/* Mobile Nav Bar */}
      <div className="md:hidden border-t border-slate-50 overflow-x-auto scrollbar-hide py-2 px-4 flex gap-1 items-center bg-white/70 backdrop-blur-xl">
        {links.map((link) => {
          const isActive = pathname === link.href || (pathname.startsWith(link.href + "/") && link.href !== "/");
          const Icon = link.icon;
          return (
            <Link key={link.href} href={link.href} className="shrink-0">
               <Button
                variant="ghost"
                className={`h-9 px-4 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest transition-all rounded-lg ${isActive
                  ? "bg-slate-900 text-white"
                  : "text-slate-400 hover:text-slate-900"
                  }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
              </Button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
