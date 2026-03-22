"use client";

import {
  LiveKitRoom,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { useMemo, useEffect, useRef, useState, useCallback, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Video, VideoOff, Mic, MicOff, LogIn, Wifi, ShieldCheck, MessageSquareText, X, Send, ArrowLeft, LogOut, Expand, StickyNote } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import EndSessionButton from "@/components/teacher/end-session-button";

import { useTracks, ParticipantTile, RoomAudioRenderer, TrackToggle, DisconnectButton, useRoomContext } from "@livekit/components-react";
import { Track } from "livekit-client";

function MicIndicator({ participant }: { participant: any }) {
  if (!participant.isSpeaking) return null;
  return (
    <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2 py-1.5 rounded-lg border border-white/5 transition-all animate-pulse">
      <Mic className="w-3 h-3 text-emerald-400" />
      <div className="flex gap-0.5 items-end h-2.5">
        <div className="w-0.5 bg-emerald-400 h-2 animate-bounce" style={{ animationDelay: "0ms" }} />
        <div className="w-0.5 bg-emerald-400 h-full animate-bounce" style={{ animationDelay: "150ms" }} />
        <div className="w-0.5 bg-emerald-400 h-3 animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*                       TEACHER NOTES                        */
/* ────────────────────────────────────────────────────────── */
function NotesPanel({ onClose }: { onClose: () => void }) {
  const [note, setNote] = useState("");
  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 shadow-2xl overflow-hidden z-[90]">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
        <h3 className="text-slate-900 font-semibold text-sm">Ghi chú cá nhân</h3>
        <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
           <X className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-1 p-4 bg-slate-50/50">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Nhập ghi chú về học viên, tiến độ lớp học..."
          className="w-full h-full bg-transparent resize-none outline-none text-slate-700 text-sm placeholder:text-slate-400 leading-relaxed"
        />
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
               
               return Array.from(allMsgsMap.values()).sort((a,b) => new Date(a.sent_at).valueOf() - new Date(b.sent_at).valueOf());
            }
            return prev;
         });
      }
    };
    
    loadMessages();

    // Polling an toàn 100% mỗi 2.5 giây - Khắc phục tình trạng Realtime bị tắt hoặc lỗi WebSocket
    const interval = setInterval(loadMessages, 2500);

    // Vẫn giữ realtime truyền thống làm phụ trợ (nếu có thì sẽ tức thời hơn Polling)
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
    
    // 1. Cập nhật giao diện ngay lập tức (Optimistic UI) - Không cần F5
    setMessages((p) => [...p, optimisticMsg]);
    scroll();

    // 2. Tiến hành Insert vào DB
    const { data, error } = await supabase.from("live_chat_messages").insert({
      session_id: sessionId,
      sender: username,
      content,
    }).select().single();

    if (data) {
        // Thay thế tempID bằng ID thật từ database
        setMessages((p) => p.map(m => m.id === tempId ? (data as ChatMsg) : m));
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-200 shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
        <h3 className="text-slate-900 font-semibold text-sm">Tin nhắn trong cuộc gọi</h3>
        <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
           <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 lk-custom-sidebar">
        {messages.map((m) => (
          <div key={m.id} className="flex flex-col gap-1">
            <div className="flex items-baseline gap-2">
              <span className="text-slate-900 text-[13px] font-bold">{m.sender === username ? "Bạn" : m.sender}</span>
              <span className="text-slate-400 text-[10px]">
                {new Date(m.sent_at).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            <p className="text-slate-700 text-sm leading-relaxed break-words">{m.content}</p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={send} className="p-4 bg-slate-50 border-t border-slate-100 shrink-0 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Gửi tin nhắn cho mọi người"
          className="flex-1 bg-white border border-slate-200 focus:border-emerald-500/50 rounded-full px-5 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all shadow-sm"
        />
        <button type="submit" disabled={!text.trim()} 
          className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 flex items-center justify-center text-white transition-all shadow-md">
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */

function LiveView({ token, camEnabled, micEnabled, onDisconnected, sessionId, sessionTitle, username }: {
  token: string;
  camEnabled: boolean;
  micEnabled: boolean;
  onDisconnected: () => void;
  sessionId: string;
  sessionTitle?: string;
  username: string;
}) {
  const [showChat, setShowChat] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  return (
    <LiveKitRoom
      video={camEnabled}
      audio={micEnabled}
      connect={true}
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      data-lk-theme="default"
      onDisconnected={onDisconnected}
      style={{ height: "100dvh", width: "100%", display: "flex", flexDirection: "column" }}
    >
      <div className="flex-1 flex overflow-hidden w-full relative">
        {/* Notes Sidebar */}
        {showNotes && (
          <div className="w-full md:w-[320px] lg:w-[360px] h-full flex-shrink-0 z-[100] absolute inset-0 md:relative md:inset-auto bg-white shadow-xl border-r border-slate-200 transition-all">
            <NotesPanel onClose={() => setShowNotes(false)} />
          </div>
        )}

        <div className="flex-1 flex flex-col h-full min-w-0">
          <YogaTeacherLayout 
            onToggleChat={() => setShowChat(!showChat)} isChatOpen={showChat} 
            onToggleNotes={() => setShowNotes(!showNotes)} isNotesOpen={showNotes}
            sessionId={sessionId}
            sessionTitle={sessionTitle}
            onLeave={onDisconnected}
          />
        </div>
        
        {/* Chat Sidebar similar to Google Meet */}
        {showChat && (
          <div className="w-full md:w-[320px] lg:w-[360px] h-full flex-shrink-0 z-[100] absolute inset-0 md:relative md:inset-auto bg-white shadow-xl border-l border-slate-200">
            <ChatPanel sessionId={sessionId} username={username} onClose={() => setShowChat(false)} />
          </div>
        )}
      </div>
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
}

function YogaTeacherLayout({ onToggleChat, isChatOpen, onToggleNotes, isNotesOpen, sessionId, sessionTitle, onLeave }: { 
  onToggleChat: () => void, 
  isChatOpen: boolean, 
  onToggleNotes: () => void, 
  isNotesOpen: boolean, 
  sessionId: string,
  sessionTitle?: string,
  onLeave: () => void
}) {
  const room = useRoomContext();
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [pinnedId, setPinnedId] = useState<string | null>(null);

  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  // Tìm ID mặc định của bản thân Giáo Viên
  const localTrack = tracks.find(t => t.participant.isLocal) || tracks[0];
  
  // Xác định màn hình chính (ưu tiên người được ghim, nếu không là Giáo viên)
  let mainTrack = localTrack;
  if (pinnedId) {
    const foundTrack = tracks.find(t => `${t.participant.identity}-${t.source}` === pinnedId);
    if (foundTrack) mainTrack = foundTrack;
  }

  // Danh sách ở sidebar (loại trừ màn hình chính đang chiếu)
  const sidebarTracks = tracks.filter(t => t !== mainTrack);

  return (
    <div className="flex-1 flex flex-col h-full w-full bg-slate-50 font-sans">
      <div className="flex-1 flex flex-col sm:flex-row p-2 sm:p-4 gap-2 sm:gap-4 overflow-hidden relative">
        
        {/* Vùng Video Chính (Main Screen) */}
        <div className="flex-1 relative rounded-[28px] overflow-hidden bg-slate-100 shadow-lg flex items-center justify-center border border-slate-200/50">
          {mainTrack ? (
            <>
              <ParticipantTile trackRef={mainTrack} className="w-full h-full object-cover" />
              <MicIndicator participant={mainTrack.participant} />
            </>
          ) : (
            <div className="text-slate-400 font-medium text-sm italic">Video trống...</div>
          )}
          
          <div className="absolute top-4 left-4 z-10 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest shadow-sm border border-emerald-200">
             {mainTrack?.participant.isLocal ? "ĐANG DẠY LIVE" : "ĐANG GHIM HỌC VIÊN"}
          </div>
        </div>

        {/* Sidebar Học viên & Các khung khác (Overlay Absolute trên Mobile) */}
        {sidebarTracks.length > 0 && (
          <div className={`flex sm:flex-shrink-0 overflow-auto lk-custom-sidebar transition-all duration-300
            absolute sm:relative bottom-4 left-4 right-4 sm:bottom-auto sm:left-auto sm:right-auto z-50 sm:z-auto
            flex-row w-auto h-[90px] sm:h-auto sm:w-auto
            ${isChatOpen ? "sm:w-[120px] lg:w-[150px]" : "sm:w-[160px] lg:w-[220px]"} 
            sm:flex-col gap-2 sm:gap-3 sm:pb-4 sm:pr-1`}>
            
            <div className="hidden sm:block text-[10px] font-bold text-slate-500 tracking-widest pl-1 uppercase py-1 shrink-0">
              Danh sách ({sidebarTracks.length})
            </div>
            
            {sidebarTracks.map((track) => {
              const trackId = `${track.participant.identity}-${track.source}`;
              return (
                <div 
                  key={trackId} 
                  onClick={() => setPinnedId(trackId)}
                  className="w-[120px] sm:w-full h-full sm:h-auto aspect-video rounded-xl sm:rounded-[18px] overflow-hidden bg-slate-200 border border-slate-200/60 shadow-lg relative shrink-0 cursor-pointer group hover:border-emerald-500 transition-all duration-300"
                >
                  {/* Sử dụng pointer-events-none để không bị chồng chéo sự kiện click với nội bộ LiveKit */}
                  <div className="w-full h-full pointer-events-none">
                    <ParticipantTile trackRef={track} className="w-full h-full object-cover" />
                    <MicIndicator participant={track.participant} />
                  </div>

                  {/* Overlay khi Hover để thông báo Ghim bằng Icon */}
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center pointer-events-none transition-all duration-300 backdrop-blur-[2px]">
                    <div className="bg-emerald-500 text-white p-2.5 rounded-full shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
                      <Expand className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Google Meet style Custom control bar (Light theme) */}
      <div className="shrink-0 bg-white px-3 sm:px-6 py-3 sm:py-5 flex items-center justify-between border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.02)] z-[60]">
        <div className="hidden md:flex flex-1 items-center gap-2">
           <button onClick={() => window.location.href = "/teacher/classes"} className="text-slate-500 hover:text-slate-900 transition flex items-center gap-1 text-xs font-semibold px-2 py-1.5 rounded-lg hover:bg-slate-100">
             <ArrowLeft className="w-4 h-4" /> Quay lại quản lý
           </button>
           <div className="w-[1px] h-4 bg-slate-200 mx-2"></div>
           <span className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] truncate max-w-[200px]">{sessionTitle || "YogAI Phòng Live"}</span>
           <div className="flex items-center gap-1.5 ml-1 px-2 py-1 rounded-full bg-red-50 border border-red-100 text-red-600 text-[9px] font-bold uppercase tracking-wider animate-[pulse_2s_ease-in-out_infinite]">
             <span className="w-1.5 h-1.5 rounded-full bg-red-600" /> Live
           </div>
        </div>

        {/* Cụm nút điều khiển trung tâm kiểu Google Meet */}
        <div className="flex flex-1 md:flex-none justify-center items-center gap-2 sm:gap-4">
           {/* Mic & Cam & ScreenShare using circular style */}
           <div className="flex items-center gap-1.5 sm:gap-3 bg-slate-50 p-1 sm:p-1.5 rounded-full border border-slate-200">
             <TrackToggle source={Track.Source.Microphone} className="!w-9 !h-9 sm:!w-10 sm:!h-10 !rounded-full !bg-white hover:!bg-slate-100 !border !border-slate-200 !text-slate-600 !shadow-sm transition-all" />
             <TrackToggle source={Track.Source.Camera} className="!w-9 !h-9 sm:!w-10 sm:!h-10 !rounded-full !bg-white hover:!bg-slate-100 !border !border-slate-200 !text-slate-600 !shadow-sm transition-all" />
             <TrackToggle source={Track.Source.ScreenShare} className="!w-9 !h-9 sm:!w-10 sm:!h-10 flex sm:!flex !rounded-full !bg-white hover:!bg-slate-100 !border !border-slate-200 !text-slate-600 !shadow-sm transition-all" />
             
             <div className="w-[1px] h-5 bg-slate-200 mx-1"></div>

             <button 
               onClick={onToggleNotes}
               title="Ghi chú"
               className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all shadow-sm border ${isNotesOpen ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"}`}
             >
               <StickyNote className="w-4 h-4 sm:w-5 sm:h-5" />
             </button>

             <button 
               onClick={onToggleChat}
               title="Thảo luận"
               className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all shadow-sm border ${isChatOpen ? "bg-emerald-500 text-white border-emerald-500" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"}`}
             >
               <MessageSquareText className="w-4 h-4 sm:w-5 sm:h-5" />
             </button>
           </div>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2">
           {/* Mobile Back / Info Indicator */}
           <div className="flex md:hidden items-center gap-2 absolute top-4 left-4 z-[60]">
             <button onClick={() => window.location.href = "/teacher/classes"} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur shadow-sm border border-slate-200 text-slate-700">
               <ArrowLeft className="w-5 h-5" />
             </button>
             <div className="bg-red-500 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-[10px] font-bold uppercase tracking-wider shadow-lg animate-pulse">
               <span className="w-1.5 h-1.5 rounded-full bg-white" /> Live
             </div>
           </div>

           <EndSessionButton sessionId={sessionId} variant="stream" />
        </div>
      </div>

      {/* Modal xác nhận rời phòng (Light Theme) */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-[999] bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Rời khỏi lớp học?</h3>
            <p className="text-slate-500 text-sm mb-6">Bạn có chắc chắn muốn kết thúc và rời khỏi lớp học trực tuyến này không?</p>
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
        /* TỔNG LỰC VÔ HIỆU HÓA: Mirror, Viền, Bóng và Focus của LiveKit */
        .lk-video-container, .lk-video-container *,
        .lk-participant-tile, .lk-participant-tile *,
        .lk-focus-indicator, .lk-focus-indicator *,
        [data-lk-speaking="true"], [data-lk-active-speaker="true"],
        .lk-participant-tile::before, .lk-participant-tile::after,
        .lk-participant-tile *::before, .lk-participant-tile *::after {
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
          transform: none !important;
          border-color: transparent !important;
          background-image: none !important; /* Đề phòng viền tạo bằng gradient */
        }
        
        /* GỠ BỎ TẤT CẢ VIỀN, BÓNG DO LIVEKIT TẠO RA NHƯNG GIỮ LẠI TRANSFORM CỦA CONTAINER */
        .lk-participant-tile, .lk-focus-indicator,
        [data-lk-speaking="true"], [data-lk-active-speaker="true"] {
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
          border-color: transparent !important;
        }
        
        /* CHỈ ĐẢO NGƯỢC THẺ VIDEO THỰC TẾ (Sửa lỗi mirror cho text) */
        .lk-participant-tile video, video {
          transform: scaleX(-1) !important;
          -webkit-transform: scaleX(-1) !important;
        }

        /* Đảm bảo khung hình luôn đầy đủ và bo tròn */
        .lk-participant-tile video {
          border-radius: inherit !important;
          object-fit: cover !important;
        }
        
        /* Thiết kế huy hiệu tên sang trọng (Đã đẩy sang phải 20px) cho Light Theme */
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

        .lk-custom-sidebar::-webkit-scrollbar { width: 4px; height: 4px; }
        .lk-custom-sidebar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}


/* ────────────────────────────────────────────────────────── */
/* Main TeacherLiveRoom component                              */
/* ────────────────────────────────────────────────────────── */
type Stage = "loading" | "error" | "lobby" | "live";

export default function TeacherLiveRoom({ room, username, sessionId, sessionTitle }: {
  room: string;
  username: string;
  sessionId: string;
  sessionTitle?: string;
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
      <div className="flex flex-col items-center justify-center w-full h-full bg-slate-50 gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20" />
          <div className="absolute inset-0 rounded-full border-2 border-t-emerald-500 border-r-emerald-500 border-transparent animate-spin" />
        </div>
        <p className="text-slate-500 text-sm font-medium">Đang kết nối...</p>
      </div>
    );
  }

  if (stage === "error") {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-slate-50 gap-4 p-6">
        <Wifi className="w-8 h-8 text-red-500" />
        <p className="text-red-600 font-bold">Lỗi kết nối</p>
        <p className="text-slate-500 text-xs text-center">{tokenError}</p>
        <button onClick={() => router.push("/teacher/classes")} className="px-5 py-2 mt-2 bg-white border border-slate-200 shadow-sm hover:bg-slate-50 text-slate-700 font-medium rounded-xl text-sm transition-colors">Quay về</button>
      </div>
    );
  }

  if (stage === "lobby") {
    return (
      <div className="fixed inset-0 z-[200] bg-slate-50 flex flex-col">
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

        <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-12 px-5 md:px-8 pb-6 overflow-y-auto">
          {/* Camera preview */}
          <div className="flex flex-col items-center gap-4 w-full max-w-md">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xl">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              {!camEnabled && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 gap-3">
                  <VideoOff className="w-8 h-8 text-slate-300" />
                  <span className="text-slate-500 text-sm font-medium">Camera đang tắt</span>
                </div>
              )}
              <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/80 backdrop-blur rounded-full flex items-center gap-1.5 shadow-sm border border-slate-100">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-slate-700 text-[10px] font-bold uppercase">Preview</span>
              </div>
              <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-white/80 backdrop-blur px-3 py-1.5 rounded-full shadow-sm border border-slate-100">
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-[10px] font-bold shrink-0">
                  {username.charAt(0).toUpperCase()}
                </div>
                <span className="text-slate-800 text-xs font-bold">{username}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={toggleCam} className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${camEnabled ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm" : "bg-red-50 hover:bg-red-100 border-red-200 text-red-600"}`}>
                {camEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                <span className="hidden sm:inline">{camEnabled ? "Camera bật" : "Camera tắt"}</span>
              </button>
              <button onClick={toggleMic} className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${micEnabled ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm" : "bg-red-50 hover:bg-red-100 border-red-200 text-red-600"}`}>
                {micEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                <span className="hidden sm:inline">{micEnabled ? "Micro bật" : "Micro tắt"}</span>
              </button>
            </div>
          </div>

          {/* Right: info + join */}
          <div className="flex flex-col items-center lg:items-start gap-5 w-full max-w-xs">
            <div className="text-center lg:text-left">
              <h2 className="text-slate-900 text-2xl md:text-3xl font-black leading-tight mb-2">Sẵn sàng<br className="hidden lg:block" /> bắt đầu?</h2>
              <p className="text-slate-500 text-sm font-medium">Kiểm tra camera và micro của bạn trước khi phát sóng.</p>
            </div>

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
                  <span className="text-slate-700 text-sm font-medium flex-1">{label}</span>
                  <span className={`text-xs font-bold ${ok ? "text-emerald-600" : "text-red-500"}`}>{ok ? "Sẵn sàng" : "Đang tắt"}</span>
                </div>
              ))}
            </div>

            <button onClick={joinRoom} className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white font-bold text-base transition-all shadow-lg shadow-emerald-500/20">
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
      sessionTitle={sessionTitle}
      username={username}
    />
  );
}
