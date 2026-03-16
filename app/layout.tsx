import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AIAssistant } from "@/components/ai-assistant";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YogAI — Intelligent Personal Yoga Platform",
  description: "YogAI finds and books the perfect yoga class for your health and goals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-white text-slate-900`}
      >
        <div className="flex min-h-screen flex-col">
          {children}
          <AIAssistant />
        </div>
      </body>
    </html>
  );
}
