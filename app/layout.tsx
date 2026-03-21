import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, DM_Sans, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const dmSerifDisplay = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-ui",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "YogAI — Nền tảng Yoga Live Class & AI Feedback Loop",
  description: "Cá nhân hóa lộ trình tập yoga qua feedback từ AI và giáo viên thật. Mỗi buổi học tốt hơn buổi trước.",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`h-full ${dmSerifDisplay.variable} ${dmSans.variable} ${jetBrainsMono.variable}`}>
      <body className="antialiased min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
        {children}
        <Toaster 
          position="bottom-right" 
          toastOptions={{
            className: "rounded-xl font-ui shadow-lg border-[var(--border)]",
            style: { fontFamily: "var(--font-ui)", background: "white" }
          }} 
        />
      </body>
    </html>
  );
}

