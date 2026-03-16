"use client";

import { useState, useEffect, useRef } from "react";
import { X, Send, BrainCircuit, Bot, Sparkles, Leaf, MessageSquare } from "lucide-react";
import { Badge } from "./ui/badge";

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<{ role: "ai" | "user"; content: string }[]>([
    { role: "ai", content: "Xin chào! Tôi là trợ lý YogAI. Bạn cần tôi phân tích chỉ số sức khỏe hôm nay hay tìm một lớp học phù hợp với cơ thể mình?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  if (!mounted) return null;

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: "user", content: input }]);
    const currentInput = input;
    setInput("");
    setIsTyping(true);

    // Simulate AI response with natural delay
    setTimeout(() => {
      let response = "Dựa trên hồ sơ của bạn, tôi thấy bạn đang có chút căng thẳng ở vùng vai. Hãy thử lớp 'Shoulder Release' tối nay để cảm nhận sự khác biệt nhé!";
      if (currentInput.toLowerCase().includes("lớp")) {
        response = "Hiện tại có 3 giáo viên đang có lớp trống phù hợp với trình độ của bạn. Tôi khuyên bạn nên chọn lớp của cô Mai vào lúc 6h tối.";
      }
      setIsTyping(false);
      setMessages(prev => [...prev, { role: "ai", content: response }]);
    }, 1500);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-6">
      {/* ─── Premium Chat Window ─── */}
      {isOpen && (
        <div className="flex h-[600px] w-[400px] flex-col overflow-hidden rounded-[2.5rem] border border-slate-50 bg-white/95 backdrop-blur-2xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] animate-in fade-in slide-in-from-bottom-8 duration-500">

          {/* Enhanced Header */}
          <div className="flex items-center justify-between bg-slate-900 p-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-indigo-600 shadow-xl shadow-indigo-900/40">
                  <Sparkles className="h-6 w-6 text-white animate-pulse" />
                </div>
                <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-slate-900" />
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-black text-white uppercase tracking-widest">YogAI Intelligence</p>
                <p className="text-[10px] text-sky-400 font-bold uppercase tracking-widest">Sẵn sàng phản hồi</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-2xl p-2.5 text-slate-400 hover:bg-white/10 hover:text-white transition-all active:scale-90"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Message Container */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-slate-50/50 to-white"
          >
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`relative max-w-[85%] rounded-[1.8rem] px-5 py-4 text-[13px] font-medium leading-relaxed shadow-sm ${m.role === "user"
                  ? "bg-slate-900 text-white rounded-br-md"
                  : "bg-white border border-slate-50 text-slate-700 rounded-bl-md"
                  }`}>
                  {m.content}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-50 px-4 py-3 rounded-2xl border border-slate-100 flex gap-1.5 items-center">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>

          {/* Premium Input Area */}
          <div className="p-6 border-t border-slate-50 bg-white">
            <div className="relative flex items-center group">
              <input
                type="text"
                placeholder="Hỏi AI về bài tập, chỉ số cơ thể..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSend()}
                className="w-full h-14 rounded-2xl border-slate-100 bg-slate-50 hover:bg-white focus:bg-white px-6 pr-14 text-sm text-slate-900 placeholder:text-slate-300 border focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all outline-none"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="absolute right-2 h-10 w-10 flex items-center justify-center rounded-xl bg-slate-900 text-white hover:bg-indigo-600 disabled:opacity-20 disabled:hover:bg-slate-900 transition-all active:scale-90"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 flex justify-center gap-4">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-300 flex items-center gap-2">
                <Leaf className="w-3 h-3" /> TRÍ TUỆ NHÂN TẠO YOGAI™
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── Premium Floating Trigger ─── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-slate-900 text-white shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 ${isOpen ? 'rotate-90' : 'hover:shadow-indigo-200'}`}
      >
        <div className="absolute inset-0 rounded-[1.5rem] bg-indigo-500 blur-xl opacity-20 group-hover:opacity-60 transition-opacity" />
        {isOpen ? (
          <X className="h-7 w-7 relative z-10" />
        ) : (
          <div className="relative z-10">
            <Bot className="h-7 w-7 group-hover:hidden" />
            <Sparkles className="h-7 w-7 hidden group-hover:block animate-pulse" />
          </div>
        )}

        {!isOpen && (
          <div className="absolute -right-1 -top-1 flex h-5 w-5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
            <span className="relative inline-flex h-5 w-5 rounded-full bg-sky-500 border-4 border-slate-900" />
          </div>
        )}
      </button>
    </div>
  );
}
