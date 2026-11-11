// hooks/useAudio.ts
import { useState, useCallback, useRef, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Capacitor } from "@capacitor/core";
import { NativeAudio } from "@capacitor-community/native-audio";
import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics";
import { AUDIO_MAP } from "@/app/data/audioMap";

export function useAudio() {
  const { getToken } = useAuth();
  const [playingItem, setPlayingItem] = useState<string | null>(null);

  // Native Mobile refs
  const preloadedIds = useRef(new Set<string>());
  const currentAssetIdRef = useRef<string | null>(null);
  const playbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Desktop & Mobile Web refs
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const audioCacheRef = useRef<Map<string, string>>(new Map());

  // Monotonic request counter to prevent async race conditions on rapid taps
  const requestIdRef = useRef<number>(0);

  const safeGetToken = useCallback(async () => {
    if (typeof window !== "undefined" && window.location.hostname === "10.0.2.2") return null;
    try {
      return await Promise.race([
        getToken(),
        new Promise<null>((_, reject) => setTimeout(() => reject(new Error("Timeout")), 1500)),
      ]);
    } catch {
      return null;
    }
  }, [getToken]);

  const stopAudio = useCallback(() => {
    // Synchronously invalidate any in-flight operations
    requestIdRef.current += 1;

    // 1. Clear mobile playback timer
    if (playbackTimerRef.current) {
      clearTimeout(playbackTimerRef.current);
      playbackTimerRef.current = null;
    }

    // 2. Stop Native hardware audio if active
    if (Capacitor.isNativePlatform() && currentAssetIdRef.current) {
      const assetToStop = currentAssetIdRef.current;
      currentAssetIdRef.current = null;
      NativeAudio.stop({ assetId: assetToStop }).catch(() => {});
    }

    // 3. Abort any in-flight Web fetch request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // 4. Stop and reset any active HTML5 Audio instance
    if (currentAudioRef.current) {
      const audio = currentAudioRef.current;
      audio.onended = null;
      audio.onerror = null;
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch {}
      currentAudioRef.current = null;
    }

    setPlayingItem(null);
  }, []);

  // Clean up any active audio if the component using this hook unmounts
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  const playAudio = useCallback(
    async (text: string) => {
      // Synchronously interrupt any currently playing audio
      stopAudio();

      const currentReqId = ++requestIdRef.current;
      setPlayingItem(text);

      const cleanText = text.replace(/[’'`]/g, "").trim();

      // Look up local sound file in AUDIO_MAP (exact, with tsheg, or without tsheg)
      let fileName = AUDIO_MAP[cleanText];
      if (!fileName && AUDIO_MAP[cleanText + "་"]) {
        fileName = AUDIO_MAP[cleanText + "་"];
      }
      if (!fileName && cleanText.endsWith("་")) {
        fileName = AUDIO_MAP[cleanText.slice(0, -1)];
      }

      // ==========================================
      // 1. NATIVE APP (iOS / Android Capacitor)
      // ==========================================
      if (Capacitor.isNativePlatform()) {
        try {
          Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
        } catch {}

        if (fileName) {
          const assetId = encodeURIComponent(fileName.replace(".wav", "")).replace(
            /[^a-zA-Z0-9]/g,
            "_"
          );

          try {
            if (!preloadedIds.current.has(assetId)) {
              await NativeAudio.preload({
                assetId: assetId,
                assetPath: `public/sounds/${fileName}`,
              });
              preloadedIds.current.add(assetId);
            }

            if (currentReqId !== requestIdRef.current) return;

            currentAssetIdRef.current = assetId;
            await NativeAudio.play({ assetId });

            playbackTimerRef.current = setTimeout(() => {
              if (currentReqId === requestIdRef.current) {
                currentAssetIdRef.current = null;
                setPlayingItem(null);
              }
            }, 1500);
            return;
          } catch (err) {
            console.warn("Native audio failed, falling back to HTML5 Audio...", err);
          }
        }
      }

      // ==========================================
      // 2. WEB BROWSERS (MOBILE PHONE WEB & DESKTOP WEB)
      // Uses the EXACT same `new Audio(encodeURI(...))` pattern as the Hero phrases!
      // ==========================================
      if (fileName && typeof window !== "undefined") {
        try {
          const audio = new Audio(encodeURI(`/sounds/${fileName}`));
          currentAudioRef.current = audio;

          audio.onended = () => {
            if (currentReqId === requestIdRef.current) {
              currentAudioRef.current = null;
              setPlayingItem(null);
            }
          };

          audio.onerror = () => {
            if (currentReqId === requestIdRef.current) {
              currentAudioRef.current = null;
              setPlayingItem(null);
            }
          };

          await audio.play();
          return;
        } catch (localErr) {
          console.warn("Local /sounds/ playback failed, falling back to /api/tts...", localErr);
        }
      }

      // ==========================================
      // 3. FALLBACK: FastAPI /api/tts Fetch + Memory Cache
      // ==========================================
      const playBase64Audio = (base64String: string) => {
        if (currentReqId !== requestIdRef.current) return;

        const audio = new Audio(`data:audio/wav;base64,${base64String}`);
        currentAudioRef.current = audio;

        audio.onended = () => {
          if (currentReqId === requestIdRef.current) {
            currentAudioRef.current = null;
            setPlayingItem(null);
          }
        };

        audio.onerror = () => {
          if (currentReqId === requestIdRef.current) {
            currentAudioRef.current = null;
            setPlayingItem(null);
          }
        };

        audio.play().catch(() => {
          if (currentReqId === requestIdRef.current) {
            currentAudioRef.current = null;
            setPlayingItem(null);
          }
        });
      };

      const cachedBase64 = audioCacheRef.current.get(cleanText);
      if (cachedBase64) {
        playBase64Audio(cachedBase64);
        return;
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const token = await safeGetToken();
        if (currentReqId !== requestIdRef.current) return;

        const formData = new FormData();
        formData.append("text", cleanText);
        formData.append("language", "en");

        const headers: Record<string, string> = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tts`, {
          method: "POST",
          headers,
          body: formData,
          signal: controller.signal,
        });

        if (!res.ok) throw new Error("Audio fetch failed");

        const data = await res.json();
        if (currentReqId !== requestIdRef.current) return;

        if (data.audio_sequence && data.audio_sequence.length > 0) {
          const part = data.audio_sequence[0];
          if (part.audio_base64) {
            audioCacheRef.current.set(cleanText, part.audio_base64);
            playBase64Audio(part.audio_base64);
            return;
          }
        }
      } catch (e: any) {
        if (e?.name === "AbortError") return;
        console.warn("Audio playback aborted:", e);
      }

      if (currentReqId === requestIdRef.current) {
        setPlayingItem(null);
      }
    },
    [safeGetToken, stopAudio]
  );

  const playErrorBeep = useCallback(() => {
    if (Capacitor.isNativePlatform()) {
      try {
        Haptics.notification({ type: NotificationType.Error }).catch(() => {});
      } catch {}
    }

    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(300, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.15);
      gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.15);
    } catch (e) {
      console.error("Audio beep failed", e);
    }
  }, []);

  return { playAudio, stopAudio, playErrorBeep, playingItem };
}