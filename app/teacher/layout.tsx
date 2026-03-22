import React from "react";
import { Sidebar } from "@/components/sidebar";
import { BottomNav } from "@/components/bottom-nav";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col lg:flex-row">
      <Sidebar />
      <main className="flex-1 lg:ml-[240px] relative pb-20 lg:pb-0">
        <div className="absolute top-0 right-0 w-[50%] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] -z-10" />
        <div className="p-4 md:p-8 lg:p-12 max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
