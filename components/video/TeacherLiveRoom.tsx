"use client";

import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
  useParticipants,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { useEffect, useRef, useState, useCallback, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Video, VideoOff, Mic, MicOff, LogIn, Wifi, ShieldCheck, MessageCircle, Users, X, Send } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

/* ────────────────────────────────────────────────────────── */
/* Participants Panel (uses LiveKit hook – must be inside     */
/* LiveKitRoom context)                                        */
/* ────────────────────────────────────────────────────────── */
function ParticipantsPanel() {
  const participants = useParticipants();

  return (
    <div className="flex flex-col h-full bg-slate-950">
      <div className="px-4 py-3.5 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-white/50" />
          <span className="text-white font-semibold text-sm">Học viên</span>
          <span className="ml-auto text-[11px] text-white/30 bg-white/5 px-2 py-0.5 rounded-full">
            {participants.length}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1.5 min-h-0">
        {participants.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 gap-3 opacity-40">
            <Users className="w-8 h-8 text-white/30" />
            <p className="text-white/40 text-xs text-center">Chưa có học viên<br />nào tham gia</p>
          </div>
        )}
        {participants.map((p) => (
          <div key={p.sid} className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-white/5 transition-colors">
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 text-xs font-bold text-emerald-300">
              {(p.name || "?").charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{p.name || "Ẩn danh"}</p>
              <p className="text-white/30 text-[10px]">{p.isLocal ? "Bạn (Host)" : "Học viên"}</p>
            </div>
            {/* Audio indicator */}
            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${p.isSpeaking ? "bg-emerald-400 shadow-lg shadow-emerald-400/50" : "bg-white/20"}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/* Chat Panel (Supabase-backed)                               */
/* ────────────────────────────────────────────────────────── */
type ChatMsg = { id: string; sender: string; content: string; sent_at: string };

function ChatPanel({ sessionId, username, onClose }: { sessionId: string; username: string; onClose: () => void }) {
  const supabase = createClient();
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const scroll = () => setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 60);

  useEffect(() => {
    supabase
      .from("live_chat_messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("sent_at", { ascending: true })
      .then(({ data }) => { if (data) { setMessages(data as ChatMsg[]); scroll(); } });

    const ch = supabase
      .channel(`live_chat_${sessionId}`)
      .on("postgres_changes", {
        event: "INSERT", schema: "public",
        table: "live_chat_messages", filter: `session_id=eq.${sessionId}`,
      }, (payload) => { setMessages((p) => [...p, payload.new as ChatMsg]); scroll(); })
      .subscribe();

    return () => { supabase.removeChannel(ch); };
  }, [sessionId]);

  const send = async (e: FormEvent) => {
    e.preventDefault();
    const content = text.trim();
    if (!content) return;
    setText("");
    await supabase.from("live_chat_messages").insert({ session_id: sessionId, sender: username, content });
  };

  return (
    <div className="flex flex-col h-full bg-slate-950">
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-emerald-400" />
          <span className="text-white font-semibold text-sm">Chat lớp học</span>
        </div>
        <button onClick={onClose} className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/50 hover:text-white transition-all">
          <X className="w-3 h-3" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 min-h-0 overscroll-contain">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-2 opacity-40 py-10">
            <MessageCircle className="w-7 h-7 text-white/30" />
            <p className="text-white/40 text-xs text-center">Chưa có tin nhắn nào</p>
          </div>
        )}
        {messages.map((m) => {
          const isMe = m.sender === username;
          return (
            <div key={m.id} className={`flex flex-col gap-0.5 ${isMe ? "items-end" : "items-start"}`}>
              {!isMe && <span className="text-white/40 text-[10px] font-medium px-1">{m.sender}</span>}
              <div className={`max-w-[85%] px-3.5 py-2 rounded-2xl text-[13px] leading-relaxed ${
                isMe ? "bg-emerald-600 text-white rounded-br-md" : "bg-white/10 text-white/90 rounded-bl-md"
              }`}>{m.content}</div>
              <span className="text-white/20 text-[9px] px-1">
                {new Date(m.sent_at).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={send} className="flex items-center gap-2 px-3 py-3 border-t border-white/10 shrink-0">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Nhắn tin..."
          className="flex-1 h-10 px-4 rounded-2xl bg-white/10 text-white text-sm placeholder:text-white/30 outline-none border border-white/10 focus:border-emerald-500/50 transition-all"
        />
        <button type="submit" disabled={!text.trim()}
          className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white disabled:opacity-30 hover:bg-emerald-500 active:scale-95 transition-all shrink-0">
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/* LiveKit Live View with Right Panel                          */
/* ────────────────────────────────────────────────────────── */
function LiveView({ token, camEnabled, micEnabled, onDisconnected, sessionId, username }: {
  token: string;
  camEnabled: boolean;
  micEnabled: boolean;
  onDisconnected: () => void;
  sessionId?: string;
  username: string;
}) {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="flex w-full h-full">
      {/* Video */}
      <div className="flex-1 overflow-hidden">
        <LiveKitRoom
          video={camEnabled}
          audio={micEnabled}
          connect={true}
          token={token}
          serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
          data-lk-theme="default"
          onDisconnected={onDisconnected}
          style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column" }}
        >
          <VideoConference />
          <RoomAudioRenderer />

          {/* Right panel — only on desktop */}
          <div className="hidden md:block absolute top-0 right-0 bottom-0 w-64 border-l border-white/10 z-10">
            {/* Participants always visible */}
            <div className={`absolute inset-0 transition-all ${showChat ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
              <ParticipantsPanel />
            </div>

            {/* Chat overlays when open */}
            {showChat && (
              <div className="absolute inset-0">
                {sessionId && <ChatPanel sessionId={sessionId} username={username} onClose={() => setShowChat(false)} />}
              </div>
            )}

            {/* Chat toggle button (bottom of right panel) */}
            {!showChat && sessionId && (
              <button
                onClick={() => setShowChat(true)}
                className="absolute bottom-4 left-0 right-0 mx-auto w-fit flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 text-xs font-medium transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Mở chat
              </button>
            )}
          </div>
        </LiveKitRoom>
      </div>

      {/* Mobile chat toggle */}
      {sessionId && !showChat && (
        <button
          onClick={() => setShowChat(true)}
          className="md:hidden absolute bottom-24 right-3 z-[60] w-11 h-11 rounded-full bg-slate-900/90 backdrop-blur border border-white/10 flex items-center justify-center text-white hover:bg-slate-800 transition-all shadow-xl"
        >
          <MessageCircle className="w-5 h-5 text-emerald-400" />
        </button>
      )}

      {/* Mobile chat full screen */}
      {sessionId && showChat && (
        <div className="md:hidden absolute inset-0 z-[100] bg-slate-950">
          <ChatPanel sessionId={sessionId} username={username} onClose={() => setShowChat(false)} />
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/* Main TeacherLiveRoom component                              */
/* ────────────────────────────────────────────────────────── */
type Stage = "loading" | "error" | "lobby" | "live";

export default function TeacherLiveRoom({ room, username, sessionId }: {
  room: string;
  username: string;
  sessionId: string;
}) {
  const [stage, setStage] = useState<Stage>("loading");
  const [token, setToken] = useState("");
  const [tokenError, setTokenError] = useState("");
  const [camEnabled, setCamEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch(`/api/livekit/token?room=${encodeURIComponent(room)}&username=${encodeURIComponent(username)}`);
        const data = await resp.json();
        if (data.error) throw new Error(data.error);
        setToken(data.token);
        setStage("lobby");
      } catch (e: any) {
        setTokenError(e.message || "Không thể lấy token.");
        setStage("error");
      }
    })();
  }, [room, username]);

  useEffect(() => {
    if (stage !== "lobby") return;
    let active = true;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (!active) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.muted = true; }
      } catch { /* permission denied */ }
    })();
    return () => {
      active = false;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [stage]);

  const toggleCam = () => { const n = !camEnabled; setCamEnabled(n); streamRef.current?.getVideoTracks().forEach((t) => (t.enabled = n)); };
  const toggleMic = () => { const n = !micEnabled; setMicEnabled(n); streamRef.current?.getAudioTracks().forEach((t) => (t.enabled = n)); };
  const joinRoom = () => { streamRef.current?.getTracks().forEach((t) => t.stop()); streamRef.current = null; setStage("live"); };
  const handleDisconnected = useCallback(() => router.push("/teacher/classes"), [router]);

  if (stage === "loading") {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-[#0d0d1a] gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20" />
          <div className="absolute inset-0 rounded-full border-2 border-t-emerald-500 border-r-emerald-500 border-transparent animate-spin" />
        </div>
        <p className="text-white/50 text-sm">Đang kết nối...</p>
      </div>
    );
  }

  if (stage === "error") {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full gap-4 p-6">
        <Wifi className="w-8 h-8 text-red-400" />
        <p className="text-red-400 font-semibold">Lỗi kết nối</p>
        <p className="text-white/40 text-xs text-center">{tokenError}</p>
        <button onClick={() => router.push("/teacher/classes")} className="px-5 py-2 bg-white/10 text-white rounded-xl text-sm">Quay về</button>
      </div>
    );
  }

  if (stage === "lobby") {
    return (
      <div className="fixed inset-0 z-[200] bg-[#0d0d1a] flex flex-col">
        <div className="flex items-center justify-between px-5 md:px-8 py-4 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="font-display text-xl text-white">Yog</span>
            <span className="text-xl text-emerald-400">AI</span>
          </div>
          <div className="flex items-center gap-1.5 text-white/40 text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span className="hidden sm:inline">Kết nối bảo mật</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-12 px-5 md:px-8 pb-6 overflow-y-auto">
          {/* Camera preview */}
          <div className="flex flex-col items-center gap-4 w-full max-w-md">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shadow-2xl">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
              {!camEnabled && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/95 gap-3">
                  <VideoOff className="w-8 h-8 text-white/20" />
                  <span className="text-white/40 text-sm">Camera đang tắt</span>
                </div>
              )}
              <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/50 backdrop-blur rounded-full flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-white text-[10px] font-bold uppercase">Preview</span>
              </div>
              <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/60 backdrop-blur px-3 py-1.5 rounded-full">
                <div className="w-5 h-5 rounded-full bg-emerald-500/30 flex items-center justify-center text-emerald-300 text-[10px] font-bold shrink-0">
                  {username.charAt(0).toUpperCase()}
                </div>
                <span className="text-white text-xs font-medium">{username}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={toggleCam} className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium border transition-all ${camEnabled ? "bg-white/10 border-white/15 text-white" : "bg-red-500/15 border-red-500/30 text-red-400"}`}>
                {camEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                <span className="hidden sm:inline">{camEnabled ? "Camera bật" : "Camera tắt"}</span>
              </button>
              <button onClick={toggleMic} className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium border transition-all ${micEnabled ? "bg-white/10 border-white/15 text-white" : "bg-red-500/15 border-red-500/30 text-red-400"}`}>
                {micEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                <span className="hidden sm:inline">{micEnabled ? "Micro bật" : "Micro tắt"}</span>
              </button>
            </div>
          </div>

          {/* Right: info + join */}
          <div className="flex flex-col items-center lg:items-start gap-5 w-full max-w-xs">
            <div className="text-center lg:text-left">
              <h2 className="text-white text-2xl md:text-3xl font-bold leading-tight mb-2">Sẵn sàng<br className="hidden lg:block" /> bắt đầu?</h2>
              <p className="text-white/40 text-sm">Kiểm tra camera và micro của bạn trước khi phát sóng.</p>
            </div>

            <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2.5">
              {[
                { label: "Camera", ok: camEnabled, Icon: camEnabled ? Video : VideoOff },
                { label: "Micro", ok: micEnabled, Icon: micEnabled ? Mic : MicOff },
                { label: "Kết nối mạng", ok: true, Icon: Wifi },
              ].map(({ label, ok, Icon }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center ${ok ? "bg-emerald-500/15" : "bg-red-500/15"}`}>
                    <Icon className={`w-3.5 h-3.5 ${ok ? "text-emerald-400" : "text-red-400"}`} />
                  </div>
                  <span className="text-white/70 text-sm flex-1">{label}</span>
                  <span className={`text-xs font-semibold ${ok ? "text-emerald-400" : "text-red-400"}`}>{ok ? "Sẵn sàng" : "Đang tắt"}</span>
                </div>
              ))}
            </div>

            <button onClick={joinRoom} className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold text-base transition-all shadow-xl shadow-emerald-900/40">
              <LogIn className="w-5 h-5" />
              Bắt đầu phát sóng
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <LiveView
      token={token}
      camEnabled={camEnabled}
      micEnabled={micEnabled}
      onDisconnected={handleDisconnected}
      sessionId={sessionId}
      username={username}
    />
  );
}
