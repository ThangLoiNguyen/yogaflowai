import React from "react";
import { Sidebar } from "@/components/sidebar";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex">
      <Sidebar />
      <main className="flex-1 ml-[240px] relative">
        <div className="absolute top-0 right-0 w-[50%] h-[400px] bg-[var(--accent)]/5 rounded-full blur-[100px] -z-10" />
        <div className="p-12 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
