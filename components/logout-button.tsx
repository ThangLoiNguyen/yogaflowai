"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";

export function LogoutButton() {
  return (
    <form action={logout}>
      <Button
        type="submit"
        size="sm"
        variant="ghost"
        className="text-slate-600 hover:text-rose-600 hover:bg-rose-50 dark:text-slate-400 dark:hover:text-rose-400 dark:hover:bg-rose-500/10"
      >
        <LogOut className="w-4 h-4 sm:mr-2" />
        <span className="hidden sm:inline-block">Đăng xuất</span>
      </Button>
    </form>
  );
}
