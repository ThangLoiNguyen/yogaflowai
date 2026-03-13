import { Badge } from "@/components/ui/badge";
import { OnboardingForm } from "@/components/onboarding-form";
import { ThemeToggle } from "@/components/theme-toggle";

export default function OnboardingPage() {
  return (
    <main className="flex-1 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="mx-auto flex w-full max-w-4xl flex-col px-4 pb-14 pt-8 sm:px-6 lg:px-8">
        <header className="flex justify-between items-start mb-12 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="space-y-3">
            <Badge className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-200/50 dark:border-indigo-400/20">
              Student Profile Builder
            </Badge>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
              Calibrate your AI
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg">
              We need a few details to build your personalized yoga engine. This helps us ensure safety and maximize progress.
            </p>
          </div>
          <ThemeToggle />
        </header>

        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          <OnboardingForm />
        </section>
      </div>
    </main>
  );
}

