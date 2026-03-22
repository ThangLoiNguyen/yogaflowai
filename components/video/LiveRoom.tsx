"use client";

import { LiveKitRoom, VideoConference, RoomAudioRenderer } from "@livekit/components-react";
import "@livekit/components-styles";
import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Video, VideoOff, Mic, MicOff, LogIn, Wifi, ShieldCheck } from "lucide-react";

interface LiveRoomProps {
  room: string;
  username: string;
  mode: "embedded" | "scale";
  onLeaveRedirect?: string;
  sessionId?: string;
}

type Stage = "loading" | "error" | "lobby" | "live";

export default function LiveRoom({ room, username, mode, onLeaveRedirect }: LiveRoomProps) {
  const [stage, setStage] = useState<Stage>("loading");
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
      <div className="flex flex-col items-center justify-center w-full h-full bg-[#0d0d1a] gap-5">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20" />
          <div className="absolute inset-0 rounded-full border-2 border-t-emerald-500 border-r-emerald-500 border-b-transparent border-l-transparent animate-spin" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="text-white font-medium text-sm">Đang kết nối phòng học</div>
          <div className="text-white/30 text-xs">Vui lòng chờ...</div>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (stage === "error") {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-[#0d0d1a] gap-5 p-6">
        <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center">
          <Wifi className="w-6 h-6 text-red-400" />
        </div>
        <div className="text-center">
          <div className="text-red-400 font-semibold mb-1">Lỗi kết nối</div>
          <div className="text-white/40 text-xs max-w-[240px]">{tokenError}</div>
        </div>
        <button
          onClick={() => router.push("/teacher/classes")}
          className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-sm font-medium transition-all"
        >
          Quay về
        </button>
      </div>
    );
  }

  /* ── Lobby ── */
  if (stage === "lobby") {
    return (
      <div className="fixed inset-0 z-[200] bg-[#0d0d1a] flex flex-col">
        {/* Top bar */}
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

        {/* Main content: two-col on desktop, one-col on mobile */}
        <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-12 px-5 md:px-8 pb-6 overflow-y-auto">

          {/* Camera preview */}
          <div className="flex flex-col items-center gap-4 w-full max-w-md">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-900/80 border border-white/10 shadow-2xl shadow-black/60 ring-1 ring-white/5">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
              {!camEnabled && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/95 gap-3">
                  <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center">
                    <VideoOff className="w-6 h-6 text-white/30" />
                  </div>
                  <span className="text-white/40 text-sm">Camera đang tắt</span>
                </div>
              )}
              {/* Status chips */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur px-2.5 py-1 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-white text-[10px] font-bold uppercase tracking-wider">Preview</span>
                </div>
                <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur px-2.5 py-1 rounded-full">
                  {micEnabled
                    ? <Mic className="w-3 h-3 text-emerald-400" />
                    : <MicOff className="w-3 h-3 text-red-400" />}
                  <span className="text-white/60 text-[10px]">{micEnabled ? "Mic bật" : "Mic tắt"}</span>
                </div>
              </div>
              {/* Name badge */}
              <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/60 backdrop-blur px-3 py-1.5 rounded-full">
                <div className="w-5 h-5 rounded-full bg-emerald-500/30 flex items-center justify-center text-emerald-300 text-[9px] font-black shrink-0">
                  {username.charAt(0).toUpperCase()}
                </div>
                <span className="text-white text-xs font-medium truncate max-w-[120px]">{username}</span>
              </div>
            </div>

            {/* Cam / Mic toggles */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleCam}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium border transition-all active:scale-95 ${
                  camEnabled
                    ? "bg-white/10 border-white/15 text-white hover:bg-white/15"
                    : "bg-red-500/15 border-red-500/30 text-red-400 hover:bg-red-500/25"
                }`}
              >
                {camEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                <span className="hidden sm:inline">{camEnabled ? "Camera bật" : "Camera tắt"}</span>
              </button>
              <button
                onClick={toggleMic}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium border transition-all active:scale-95 ${
                  micEnabled
                    ? "bg-white/10 border-white/15 text-white hover:bg-white/15"
                    : "bg-red-500/15 border-red-500/30 text-red-400 hover:bg-red-500/25"
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
              <h2 className="text-white text-2xl md:text-3xl font-bold leading-tight mb-2">
                Sẵn sàng<br className="hidden lg:block" /> tham gia?
              </h2>
              <p className="text-white/40 text-sm">Kiểm tra camera và micro trước khi vào lớp học.</p>
            </div>

            {/* Checklist */}
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
                  <span className={`text-xs font-semibold ${ok ? "text-emerald-400" : "text-red-400"}`}>
                    {ok ? "Sẵn sàng" : "Đang tắt"}
                  </span>
                </div>
              ))}
            </div>

            {/* Join */}
            <button
              onClick={joinRoom}
              className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold text-base transition-all shadow-xl shadow-emerald-900/40"
            >
              <LogIn className="w-5 h-5" />
              Tham gia lớp học
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
      <YogaLiveLayout />
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
}

import { useTracks, ParticipantTile, ControlBar } from "@livekit/components-react";
import { Track } from "livekit-client";

function YogaLiveLayout() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  // Người đầu tiên tham gia (giáo viên) sẽ được focus, các tracks khác là học sinh
  // Trong thực tế, bạn có thể thêm logic kiểm tra metadata hoặc role nếu cần
  const teacherTrack = tracks[0];
  const studentTracks = tracks.slice(1);

  return (
    <div className="flex-1 flex flex-col h-full w-full bg-[#09090b] font-sans">
      <div className="flex-1 flex flex-row p-3 lg:p-5 gap-4 lg:gap-6 overflow-hidden">
        
        {/* Vùng Giáo Viên (Bên Trái - Lớn) */}
        <div className="flex-1 relative rounded-3xl overflow-hidden border-2 border-blue-500/20 bg-[#111827] shadow-2xl flex items-center justify-center">
          {teacherTrack ? (
            <ParticipantTile trackRef={teacherTrack} className="w-full h-full object-cover" />
          ) : (
            <div className="text-white/30 text-sm italic">Đang chờ tín hiệu...</div>
          )}
          
          <div className="absolute top-4 left-4 z-10 bg-blue-600/20 border border-blue-500/50 text-blue-400 px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
            Lớp học Live
          </div>
        </div>

        {/* Vùng Học Sinh (Bên Phải - Sidebar) */}
        <div className="w-[180px] lg:w-[240px] flex-shrink-0 flex flex-col gap-3 overflow-y-auto lk-custom-sidebar pb-4 pr-1">
          <div className="text-[10px] font-bold text-gray-500 tracking-widest pl-1 uppercase">
            Học viên ({studentTracks.length})
          </div>
          
          {studentTracks.length === 0 && (
            <div className="text-white/20 text-[10px] pl-1 py-4 border border-dashed border-white/5 rounded-2xl text-center">
              Chưa có học viên khác
            </div>
          )}
          
          {studentTracks.map((track) => (
            <div key={`${track.participant.identity}-${track.source}`} className="w-full aspect-video rounded-2xl overflow-hidden bg-[#18181b] border border-white/5 relative shrink-0">
              <ParticipantTile trackRef={track} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

      </div>

      {/* Điều khiển tập trung ở giữa */}
      <div className="shrink-0 border-t border-white/5 bg-[#0d0d12] p-2 flex justify-center">
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
          outline: 2px solid #22c55e !important;
          outline-offset: -2px;
        }
        .lk-participant-name {
          background: rgba(0, 0, 0, 0.6) !important;
          font-size: 10px !important;
          padding: 3px 8px !important;
          border-radius: 4px !important;
        }
        html, body { overflow: hidden !important; }
        .lk-custom-sidebar::-webkit-scrollbar { width: 4px; }
        .lk-custom-sidebar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}
