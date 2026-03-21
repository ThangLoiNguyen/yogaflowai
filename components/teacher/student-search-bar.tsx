"use client";

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function StudentSearchBar({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [text, setText] = useState(defaultValue);

  // Slightly longer debounce for better stability
  useEffect(() => {
    // Current URL query
    const currentQ = searchParams.get("q") || "";
    if (text === currentQ) return;

    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (!text.trim()) {
        params.delete("q");
      } else {
        params.set("q", text);
      }
      
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, 500);

    return () => clearTimeout(handler);
  }, [text, pathname, router, searchParams]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (!text) {
      params.delete("q");
    } else {
      params.set("q", text);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="shrink-0 max-w-2xl" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      <div className="relative group">
        <form
          onSubmit={handleFormSubmit}
          className="flex items-center bg-white rounded-pill shadow-md border border-slate-100/50 p-1.5 focus-within:border-accent/20 transition-all font-bold relative"
        >
          <div className="absolute left-6 text-slate-300 pointer-events-none">
             <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            name="q"
            placeholder="Tìm kiếm theo tên học viên..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 h-12 pl-14 pr-6 bg-transparent outline-none txt-content placeholder:text-slate-300 focus:placeholder:text-slate-200 transition-all font-bold"
          />
        </form>
      </div>
    </div>
  );
}
