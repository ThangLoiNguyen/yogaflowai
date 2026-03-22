"use client";

import {
  LiveKitRoom,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Video, VideoOff, Mic, MicOff, LogIn, Wifi, ShieldCheck } from "lucide-react";

/* ────────────────────────────────────────────────────────── */
/*                      LIVE PREMIUM VIEW                     */
/* ────────────────────────────────────────────────────────── */

import { useTracks, ParticipantTile, ControlBar, RoomAudioRenderer } from "@livekit/components-react";
import { Track } from "livekit-client";

function LiveView({ token, camEnabled, micEnabled, onDisconnected }: {
  token: string;
  camEnabled: boolean;
  micEnabled: boolean;
  onDisconnected: () => void;
}) {
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
      <YogaTeacherLayout />
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
}

function YogaTeacherLayout() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  // Đối với giáo viên, chính họ (local participant) thường là người đầu tiên/chính
  const teacherTrack = tracks.find(t => t.participant.isLocal) || tracks[0];
  const studentTracks = tracks.filter(t => t !== teacherTrack);

  return (
    <div className="flex-1 flex flex-col h-full w-full bg-[#0a0a0f] font-sans">
      <div className="flex-1 flex flex-row p-3 lg:p-5 gap-4 lg:gap-6 overflow-hidden">
        
        {/* Vùng Giáo Viên (Chính) */}
        <div className="flex-1 relative rounded-[32px] overflow-hidden border border-emerald-500/20 bg-[#11111a] shadow-2xl flex items-center justify-center">
          {teacherTrack && <ParticipantTile trackRef={teacherTrack} className="w-full h-full object-cover" />}
          
          <div className="absolute top-5 left-5 z-10 bg-emerald-600/20 border border-emerald-500/50 text-emerald-400 px-3.5 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest backdrop-blur-xl">
             ĐANG PHÁT SÓNG
          </div>
        </div>

        {/* Sidebar Học viên */}
        <div className="w-[180px] lg:w-[240px] flex-shrink-0 flex flex-col gap-3 overflow-y-auto lk-custom-sidebar pb-4 pr-1">
          <div className="text-[10px] font-bold text-slate-500 tracking-widest pl-1 uppercase py-1">
            Học viên đang xem ({studentTracks.length})
          </div>
          
          {studentTracks.length === 0 && (
            <div className="text-slate-600 text-[10px] pl-1 py-8 border border-dashed border-white/5 rounded-3xl text-center italic">
              Chưa có học viên tham gia
            </div>
          )}
          
          {studentTracks.map((track) => (
            <div key={`${track.participant.identity}-${track.source}`} className="w-full aspect-video rounded-[20px] overflow-hidden bg-[#16161e] border border-white/5 relative shrink-0">
              <ParticipantTile trackRef={track} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

      </div>

      {/* Control Bar Tinh gọn */}
      <div className="shrink-0 border-t border-white/5 bg-[#0a0a0f] p-3 flex justify-center">
        <ControlBar variation="minimal" />
      </div>

      <style jsx global>{`
        /* Mirror CHỈ video cho người dùng local, không mirror text/tên */
        .lk-participant-tile[data-lk-local-participant="true"] video {
          transform: scaleX(-1);
        }
        .lk-button[title="Chat"], .lk-button[aria-label="Chat"],
        .lk-button[title="Participants"], .lk-button[aria-label="Participants"] {
          display: none !important;
        }
        .lk-participant-tile[data-lk-speaking="true"] {
          outline: 2px solid #10b981 !important;
          outline-offset: -2px;
        }
        .lk-participant-name {
          background: rgba(0, 0, 0, 0.7) !important;
          font-size: 10px !important;
          padding: 4px 10px !important;
          border-radius: 6px !important;
          backdrop-filter: blur(4px);
        }
        .lk-custom-sidebar::-webkit-scrollbar { width: 4px; }
        .lk-custom-sidebar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
      `}</style>
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
    />
  );
}
