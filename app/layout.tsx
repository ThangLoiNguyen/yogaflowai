import type { Metadata } from "next";
import { AIAssistant } from "@/components/ai-assistant";
import { Toaster } from "@/components/ui/toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "YogAI — Nền tảng Yoga Thông minh Cá nhân hóa",
  description: "YogAI tìm kiếm và đặt lớp học yoga hoàn hảo cho sức khỏe và mục tiêu của bạn.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full">
      <body
        className="antialiased min-h-screen bg-white text-slate-900"
      >
        <div className="flex min-h-screen flex-col">
          {children}
          <AIAssistant />
          <Toaster />
        </div>
      </body>
    </html>
  );
}
