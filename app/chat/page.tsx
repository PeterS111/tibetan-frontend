"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Mic, Square, Loader2, Send, Zap, BookOpen, PenTool, Menu, X, Plus, MessageSquarePlus, StopCircle, PlayCircle, ArrowRight, Home, Info, Heart, Mail, MessageSquare, ChevronDown, ChevronRight, Globe } from "lucide-react";
import { SignInButton, SignUpButton, Show, UserButton, useAuth } from '@clerk/nextjs';

// ==========================================
// MULTILINGUAL UI CONFIGURATION
// ==========================================
const TRANSLATIONS = {
  en: {
    name: "English", sttCode: "en-GB",
    startLesson: "Start Lesson from Book",
    selectMode: "Select a mode above.\nType a message or press the microphone to start.",
    thinking: "Tara is thinking...",
    start: "Let's start.", continue: "Continue.",
    loginToChat: "🔒 Please log in to chat...", listening: "Listening...",
    typePlaceholder: "Type in English or བོད་ཡིག...",
    letTaraLead: "Let Tara lead.", or: "or"
  },
  zh: {
    name: "中文", sttCode: "zh-CN",
    startLesson: "开始课本学习",
    selectMode: "在上面选择一个模式。\n输入一条消息或按住麦克风开始。",
    thinking: "Tara 正在思考...",
    start: "我们开始吧。", continue: "继续。",
    loginToChat: "🔒 请登录以聊天...", listening: "正在聆听...",
    typePlaceholder: "输入中文或བོད་ཡིག...",
    letTaraLead: "让 Tara 引导。", or: "或"
  },
  es: {
    name: "Español", sttCode: "es-ES",
    startLesson: "Comenzar lección del libro",
    selectMode: "Selecciona un modo arriba.\nEscribe un mensaje o presiona el micrófono para empezar.",
    thinking: "Tara está pensando...",
    start: "Empecemos.", continue: "Continuar.",
    loginToChat: "🔒 Inicia sesión para chatear...", listening: "Escuchando...",
    typePlaceholder: "Escribe en español o བོད་ཡིག...",
    letTaraLead: "Deja que Tara guíe.", or: "o"
  },
  fr: {
    name: "Français", sttCode: "fr-FR",
    startLesson: "Commencer la leçon du livre",
    selectMode: "Sélectionnez un mode ci-dessus.\nÉcrivez un message ou appuyez sur le micro pour commencer.",
    thinking: "Tara réfléchit...",
    start: "Commençons.", continue: "Continuer.",
    loginToChat: "🔒 Connectez-vous pour discuter...", listening: "Écoute...",
    typePlaceholder: "Écrivez en français ou བོད་ཡིག...",
    letTaraLead: "Laissez Tara guider.", or: "ou"
  },
  pt: {
    name: "Português", sttCode: "pt-BR",
    startLesson: "Começar a lição do livro",
    selectMode: "Selecione um modo acima.\nDigite uma mensagem ou pressione o microfone para começar.",
    thinking: "Tara está pensando...",
    start: "Vamos começar.", continue: "Continuar.",
    loginToChat: "🔒 Faça login para conversar...", listening: "Ouvindo...",
    typePlaceholder: "Digite em português ou བོད་ཡིག...",
    letTaraLead: "Deixe Tara guiar.", or: "ou"
  },
  de: {
    name: "Deutsch", sttCode: "de-DE",
    startLesson: "Lektion aus dem Buch starten",
    selectMode: "Wähle oben einen Modus.\nTippe eine Nachricht oder drücke auf das Mikrofon, um zu beginnen.",
    thinking: "Tara denkt nach...",
    start: "Lass uns anfangen.", continue: "Weiter.",
    loginToChat: "🔒 Bitte anmelden, um zu chatten...", listening: "Zuhören...",
    typePlaceholder: "Tippe auf Deutsch oder བོད་ཡིག...",
    letTaraLead: "Lass Tara führen.", or: "oder"
  },
  pl: {
    name: "Polski", sttCode: "pl-PL",
    startLesson: "Zacznij lekcję z książki",
    selectMode: "Wybierz tryb powyżej.\nWpisz wiadomość lub naciśnij mikrofon, aby rozpocząć.",
    thinking: "Tara myśli...",
    start: "Zaczynajmy.", continue: "Kontynuuj.",
    loginToChat: "🔒 Zaloguj się, aby pisać...", listening: "Słucham...",
    typePlaceholder: "Wpisz po polsku lub བོད་ཡིག...",
    letTaraLead: "Pozwól Tarze prowadzić.", or: "albo"
  }
};

type LangCode = keyof typeof TRANSLATIONS;
type AudioPart = { lang: string; text: string; audio_base64: string; };
type Message = { id?: string; role: "user" | "ai"; content: string; audioSequence?: AudioPart[]; isLoadingAudio?: boolean; };

export default function ChatPage() {
  const { userId } = useAuth();
  const [conversationId, setConversationId] = useState<string | null>(null);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);
  const [pastConversations, setPastConversations] = useState<any[]>([]);

  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  const [isPlaying, setIsPlaying] = useState(false); 
  
  const [aiMode, setAiMode] = useState<"chat" | "study" | "custom">("chat");
  
  const [appLanguage, setAppLanguage] = useState<LangCode>("en");
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const t = TRANSLATIONS[appLanguage];

  const recognitionRef = useRef<any>(null);
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

  const loadConversation = async (id: string, convMode: "chat" | "study" | "custom" = "chat") => {
    setConversationId(id);
    setAiMode(convMode);
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

  const startRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support real-time dictation. Please use Google Chrome, Safari, or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true; 
    recognition.lang = t.sttCode; 

    const currentInput = inputText.trim() ? inputText.trim() + " " : "";

    recognition.onstart = () => setIsRecording(true);

    recognition.onresult = (event: any) => {
      let final = "";
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) final += event.results[i][0].transcript;
        else interim += event.results[i][0].transcript;
      }
      setInputText(currentInput + final + interim);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      if (event.error === 'not-allowed') alert("Microphone access denied.");
      setIsRecording(false);
    };

    recognition.onend = () => setIsRecording(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setIsRecording(false);
  };

  const handleSendText = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Automatically stop recording if the user clicks send while speaking
    if (isRecording) {
      stopRecording();
    }
    
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
    formData.append("language", appLanguage); 

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
      ttsFormData.append("language", appLanguage); 
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
            const audioType = part.lang === "tib" ? "wav" : "mp3";
            const audio = new Audio(`data:audio/${audioType};base64,${part.audio_base64}`);
            
            currentAudioRef.current = audio;
            audio.onended = playNext; 
            audio.play().catch((err) => { 
                console.error("Audio playback error:", err);
                if (isPlayingRef.current) playNext(); 
            });
          } else { playNext(); }
        };
        playNext(); 
      }

    } catch (error: any) {
      if (error.name === "AbortError") {
        setMessages((prev) => {
            const updated = [...prev];
            const lastMsg = updated[updated.length - 1];
            if (lastMsg && lastMsg.role === "ai" && lastMsg.isLoadingAudio) lastMsg.isLoadingAudio = false; 
            else if (!lastMsg || lastMsg.role === "user") updated.push({ role: "ai", content: "🛑 Interrupted." });
            return updated;
        });
      } else {
        setMessages((prev) => {
            const lastMsg = prev[prev.length - 1];
            if (lastMsg && lastMsg.role === "ai" && lastMsg.isLoadingAudio) return prev.map(m => m === lastMsg ? { ...m, isLoadingAudio: false } : m);
            return [...prev, { role: "ai", content: "⚠️ Error communicating with AI server." }];
        });
      }
      setIsLoading(false);
    }
  };

  const replayAudio = (base64Audio: string, isTibetan: boolean) => {
    if (!base64Audio) return;
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
    }
    
    setPlayingAudioBase64(base64Audio); 
    setIsPlaying(true);
    isPlayingRef.current = true;
    
    const audioType = isTibetan ? "wav" : "mp3";
    const audio = new Audio(`data:audio/${audioType};base64,${base64Audio}`);
    currentAudioRef.current = audio;
    
    audio.onended = () => {
      setPlayingAudioBase64(null); setIsPlaying(false); isPlayingRef.current = false;
    };
    
    audio.play().catch(() => {
      setPlayingAudioBase64(null); setIsPlaying(false); isPlayingRef.current = false;
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
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
              <div classNa