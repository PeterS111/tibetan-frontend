"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Square, Loader2, Send } from "lucide-react";

type AudioPart = {
  lang: string;
  text: string;
  audio_base64: string;
};

type Message = {
  role: "user" | "ai";
  content: string;
  audioSequence?: AudioPart[];
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMessage = inputText.trim();
    setInputText("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    const formData = new FormData();
    formData.append("text", userMessage);
    await sendToBackend(formData);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        setMessages((prev) => [...prev, { role: "user", content: "🎙️ [Voice Audio Sent]" }]);
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });

        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.webm");

        stream.getTracks().forEach((track) => track.stop());
        await sendToBackend(formData);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Mic error:", error);
      alert("Microphone access denied.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendToBackend = async (formData: FormData) => {
    setIsLoading(true);
    const safeHistory = messages.map(m => ({ role: m.role, content: m.content }));
    formData.append("history", JSON.stringify(safeHistory));

    try {
      const response = await fetch("https://tibetan-backend.onrender.com/api/chat", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();

      if (formData.has("audio")) {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "user", content: data.user_text };
          return updated;
        });
      }

      setMessages((prev) => [
        ...prev,
        { 
          role: "ai", 
          content: data.ai_text, 
          audioSequence: data.audio_sequence 
        },
      ]);

      // --- CHRONOLOGICAL PLAYBACK LOOP ---
      if (data.audio_sequence && data.audio_sequence.length > 0) {
        setIsPlaying(true);
        let currentIndex = 0;

        const playNext = () => {
          if (currentIndex >= data.audio_sequence.length) {
            setIsPlaying(false);
            setIsLoading(false);
            return;
          }
          
          const part = data.audio_sequence[currentIndex];
          currentIndex++;
          
          if (part.audio_base64) {
            const audio = new Audio(`data:audio/mp3;base64,${part.audio_base64}`);
            audio.onended = playNext;
            audio.play();
          } else {
            playNext(); // Skip empty audio and move to next
          }
        };

        playNext(); // Start the sequence
      } else {
        setIsLoading(false);
      }

    } catch (error) {
      console.error("Backend error:", error);
      setMessages((prev) => [...prev, { role: "ai", content: "⚠️ Error communicating with AI server." }]);
      setIsLoading(false);
    }
  };

  const replayTibetanAudio = (base64Audio: string) => {
    if (!base64Audio) return;
    const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`);
    audio.play();
  };

  const renderAiContent = (msg: Message) => {
    const parts = msg.content.split(/([\u0F00-\u0FFF]+(?:[\s\u0F00-\u0FFF]*[\u0F00-\u0FFF]+)*)/g);

    return (
      <div className="flex flex-col gap-3 w-full">
        {parts.map((part, i) => {
          const trimmed = part.trim();
          if (!trimmed) return null;

          const isTibetan = /[\u0F00-\u0FFF]/.test(trimmed);

          if (isTibetan) {
            // Find the specific audio chunk for THIS exact line of Tibetan text
            const matchingAudio = msg.audioSequence?.find(a => a.lang === "tib" && a.text === trimmed)?.audio_base64;

            return (
              <div key={i} className="flex flex-row items-center gap-4 w-full mt-2 mb-2">
                <div className="p-4 sm:p-5 rounded-2xl bg-blue-50 border border-blue-200 shadow-sm rounded-tl-none w-fit">
                  <span className="text-2xl sm:text-3xl text-slate-800 leading-loose">{trimmed}</span>
                </div>
                
                {/* Specific Yogi Button for this line */}
                {matchingAudio && (