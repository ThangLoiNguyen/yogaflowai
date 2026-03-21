"use client";

import {
  LiveKitRoom,
  VideoConference,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  ControlBar,
  useTracks,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { useEffect, useState } from "react";
import { Track } from "livekit-client";

interface LiveRoomProps {
  room: string;
  username: string;
  mode: "embedded" | "scale";
}

export default function LiveRoom({ room, username, mode }: LiveRoomProps) {
  const [token, setToken] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch(`/api/livekit/token?room=${room}&username=${username}`);
        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [room, username]);

  if (token === "") {
    return (
      <div className="flex flex-col items-center justify-center p-20 bg-slate-900 rounded-3xl animate-pulse">
        <div className="text-white font-display text-xl">Đang kết nối vào lớp học...</div>
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
      style={{ height: mode === "scale" ? "80vh" : "500px", borderRadius: "24px", overflow: "hidden" }}
    >
      <VideoConference />
      <RoomAudioRenderer />
      <ControlBar />
    </LiveKitRoom>
  );
}
