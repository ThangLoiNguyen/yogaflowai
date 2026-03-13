"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play, Activity, Sparkles, UserCheck } from "lucide-react";

export function HeroSection() {
  return (
    <section className="mt-12 mb-20 md:mb-32 grid gap-16 lg:grid-cols-2 lg:items-center">
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <Badge className="bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-200/50 dark:border-sky-400/20 px-3 py-1 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 mr-1.5 inline" />
          AI-Powered Yoga Personalized for You
        </Badge>
        
        <div className="space-y-6">
          <h1 className="text-balance text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-6xl leading-[1.1]">
            Stop guessing. <br className="hidden md:block" />
            Find the yoga <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-600">your body needs.</span>
          </h1>
          <p className="max-w-xl text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            YogaFlow AI analyzes your health data, goals, and mobility to recommend the perfect classes. Tailored for absolute beginners to seasoned practitioners.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link href="/onboarding" className="w-full sm:w-auto">
            <Button size="lg" className="w-full h-12 px-8 text-base bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 rounded-full shadow-lg shadow-slate-900/10 transition-transform active:scale-95">
              Start Free Trial
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Link href="#demo" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full h-12 px-8 text-base rounded-full border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
            >
              <Play className="mr-2 w-4 h-4" />
              Watch Demo
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-800/50">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-500" />
            <span>Used by 10,000+ yogis</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-sky-500" />
            <span>Pro-level Analytics</span>
          </div>
        </div>
      </div>

      <div className="relative animate-in fade-in slide-in-from-right-8 duration-700 delay-150">
        {/* Glow effects */}
        <div className="pointer-events-none absolute -left-10 top-20 h-64 w-64 rounded-full bg-sky-400/20 dark:bg-sky-500/20 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-10 right-0 h-48 w-48 rounded-full bg-indigo-400/20 dark:bg-indigo-500/20 blur-[60px]" />

        {/* Dashboard Mockup Component */}
        <div className="relative rounded-2xl border border-slate-200/50 bg-white/60 dark:border-slate-800/50 dark:bg-slate-950/40 p-2 shadow-2xl shadow-slate-200/50 dark:shadow-black/40 backdrop-blur-xl">
          <div className="rounded-xl border border-slate-100 bg-white dark:border-slate-800/80 dark:bg-slate-900 overflow-hidden">
            {/* Window controls */}
            <div className="flex items-center px-4 py-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
              </div>
              <div className="mx-auto text-[10px] font-medium text-slate-400 flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                <Sparkles className="w-3 h-3 text-sky-500" /> AI Analysis Complete
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="p-5 space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Recovery Status</h3>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">Optimal</span>
                </div>
                <div className="flex gap-4">
                  <MetricCard label="Flexibility" value="78%" trend="+5%" />
                  <MetricCard label="Stress Load" value="L" trend="-12%" />
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Recommended Next Class</h3>
                <div className="rounded-lg border border-sky-100 bg-sky-50/50 dark:border-sky-900/50 dark:bg-sky-900/10 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Restorative Flow</p>
                      <p className="text-xs text-slate-500">30 min • Gentle stretch</p>
                    </div>
                    <Badge className="bg-sky-500 text-white border-0 hover:bg-sky-600">98% Match</Badge>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 bg-white/60 dark:bg-slate-950/40 p-2 rounded-md">
                    <span className="font-semibold text-sky-600 dark:text-sky-400">AI Note:</span> Your lower back shows tension from recent activities. This flow focuses on hip openers to relieve it.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricCard({ label, value, trend }: { label: string; value: string; trend: string }) {
  const isPositive = trend.startsWith('+') || trend.startsWith('-');
  return (
    <div className="flex-1 rounded-lg border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50 p-3">
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      <div className="flex items-baseline gap-2 mt-1">
        <span className="text-lg font-bold text-slate-900 dark:text-slate-100">{value}</span>
        <span className={`text-[10px] font-medium ${trend.startsWith('-') ? 'text-emerald-500' : 'text-sky-500'}`}>
          {trend}
        </span>
      </div>
    </div>
  );
}


