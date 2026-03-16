"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";
import { Leaf, LayoutDashboard, Compass, CalendarCheck, Users, ClipboardList, UserCircle, Camera } from "lucide-react";

export function DashboardNav({ role: roleProp = "student" }: { role?: "student" | "teacher" }) {
  const pathname = usePathname();
  const [profile, setProfile] = useState<{ name?: string; avatar_url?: string; role?: string } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();
        if (data.user) {
          setProfile({
            name: data.user.name,
            avatar_url: data.user.avatar_url,
            role: data.user.role,
          });
        }
      } catch (err) {
        console.error("Error fetching nav profile:", err);
      }
    };
    fetchProfile();
  }, []);

  // Use the role from API if loaded, otherwise fallback to the prop
  const effectiveRole = profile?.role || roleProp;

  const studentLinks = [
    { href: "/student-dashboard", label: "Tổng quan", icon: LayoutDashboard },
    { href: "/recommendation", label: "Lộ trình AI", icon: Compass },
    { href: "/classes", label: "Lớp học", icon: CalendarCheck },
    { href: "/student-profile", label: "Hồ sơ", icon: UserCircle },
  ];

  const teacherLinks = [
    { href: "/teacher-dashboard", label: "Bảng tin", icon: LayoutDashboard },
    { href: "/teacher/students", label: "Học viên", icon: Users },
    { href: "/teacher-profile", label: "Hồ sơ", icon: UserCircle },
  ];

  const links = effectiveRole === "student" ? studentLinks : teacherLinks;

  return (
    <div className="sticky top-0 z-50 w-full border-b border-slate-50 bg-white/70 backdrop-blur-2xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 overflow-hidden items-center justify-center rounded-xl bg-white group-hover:scale-105 transition-transform duration-500 shadow-xl shadow-slate-200">
              <img src="/YogAI-logo.png" alt="YogAI Logo" className="w-full h-full object-cover" />
            </div>
            <span className="hidden sm:inline-block font-black text-slate-900 text-xl tracking-tighter">
              YogAI
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
          <Link
            href={effectiveRole === "teacher" ? "/teacher-profile" : "/student-profile"}
            className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl bg-slate-50 border border-slate-100 group transition-all hover:bg-white hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-50/50"
          >
            <div className="h-9 w-9 rounded-[0.9rem] overflow-hidden bg-white border border-slate-200 flex-shrink-0 relative group-hover:scale-105 transition-transform">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <UserCircle className="w-5 h-5 text-slate-300" />
                </div>
              )}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-0.5">Hồ sơ</p>
              <p className="text-xs font-black text-slate-900 leading-none">{profile?.name || "Người dùng"}</p>
            </div>
          </Link>
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
