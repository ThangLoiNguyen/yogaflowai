"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";
import { cn } from "@/lib/utils";

interface LogoutButtonProps {
  className?: string;
  showFullText?: boolean;
}

export function LogoutButton({ className, showFullText = false }: LogoutButtonProps) {
  return (
    <form action={logout} noValidate className={cn("inline-block", className)}>
      <Button
        type="submit"
        variant="ghost"
        className={cn(
          "h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-rose-600 hover:bg-rose-50/50 transition-all flex items-center justify-center gap-2.5",
          className
        )}
      >
        <LogOut className="w-4 h-4" />
        {(showFullText) && <span>Đăng xuất</span>}
        {(!showFullText) && <span className="hidden sm:inline-block">Đăng xuất</span>}
      </Button>
    </form>
  );
}
