// hooks/useTimeTracker.ts
"use client";

import { useEffect, useRef } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";

export function useTimeTracker() {
  const { getToken, isSignedIn } = useAuth();
  const { user } = useUser();
  const accumulatedSeconds = useRef(0);

  useEffect(() => {
    // Only track if signed in
    if (!isSignedIn || !user) return;

    const pingTime = async (minutes: number) => {
      try {
        const token = await getToken();
        if (!token) return;

        const formData = new FormData();
        formData.append("user_id", user.id);
        formData.append("minutes", minutes.toString());

        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/track-time`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
      } catch (e) {
        console.error("Failed to track time", e);
      }
    };

    const interval = setInterval(() => {
      accumulatedSeconds.current += 10;
      // Every 60 seconds of active dashboard time, ping the database
      if (accumulatedSeconds.current >= 60) {
        accumulatedSeconds.current = 0;
        pingTime(1);
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [isSignedIn, user, getToken]);
}