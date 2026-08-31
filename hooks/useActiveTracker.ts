// hooks/useActiveTracker.ts
"use client";

import { useEffect, useRef } from "react";
import { useUser, useAuth } from "@clerk/nextjs";

export function useActiveTracker() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  
  const isActiveRef = useRef(false);
  const lastTrackedRef = useRef(Date.now());

  useEffect(() => {
    if (!isLoaded || !user) return;

    // 1. Mark user as active if they move mouse, click, or type
    const markActive = () => {
      isActiveRef.current = true;
    };

    window.addEventListener("mousemove", markActive);
    window.addEventListener("keydown", markActive);
    window.addEventListener("click", markActive);
    window.addEventListener("scroll", markActive);

    // 2. Every 60 seconds, check if they were active
    const interval = setInterval(async () => {
      if (isActiveRef.current) {
        try {
          const token = await getToken();
          if (token) {
            const formData = new FormData();
            formData.append("user_id", user.id);
            formData.append("minutes", "1"); // Add 1 minute of active time

            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/track-time`, {
              method: "POST",
              headers: { Authorization: `Bearer ${token}` },
              body: formData,
            });
          }
        } catch (e) {
          console.error("Failed to track time", e);
        }
        
        // Reset activity flag for the next minute
        isActiveRef.current = false;
        lastTrackedRef.current = Date.now();
      }
    }, 60000); // 60,000 ms = 1 minute

    return () => {
      window.removeEventListener("mousemove", markActive);
      window.removeEventListener("keydown", markActive);
      window.removeEventListener("click", markActive);
      window.removeEventListener("scroll", markActive);
      clearInterval(interval);
    };
  }, [user, isLoaded, getToken]);
}