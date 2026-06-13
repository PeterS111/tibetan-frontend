"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Square, Loader2, Send, User, Bot } from "lucide-react";

type Message = {
  role: "user" | "ai";
  content: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    
    // --- NEW: Attach the entire chat history before sending! ---
    formData.append("history", JSON.stringify(messages));

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

      setMessages((prev) => [...prev, { role: "ai", content: data.ai_text }]);

      if (data.audio_base64) {
        const audioUrl = `data:audio/mp3;base64,${data.audio_base64}`;
        const audio = new Audio(audioUrl);
        audio.play();
      }

    } catch (error) {
      console.error("Backend error:", error);
      setMessages((prev) => [...prev, { role: "ai", content: "⚠️ Error communicating with AI server." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col h-screen bg-zinc-900 text-white">
      <header className="p-4 bg-zinc-800 shadow-md text-center">
        <h1 className="text-2xl font-bold">🏔️ Tibetan Tutor</h1>
        <p className="text-xs text-zinc-400">Conversational AI Guide</p>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center text-zinc-500">
            <p>Type a message or press the microphone to start.</p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`flex items-start max-w-[80%] gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-indigo-600" : "bg-red-600"}`}>
                {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-3 rounded-2xl ${msg.role === "user" ? "bg-indigo-600 rounded-tr-none" : "bg-zinc-800 rounded-tl-none"}`}>
                <p className="whitespace-pre-wrap leading-relaxed text-sm">{msg.content}</p>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-zinc-400 p-4">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-zinc-800">
        <form onSubmit={handleSendText} className="flex items-center gap-2 max-w-4xl mx-auto">
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isLoading}
            className={`p-3 rounded-full transition-all flex-shrink-0 ${
              isRecording ? "bg-red-500 animate-pulse" : "bg-zinc-700 hover:bg-zinc-600"
            }`}
          >
            {isRecording ? <Square size={20} className="fill-white" /> : <Mic size={20} />}
          </button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading || isRecording}
            placeholder={isRecording ? "Listening..." : "Type in English or བོད་ཡིག..."}
            className="flex-1 bg-zinc-700 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading || isRecording}
            className="p-3 bg-indigo-600 rounded-full hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all flex-shrink-0"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </main>
  );
}