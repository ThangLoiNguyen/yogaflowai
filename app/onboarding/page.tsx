import { Badge } from "@/components/ui/badge";
import { OnboardingForm } from "@/components/onboarding-form";
import { Sparkles, Leaf, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function OnboardingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fdfdfd]">
      {/* Minimal nav */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-50 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 group-hover:scale-105 transition-transform duration-500 shadow-xl shadow-slate-200">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="font-black text-slate-900 text-xl tracking-tighter">YogaFlow AI</span>
          </Link>
          <Link href="/" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Quay lại trang chủ
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col py-16 px-4 sm:px-6">
        <div className="mx-auto max-w-2xl w-full space-y-12">
          <div className="text-center space-y-6 animate-soft-fade">
            <div className="flex justify-center">
               <Badge className="bg-sky-50 text-sky-700 border-sky-100 font-black uppercase tracking-widest text-[10px] py-1.5 px-4 rounded-full">
                 <Sparkles className="w-3.5 h-3.5 mr-2 inline animate-pulse" />
                 Khởi tạo hồ sơ học viên
               </Badge>
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">
              Hãy cho chúng tôi thấy <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600">con người thật của bạn</span>
            </h1>
            <p className="text-lg text-slate-400 font-medium max-w-md mx-auto leading-relaxed">
              Dựa trên các chỉ số cá nhân, YogAI sẽ kiến tạo một hành trình luyện tập dành riêng cho cơ thể bạn.
            </p>
          </div>

          <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
            <OnboardingForm />
          </section>
        </div>
      </main>
    </div>
  );
}
