"use client";

import { useState, useRef } from "react";
import { Mic, Square, Loader2 } from "lucide-react";

export default function Home() {
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("Press the microphone to speak");
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsLoading(true);
        setStatus("Thinking...");
        
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        await sendAudioToBackend(audioBlob);
        
        // Turn off microphone completely
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setStatus("Listening... Tap square to stop.");
    } catch (error) {
      console.error("Mic error:", error);
      setStatus("Microphone access denied.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendAudioToBackend = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");

    try {
      // Sending audio to your LIVE Render Backend!
      const response = await fetch("https://tibetan-backend.onrender.com/api/chat", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Network response was not ok");

      // Play the AI response
      const aiAudioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(aiAudioBlob);
      const audio = new Audio(audioUrl);
      
      setStatus("Speaking...");
      audio.play();

      audio.onended = () => {
        setStatus("Press the microphone to speak");
        setIsLoading(false);
      };

    } catch (error) {
      console.error("Backend error:", error);
      setStatus("Error communicating with AI server.");
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-900 text-white p-4">
      <div className="absolute top-10 text-center">
        <h1 className="text-4xl font-bold mb-2">🏔️ Tibetan Tutor</h1>
        <p className="text-zinc-400">Conversational AI Language Guide</p>
      </div>

      {/* The Main UI Circle Button */}
      <div className="relative flex flex-col items-center justify-center">
        {/* Pulsing ring animation when recording */}
        {isRecording && (
          <div className="absolute w-48 h-48 bg-red-500/30 rounded-full animate-ping pointer-events-none" />
        )}

        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isLoading}
          className={`relative flex items-center justify-center w-32 h-32 rounded-full transition-all duration-300 shadow-2xl z-10 
            ${isLoading ? "bg-zinc-700 cursor-not-allowed" : 
              isRecording ? "bg-red-500 hover:bg-red-600 scale-110" : 
              "bg-indigo-600 hover:bg-indigo-500 hover:scale-105"}`}
        >
          {isLoading ? (
            <Loader2 className="w-12 h-12 animate-spin text-zinc-300" />
          ) : isRecording ? (
            <Square className="w-12 h-12 text-white fill-white" />
          ) : (
            <Mic className="w-14 h-14 text-white" />
          )}
        </button>

        <p className="mt-8 text-xl font-medium text-zinc-300 animate-pulse">
          {status}
        </p>
      </div>
    </main>
  );
}