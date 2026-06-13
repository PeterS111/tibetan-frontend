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
            playNext(); 
          }
        };

        playNext(); 
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
            const matchingAudio = msg.audioSequence?.find(a => a.lang === "tib" && a.text === trimmed)?.audio_base64;

            return (
              <div key={i} className="flex flex-row items-center gap-4 w-full mt-2 mb-2">
                <div className="p-4 sm:p-5 rounded-2xl bg-blue-50 border border-blue-200 shadow-sm rounded-tl-none w-fit">
                  <span className="text-2xl sm:text-3xl text-slate-800 leading-loose">{trimmed}</span>
                </div>
                
                {matchingAudio && (
                  <button 
                    onClick={() => replayTibetanAudio(matchingAudio)}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-slate-300 hover:border-blue-500 hover:shadow-lg transition-all flex-shrink-0 bg-white shadow-sm"
                    title="Play Tibetan Audio"
                  >
                    <img src="/yogi.png" alt="Yogi Replay" className="w-full h-full object-cover" />
                  </button>
                )}
              </div>
            );
          } else {
            return (
              <div key={i} className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 text-slate-700 shadow-sm rounded-tl-none w-fit max-w-[85%]">
                <p className="whitespace-pre-wrap">{trimmed}</p>
              </div>
            );
          }
        })}
      </div>
    );
  };

  return (
    <main className="fixed inset-0 flex flex-col bg-slate-50 text-slate-800 font-sans">
      
      <header className="flex items-center justify-center p-5 bg-white border-b border-slate-200 shadow-sm z-10 shrink-0">
        <div className="text-center flex flex-col items-center">
          <h1 className="text-2xl font-bold text-slate-800">Tibetan Tutor</h1>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mt-1">Language Guide</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 scroll-smooth flex justify-center">
        <div className="w-full max-w-3xl space-y-8 pb-4">
          
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 mt-20">
              <div className="w-24 h-24 rounded-full border border-slate-200 p-1 opacity-70">
                <img src="/dakini.png" alt="Tara" className="w-full h-full object-cover rounded-full" />
              </div>
              <p className="text-base text-center max-w-md">
                Welcome to your Tibetan Tutor. <br/> Type a message or press the microphone to begin.
              </p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div key={index} className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex items-start w-full gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                
                {msg.role === "ai" ? (
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0 shadow-sm border border-slate-200 bg-white overflow-hidden">
                    <img src="/dakini.png" alt="Tara" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0 bg-slate-200 border border-slate-300 flex items-center justify-center">
                    <span className="text-slate-500 font-bold text-lg">U</span>
                  </div>
                )}

                <div className={`w-full ${msg.role === "user" ? "max-w-[85%] sm:max-w-[75%]" : ""}`}>
                  {msg.role === "user" ? (
                    <div className="p-4 sm:p-5 rounded-2xl shadow-sm text-base leading-relaxed bg-blue-600 text-white rounded-br-none w-fit ml-auto">
                      <p>{msg.content}</p>
                    </div>
                  ) : (
                    renderAiContent(msg)
                  )}
                </div>

              </div>
            </div>
          ))}

          {isLoading && !isPlaying && (
            <div className="flex items-center gap-3 text-slate-500 p-2 ml-16">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-medium">Tara is thinking...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-4 bg-white border-t border-slate-200 shrink-0 relative z-20">
        <form onSubmit={handleSendText} className="flex items-center gap-3 max-w-3xl mx-auto relative">
          
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isLoading || isPlaying}
            className={`w-12 h-12 flex items-center justify-center rounded-full transition-colors duration-200 flex-shrink-0 relative ${
              isRecording ? "bg-red-500 hover:bg-red-600" : "bg-slate-800 hover:bg-slate-700"
            } disabled:opacity-50`}
          >
            {isRecording && <span className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping opacity-50 pointer-events-none"></span>}
            <div className="w-5 h-5 flex items-center justify-center z-10">
              {isRecording ? <Square size={20} className="fill-white text-white" /> : <Mic size={20} className="text-white" />}
            </div>
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading || isRecording || isPlaying}
            placeholder={isRecording ? "Listening to your voice..." : "Type in English or བོད་ཡིག..."}
            className="flex-1 min-w-0 bg-slate-100 border border-slate-200 rounded-full px-5 py-3 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all disabled:opacity-60"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading || isRecording || isPlaying}
            className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors flex-shrink-0"
          >
            <Send size={20} className="ml-1" />
          </button>
        </form>
      </div>
    </main>
  );
}