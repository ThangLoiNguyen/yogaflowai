"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";

export function LogoutButton() {
  return (
    <form action={logout} noValidate>
      <Button
        type="submit"
        variant="ghost"
        className="h-12 px-6 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-rose-600 hover:bg-rose-50/50 transition-all flex items-center gap-2.5"
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden sm:inline-block">Đăng xuất</span>
      </Button>
    </form>
  );
}
