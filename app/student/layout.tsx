import React from "react";
import { Sidebar } from "@/components/sidebar";
import { BottomNav } from "@/components/bottom-nav";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col lg:flex-row">
      <Sidebar />
      <main className="flex-1 lg:ml-[240px] relative pb-20 lg:pb-0">
        <div className="absolute top-0 right-0 w-[50%] h-[400px] bg-[var(--accent)]/5 rounded-full blur-[100px] -z-10" />
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
