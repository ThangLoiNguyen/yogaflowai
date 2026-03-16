import { Badge } from "@/components/ui/badge";
import { OnboardingForm } from "@/components/onboarding-form";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sparkles, Leaf } from "lucide-react";
import Link from "next/link";

export default function OnboardingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Minimal nav */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/80">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-600 to-cyan-500 shadow-lg">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-lg tracking-tight">YogaFlow AI</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 flex flex-col py-12 px-4 sm:px-6">
        <div className="mx-auto max-w-2xl w-full">
          <div className="mb-10 text-center space-y-4">
            <Badge className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-200/50 dark:border-indigo-400/20 font-semibold px-4 py-1.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5 mr-2 inline animate-pulse" />
              Student Onboarding
            </Badge>
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
              Tell us about yourself
            </h1>
            <p className="text-base text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              We need a few details to create a personalized yoga journey powered by AI.
            </p>
          </div>

          <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <OnboardingForm />
          </section>
        </div>
      </main>
    </div>
  );
}
