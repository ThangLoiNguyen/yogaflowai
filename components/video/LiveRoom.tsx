"use client";

import { LiveKitRoom, RoomAudioRenderer, useTracks, ParticipantTile, TrackToggle, DisconnectButton, useRoomContext } from "@livekit/components-react";
import "@livekit/components-styles";
import { useMemo, useEffect, useRef, useState, useCallback, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Video, VideoOff, Mic, MicOff, LogIn, Wifi, ShieldCheck, MessageSquareText, X, Send, LogOut, ArrowLeft } from "lucide-react";
import { Track } from "livekit-client";
import { createClient } from "@/utils/supabase/client";

function MicIndicator({ participant }: { participant: any }) {
  if (!participant.isSpeaking) return null;
  return (
    <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2 py-1.5 rounded-lg border border-white/5 transition-all animate-pulse">
      <Mic className="w-3 h-3 text-sky-400" />
      <div className="flex gap-0.5 items-end h-2.5">
        <div className="w-0.5 bg-sky-400 h-2 animate-bounce" style={{ animationDelay: "0ms" }} />
        <div className="w-0.5 bg-sky-400 h-full animate-bounce" style={{ animationDelay: "150ms" }} />
        <div className="w-0.5 bg-sky-400 h-3 animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*                      LIVE CHAT PANEL                       */
/* ────────────────────────────────────────────────────────── */
type ChatMsg = { id: string; sender: string; content: string; sent_at: string };

function ChatPanel({ sessionId, username, onClose }: { sessionId: string; username: string; onClose: () => void }) {
  const supabase = useMemo(() => createClient(), []);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const scroll = () => setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 60);

  useEffect(() => {
    let active = true;

    // Tải tin nhắn lần đầu
    const loadMessages = async () => {
      const { data } = await supabase
        .from("live_chat_messages")
        .select("*")
        .eq("session_id", sessionId)
        .order("sent_at", { ascending: true });

      if (data && active) {
        setMessages((prev) => {
          const dbMsgs = data as ChatMsg[];
          const prevIds = new Set(prev.map(m => m.id.toString()));

          // Lọc ra các tin nhắn từ DB mà UI chưa hề có
          const newMessegesFromDb = dbMsgs.filter(m => !prevIds.has(m.id.toString()));

          if (newMessegesFromDb.length > 0 || prev.length === 0) {
            setTimeout(() => scroll(), 60);

            // Giữ lại các tin nhắn 'temp' (Optimistic UI) chưa kịp vào DB
            const pendingTemps = prev.filter(m => m.id.toString().startsWith("temp-"));

            // Map gộp lại rành mạch không ghi đè
            const allMsgsMap = new Map();
            dbMsgs.forEach(m => allMsgsMap.set(m.id.toString(), m));
            pendingTemps.forEach(m => allMsgsMap.set(m.id.toString(), m));

            return Array.from(allMsgsMap.values()).sort((a, b) => new Date(a.sent_at).valueOf() - new Date(b.sent_at).valueOf());
          }
          return prev;
        });
      }
    };

    loadMessages();

    // Polling an toàn 100% mỗi 2.5 giây
    const interval = setInterval(loadMessages, 2500);

    // Realtime channel
    const ch = supabase
      .channel(`live_chat_${sessionId}`)
      .on("postgres_changes", {
        event: "INSERT", schema: "public",
        table: "live_chat_messages", filter: `session_id=eq.${sessionId}`,
      }, (payload) => {
        const newMsg = payload.new as ChatMsg;
        setMessages((p) => {
          if (p.some((m) => m.id === newMsg.id || (m.content === newMsg.content && m.sender === newMsg.sender && m.id.toString().startsWith("temp-")))) {
            return p.map(m => (m.content === newMsg.content && m.sender === newMsg.sender && m.id.toString().startsWith("temp-")) ? newMsg : m);
          }
          return [...p, newMsg];
        });
        scroll();
      })
      .subscribe();

    return () => {
      active = false;
      clearInterval(interval);
      supabase.removeChannel(ch);
    };
  }, [sessionId, supabase]);

  const send = async (e: FormEvent) => {
    e.preventDefault();
    const content = text.trim();
    if (!content) return;

    setText("");

    // Tạo Unique ID và object tin nhắn nội bộ
    const tempId = `temp-${Date.now()}-${Math.random()}`;
    const optimisticMsg: ChatMsg = {
      id: tempId,
      sender: username,
      content,
      sent_at: new Date().toISOString(),
    };

    setMessages((p) => [...p, optimisticMsg]);
    scroll();

    const { data } = await supabase.from("live_chat_messages").insert({
      session_id: sessionId,
      sender: username,
      content,
    }).select().single();

    if (data) {
      setMessages((p) => p.map(m => m.id === tempId ? (data as ChatMsg) : m));
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-200 shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
        <h3 className="text-slate-900 font-semibold text-sm italic">Tin nhắn lớp học</h3>
        <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 lk-custom-sidebar">
        {messages.map((m) => (
          <div key={m.id} className="flex flex-col gap-1 anim-fade-in">
            <div className="flex items-baseline gap-2">
              <span className="text-slate-900 text-[13px] font-bold">{m.sender === username ? "Bạn" : m.sender}</span>
              <span className="text-slate-400 text-[10px]">
                {new Date(m.sent_at).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            <p className="text-slate-700 text-sm leading-relaxed break-words italic opacity-80">"{m.content}"</p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={send} className="p-4 bg-slate-50 border-t border-slate-100 shrink-0 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Gửi tin nhắn..."
          className="flex-1 bg-white border border-slate-200 focus:border-sky-500/50 rounded-full px-5 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all shadow-sm"
        />
        <button type="submit" disabled={!text.trim()}
          className="w-10 h-10 rounded-full bg-sky-600 hover:bg-sky-500 disabled:opacity-50 flex items-center justify-center text-white transition-all shadow-md">
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}

interface LiveRoomProps {
  room: string;
  username: string;
  mode: "embedded" | "scale";
  onLeaveRedirect?: string;
  sessionId?: string;
  sessionTitle?: string;
}

type Stage = "loading" | "error" | "lobby" | "live";

export default function LiveRoom({ room, username, mode, onLeaveRedirect, sessionId, sessionTitle }: LiveRoomProps) {
  const [stage, setStage] = useState<Stage>("loading");
  const [showChat, setShowChat] = useState(false);
  const [token, setToken] = useState("");
  const [tokenError, setTokenError] = useState("");
  const [camEnabled, setCamEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const router = useRouter();

  /* 1. Fetch LiveKit token */
  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch(
          `/api/livekit/token?room=${encodeURIComponent(room)}&username=${encodeURIComponent(username)}`
        );
        const data = await resp.json();
        if (data.error) throw new Error(data.error);
        setToken(data.token);
        setStage("lobby");
      } catch (e: any) {
        setTokenError(e.message || "Không thể lấy token phòng học.");
        setStage("error");
      }
    })();
  }, [room, username]);

  /* 2. Lobby Media Preview logic */
  useEffect(() => {
    if (stage !== "lobby") return;
    let active = true;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (!active) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.muted = true;
        }
      } catch (err) {
        console.warn("Lobby preview failed:", err);
      }
    })();
    return () => {
      active = false;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [stage]);

  const toggleCam = () => {
    const next = !camEnabled;
    setCamEnabled(next);
    streamRef.current?.getVideoTracks().forEach((t) => (t.enabled = next));
  };
  const toggleMic = () => {
    const next = !micEnabled;
    setMicEnabled(next);
    streamRef.current?.getAudioTracks().forEach((t) => (t.enabled = next));
  };

  const joinRoom = () => {
    setStage("loading"); // intermediate stage to unmount lobby
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    // Delay to let browser release hardware handle
    setTimeout(() => {
      setStage("live");
    }, 400);
  };

  const handleDisconnected = useCallback(() => {
    if (onLeaveRedirect) {
      router.push(onLeaveRedirect);
    } else if (sessionId) {
      router.push(`/session/summary?sessionId=${sessionId}`);
    } else {
      router.push("/student");
    }
  }, [onLeaveRedirect, router, sessionId]);

  /* ────────────────────────────────────────────────────────── */
  /*                      GLOBAL STYLES                         */
  /* ────────────────────────────────────────────────────────── */
  const globalStyles = (
    <style jsx global>{`
      /* MIRROR EFFECT FIX (Selfie View) */
      .lk-participant-tile video, .lobby-video, video {
        transform: scaleX(-1) !important;
        -webkit-transform: scaleX(-1) !important;
        object-fit: cover !important;
        border-radius: inherit !important;
      }
      .lk-participant-name {
        background: rgba(255, 255, 255, 0.75) !important;
        backdrop-filter: blur(12px) !important;
        border: 1px solid rgba(0, 0, 0, 0.05) !important;
        color: #0f172a !important;
        font-size: 11px !important;
        font-weight: 600 !important;
        padding: 6px 14px !important;
        border-radius: 12px !important;
        bottom: 16px !important;
        left: 20px !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
      }
      .lk-participant-tile, video {
        border-radius: 20px !important;
      }
      html, body { overflow: hidden !important; }
      .lk-custom-sidebar::-webkit-scrollbar { width: 4px; }
      .lk-custom-sidebar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 10px; }
    `}</style>
  );

  /* ── Stages ── */
  if (stage === "loading") {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-slate-50 gap-5">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-2 border-sky-500/20" />
          <div className="absolute inset-0 rounded-full border-2 border-t-sky-500 animate-spin" />
        </div>
        <p className="text-slate-500 text-sm font-medium italic">Đang chuẩn bị phòng học...</p>
      </div>
    );
  }

  if (stage === "error") {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-slate-50 gap-5 p-6 text-center">
        <Wifi className="w-12 h-12 text-red-500" />
        <h2 className="text-red-600 font-bold italic border-none">Lỗi kết nối</h2>
        <p className="text-slate-500 text-sm max-w-xs italic">{tokenError}</p>
        <button onClick={() => router.push("/student")} className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl font-bold shadow-sm">Quay về</button>
      </div>
    );
  }

  if (stage === "lobby") {
    return (
      <div className="fixed inset-0 z-[200] bg-slate-50 flex flex-col font-sans">
        {globalStyles}
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 md:px-8 py-4 shrink-0 bg-white border-b border-slate-200 shadow-sm">
          <div className="flex items-center gap-1.5"><span className="font-display text-xl text-slate-900 font-bold border-none italic leading-none">Yog<span className="text-sky-500">AI</span></span></div>
          <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase tracking-widest font-black"><ShieldCheck className="w-4 h-4 text-sky-500" /><span>Kết nối bảo mật</span></div>
        </div>
        {/* Main */}
        <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-12 px-5 md:px-8 pb-6 overflow-y-auto">
          <div className="flex flex-col items-center gap-4 w-full max-w-md">
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-2xl shadow-sky-100/50">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover lobby-video" />
              {!camEnabled && <div className="absolute inset-0 flex items-center justify-center bg-slate-50 text-slate-400 font-medium italic">Camera đang tắt</div>}
              {/* Chips */}
              <div className="absolute top-3 left-3 flex gap-2">
                <div className="bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-600 border border-slate-100 shadow-sm flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />Xem trước</div>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={toggleCam} className={`p-4 rounded-full border transition-all ${camEnabled ? "bg-white border-slate-200 shadow-sm" : "bg-red-50 border-red-200 text-red-600"}`}>{camEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}</button>
              <button onClick={toggleMic} className={`p-4 rounded-full border transition-all ${micEnabled ? "bg-white border-slate-200 shadow-sm" : "bg-red-50 border-red-200 text-red-600"}`}>{micEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}</button>
            </div>
          </div>
          <div className="w-full max-w-xs space-y-6">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl font-black text-slate-900 mb-2 italic border-none leading-none">Sẵn sàng tham gia?</h2>
              <p className="text-slate-500 text-sm italic">Kiểm tra camera và micrô trước khi vào lớp.</p>
            </div>
            <button onClick={joinRoom} className="w-full py-4 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-sky-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"><LogIn className="w-5 h-5" />Bắt đầu tham gia</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {globalStyles}
      <LiveKitRoom
        video={camEnabled}
        audio={micEnabled}
        connect={true}
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        data-lk-theme="default"
        onDisconnected={handleDisconnected}
        style={{ height: "100dvh", width: "100%", display: "flex", flexDirection: "column" }}
      >
        <div className="flex-1 flex overflow-hidden w-full relative">
          <div className="flex-1 flex flex-col h-full min-w-0">
            <YogaLiveLayout 
              onToggleChat={() => setShowChat(!showChat)} 
              isChatOpen={showChat} 
              sessionId={sessionId || room} 
              sessionTitle={sessionTitle} 
              onLeaveRedirect={onLeaveRedirect} 
            />
          </div>
          {showChat && (
            <div className="w-full md:w-[320px] lg:w-[360px] h-full flex-shrink-0 z-[100] absolute inset-0 md:relative bg-white">
              <ChatPanel sessionId={sessionId || room} username={username} onClose={() => setShowChat(false)} />
            </div>
          )}
        </div>
        <RoomAudioRenderer />
      </LiveKitRoom>
    </>
  );
}

function YogaLiveLayout({ onToggleChat, isChatOpen, sessionId, sessionTitle, onLeaveRedirect }: any) {
  const room = useRoomContext();
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  const teacherTrack = tracks.find(t => !t.participant.isLocal) || tracks[0];
  const studentTracks = tracks.filter(t => t !== teacherTrack);

  return (
    <div className="flex-1 flex flex-col h-full w-full bg-slate-50 font-sans">
      <div className="flex-1 flex flex-col sm:flex-row p-2 sm:p-4 gap-2 sm:gap-4 overflow-hidden relative">
        <div className="flex-1 relative rounded-[28px] overflow-hidden bg-white shadow-xl flex items-center justify-center border border-slate-200/50">
          {teacherTrack ? (
            <>
              <ParticipantTile trackRef={teacherTrack} className="w-full h-full object-cover" />
              <MicIndicator participant={teacherTrack.participant} />
            </>
          ) : (
            <div className="text-slate-400 font-medium text-sm italic">Đang chờ tín hiệu...</div>
          )}
          <div className="absolute top-4 left-4 z-10 bg-sky-50 text-sky-700 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm border border-sky-100">
            Lớp học Live
          </div>
        </div>

        {studentTracks.length > 0 && (
          <div className={`flex sm:flex-shrink-0 overflow-auto lk-custom-sidebar transition-all duration-300
            absolute sm:relative bottom-4 left-4 right-4 sm:bottom-auto sm:left-auto sm:right-auto z-50 sm:z-auto
            flex-row w-auto h-[90px] sm:h-auto sm:w-auto
            ${isChatOpen ? "sm:w-[120px] lg:w-[150px]" : "sm:w-[160px] lg:w-[220px]"} 
            sm:flex-col gap-2 sm:gap-3 sm:pb-4 sm:pr-1`}>
            {studentTracks.map((track) => (
              <div key={`${track.participant.identity}-${track.source}`} className="w-[120px] sm:w-full h-full sm:h-auto aspect-video rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/50 relative shrink-0 shadow-md">
                <ParticipantTile trackRef={track} className="w-full h-full object-cover pointer-events-none" />
                <MicIndicator participant={track.participant} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="shrink-0 bg-white px-3 sm:px-6 py-3 sm:py-5 flex items-center justify-between border-t border-slate-200 shadow-lg z-[60]">
        <div className="hidden md:flex flex-1 items-center gap-2">
          <button onClick={() => window.location.href = "/student"} className="text-slate-400 hover:text-sky-600 transition flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-xl hover:bg-slate-50 transition-all"><ArrowLeft className="w-4 h-4" /> Quay lại</button>
          <div className="w-[1px] h-4 bg-slate-100 mx-2"></div>
          <span className="text-slate-300 text-[9px] font-black uppercase tracking-[0.2em] italic">{sessionTitle || "YogAI Phòng Live"}</span>
        </div>

        <div className="flex flex-1 md:flex-none justify-center items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1.5 sm:gap-3 bg-slate-50 p-1 sm:p-1.5 rounded-full border border-slate-200 shadow-inner">
            <TrackToggle source={Track.Source.Microphone} className="!w-9 !h-9 sm:!w-10 sm:!h-10 !rounded-full !bg-white hover:!bg-slate-50 !border !border-slate-200 !text-slate-500 shadow-sm transition-all" />
            <TrackToggle source={Track.Source.Camera} className="!w-9 !h-9 sm:!w-10 sm:!h-10 !rounded-full !bg-white hover:!bg-slate-50 !border !border-slate-200 !text-slate-500 shadow-sm transition-all" />
            <button onClick={onToggleChat} className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all border ${isChatOpen ? "bg-sky-500 text-white border-sky-500 shadow-lg" : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50 shadow-sm"}`}><MessageSquareText className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2">
          <button onClick={() => setShowLeaveModal(true)} className="bg-sky-500 hover:bg-sky-600 text-white px-5 sm:px-8 py-2.5 sm:py-3 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-sky-500/20 transition-all active:scale-95">Hoàn tất</button>
        </div>
      </div>

      {showLeaveModal && (
        <div className="fixed inset-0 z-[999] bg-slate-900/40 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-black text-slate-900 mb-2 italic border-none leading-none">Rời khỏi lớp học?</h3>
            <p className="text-slate-500 text-sm mb-6 italic">Bạn có chắc chắn muốn rời khỏi lớp học này không? Kết quả tập luyện sẽ được lưu lại.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowLeaveModal(false)} className="px-5 py-2.5 rounded-xl text-slate-400 font-bold hover:bg-slate-50 transition-colors uppercase text-[10px] tracking-widest">Hủy</button>
              <button onClick={() => room.disconnect()} className="px-6 py-2.5 rounded-xl bg-sky-500 text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-sky-500/20 hover:bg-sky-600 transition-all">Xác nhận</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
