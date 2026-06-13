"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Square, Loader2, Send, Sparkles } from "lucide-react";

type Message = {
  role: "user" | "ai";
  content: string;
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
        
        audio.onplay = () => setIsPlaying(true);
        audio.onended = () => {
          setIsPlaying(false);
          setIsLoading(false);
        };
        
        audio.play();
      } else {
        setIsLoading(false);
      }

    } catch (error) {
      console.error("Backend error:", error);
      setMessages((prev) => [...prev, { role: "ai", content: "⚠️ Error communicating with AI server." }]);
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col h-screen bg-gradient-to-b from-[#FFFDF7] to-[#FDF5E6] text-slate-800 font-sans selection:bg-amber-200">
      
      <header className="relative flex items-center justify-center p-6 bg-white/60 backdrop-blur-md border-b-2 border-amber-200 shadow-[0_4px_20px_-5px_rgba(218,165,32,0.15)] z-10">
        <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-300"></div>
        <div className="text-center flex flex-col items-center">
          <h1 className="text-3xl font-serif font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent flex items-center gap-2">
            <Sparkles className="text-amber-500 w-6 h-6" />
            Tibetan Tutor
            <Sparkles className="text-amber-500 w-6 h-6" />
          </h1>
          <p className="text-sm font-medium text-amber-700/70 uppercase tracking-widest mt-1">Divine Language Guide</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 scroll-smooth">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-amber-700/50 space-y-4">
            <div className="w-24 h-24 rounded-full border-4 border-amber-100 p-1 opacity-50">
              {/* UPDATED TO .PNG */}
              <img src="/dakini.png" alt="Dakini" className="w-full h-full object-cover rounded-full" />
            </div>
            <p className="text-lg font-serif text-center max-w-md">
              Welcome to the sanctuary of learning. <br/> Type a message or press the golden microphone to begin.
            </p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`flex items-end max-w-[85%] sm:max-w-[70%] gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              
              {msg.role === "ai" ? (
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0 shadow-lg shadow-amber-200/50 border-2 border-white relative">
                  {/* UPDATED TO .PNG */}
                  <img src="/dakini.png" alt="Teacher" className="w-full h-full object-cover rounded-full" />
                </div>
              ) : (
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0 bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-white shadow-sm flex items-center justify-center">
                  <span className="text-amber-700 font-serif font-bold text-lg">U</span>
                </div>
              )}

              <div 
                className={`p-4 sm:p-5 rounded-3xl shadow-sm text-base sm:text-lg leading-relaxed ${
                  msg.role === "user" 
                    ? "bg-gradient-to-br from-white to-amber-50 border border-amber-100 text-amber-900 rounded-br-none" 
                    : "bg-white border-2 border-amber-100/50 shadow-[0_4px_15px_-3px_rgba(218,165,32,0.1)] text-slate-700 rounded-bl-none"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>

            </div>
          </div>
        ))}

        <div className="flex flex-col gap-4">
          {isLoading && !isPlaying && (
            <div className="flex items-center gap-3 text-amber-600 p-2 ml-14">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-medium tracking-wide">The Dakini is thinking...</span>
            </div>
          )}

          {isPlaying && (
            <div className="flex items-center gap-4 p-2 ml-14 animate-pulse">
              <div className="w-12 h-12 rounded-full border-2 border-amber-400 shadow-[0_0_15px_rgba(218,165,32,0.6)] p-0.5 relative overflow-hidden bg-white">
                {/* UPDATED TO .PNG */}
                <img src="/yogi.png" alt="Yogi Speaking" className="w-full h-full object-cover rounded-full scale-110" />
              </div>
              <span className="text-sm font-medium text-amber-700 italic">Yogi TTS is speaking...</span>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 sm:p-6 bg-white/80 backdrop-blur-xl border-t border-amber-100 shadow-[0_-10px_30px_-15px_rgba(218,165,32,0.2)]">
        <form onSubmit={handleSendText} className="flex items-center gap-3 max-w-4xl mx-auto relative">
          
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isLoading || isPlaying}
            className={`p-4 rounded-full transition-all duration-300 flex-shrink-0 shadow-lg relative ${
              isRecording 
                ? "bg-red-500 hover:bg-red-600 scale-110 shadow-red-500/40" 
                : "bg-gradient-to-br from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 shadow-amber-500/30 hover:shadow-amber-500/50"
            } disabled:opacity-50 disabled:scale-100`}
          >
            {isRecording && <span className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping opacity-50"></span>}
            {isRecording ? <Square size={22} className="fill-white text-white" /> : <Mic size={22} className="text-white" />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading || isRecording || isPlaying}
            placeholder={isRecording ? "Listening to your voice..." : "Type in English or བོད་ཡིག..."}
            className="flex-1 bg-white border-2 border-amber-100 rounded-full px-6 py-4 text-slate-700 placeholder-amber-700/40 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 shadow-inner transition-all disabled:opacity-60 text-lg"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading || isRecording || isPlaying}
            className="p-4 bg-white border-2 border-amber-200 text-amber-600 rounded-full hover:bg-amber-50 hover:text-amber-700 hover:border-amber-400 disabled:opacity-50 transition-all flex-shrink-0 shadow-sm"
          >
            <Send size={22} />
          </button>
        </form>
      </div>
    </main>
  );
}