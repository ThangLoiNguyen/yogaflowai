"use client";

import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ConnectionState } from "livekit-client";

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
        <div className="text-white/60 font-mono text-sm">Đang kết nối vào lớp học...</div>
      </div>
    );
  }

  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      data-lk-theme="default"
      onDisconnected={handleDisconnected}
      style={{
        height: mode === "scale" ? "100%" : "500px",
        width: "100%",
      }}
    >
      <VideoConference />
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
}
