"use client";

import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
  PreJoin,
  LocalUserChoices,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface LiveRoomProps {
  room: string;
  username: string;
  mode: "embedded" | "scale";
  /** If provided, will redirect here when user leaves the room */
  onLeaveRedirect?: string;
}

export default function LiveRoom({ room, username, mode, onLeaveRedirect }: LiveRoomProps) {
  const [token, setToken] = useState("");
  const [tokenError, setTokenError] = useState("");
  const [preJoinChoices, setPreJoinChoices] = useState<LocalUserChoices | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch(`/api/livekit/token?room=${room}&username=${encodeURIComponent(username)}`);
        const data = await resp.json();
        if (data.error) throw new Error(data.error);
        setToken(data.token);
      } catch (e: any) {
        console.error("LiveKit token error:", e);
        setTokenError(e.message || "Không thể lấy token phòng học.");
      }
    })();
  }, [room, username]);

  const handleDisconnected = useCallback(() => {
    // When user clicks Leave or disconnects, redirect appropriately
    const target = onLeaveRedirect || "/teacher/classes";
    router.push(target);
  }, [onLeaveRedirect, router]);

  if (tokenError) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-900 gap-4">
        <div className="text-red-400 font-mono text-sm">⚠ Lỗi kết nối: {tokenError}</div>
        <button
          onClick={() => router.push("/teacher/classes")}
          className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm transition-colors"
        >
          Quay về quản lý lớp
        </button>
      </div>
    );
  }

  if (token === "") {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-900 gap-4">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <div className="text-white/60 font-mono text-sm">Đang kết nối vào máy chủ LiveKít...</div>
      </div>
    );
  }

  if (!preJoinChoices) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-black md:bg-[#111] overflow-hidden rounded-none md:rounded-[32px] w-full relative" data-lk-theme="default">
        <style dangerouslySetInnerHTML={{ __html: `
          .lk-prejoin .lk-username-container { display: none !important; }
        `}} />
        <PreJoin
          defaults={{
            username: username || "Guest",
            videoEnabled: true,
            audioEnabled: true,
          }}
          onSubmit={setPreJoinChoices}
          onValidate={(values) => {
            return true;
          }}
          onError={(err) => console.log('error while setting up prejoin', err)}
        />
      </div>
    );
  }

  return (
    <LiveKitRoom
      video={preJoinChoices.videoEnabled}
      audio={preJoinChoices.audioEnabled}
      connect={true}
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      data-lk-theme="default"
      onDisconnected={handleDisconnected}
      options={{
        videoCaptureDefaults: {
          deviceId: preJoinChoices.videoDeviceId ?? undefined,
        },
        audioCaptureDefaults: {
          deviceId: preJoinChoices.audioDeviceId ?? undefined,
        },
      }}
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column"
      }}
      className="video-container shadow-2xl overflow-hidden"
    >
      <VideoConference />
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
}
