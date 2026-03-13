import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OnboardingForm } from "@/components/onboarding-form";
import { ThemeToggle } from "@/components/theme-toggle";

export default function OnboardingPage() {
  return (
    <main className="flex-1 bg-white dark:bg-slate-950">
      <div className="mx-auto flex w-full max-w-5xl flex-col px-4 pb-14 pt-8 sm:px-6 lg:px-8">
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>
        <div className="mb-8 max-w-xl space-y-2">
          <Badge className="bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-400/40">
            Hồ sơ học viên
          </Badge>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
            Cho YogaFlow AI biết về cơ thể và thói quen của bạn
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-300">
            Chúng tôi sẽ sử dụng thông tin này để đề xuất những lớp học an toàn và phù hợp nhất dành riêng cho bạn.
          </p>
        </div>

        <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/80">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-900 dark:text-slate-200">
              Hồ sơ cá nhân
            </CardTitle>
          </CardHeader>
          <CardContent>
            <OnboardingForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

