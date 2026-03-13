"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => setMounted(true), []);

  return (
    <button
      aria-label="Chuyển đổi giao diện"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="group relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 active:scale-95"
    >
      {mounted ? (
        resolvedTheme === "dark" ? (
          <Sun className="h-4 w-4 transition-transform group-hover:rotate-12" />
        ) : (
          <Moon className="h-4 w-4 transition-transform group-hover:-rotate-12" />
        )
      ) : (
        <span className="h-4 w-4 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
      )}
    </button>
  );
}
