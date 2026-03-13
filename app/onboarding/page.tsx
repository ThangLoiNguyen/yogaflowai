import { Badge } from "@/components/ui/badge";
import { OnboardingForm } from "@/components/onboarding-form";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sparkles } from "lucide-react";
import Link from "next/link";

export default function OnboardingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Minimal nav */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/80">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-cyan-500 shadow-md">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-sm">YogaFlow AI</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 py-10 px-4 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <div className="mb-10 text-center space-y-3">
            <Badge className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-200/50 dark:border-indigo-400/20 font-semibold px-3 py-1.5">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 inline" />
              Thiết lập hồ sơ học viên
            </Badge>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
              Khởi động AI của bạn
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              Chỉ cần 2 phút. Chúng tôi cần một vài thông tin để xây dựng chương trình yoga cá nhân hóa hoàn toàn cho bạn.
            </p>
          </div>

          <section className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <OnboardingForm />
          </section>
        </div>
      </main>
    </div>
  );
}

