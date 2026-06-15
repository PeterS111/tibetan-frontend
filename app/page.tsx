"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Square, Loader2, Send, Zap, BookOpen, BrainCircuit, Menu, X, Plus } from "lucide-react";
import { SignInButton, SignUpButton, Show, UserButton, useAuth } from '@clerk/nextjs';

type AudioPart = { lang: string; text: string; audio_base64: string; };

type Message = {
  role: "user" | "ai";
  content: string;
  audioSequence?: AudioPart[];
};

export default function Home() {
  const { userId } = useAuth();
  const [conversationId, setConversationId] = useState<string | null>(null);
  
  // Sidebar and History State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pastConversations, setPastConversations] = useState<any[]>([]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [aiMode, setAiMode] = useState<"chat" | "study" | "pro">("chat");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Fetch ALL conversations on login
  useEffect(() => {
    if (userId) {
      fetch(`https://tibetan-backend.onrender.com/api/conversations?user_id=${userId}`)
        .then(res => res.json())
        .then(data => setPastConversations(data.conversations || []));
    } else {
      setPastConversations([]);
      setMessages([]);
      setConversationId(null);
    }
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load a specific conversation
  const loadConversation = async (id: string) => {
    setConversationId(id);
    setIsSidebarOpen(false);
    setMessages([]); // clear current chat
    try {
      const res = await fetch(`https://tibetan-backend.onrender.com/api/history?conversation_id=${id}`);
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages.map((m: any) => ({
          role: m.role,
          content: m.content,
          audioSequence: m.audio_sequence
        })));
      }
    } catch (e) { console.error(e); }
  };

  // Start a fresh chat
  const startNewChat = () => {
    setConversationId(null);
    setMessages([]);
    setIsSidebarOpen(false);
  };

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
        setMessages((prev) => [...prev, { role: "user", content: "🎙️ Processing Voice..." }]);
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.webm");
        stream.getTracks().forEach((track) => track.stop());
        await sendToBackend(formData);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) { alert("Microphone access denied."); }
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
    formData.append("mode", aiMode);

    let activeConvId = conversationId;
    if (userId) {
      formData.append("user_id", userId);
      activeConvId = conversationId || crypto.randomUUID();
      if (!conversationId) setConversationId(activeConvId);
      formData.append("conversation_id", activeConvId);
    }

    try {
      const response = await fetch("https://tibetan-backend.onrender.com/api/chat", {
        method: "POST", body: formData,
      });

      const data = await response.json();

      if (formData.has("audio")) {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "user", content: data.user_text };
          return updated;
        });
      }

      setMessages((prev) => [...prev, { role: "ai", content: data.ai_text, audioSequence: data.audio_sequence }]);

      // Refresh Sidebar List if it's a new chat
      if (userId && !conversationId) {
        fetch(`https://tibetan-backend.onrender.com/api/conversations?user_id=${userId}`)
          .then(res => res.json())
          .then(data => setPastConversations(data.conversations || []));
      }

      if (data.audio_sequence && data.audio_sequence.length > 0) {
        setIsPlaying(true);
        let currentIndex = 0;
        const playNext = () => {
          if (currentIndex >= data.audio_sequence.length) {
            setIsPlaying(false); setIsLoading(false); return;
          }
          const part = data.audio_sequence[currentIndex];
          currentIndex++;
          if (part.audio_base64) {
            const audio = new Audio(`data:audio/mp3;base64,${part.audio_base64}`);
            audio.onended = playNext; audio.play();
          } else { playNext(); }
        };
        playNext(); 
      } else { setIsLoading(false); }

    } catch (error) {
      setMessages((prev) => [...prev, { role: "ai", content: "⚠️ Error communicating with AI server." }]);
      setIsLoading(false);
    }
  };

  const replayTibetanAudio = (base64Audio: string) => {
    if (!base64Audio) return;
    new Audio(`data:audio/mp3;base64,${base64Audio}`).play();
  };

  return (
    {/* MOBILE FIX 1: h-dvh (Dynamic Viewport Height) prevents keyboard crush! */}
    <main className="fixed inset-0 h-dvh w-full flex flex-col bg-slate-50 text-slate-800 font-sans overflow-hidden">
      
      {/* Sidebar Drawer Overlay */}
      {isSidebarOpen && (
        <div className="absolute inset-0 z-50 flex">
          <div className="w-72 max-w-[80vw] bg-white border-r border-slate-200 shadow-2xl flex flex-col h-full animate-in slide-in-from-left duration-200">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="font-bold text-slate-700">Chat History</h2>
              <button onClick={() => setIsSidebarOpen(false)} className="p-1 rounded hover:bg-slate-200"><X size={20}/></button>
            </div>
            <div className="p-4 border-b border-slate-100">
               <button onClick={startNewChat} className="w-full bg-slate-800 text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-slate-700 shadow-sm transition">
                 <Plus size={18}/> New Conversation
               </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {pastConversations.map(c => (
                 <button key={c.id} onClick={() => loadConversation(c.id)} className={`w-full text-left p-3 rounded-xl border transition-all ${conversationId === c.id ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50'}`}>
                   <div className="text-sm font-bold text-slate-700">Session</div>
                   <div className="text-xs text-slate-500 mt-1">{new Date(c.created_at).toLocaleString()}</div>
                 </button>
              ))}
              {pastConversations.length === 0 && (
                <p className="text-sm text-slate-400 text-center mt-10">No past conversations yet.</p>
              )}
            </div>
          </div>
          <div className="flex-1 bg-slate-900/20 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
        </div>
      )}

      {/* Header and Controls */}
      <div className="flex flex-col bg-white border-b border-slate-200 shadow-sm z-10 shrink-0">
        
        {/* MOBILE FIX 2: flex-1 on header columns keeps it centered on narrow screens */}
        <header className="flex items-center justify-between p-3 sm:p-4 w-full max-w-5xl mx-auto">
          <div className="flex-1 flex justify-start">
            <Show when="signed-in">
              <button onClick={() => setIsSidebarOpen(true)} className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-semibold text-sm transition">
                <Menu size={20} /> <span className="hidden sm:inline">History</span>
              </button>
            </Show>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 whitespace-nowrap">Tibetan Tutor</h1>
            <p className="text-[10px] sm:text-xs font-medium text-slate-500 uppercase tracking-widest mt-1">Language Guide</p>
          </div>
          
          <div className="flex-1 flex justify-end gap-3 items-center">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Log in</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="hidden sm:block text-sm font-semibold bg-blue-600 text-white px-4 py-1.5 rounded-full hover:bg-blue-700 transition-colors shadow-sm">Sign Up</button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </div>
        </header>

        {/* MOBILE FIX 3: flex-nowrap + overflow-x-auto allows swiping on phones! */}
        <div className="flex justify-start sm:justify-center items-center gap-2 sm:gap-4 p-3 bg-slate-50 border-t border-slate-100 overflow-x-auto w-full flex-nowrap scroll-smooth">
          
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={() => setAiMode("chat")} className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${aiMode === 'chat' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'}`}><Zap size={16} /> Fast Chat</button>
            <button onClick={() => setAiMode("study")} className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${aiMode === 'study' ? 'bg-purple-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'}`}><BookOpen size={16} /> Study Book</button>
            <button onClick={() => setAiMode("pro")} className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${aiMode === 'pro' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'}`}><BrainCircuit size={16} /> Pro Model</button>
          </div>

          <div className="w-px h-8 bg-slate-300 flex-shrink-0 mx-1 hidden sm:block"></div>

          <button onClick={startNewChat} className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 text-white text-sm font-bold shadow-md hover:bg-slate-700 transition-all">
            <Plus size={16} /> New Chat
          </button>

        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 scroll-smooth flex justify-center">
        <div className="w-full max-w-3xl space-y-8 pb-4">
          
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 mt-10">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-slate-200 p-1 opacity-70"><img src="/dakini.png" alt="Tara" className="w-full h-full object-cover rounded-full" /></div>
              <p className="text-sm sm:text-base text-center max-w-md px-4">Select a mode above.<br/> Type a message or press the microphone to start a new chat.</p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div key={index} className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex items-start w-full gap-3 sm:gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                
                {msg.role === "ai" ? (
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0 shadow-sm border border-slate-200 bg-white overflow-hidden"><img src="/dakini.png" alt="Tara" className="w-full h-full object-cover" /></div>
                ) : (
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0 bg-slate-200 border border-slate-300 flex items-center justify-center"><span className="text-slate-500 font-bold text-base sm:text-lg">U</span></div>
                )}

                <div className={`w-full ${msg.role === "user" ? "max-w-[85%] sm:max-w-[75%]" : ""}`}>
                  {msg.role === "user" ? (
                    <div className="p-3 sm:p-5 rounded-2xl shadow-sm text-sm sm:text-base leading-relaxed bg-blue-600 text-white rounded-br-none w-fit ml-auto">
                      <p>{msg.content}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3 w-full">
                      {msg.content.split(/([\u0F00-\u0FFF]+(?:[\s\u0F00-\u0FFF]*[\u0F00-\u0FFF]+)*)/g).map((part, i) => {
                        const trimmed = part.trim();
                        if (!trimmed) return null;
                        const isTibetan = /[\u0F00-\u0FFF]/.test(trimmed);
                        if (isTibetan) {
                          const matchingAudio = msg.audioSequence?.find(a => a.lang === "tib" && a.text === trimmed)?.audio_base64;
                          return (
                            <div key={i} className="flex flex-row items-center gap-3 sm:gap-4 w-full mt-2 mb-2">
                              <div className="p-3 sm:p-5 rounded-2xl bg-blue-50 border border-blue-200 shadow-sm rounded-tl-none w-fit"><span className="text-xl sm:text-3xl text-slate-800 leading-loose">{trimmed}</span></div>
                              {matchingAudio && (
                                <button onClick={() => replayTibetanAudio(matchingAudio)} className="w-10 h-10 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-slate-300 hover:border-blue-500 hover:shadow-lg transition flex-shrink-0 bg-white shadow-sm" title="Play Tibetan Audio">
                                  <img src="/yogi.png" alt="Yogi" className="w-full h-full object-cover" />
                                </button>
                              )}
                            </div>
                          );
                        } else {
                          return <div key={i} className="p-3 sm:p-5 rounded-2xl bg-white border border-slate-200 text-slate-700 shadow-sm rounded-tl-none w-fit max-w-[90%] sm:max-w-[85%] text-sm sm:text-base"><p className="whitespace-pre-wrap">{trimmed}</p></div>;
                        }
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && !isPlaying && (
            <div className="flex items-center gap-3 text-slate-500 p-2 ml-14 sm:ml-16"><Loader2 className="w-5 h-5 animate-spin" /><span className="text-sm font-medium">Tara is thinking...</span></div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0 relative z-20 pb-safe">
        <form onSubmit={handleSendText} className="flex items-center gap-2 sm:gap-3 max-w-3xl mx-auto relative">
          <button type="button" onClick={isRecording ? stopRecording : startRecording} disabled={isLoading || isPlaying} className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full transition-colors flex-shrink-0 relative ${isRecording ? "bg-red-500 hover:bg-red-600" : "bg-slate-800 hover:bg-slate-700"} disabled:opacity-50`}>
            {isRecording && <span className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping opacity-50 pointer-events-none"></span>}
            <div className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center z-10">{isRecording ? <Square size={18} className="fill-white text-white" /> : <Mic size={18} className="text-white" />}</div>
          </button>
          
          {/* MOBILE FIX 4: text-[16px] is exactly 16px. This physically blocks Apple iOS from force-zooming the screen when tapping the input box! */}
          <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} disabled={isLoading || isRecording || isPlaying} placeholder={isRecording ? "Listening..." : "Type in English or བོད་ཡིག..."} className="flex-1 min-w-0 bg-slate-100 border border-slate-200 rounded-full px-4 sm:px-5 py-2.5 sm:py-3 text-[16px] text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all disabled:opacity-60" />
          
          <button type="submit" disabled={!inputText.trim() || isLoading || isRecording || isPlaying} className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors flex-shrink-0"><Send size={18} className="ml-0.5 sm:ml-1" /></button>
        </form>
      </div>
    </main>
  );
}