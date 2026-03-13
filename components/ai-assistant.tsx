"use client";

import { useState, useEffect } from "react";
import { Sparkles, X, MessageCircle, Send, BrainCircuit, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<{ role: "ai" | "user"; content: string }[]>([
    { role: "ai", content: "Chào bạn! Tôi là trợ lý YogAI. Tôi có thể giúp bạn tìm lớp học, giải thích các chỉ số sức khỏe hoặc lên kế hoạch tập luyện tuần này. Bạn cần trợ giúp gì không?" }
  ]);
  const [input, setInput] = useState("");

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: "user", content: input }]);
    const currentInput = input;
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      let response = "Đó là một câu hỏi hay! Dựa trên dữ liệu của bạn, tôi khuyên bạn nên tập trung vào các bài tập mở hông tuần này để giảm áp lực cho lưng dưới.";
      if (currentInput.toLowerCase().includes("lớp")) {
        response = "Tôi tìm thấy 3 lớp lớp phù hợp với bạn tối nay. 'Grounded Flow' lúc 7h tối là lựa chọn tối ưu nhất dựa trên mức năng lượng hiện tại của bạn.";
      }
      setMessages(prev => [...prev, { role: "ai", content: response }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
      {/* ─── Chat Window ─── */}
      {isOpen && (
        <div className="flex h-[500px] w-[360px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300 dark:border-slate-800 dark:bg-slate-900/95 dark:backdrop-blur-xl">
          {/* Header */}
          <div className="flex items-center justify-between bg-slate-900 px-4 py-3 dark:bg-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-sky-400 to-indigo-500 shadow-md">
                <BrainCircuit className="h-4 w-4 text-white" />
              </div>
              <div className="leading-tight">
                <p className="text-xs font-bold text-white">YogAI Assistant</p>
                <p className="text-[10px] text-sky-300 font-medium">● Đang trực tuyến</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-transparent">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs font-medium leading-relaxed shadow-sm ${m.role === "user"
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                  : "bg-white border border-slate-100 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
                  }`}>
                  {m.content}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-slate-100 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Hỏi AI về bài tập, sức khỏe..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSend()}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-400 transition-all"
              />
              <button
                onClick={handleSend}
                className="absolute right-1.5 rounded-lg bg-slate-900 p-1.5 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="mt-2 text-center text-[9px] text-slate-400 italic">Câu trả lời được tạo bởi AI của YogaFlow.</p>
          </div>
        </div>
      )}

      {/* ─── Floating Button ─── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-xl hover:scale-105 active:scale-95 transition-all dark:bg-white dark:text-slate-900"
      >
        <div className="absolute inset-0 rounded-2xl bg-indigo-500 blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
        {isOpen ? <X className="h-6 w-6 relative" /> : <Bot className="h-6 w-6 relative" />}
        {!isOpen && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
            <span className="relative inline-flex h-4 w-4 rounded-full bg-sky-500" />
          </span>
        )}
      </button>
    </div>
  );
}
