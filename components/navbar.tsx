import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="w-full border-b border-slate-900/80 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex h-10 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-5">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-400 via-teal-400 to-sky-400">
            <span className="text-sm font-semibold text-slate-950">YF</span>
          </div>
          <span className="text-sm font-medium text-slate-100">
            YogAI
          </span>
        </Link>
        <nav className="hidden items-center gap-4 text-xs text-slate-300 md:flex">
          <Link href="/#features" className="hover:text-slate-50">
            Features
          </Link>
          <Link href="/#product" className="hover:text-slate-50">
            Product
          </Link>
          <Link href="/#pricing" className="hover:text-slate-50">
            Pricing
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/onboarding">
              <Button size="sm" variant="ghost">
                Start as student
              </Button>
            </Link>
            <Link href="/teacher-dashboard">
              <Button size="sm" variant="outline">
                Join as teacher
              </Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

