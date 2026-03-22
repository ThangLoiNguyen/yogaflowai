"use client";

import { LiveKitRoom, RoomAudioRenderer, useTracks, ParticipantTile, TrackToggle, DisconnectButton, useRoomContext } from "@livekit/components-react";
import "@livekit/components-styles";
import { useEffect, useRef, useState, useCallback, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Video, VideoOff, Mic, MicOff, LogIn, Wifi, ShieldCheck, MessageSquareText, X, Send, LogOut } from "lucide-react";
import { Track } from "livekit-client";
import { createClient } from "@/utils/supabase/client";

function MicIndicator({ participant }: { participant: any }) {
  if (!participant.isSpeaking) return null;
  return (
    <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2 py-1.5 rounded-lg border border-white/5 transition-all animate-pulse">
      <Mic className="w-3 h-3 text-blue-400" />
      <div className="flex gap-0.5 items-end h-2.5">
        <div className="w-0.5 bg-blue-400 h-2 animate-bounce" style={{ animationDelay: "0ms" }} />
        <div className="w-0.5 bg-blue-400 h-full animate-bounce" style={{ animationDelay: "150ms" }} />
        <div className="w-0.5 bg-blue-400 h-3 animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*                      LIVE CHAT PANEL                       */
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
    <div className="flex flex-col h-full bg-[#161b22] border-l border-white/10 shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 shrink-0">
        <h3 className="text-white font-semibold text-sm">Tin nhắn trong cuộc gọi</h3>
        <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-full text-white/50 transition-colors">
           <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 lk-custom-sidebar">
        {messages.map((m) => (
          <div key={m.id} className="flex flex-col gap-1">
            <div className="flex items-baseline gap-2">
              <span className="text-white/90 text-[13px] font-bold">{m.sender === username ? "Bạn" : m.sender}</span>
              <span className="text-white/30 text-[10px]">
                {new Date(m.sent_at).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            <p className="text-white/80 text-sm leading-relaxed break-words">{m.content}</p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={send} className="p-4 bg-[#0d1117]/50 border-t border-white/5 shrink-0 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Gửi tin nhắn cho mọi người"
          className="flex-1 bg-white/5 border border-white/10 focus:border-emerald-500/50 rounded-full px-5 py-2 text-sm text-white placeholder:text-white/30 outline-none transition-all"
        />
        <button type="submit" disabled={!text.trim()} 
          className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-20 flex items-center justify-center text-white transition-all">
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
}

type Stage = "loading" | "error" | "lobby" | "live";

export default function LiveRoom({ room, username, mode, onLeaveRedirect, sessionId }: LiveRoomProps) {
  const [stage, setStage] = useState<Stage>("loading");
  const [showChat, setShowChat] = useState(false);
  const [token, setToken] = useState("");
  const [tokenError, setTokenError] = useState("");
  const [camEnabled, setCamEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const router = useRouter();

  /* Fetch LiveKit token */
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

  /* Camera preview in lobby */
  useEffect(() => {
    if (stage !== "lobby") return;
    let active = true;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (!active) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.muted = true;
        }
      } catch (err) {
        console.warn("Camera preview failed:", err);
      }
    })();
    return () => {
      active = false;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [stage]);

  const toggleCam = () => {
    const next = !camEnabled; setCamEnabled(next);
    streamRef.current?.getVideoTracks().forEach((t) => (t.enabled = next));
  };
  const toggleMic = () => {
    const next = !micEnabled; setMicEnabled(next);
    streamRef.current?.getAudioTracks().forEach((t) => (t.enabled = next));
  };
  const joinRoom = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setStage("live");
  };
  const handleDisconnected = useCallback(() => {
    router.push(onLeaveRedirect || "/teacher/classes");
  }, [onLeaveRedirect, router]);

  /* ── Loading ── */
  if (stage === "loading") {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-slate-50 gap-5">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20" />
          <div className="absolute inset-0 rounded-full border-2 border-t-emerald-500 border-r-emerald-500 border-b-transparent border-l-transparent animate-spin" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="text-slate-700 font-bold text-sm">Đang kết nối phòng học</div>
          <div className="text-slate-500 text-xs font-medium">Vui lòng chờ...</div>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (stage === "error") {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-slate-50 gap-5 p-6">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
          <Wifi className="w-6 h-6 text-red-500" />
        </div>
        <div className="text-center">
          <div className="text-red-600 font-bold mb-1">Lỗi kết nối</div>
          <div className="text-slate-500 text-xs max-w-[240px] font-medium">{tokenError}</div>
        </div>
        <button
          onClick={() => router.push("/teacher/classes")}
          className="px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm rounded-xl text-sm font-bold transition-all mt-2"
        >
          Quay về
        </button>
      </div>
    );
  }

  /* ── Lobby ── */
  if (stage === "lobby") {
    return (
      <div className="fixed inset-0 z-[200] bg-slate-50 flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 md:px-8 py-4 shrink-0 bg-white border-b border-slate-200">
          <div className="flex items-center gap-1.5">
            <span className="font-display text-xl text-slate-900">Yog</span>
            <span className="text-xl text-emerald-500 font-bold">AI</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="hidden sm:inline font-medium">Kết nối bảo mật</span>
          </div>
        </div>

        {/* Main content: two-col on desktop, one-col on mobile */}
        <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-12 px-5 md:px-8 pb-6 overflow-y-auto">

          {/* Camera preview */}
          <div className="flex flex-col items-center gap-4 w-full max-w-md">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-xl">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {!camEnabled && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 gap-3">
                  <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-200">
                    <VideoOff className="w-6 h-6 text-slate-400" />
                  </div>
                  <span className="text-slate-500 text-sm font-medium">Camera đang tắt</span>
                </div>
              )}
              {/* Status chips */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full shadow-sm border border-slate-100">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-slate-700 text-[10px] font-bold uppercase tracking-wider">Preview</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full shadow-sm border border-slate-100">
                  {micEnabled
                    ? <Mic className="w-3 h-3 text-emerald-500" />
                    : <MicOff className="w-3 h-3 text-red-500" />}
                  <span className="text-slate-700 font-bold text-[10px]">{micEnabled ? "Mic bật" : "Mic tắt"}</span>
                </div>
              </div>
              {/* Name badge */}
              <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-sm border border-slate-100">
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-[9px] font-black shrink-0">
                  {username.charAt(0).toUpperCase()}
                </div>
                <span className="text-slate-800 text-xs font-bold truncate max-w-[120px]">{username}</span>
              </div>
            </div>

            {/* Cam / Mic toggles */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleCam}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all active:scale-95 shadow-sm ${
                  camEnabled
                    ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    : "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                }`}
              >
                {camEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                <span className="hidden sm:inline">{camEnabled ? "Camera bật" : "Camera tắt"}</span>
              </button>
              <button
                onClick={toggleMic}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all active:scale-95 shadow-sm ${
                  micEnabled
                    ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    : "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                }`}
              >
                {micEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                <span className="hidden sm:inline">{micEnabled ? "Micro bật" : "Micro tắt"}</span>
              </button>
            </div>
          </div>

          {/* Right panel: info + join */}
          <div className="flex flex-col items-center lg:items-start gap-5 w-full max-w-xs">
            <div className="text-center lg:text-left">
              <h2 className="text-slate-900 text-2xl md:text-3xl font-black leading-tight mb-2">
                Sẵn sàng<br className="hidden lg:block" /> tham gia?
              </h2>
              <p className="text-slate-500 text-sm font-medium">Kiểm tra camera và micro trước khi vào lớp học.</p>
            </div>

            {/* Checklist */}
            <div className="w-full bg-white border border-slate-200 rounded-2xl p-4 space-y-2.5 shadow-sm">
              {[
                { label: "Camera", ok: camEnabled, Icon: camEnabled ? Video : VideoOff },
                { label: "Micro", ok: micEnabled, Icon: micEnabled ? Mic : MicOff },
                { label: "Kết nối mạng", ok: true, Icon: Wifi },
              ].map(({ label, ok, Icon }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center ${ok ? "bg-emerald-50" : "bg-red-50"}`}>
                    <Icon className={`w-3.5 h-3.5 ${ok ? "text-emerald-500" : "text-red-500"}`} />
                  </div>
                  <span className="text-slate-700 font-medium text-sm flex-1">{label}</span>
                  <span className={`text-xs font-bold ${ok ? "text-emerald-600" : "text-red-500"}`}>
                    {ok ? "Sẵn sàng" : "Đang tắt"}
                  </span>
                </div>
              ))}
            </div>

            {/* Join */}
            <button
              onClick={joinRoom}
              className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-bold text-base transition-all shadow-lg shadow-blue-600/20"
            >
              <LogIn className="w-5 h-5" />
              Bắt đầu tham gia
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Live Custom Layout ── */
  return (
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
          <YogaLiveLayout onToggleChat={() => setShowChat(!showChat)} isChatOpen={showChat} sessionId={sessionId || room} />
        </div>
        
        {/* Chat Sidebar similar to Google Meet */}
        {showChat && (
          <div className="w-full md:w-[320px] lg:w-[360px] h-full flex-shrink-0 z-[100] absolute inset-0 md:relative md:inset-auto">
            <ChatPanel sessionId={sessionId || room} username={username} onClose={() => setShowChat(false)} />
          </div>
        )}
      </div>
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
}

function YogaLiveLayout({ onToggleChat, isChatOpen, sessionId }: { onToggleChat: () => void, isChatOpen: boolean, sessionId: string }) {
  const room = useRoomContext();
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  // Tìm stream của Giáo viên: Ưu tiên người không phải bản thân (isLocal: false) và có tracks
  // Nếu chỉ có 1 mình (trong lobby hoặc giáo viên chưa vào), hiển thị bản thân
  const teacherTrack = tracks.find(t => !t.participant.isLocal) || tracks[0];
  const studentTracks = tracks.filter(t => t !== teacherTrack);

  return (
    <div className="flex-1 flex flex-col h-full w-full bg-slate-50 font-sans">
      <div className="flex-1 flex flex-col sm:flex-row p-2 sm:p-4 gap-2 sm:gap-4 overflow-hidden relative">
        
        {/* Vùng Giáo Viên (Bên Trái - Lớn) */}
        <div className="flex-1 relative rounded-[28px] overflow-hidden bg-slate-900 shadow-lg flex items-center justify-center border border-slate-200/50">
          {teacherTrack ? (
            <>
              <ParticipantTile trackRef={teacherTrack} className="w-full h-full object-cover" />
              <MicIndicator participant={teacherTrack.participant} />
            </>
          ) : (
            <div className="text-slate-400 font-medium text-sm italic">Đang chờ tín hiệu...</div>
          )}
          
          <div className="absolute top-4 left-4 z-10 bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest shadow-sm border border-blue-200">
            Lớp học Live
          </div>
        </div>

        {/* Vùng Học Sinh (Sidebar) - Overlay Absolute trên Mobile */}
        {studentTracks.length > 0 && (
          <div className={`flex sm:flex-shrink-0 overflow-auto lk-custom-sidebar transition-all duration-300
            absolute sm:relative bottom-4 left-4 right-4 sm:bottom-auto sm:left-auto sm:right-auto z-50 sm:z-auto
            flex-row w-auto h-[90px] sm:h-auto sm:w-auto
            ${isChatOpen ? "sm:w-[120px] lg:w-[150px]" : "sm:w-[160px] lg:w-[220px]"} 
            sm:flex-col gap-2 sm:gap-3 sm:pb-4 sm:pr-1`}>
            
            <div className="hidden sm:block text-[10px] font-bold text-slate-500 tracking-widest pl-1 uppercase py-1 shrink-0">
              Học viên ({studentTracks.length})
            </div>
            
            {studentTracks.map((track) => (
              <div key={`${track.participant.identity}-${track.source}`} className="w-[120px] sm:w-full h-full sm:h-auto aspect-video rounded-xl sm:rounded-[18px] overflow-hidden bg-slate-800 border-2 border-transparent shadow-lg relative shrink-0">
                <ParticipantTile trackRef={track} className="w-full h-full object-cover pointer-events-none" />
                <MicIndicator participant={track.participant} />
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Custom Control Bar for Student - Zoom/Google Meet Style */}
      <div className="shrink-0 bg-white px-3 sm:px-6 py-3 sm:py-5 flex items-center justify-between border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.02)] z-[60] font-sans">
        <div className="hidden md:flex flex-1 items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
           <span className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] pl-2">Lớp Học Trực Tuyến</span>
        </div>

        {/* Cụm nút điều khiển trung tâm */}
        <div className="flex flex-1 md:flex-none justify-center items-center gap-2 sm:gap-4">
           <div className="flex items-center gap-1.5 sm:gap-3 bg-slate-50 p-1 sm:p-1.5 rounded-full border border-slate-200">
             <TrackToggle source={Track.Source.Microphone} className="!w-9 !h-9 sm:!w-10 sm:!h-10 !rounded-full !bg-white hover:!bg-slate-100 !border !border-slate-200 !text-slate-600 !shadow-sm transition-all" />
             <TrackToggle source={Track.Source.Camera} className="!w-9 !h-9 sm:!w-10 sm:!h-10 !rounded-full !bg-white hover:!bg-slate-100 !border !border-slate-200 !text-slate-600 !shadow-sm transition-all" />
             <TrackToggle source={Track.Source.ScreenShare} className="!w-9 !h-9 sm:!w-10 sm:!h-10 hidden sm:!flex !rounded-full !bg-white hover:!bg-slate-100 !border !border-slate-200 !text-slate-600 !shadow-sm transition-all" />
             
             <button 
               onClick={onToggleChat}
               title="Thảo luận"
               className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all shadow-sm border ${isChatOpen ? "bg-blue-500 text-white border-blue-500" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"}`}
             >
               <MessageSquareText className="w-5 h-5" />
             </button>
           </div>
        </div>

        <div className="flex flex-1 items-center justify-end">
           <button onClick={() => setShowLeaveModal(true)} className="flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2 sm:px-6 sm:h-10 text-xs font-bold uppercase tracking-widest rounded-full shadow-md hover:bg-red-600 transition-all border-none outline-none">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Leave</span>
           </button>
        </div>
      </div>

      {/* Modal xác nhận rời phòng (Light Theme) */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-[999] bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Rời khỏi lớp học?</h3>
            <p className="text-slate-500 text-sm mb-6">Bạn có chắc chắn muốn rời khỏi lớp học trực tuyến này không?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowLeaveModal(false)} className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium transition-all text-sm outline-none border border-transparent hover:border-slate-200">Hủy</button>
              <button onClick={() => room.disconnect()} className="px-5 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-bold transition-all shadow-lg shadow-red-500/20 text-sm outline-none">
                Rời Lớp
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        /* GỠ BỎ TẤT CẢ VIỀN, BÓNG DO LIVEKIT TẠO RA NHƯNG GIỮ LẠI TRANSFORM CỦA CONTAINER */
        .lk-participant-tile, .lk-focus-indicator,
        [data-lk-speaking="true"], [data-lk-active-speaker="true"] {
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
          border-color: transparent !important;
        }

        /* CHỈ ĐẢO NGƯỢC THẺ VIDEO THỰC TẾ ĐỂ SỬA LỖI MIRROR CHỮ NGƯỢC */
        .lk-participant-tile video, video {
          transform: scaleX(-1) !important;
          -webkit-transform: scaleX(-1) !important;
        }

        /* Đảm bảo video bên trong cũng được bo tròn đúng */
        .lk-participant-tile video {
          border-radius: inherit !important;
          object-fit: cover !important;
        }

        /* Huy hiệu tên Glassmorphism (Light Theme) */
        .lk-participant-name {
          background: rgba(255, 255, 255, 0.75) !important;
          backdrop-filter: blur(12px) !important;
          -webkit-backdrop-filter: blur(12px) !important;
          border: 1px solid rgba(0, 0, 0, 0.05) !important;
          color: #0f172a !important;
          font-size: 11px !important;
          font-weight: 600 !important;
          letter-spacing: 0.02em !important;
          padding: 6px 14px !important;
          border-radius: 12px !important;
          bottom: 16px !important;
          left: 20px !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
        }

        html, body { overflow: hidden !important; }
        .lk-custom-sidebar::-webkit-scrollbar { width: 4px; }
        .lk-custom-sidebar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}
