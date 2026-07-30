import { useState, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";

export function useAudio() {
  const { getToken } = useAuth();
  const [playingItem, setPlayingItem] = useState<string | null>(null);

  const playAudio = useCallback(async (text: string) => {
    if (playingItem) return;
    setPlayingItem(text);
    
    try {
      const cleanText = text.replace(/[’'`]/g, ""); // Strip out transliteration marks
      const token = await getToken();
      const formData = new FormData();
      formData.append("text", cleanText);
      formData.append("language", "en"); 
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tts`, { 
        method: "POST", 
        headers: { Authorization: `Bearer ${token}` }, 
        body: formData 
      });
      
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
      console.error("Audio playback failed", e); 
    }
    
    setPlayingItem(null);
  }, [getToken, playingItem]);

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
    } catch (e) { 
      console.error("Audio beep failed", e); 
    }
  }, []);

  return { playAudio, playErrorBeep, playingItem };
}