"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Mic, Square, Loader2, Send, Zap, BookOpen, PenTool, Menu, X, Plus, MessageSquarePlus, StopCircle, PlayCircle, ArrowRight } from "lucide-react";
import { SignInButton, SignUpButton, Show, UserButton, useAuth } from '@clerk/nextjs';

type AudioPart = { lang: string; text: string; audio_base64: string; };
type Message = { id?: string; role: "user" | "ai"; content: string; audioSequence?: AudioPart[]; isLoadingAudio?: boolean; };

export default function Home() {
  const { userId } = useAuth();
  const [conversationId, setConversationId] = useState<string | null>(null);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pastConversations, setPastConversations] = useState<any[]>([]);

  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  const [isPlaying, setIsPlaying] = useState(false); 
  
  const [aiMode, setAiMode] = useState<"chat" | "study" | "custom">("chat");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isPlayingRef = useRef(false);

  const [playingAudioBase64, setPlayingAudioBase64] = useState<string | null>(null);

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

  useEffect(() => {
    fetch("https://tibetan-backend.onrender.com/api/wakeup").catch(() => {});
  }, []);

  const loadConversation = async (id: string) => {
    setConversationId(id);
    setIsSidebarOpen(false);
    setMessages([]); 
    try {
      const res = await fetch(`https://tibetan-backend.onrender.com/api/history?conversation_id=${id}`);
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages.map((m: any) => ({
          id: m.id, role: m.role, content: m.content, audioSequence: m.audio_sequence
        })));
      }
    } catch (e) { console.error(e); }
  };

  const startNewChat = () => {
    setConversationId(null);
    setMessages([]);
    setIsSidebarOpen(false);
  };

  const submitFeedback = async () => {
    if (!feedbackText.trim()) return;
    setIsSubmittingFeedback(true);
    const formData = new FormData();
    formData.append("content", feedbackText.trim());
    if (userId) formData.append("user_id", userId);
    try {
      await fetch("https://tibetan-backend.onrender.com/api/feedback", { method: "POST", body: formData });
      setFeedbackText(""); setIsFeedbackModalOpen(false);
      alert("Thank you! Your feedback has been sent.");
    } catch (e) { alert("Failed to send feedback."); } 
    finally { setIsSubmittingFeedback(false); }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        stream.getTracks().forEach((track) => track.stop());
        
        setIsTranscribing(true);
        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.webm");
        
        try {
          const res = await fetch("https://tibetan-backend.onrender.com/api/transcribe", {
            method: "POST",
            body: formData
          });
          const data = await res.json();
          if (data.text) {
            setInputText((prev) => prev.trim() ? prev.trim() + " " + data.text : data.text);
          }
        } catch (error) {
          console.error(error);
          alert("Failed to transcribe audio.");
        } finally {
          setIsTranscribing(false);
        }
      };
      
      mediaRecorder.start(); 
      setIsRecording(true);
    } catch (error) { alert("Microphone access denied."); }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) { mediaRecorderRef.current.stop(); setIsRecording(false); }
  };

  const handleSendText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const userMessage = inputText.trim();
    setInputText("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    await processMessage(userMessage);
  };

  const sendAutomatedMessage = async (text: string) => {
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    await processMessage(text);
  };

  const handleInterrupt = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }
    isPlayingRef.current = false;
    setIsPlaying(false);
    setIsLoading(false);
    setPlayingAudioBase64(null);
    
    setMessages((prev) => prev.map(msg => msg.isLoadingAudio ? { ...msg, isLoadingAudio: false } : msg));
  };

  const processMessage = async (text: string) => {
    setIsLoading(true); 
    abortControllerRef.current = new AbortController();

    const formData = new FormData();
    formData.append("text", text);
    
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
        method: "POST", body: formData, signal: abortControllerRef.current.signal 
      });
      const data = await response.json();

      setIsLoading(false); 
      const tempMsgId = crypto.randomUUID();

      setMessages((prev) => [...prev, { 
        id: tempMsgId, role: "ai", content: data.ai_text, isLoadingAudio: true 
      }]);

      if (userId && !conversationId) {
        fetch(`https://tibetan-backend.onrender.com/api/conversations?user_id=${userId}`)
          .then(res => res.json()).then(data => setPastConversations(data.conversations || []));
      }

      const ttsFormData = new FormData();
      ttsFormData.append("text", data.ai_text);
      if (data.message_id) ttsFormData.append("message_id", data.message_id);

      const ttsResponse = await fetch("https://tibetan-backend.onrender.com/api/tts", {
        method: "POST", body: ttsFormData, signal: abortControllerRef.current.signal
      });
      const ttsData = await ttsResponse.json();

      setMessages((prev) => prev.map(msg => 
        msg.id === tempMsgId ? { ...msg, audioSequence: ttsData.audio_sequence, isLoadingAudio: false } : msg
      ));

      if (ttsData.audio_sequence && ttsData.audio_sequence.length > 0) {
        setIsPlaying(true);
        isPlayingRef.current = true;
        let currentIndex = 0;
        
        const playNext = () => {
          if (!isPlayingRef.current) { setPlayingAudioBase64(null); return; }
          if (currentIndex >= ttsData.audio_sequence.length) { 
            setIsPlaying(false); isPlayingRef.current = false; setPlayingAudioBase64(null); return; 
          }
          const part = ttsData.audio_sequence[currentIndex];
          currentIndex++;
          
          if (part.audio_base64) {
            setPlayingAudioBase64(part.audio_base64);
            const audio = new Audio(`data:audio/mp3;base64,${part.audio_base64}`);
            currentAudioRef.current = audio;
            audio.onended = playNext; 
            audio.play().catch(() => { if (isPlayingRef.current) playNext(); });
          } else { playNext(); }
        };
        playNext(); 
      }

    } catch (error: any) {
      if (error.name === "AbortError") {
        setMessages((prev) => {
            const updated = [...prev];
            const lastMsg = updated[updated.length - 1];
            if (lastMsg && lastMsg.role === "ai" && lastMsg.isLoadingAudio) {
                lastMsg.isLoadingAudio = false; 
            } else if (!lastMsg || lastMsg.role === "user") {
                updated.push({ role: "ai", content: "🛑 Interrupted." });
            }
            return updated;
        });
      } else {
        setMessages((prev) => {
            const lastMsg = prev[prev.length - 1];
            if (lastMsg && lastMsg.role === "ai" && lastMsg.isLoadingAudio) {
                return prev.map(m => m === lastMsg ? { ...m, isLoadingAudio: false } : m);
            }
            return [...prev, { role: "ai", content: "⚠️ Error communicating with AI server." }];
        });
      }
      setIsLoading(false);
    }
  };

  const replayAudio = (base64Audio: string) => {
    if (!base64Audio) return;
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
    }
    
    setPlayingAudioBase64(base64Audio); 
    setIsPlaying(true);
    isPlayingRef.current = true;
    
    const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`);
    currentAudioRef.current = audio;
    
    audio.onended = () => {
      setPlayingAudioBase64(null);
      setIsPlaying(false);
      isPlayingRef.current = false;
    };
    
    audio.play().catch(() => {
      setPlayingAudioBase64(null);
      setIsPlaying(false);
      isPlayingRef.current = false;
    });
  };

  return (
    <main className="fixed inset-0 h-[100dvh] w-full flex flex-col bg-slate-50 text-slate-800 font-sans overflow-hidden">
      
      {isFeedbackModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="font-bold text-slate-700">Leave Feedback</h2>
              <button onClick={() => setIsFeedbackModalOpen(false)} className="p-1 rounded hover:bg-slate-200 transition"><X size={20}/></button>
            </div>
            <div className="p-4 space-y-4">
              <textarea value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} placeholder="Tell us what you think, report a bug, or suggest a feature!" className="w-full h-32 p-3 border border-slate-200 rounded-xl resize-none focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 bg-slate-50 text-[16px] text-slate-700"></textarea>
              <button onClick={submitFeedback} disabled={!feedbackText.trim() || isSubmittingFeedback} className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50 transition shadow-sm">{isSubmittingFeedback ? <Loader2 size={18} className="animate-spin" /> : "Submit Feedback"}</button>
            </div>
          </div>
        </div>
      )}

      {isSidebarOpen && (
        <div className="absolute inset-0 z-50 flex">
          <div className="w-72 max-w-[80vw] bg-white border-r border-slate-200 shadow-2xl flex flex-col h-full animate-in slide-in-from-left duration-200">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="font-bold text-slate-700">Chat History</h2>
              <button onClick={() => setIsSidebarOpen(false)} className="p-1 rounded hover:bg-slate-200"><X size={20}/></button>
            </div>
            <div className="p-4 border-b border-slate-100">
               <button onClick={startNewChat} className="w-full bg-slate-800 text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-slate-700 shadow-sm transition"><Plus size={18}/> New Conversation</button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {pastConversations.map(c => (
                 <button key={c.id} onClick={() => loadConversation(c.id)} className={`w-full text-left p-3 rounded-xl border transition-all ${conversationId === c.id ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50'}`}>
                   <div className="text-sm font-bold text-slate-700">Session</div>
                   <div className="text-xs text-slate-500 mt-1">{new Date(c.created_at).toLocaleString()}</div>
                 </button>
              ))}
            </div>
          </div>
          <div className="flex-1 bg-slate-900/20 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
        </div>
      )}

      <div className="flex flex-col bg-white border-b border-slate-200 shadow-sm z-10 shrink-0">
        <header className="flex items-center justify-between p-3 sm:p-4 w-full max-w-5xl mx-auto">
          <div className="flex-1 flex justify-start gap-4">
            <Show when="signed-in">
              <button onClick={() => setIsSidebarOpen(true)} className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-semibold text-sm transition"><Menu size={20} /> <span className="hidden sm:inline">History</span></button>
            </Show>
            <Link href="/about" className="text-slate-600 hover:text-blue-600 font-semibold text-sm transition flex items-center">
              About
            </Link>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 whitespace-nowrap">Tibetan Tutor</h1>
            <p className="text-[10px] sm:text-xs font-medium text-slate-500 uppercase tracking-widest mt-1">Dolma AI</p>
          </div>
          <div className="flex-1 flex justify-end gap-3 items-center">
            <button onClick={() => setIsFeedbackModalOpen(true)} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-colors" title="Leave Feedback"><MessageSquarePlus size={20} /></button>
            <Show when="signed-out"><SignInButton mode="modal"><button className="text-sm font-semibold bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition-colors shadow-sm">Log in</button></SignInButton></Show>
            <Show when="signed-in"><UserButton /></Show>
          </div>
        </header>

        <div className="flex justify-start sm:justify-center items-center gap-2 sm:gap-4 p-3 bg-slate-50 border-t border-slate-100 overflow-x-auto w-full flex-nowrap scroll-smooth">
          <button onClick={() => { setAiMode("chat"); startNewChat(); }} className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${aiMode === 'chat' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'}`}><Zap size={16} /> Quick Chat</button>
          <button onClick={() => setAiMode("study")} className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${aiMode === 'study' ? 'bg-purple-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'}`}><BookOpen size={16} /> Study Book</button>
          <button onClick={() => setAiMode("custom")} className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${aiMode === 'custom' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'}`}><PenTool size={16} /> Custom Text</button>
        </div>
        
        {(aiMode === "study") && (
          <div className="flex justify-center p-2 bg-slate-100 border-t border-slate-200">
             <button onClick={() => sendAutomatedMessage("Please start the next text from the textbook.")} disabled={!userId || isLoading || isPlaying} className="flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors bg-white px-4 py-1.5 rounded-full border border-slate-300 shadow-sm disabled:opacity-50">
               <PlayCircle size={18} className="text-blue-500"/> Start Lesson from Book
             </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 scroll-smooth flex justify-center">
        <div className="w-full max-w-3xl space-y-8 pb-4">
          
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 mt-10">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-slate-200 p-1 opacity-70"><img src="/dakini.png" alt="Dolma" className="w-full h-full object-cover rounded-full" /></div>
              <p className="text-sm sm:text-base text-center max-w-md px-4">Select a mode above.<br/> Type a message or press the microphone to start.</p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div key={index} className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex items-start w-full gap-3 sm:gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                
                {msg.role === "user" ? (
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0 bg-slate-200 border border-slate-300 flex items-center justify-center"><span className="text-slate-500 font-bold text-base sm:text-lg">U</span></div>
                ) : (
                  <div className="flex flex-col gap-4 w-full">
                    {msg.content.split(/([\u0F00-\u0FFF]+(?:[\s\u0F00-\u0FFF]*[\u0F00-\u0FFF]+)*)/g).map((part, i) => {
                      const trimmed = part.trim();
                      if (!trimmed) return null;
                      const isTibetan = /[\u0F00-\u0FFF]/.test(trimmed);
                      const matchingAudio = msg.audioSequence?.find(a => a.text === trimmed)?.audio_base64;
                      const isThisPlaying = playingAudioBase64 === matchingAudio && matchingAudio != null;
                      const showSpinner = msg.isLoadingAudio && !matchingAudio;

                      return (
                        <div key={i} className="flex flex-row items-start gap-3 sm:gap-4 w-full">
                          
                          {/* CORRECTED: Yogi pulses red, Dolma pulses golden/yellow */}
                          <div className="relative">
                            <button 
                              onClick={() => matchingAudio && replayAudio(matchingAudio)}
                              disabled={!matchingAudio && !showSpinner}
                              className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex-shrink-0 transition-all duration-300 ${isThisPlaying ? (isTibetan ? 'ring-4 ring-red-700 scale-110 shadow-lg' : 'ring-4 ring-yellow-500 scale-110 shadow-lg') : 'border border-slate-200 shadow-sm'} ${matchingAudio ? (isTibetan ? 'hover:border-red-700 cursor-pointer' : 'hover:border-yellow-500 cursor-pointer') : 'cursor-default'}`}
                              title={matchingAudio ? "Play Audio" : "Generating Audio..."}
                            >
                              <img src={isTibetan ? "/yogi.png" : "/dakini.png"} alt="Avatar" className={`w-full h-full object-cover ${isThisPlaying ? 'animate-pulse' : ''} ${showSpinner ? 'opacity-40 grayscale' : ''}`} />
                            </button>
                            {showSpinner && (
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <Loader2 className="w-5 h-5 animate-spin text-slate-700" />
                              </div>
                            )}
                          </div>

                          <div className={`px-3 sm:px-5 rounded-2xl shadow-sm rounded-tl-none w-fit max-w-[85%] sm:max-w-[75%] ${isTibetan ? 'py-2 sm:py-3 bg-blue-50 border border-blue-200' : 'py-3 sm:py-5 bg-white border border-slate-200 text-slate-700'}`}>
                            {isTibetan ? (
                              <span className="text-xl sm:text-3xl text-slate-800 leading-normal">{trimmed}</span>
                            ) : (
                              <p className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed">{trimmed}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {msg.role === "user" && (
                  <div className={`w-full max-w-[85%] sm:max-w-[75%]`}>
                    <div className="p-3 sm:p-5 rounded-2xl shadow-sm text-sm sm:text-base leading-relaxed bg-blue-600 text-white rounded-br-none w-fit ml-auto"><p>{msg.content}</p></div>
                  </div>
                )}

              </div>
            </div>
          ))}

          {/* CORRECTED: Dolma is thinking... */}
          {isLoading && !isPlaying && (
            <div className="flex items-center gap-3 text-slate-500 p-2 ml-14 sm:ml-16"><Loader2 className="w-5 h-5 animate-spin" /><span className="text-sm font-medium">Dolma is thinking...</span></div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0 relative z-20 pb-safe flex flex-col items-center">
        
        <div className="w-full max-w-3xl mb-3 flex justify-center">
          <div className="relative inline-flex group">
            {userId && !isLoading && !isRecording && !isPlaying && !isTranscribing && (
              <span className="absolute -inset-1.5 rounded-full bg-green-400 animate-pulse opacity-40 pointer-events-none blur-sm"></span>
            )}
            
            <button 
              type="button" 
              onClick={() => {
                if (messages.length === 0) {
                  sendAutomatedMessage("Let's start.");
                } else {
                  sendAutomatedMessage("Continue.");
                }
              }} 
              disabled={!userId || isLoading || isRecording || isPlaying || isTranscribing} 
              className="relative z-10 px-16 py-1.5 bg-green-500 border-[3px] border-green-600 text-white rounded-full shadow-md transition-all flex items-center justify-center hover:bg-green-600 hover:scale-105 disabled:bg-slate-300 disabled:border-slate-400 disabled:text-slate-500 disabled:shadow-none disabled:hover:scale-100 disabled:cursor-not-allowed"
              title={messages.length === 0 ? "Start" : "Continue"}
            >
              <svg 
                width="60" 
                height="28" 
                viewBox="0 0 60 28" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="transition-transform group-hover:translate-x-2"
              >
                <line x1="2" y1="14" x2="56" y2="14" />
                <polyline points="46 4 56 14 46 24" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSendText} className="flex items-center gap-2 sm:gap-3 w-full max-w-3xl mx-auto relative">
          
          <button type="button" onClick={isRecording ? stopRecording : startRecording} disabled={!userId || isLoading || isPlaying || isTranscribing} className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full transition-colors flex-shrink-0 relative ${isRecording ? "bg-red-500 hover:bg-red-600" : "bg-slate-800 hover:bg-slate-700"} disabled:opacity-50`}>
            {isRecording && <span className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping opacity-50 pointer-events-none"></span>}
            <div className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center z-10">{isRecording ? <Square size={18} className="fill-white text-white" /> : <Mic size={18} className="text-white" />}</div>
          </button>
          
          <input 
             type="text" 
             value={inputText} 
             onChange={(e) => setInputText(e.target.value)} 
             disabled={!userId || isLoading || isRecording || isPlaying || isTranscribing} 
             placeholder={!userId ? "🔒 Please log in to chat..." : isRecording ? "Listening..." : isTranscribing ? "Transcribing..." : "Type in English or བོད་ཡིག..."} 
             className="flex-1 min-w-0 bg-slate-100 border border-slate-200 rounded-full px-4 sm:px-5 py-2.5 sm:py-3 text-[16px] text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all disabled:opacity-60" 
          />
          
          <button type="submit" disabled={!userId || !inputText.trim() || isLoading || isRecording || isPlaying || isTranscribing} className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors flex-shrink-0"><Send size={18} className="ml-0.5 sm:ml-1" /></button>
          
          <button type="button" onClick={handleInterrupt} disabled={!(isLoading || isPlaying)} className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-red-100 text-red-600 rounded-full hover:bg-red-200 disabled:opacity-50 transition-colors flex-shrink-0" title="Interrupt Dolma">
            <StopCircle size={20} />
          </button>

        </form>
      </div>
    </main>
  );
}