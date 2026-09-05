import { useState, useCallback, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import { Capacitor } from "@capacitor/core";
import { NativeAudio } from "@capacitor-community/native-audio";
import { AUDIO_MAP } from "@/app/data/audioMap";

export function useAudio() {
  const { getToken } = useAuth();
  const [playingItem, setPlayingItem] = useState<string | null>(null);
  const preloadedIds = useRef(new Set<string>()); // Keep track of loaded files

  const safeGetToken = useCallback(async () => {
    if (typeof window !== 'undefined' && window.location.hostname === '10.0.2.2') return null;
    try {
      return await Promise.race([
        getToken(),
        new Promise<null>((_, reject) => setTimeout(() => reject(new Error("Timeout")), 1500))
      ]);
    } catch (err) { return null; }
  }, [getToken]);

  const playAudio = useCallback(async (text: string) => {
    if (playingItem) return;
    setPlayingItem(text);
    
    const cleanText = text.replace(/[’'`]/g, ""); 

    // ==========================================
    // MOBILE: ZERO-LATENCY HARDWARE AUDIO
    // ==========================================
    if (Capacitor.isNativePlatform()) {
      let fileName = AUDIO_MAP[cleanText];
      if (!fileName && AUDIO_MAP[cleanText + '་']) {
          fileName = AUDIO_MAP[cleanText + '་'];
      }

      if (fileName) {
        // Strip out weird characters to make a safe internal ID for the plugin
        const assetId = fileName.replace('.wav', '').replace(/[^a-zA-Z0-9]/g, '_');
        
        try {
          // Preload into hardware memory if we haven't already
          if (!preloadedIds.current.has(assetId)) {
            await NativeAudio.preload({
              assetId: assetId,
              assetPath: `public/sounds/${fileName}`, 
              isComplex: false,
            });
            preloadedIds.current.add(assetId);
          }
          
          // Play instantly
          await NativeAudio.play({ assetId });
          
          // Turn off the loading spinner after 1.5 seconds (avg length of your clips)
          setTimeout(() => setPlayingItem(null), 1500);
          return;
        } catch (err) {
          console.warn("Native audio failed, falling back to Web API...", err);
        }
      }
    }

    // ==========================================
    // DESKTOP / FALLBACK: FastAPI Base64 Fetch
    // ==========================================
    try {
      const token = await safeGetToken();
      const formData = new FormData();
      formData.append("text", cleanText);
      formData.append("language", "en"); 
      
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tts`, { method: "POST", headers, body: formData });
      if (!res.ok) throw new Error("Audio fetch failed");

      const data = await res.json();
      if (data.audio_sequence && data.audio_sequence.length > 0) {
        const part = data.audio_sequence[0];
        if (part.audio_base64) {
          const audio = new Audio(`data:audio/wav;base64,${part.audio_base64}`);
          audio.onended = () => setPlayingItem(null);
          audio.play().catch(() => setPlayingItem(null));
          return;
        }
      }
    } catch (e) { 
      console.warn("Audio playback aborted:", e); 
    }
    
    setPlayingItem(null);
  }, [safeGetToken, playingItem]);

  // ... playErrorBeep remains exactly the same
  const playErrorBeep = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(300, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.15);
      gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.15);
    } catch (e) { console.error("Audio beep failed", e); }
  }, []);

  return { playAudio, playErrorBeep, playingItem };
}