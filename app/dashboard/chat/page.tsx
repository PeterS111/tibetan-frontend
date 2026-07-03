"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Mic, Square, Loader2, Send, Zap, BookOpen, PenTool, StopCircle, PlayCircle, Globe, Trash2, List, History, X, Plus, Play } from "lucide-react";
import { useAuth } from '@clerk/nextjs';

const TRANSLATIONS = {
  en: { name: "English", sttCode: "en-GB", startLesson: "Start Lesson from Book", selectMode: "Select a mode above.\nType a message or press the microphone to start.", thinking: "Dolma is thinking...", start: "Let's start.", continue: "Continue.", listening: "Listening...", typePlaceholder: "Type in English or བོད་ཡིག...", letTaraLead: "Let Dolma lead -> ", or: "or type/speak:", selectTopic: "Select a topic...", wakingUp: "Waking up Uncle Sherab. He is drunk again...", playIntro: "Play Welcome Message", welcomeMessage: "Hello! I am Dolma AI..." },
  zh: { name: "中文", sttCode: "zh-CN", startLesson: "开始课本学习", selectMode: "在上面选择一个模式。\n输入一条消息或按住麦克风开始。", thinking: "卓玛正在思考...", start: "我们开始吧。", continue: "继续。", listening: "正在聆听...", typePlaceholder: "输入中文或བོད་ཡིག...", letTaraLead: "让卓玛引导 -> ", or: "或输入/说话：", selectTopic: "选择一个主题...", wakingUp: "正在唤醒谢拉大叔...", playIntro: "播放欢迎信息", welcomeMessage: "你好！我是卓玛 AI..." },
  es: { name: "Español", sttCode: "es-ES", startLesson: "Comenzar lección", selectMode: "Selecciona un modo.", thinking: "Dolma está pensando...", start: "Empecemos.", continue: "Continuar.", listening: "Escuchando...", typePlaceholder: "Escribe...", letTaraLead: "Dolma guía -> ", or: "o:", selectTopic: "Selecciona...", wakingUp: "Despertando...", playIntro: "Intro", welcomeMessage: "¡Hola!" },
  fr: { name: "Français", sttCode: "fr-FR", startLesson: "Commencer la leçon", selectMode: "Sélectionnez un mode.", thinking: "Dolma réfléchit...", start: "Commençons.", continue: "Continuer.", listening: "Écoute...", typePlaceholder: "Écrivez...", letTaraLead: "Dolma guide -> ", or: "ou :", selectTopic: "Sélectionnez...", wakingUp: "Réveil...", playIntro: "Intro", welcomeMessage: "Bonjour !" },
  de: { name: "Deutsch", sttCode: "de-DE", startLesson: "Lektion starten", selectMode: "Wähle einen Modus.", thinking: "Dolma denkt nach...", start: "Lass uns anfangen.", continue: "Weiter.", listening: "Zuhören...", typePlaceholder: "Tippe...", letTaraLead: "Dolma führt -> ", or: "oder:", selectTopic: "Wähle...", wakingUp: "Aufwachen...", playIntro: "Intro", welcomeMessage: "Hallo!" },
  ru: { name: "Русский", sttCode: "ru-RU", startLesson: "Начать урок", selectMode: "Выберите режим.", thinking: "Долма думает...", start: "Начнем.", continue: "Продолжить.", listening: "Слушаю...", typePlaceholder: "Пишите...", letTaraLead: "Долма ведет -> ", or: "или:", selectTopic: "Выберите...", wakingUp: "Будим...", playIntro: "Интро", welcomeMessage: "Привет!" },
  ne: { name: "नेपाली", sttCode: "ne-NP", startLesson: "पाठ सुरु गर्नुहोस्", selectMode: "मोड चयन गर्नुहोस्।", thinking: "डोल्मा सोच्दै छिन्...", start: "सुरु गरौं।", continue: "जारी राख्नुहोस्।", listening: "सुन्दै...", typePlaceholder: "टाइप गर्नुहोस्...", letTaraLead: "डोल्मालाई अघि बढ्न दिनुहोस् -> ", or: "वा:", selectTopic: "विषय चयन...", wakingUp: "उठाउँदै...", playIntro: "परिचय", welcomeMessage: "नमस्ते!" },
  ja: { name: "日本語", sttCode: "ja-JP", startLesson: "レッスンを開始", selectMode: "上のモードを選択してください。\nメッセージを入力するか、マイクを押して開始します。", thinking: "ドルマが考えています...", start: "始めましょう。", continue: "続ける。", listening: "聞いています...", typePlaceholder: "入力してください...", letTaraLead: "ドルマに任せる -> ", or: "または:", selectTopic: "トピックを選択...", wakingUp: "シェラブおじさんを起こしています...", playIntro: "紹介を再生", welcomeMessage: "こんにちは！" },
  pt: { name: "Português", sttCode: "pt-BR", startLesson: "Começar a lição", selectMode: "Selecione um modo acima.", thinking: "Dolma está pensando...", start: "Vamos começar.", continue: "Continuar.", listening: "Ouvindo...", typePlaceholder: "Digite...", letTaraLead: "Deixe Dolma guiar -> ", or: "ou:", selectTopic: "Selecione...", wakingUp: "Acordando...", playIntro: "Intro", welcomeMessage: "Olá!" },
  pl: { name: "Polski", sttCode: "pl-PL", startLesson: "Rozpocznij lekcję", selectMode: "Wybierz tryb powyżej.", thinking: "Dolma myśli...", start: "Zaczynajmy.", continue: "Kontynuuj.", listening: "Słucham...", typePlaceholder: "Wpisz...", letTaraLead: "Niech Dolma prowadzi -> ", or: "lub:", selectTopic: "Wybierz...", wakingUp: "Budzenie...", playIntro: "Intro", welcomeMessage: "Cześć!" },
  it: { name: "Italiano", sttCode: "it-IT", startLesson: "Inizia la lezione", selectMode: "Seleziona una modalità.", thinking: "Dolma sta pensando...", start: "Iniziamo.", continue: "Continua.", listening: "Ascoltando...", typePlaceholder: "Scrivi...", letTaraLead: "Lascia guidare Dolma -> ", or: "oppure:", selectTopic: "Seleziona...", wakingUp: "Svegliando...", playIntro: "Intro", welcomeMessage: "Ciao!" }
};

const SYLLABUS_TOPICS = [
  "Module 1: The World of Tibetan Letters & Greetings", "Module 2: The Logic of Existence & Particles",
  "Module 3: Relations, Proximity & Politeness", "Module 4: Questions, Articles & Word Order",
  "Module 5: Action, Intention & The Agent", "Module 6: Actions in the Past",
  "Module 7: The Present Moment & Visible Results", "Module 8: The Future, Nature, & Volunteering",
  "Module 9: Requests & Imperatives", "Module 10: Time, Dates & Exceptions"
];

// The 30 consonants perfectly aligned for a 4-column grid (naturally separating by phonetic group)
const TIBETAN_ALPHABET = [
  { letter: "ཀ", phonetics: "KA" }, { letter: "ཁ", phonetics: "KHA" }, { letter: "ག", phonetics: "GA" }, { letter: "ང", phonetics: "NGA" },
  { letter: "ཅ", phonetics: "CA" }, { letter: "ཆ", phonetics: "CHA" }, { letter: "ཇ", phonetics: "JA" }, { letter: "ཉ", phonetics: "NYA" },
  { letter: "ཏ", phonetics: "TA" }, { letter: "ཐ", phonetics: "THA" }, { letter: "ད", phonetics: "DA" }, { letter: "ན", phonetics: "NA" },
  { letter: "པ", phonetics: "PA" }, { letter: "ཕ", phonetics: "PHA" }, { letter: "བ", phonetics: "BA" }, { letter: "མ", phonetics: "MA" },
  { letter: "ཙ", phonetics: "TSA" }, { letter: "ཚ", phonetics: "TSHA" }, { letter: "ཛ", phonetics: "DZA" }, { letter: "ཝ", phonetics: "WA" },
  { letter: "ཞ", phonetics: "ZHA" }, { letter: "ཟ", phonetics: "ZA" }, { letter: "འ", phonetics: "'A" }, { letter: "ཡ", phonetics: "YA" },
  { letter: "ར", phonetics: "RA" }, { letter: "ལ", phonetics: "LA" }, { letter: "ཤ", phonetics: "SHA" }, { letter: "ས", phonetics: "SA" },
  { letter: "ཧ", phonetics: "HA" }, { letter: "ཨ", phonetics: "A" }
];

type LangCode = keyof typeof TRANSLATIONS;
type AudioPart = { lang: string; text: string; audio_base64: string; };
type Message = { id?: string; role: "user" | "ai"; content: string; audioSequence?: AudioPart[]; isLoadingAudio?: boolean; };

function ChatInterface() {
  const { userId, getToken } = useAuth();
  const searchParams = useSearchParams();
  
  const urlMode = searchParams.get("mode") as "chat" | "study" | "custom" | null;
  const urlTopic = searchParams.get("topic");

  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  const [isPlaying, setIsPlaying] = useState(false); 
  const [isTtsReady, setIsTtsReady] = useState(false);
  
  const [aiMode, setAiMode] = useState<"chat" | "study" | "custom">(urlMode || "chat");
  const [studyTopic, setStudyTopic] = useState<string>(urlTopic || SYLLABUS_TOPICS[0]);
  
  const [appLanguage, setAppLanguage] = useState<LangCode>("en");
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [pastConversations, setPastConversations] = useState<any[]>([]);

  // NEW: Alphabet Modal States
  const [isAlphabetOpen, setIsAlphabetOpen] = useState(false);
  const [playingLetter, setPlayingLetter] = useState<string | null>(null);

  const t = TRANSLATIONS[appLanguage];

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isPlayingRef = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [playingAudioBase64, setPlayingAudioBase64] = useState<string | null>(null);

  // Time Tracker
  useEffect(() => {
    if (!userId) return;
    const interval = setInterval(async () => {
      try {
        const token = await getToken();
        const formData = new FormData();
        formData.append("user_id", userId);
        formData.append("minutes", "1");
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/track-time`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: formData }).catch(() => {});
      } catch (e) {}
    }, 60000); 
    return () => clearInterval(interval); 
  }, [userId, getToken]);
  
  // TTS Status
  useEffect(() => {
    let interval: NodeJS.Timeout;
    const checkTtsStatus = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/status`);
        const data = await res.json();
        if (data.ready) { setIsTtsReady(true); clearInterval(interval); }
      } catch (e) {}
    };
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wakeup`).then(() => checkTtsStatus()).catch(() => {});
    interval = setInterval(checkTtsStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  // History Fetch & Auto-Load Logic
  useEffect(() => {
    let isMounted = true;
    if (userId) {
      getToken().then(async token => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/conversations?user_id=${userId}`, { headers: { Authorization: `Bearer ${token}` } });
          const data = await res.json();
          const convs = data.conversations || [];
          if (isMounted) setPastConversations(convs);

          // If we came from the Lessons page, find the exact history for this module
          if (urlMode === "study" && urlTopic && isMounted) {
            const latestMatch = convs.find((c: any) => c.mode === "study" && c.topic === urlTopic);
            if (latestMatch) {
              setConversationId(latestMatch.id);
              setAiMode("study");
              // Fetch the messages for this conversation
              const histRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/history?conversation_id=${latestMatch.id}`, { headers: { Authorization: `Bearer ${token}` } });
              const histData = await histRes.json();
              if (histData.messages && isMounted) {
                setMessages(histData.messages.map((m: any) => ({ id: m.id, role: m.role, content: m.content, audioSequence: m.audio_sequence })));
              }
            } else {
               setConversationId(null);
               setMessages([]); // No history for this lesson yet, start fresh
            }
          }
        } catch(e) { console.error(e) }
      });
    }
    return () => { isMounted = false; };
  }, [userId, getToken, urlMode, urlTopic]);

  useEffect(() => {
    if (urlMode) setAiMode(urlMode);
    if (urlTopic) setStudyTopic(urlTopic);
  }, [urlMode, urlTopic]);

  useEffect(() => { if (!isPlaying) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isLoading, isPlaying]);

  useEffect(() => {
    if (isPlaying && playingAudioBase64) {
      const timer = setTimeout(() => {
        const activeEl = document.querySelector('[data-active-part="true"]');
        if (activeEl) activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [playingAudioBase64, isPlaying]);

  const unlockMobileAudio = () => {
    const silentAudio = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA");
    silentAudio.play().catch(() => {});
  };

  const loadConversation = async (id: string, convMode: "chat" | "study" | "custom" = "chat") => {
    setConversationId(id); setAiMode(convMode); setIsHistoryOpen(false); setMessages([]); 
    try {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/history?conversation_id=${id}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.messages) setMessages(data.messages.map((m: any) => ({ id: m.id, role: m.role, content: m.content, audioSequence: m.audio_sequence })));
    } catch (e) { console.error(e); }
  };

  const startNewChat = () => { setConversationId(null); setMessages([]); setIsHistoryOpen(false); };

  const handleTopicChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTopic = e.target.value;
    setStudyTopic(newTopic);
    
    // Check if we have history for this newly selected topic
    const latestMatch = pastConversations.find((c: any) => c.mode === "study" && c.topic === newTopic);
    if (latestMatch) {
       await loadConversation(latestMatch.id, "study");
    } else {
       startNewChat();
    }
  };

  // ==========================================
  // CROSS-PLATFORM AUDIO RECORDING (IOS SAFE)
  // ==========================================
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        setIsTranscribing(true);
        const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType });
        stream.getTracks().forEach(track => track.stop());

        try {
          const token = await getToken();
          const formData = new FormData();
          formData.append("audio", audioBlob);
          formData.append("language", appLanguage);

          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/transcribe`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData
          });
          const data = await res.json();
          if (data.text) {
            setInputText(prev => (prev.trim() + " " + data.text).trim());
          }
        } catch(e) {
          console.error("Transcription failed", e);
        }
        setIsTranscribing(false);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert("Microphone access is required to use dictation. Please allow permissions in your browser settings.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };
  // ==========================================

  const executeSubmission = async () => {
    unlockMobileAudio();
    if (!inputText.trim() || isLoading) return;
    if (isRecording) stopRecording();
    const userMessage = inputText.trim();
    setInputText("");
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    await processMessage(userMessage);
  };

  const sendAutomatedMessage = async (text: string) => {
    unlockMobileAudio();
    let msgText = text;
    if (aiMode === "study" && text === t.startLesson) msgText = `${t.startLesson}: ${studyTopic}`;
    setMessages((prev) => [...prev, { role: "user", content: msgText }]);
    await processMessage(msgText);
  };

  const handleInterrupt = () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    if (currentAudioRef.current) { currentAudioRef.current.pause(); currentAudioRef.current.currentTime = 0; }
    isPlayingRef.current = false; setIsPlaying(false); setIsLoading(false); setPlayingAudioBase64(null);
    setMessages((prev) => prev.map(msg => msg.isLoadingAudio ? { ...msg, isLoadingAudio: false } : msg));
  };

  const processMessage = async (text: string) => {
    setIsLoading(true); 
    abortControllerRef.current = new AbortController();
    const token = await getToken();
    const formData = new FormData();
    formData.append("text", text);
    formData.append("history", JSON.stringify(messages.map(m => ({ role: m.role, content: m.content }))));
    formData.append("mode", aiMode);
    formData.append("language", appLanguage); 
    if (aiMode === "study") formData.append("topic", studyTopic);

    let activeConvId = conversationId;
    if (userId) {
      formData.append("user_id", userId);
      activeConvId = conversationId || crypto.randomUUID();
      if (!conversationId) setConversationId(activeConvId);
      formData.append("conversation_id", activeConvId);
    }

    const tempMsgId = crypto.randomUUID();
    setMessages((prev) => [...prev, { id: tempMsgId, role: "ai", content: "", isLoadingAudio: false }]);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, { 
        method: "POST", 
        headers: { Authorization: `Bearer ${token}` }, 
        body: formData, 
        signal: abortControllerRef.current.signal 
      });

      if (!response.ok) throw new Error("Network error");

      setIsLoading(false); 

      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");
      let aiText = "";
      let finalMessageId = null;

      if (reader) {
        let buffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n\n");
          buffer = lines.pop() || "";
          
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.substring(6));
                
                if (data.type === "chunk") {
                  aiText += data.text;
                  setMessages((prev) => prev.map(msg => msg.id === tempMsgId ? { ...msg, content: aiText } : msg));
                } else if (data.type === "done") {
                  finalMessageId = data.message_id;
                  aiText = data.full_text || aiText;
                }
              } catch (e) {}
            }
          }
        }
      }

      setMessages((prev) => prev.map(msg => msg.id === tempMsgId ? { ...msg, content: aiText, isLoadingAudio: true } : msg));

      if (userId && !conversationId) {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/conversations?user_id=${userId}`, { headers: { Authorization: `Bearer ${token}` } })
          .then(res => res.json()).then(data => setPastConversations(data.conversations || []));
      }

      const ttsFormData = new FormData();
      ttsFormData.append("text", aiText);
      ttsFormData.append("language", appLanguage); 
      if (finalMessageId) ttsFormData.append("message_id", finalMessageId);

      const ttsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tts`, { 
        method: "POST", 
        headers: { Authorization: `Bearer ${token}` }, 
        body: ttsFormData, 
        signal: abortControllerRef.current.signal 
      });
      const ttsData = await ttsResponse.json();

      setMessages((prev) => prev.map(msg => msg.id === tempMsgId ? { ...msg, audioSequence: ttsData.audio_sequence, isLoadingAudio: false } : msg));

      if (ttsData.audio_sequence && ttsData.audio_sequence.length > 0) {
        setIsPlaying(true); isPlayingRef.current = true; let currentIndex = 0;
        const playNext = () => {
          if (!isPlayingRef.current || currentIndex >= ttsData.audio_sequence.length) { setIsPlaying(false); isPlayingRef.current = false; setPlayingAudioBase64(null); return; }
          const part = ttsData.audio_sequence[currentIndex]; currentIndex++;
          if (part.audio_base64) {
            setPlayingAudioBase64(part.audio_base64);
            const audioType = part.lang === "tib" ? "wav" : "mp3";
            const audio = new Audio(`data:audio/${audioType};base64,${part.audio_base64}`);
            if (part.lang === "tib") audio.playbackRate = 1.25;
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
            const updated = [...prev]; const lastMsg = updated[updated.length - 1];
            if (lastMsg && lastMsg.role === "ai" && lastMsg.isLoadingAudio) lastMsg.isLoadingAudio = false; 
            else if (!lastMsg || lastMsg.role === "user") updated.push({ role: "ai", content: "🛑 Interrupted." });
            return updated;
        });
      } else {
        setMessages((prev) => prev.map(msg => msg.id === tempMsgId ? { ...msg, content: "⚠️ Error communicating with AI server.", isLoadingAudio: false } : msg));
      }
      setIsLoading(false);
    }
  };

  const replayAudio = (base64Audio: string, isTibetan: boolean) => {
    if (!base64Audio) return;
    if (currentAudioRef.current) { currentAudioRef.current.pause(); currentAudioRef.current.currentTime = 0; }
    setPlayingAudioBase64(base64Audio); setIsPlaying(true); isPlayingRef.current = true;
    const audioType = isTibetan ? "wav" : "mp3";
    const audio = new Audio(`data:audio/${audioType};base64,${base64Audio}`);
    if (isTibetan) audio.playbackRate = 1.25;
    currentAudioRef.current = audio;
    audio.onended = () => { setPlayingAudioBase64(null); setIsPlaying(false); isPlayingRef.current = false; };
    audio.play().catch(() => { setPlayingAudioBase64(null); setIsPlaying(false); isPlayingRef.current = false; });
  };

  // NEW: Play specific Alphabet Letter Audio directly from the backend
  const playAlphabetLetter = async (letter: string) => {
    if (playingLetter) return;
    setPlayingLetter(letter);
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append("text", letter);
      formData.append("language", "en"); // Base language doesn't matter for single Tibetan characters

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
          audio.onended = () => setPlayingLetter(null);
          audio.play().catch(() => setPlayingLetter(null));
          return; // Early return so we don't reset state before the audio finishes
        }
      }
    } catch (e) { console.error("Alphabet audio failed", e); }
    setPlayingLetter(null);
  };

  return (
    <div className="h-full flex flex-col relative bg-white">
      
      {/* HEADER BAR */}
      <div className="flex flex-wrap justify-between items-center gap-4 p-4 bg-white border-b border-[#e8e4d9] shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
          
          {/* NEW: ALPHABET POP-UP BUTTON */}
          <button 
            onClick={() => setIsAlphabetOpen(true)} 
            className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-stone-50 text-amber-600 hover:bg-stone-100 hover:border-amber-300 transition-all border border-[#e8e4d9] font-serif text-2xl font-bold shadow-sm"
            title="Alphabet Chart"
          >
            ཀ
          </button>
          
          <div className="w-px h-6 bg-stone-200 mx-1"></div> {/* Divider */}

          <button onClick={() => { setAiMode("chat"); startNewChat(); }} className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${aiMode === 'chat' ? 'bg-amber-100 text-amber-800' : 'bg-stone-50 text-stone-600 hover:bg-stone-100'}`}><Zap size={16} /> Chat</button>
          <button onClick={() => setAiMode("study")} className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${aiMode === 'study' ? 'bg-amber-100 text-amber-800' : 'bg-stone-50 text-stone-600 hover:bg-stone-100'}`}><BookOpen size={16} /> Textbook</button>
          <button onClick={() => setAiMode("custom")} className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${aiMode === 'custom' ? 'bg-amber-100 text-amber-800' : 'bg-stone-50 text-stone-600 hover:bg-stone-100'}`}><PenTool size={16} /> Custom Text</button>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <button onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold text-sm bg-stone-50 text-stone-600 hover:bg-stone-100 transition"><Globe size={16} /> {appLanguage.toUpperCase()}</button>
            {isLangMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-[#e8e4d9] shadow-xl rounded-xl overflow-hidden z-50">
                {Object.entries(TRANSLATIONS).map(([code, config]) => (
                  <button key={code} onClick={() => { setAppLanguage(code as LangCode); setIsLangMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-amber-50">{config.name}</button>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => setIsHistoryOpen(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold text-sm bg-stone-50 text-stone-600 hover:bg-stone-100 transition"><History size={16} /> History</button>
          <button onClick={startNewChat} className="p-2 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-lg transition" title="Clear Chat"><Trash2 size={18} /></button>
        </div>
      </div>

      {/* STUDY TOPIC BAR */}
      {aiMode === "study" && (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 p-3 bg-amber-50 border-b border-amber-100 shrink-0">
           <div className="relative w-full max-w-sm flex items-center">
              <List size={18} className="absolute left-3 text-amber-600 pointer-events-none" />
              <select value={studyTopic} onChange={handleTopicChange} className="w-full appearance-none bg-white border border-amber-200 text-stone-800 font-bold text-sm rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm cursor-pointer">
                 {SYLLABUS_TOPICS.map((topic, i) => <option key={i} value={topic}>{topic}</option>)}
              </select>
           </div>
           <button onClick={() => sendAutomatedMessage(t.startLesson)} disabled={!userId || isLoading || isPlaying || !isTtsReady} className="flex items-center justify-center gap-2 text-sm font-bold text-white bg-amber-500 px-5 py-2 rounded-xl shadow-sm hover:bg-amber-600 disabled:opacity-50 w-full sm:w-auto">
             <PlayCircle size={16}/> {t.startLesson}
           </button>
        </div>
      )}

      {/* MESSAGES AREA */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
        {!isTtsReady && <div className="mx-auto w-fit bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 mb-4"><Loader2 size={16} className="animate-spin" /> {t.wakingUp}</div>}
        
        <div className="max-w-3xl mx-auto space-y-8 pb-4">
          {messages.length === 0 && (
            <div className="h-[40vh] flex flex-col items-center justify-center text-stone-400 space-y-4">
              <div className="w-32 h-32 rounded-full border border-[#e8e4d9] shadow-sm overflow-hidden"><img src="/dakini.png" alt="Dolma" className="w-full h-full object-cover" /></div>
              <p className="text-sm font-medium text-center max-w-xs">{t.selectMode}</p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div key={index} className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex items-start w-full gap-3 sm:gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                {msg.role === "user" ? (
                  <div className="w-10 h-10 rounded-full flex-shrink-0 bg-stone-200 border border-stone-300 flex items-center justify-center"><span className="text-stone-500 font-bold text-lg">U</span></div>
                ) : (
                  <div className="flex flex-col gap-4 w-full">
                    {msg.content.split(/([\u0F00-\u0FFF]+[^a-zA-Z0-9(（]*[(（][^)）]+[)）](?:\s*\{[^}]+\})?|[\u0F00-\u0FFF]+(?:[\s\u0F00-\u0FFF]*[\u0F00-\u0FFF]+)*)/g).map((part, i) => {
                      const trimmed = part.trim();
                      if (!trimmed || /^[\.\?\!\,\;]+$/.test(trimmed)) return null;
                      const isTibetan = /[\u0F00-\u0FFF]/.test(trimmed);
                      const matchingAudio = msg.audioSequence?.find(a => a.text === part.trim())?.audio_base64;
                      const isThisPlaying = playingAudioBase64 === matchingAudio && matchingAudio != null;
                      const showSpinner = msg.isLoadingAudio && !matchingAudio;
                      
                      let tibText = trimmed, phonetics = "", translation = "";
                      if (isTibetan) {
                        const transMatch = trimmed.match(/\{([^}]+)\}/);
                        if (transMatch) { translation = transMatch[1].trim(); tibText = trimmed.replace(transMatch[0], '').trim(); }
                        if (tibText.includes('(') || tibText.includes('（')) {
                          const splitIdx = tibText.lastIndexOf('(') !== -1 ? tibText.lastIndexOf('(') : tibText.lastIndexOf('（');
                          phonetics = tibText.substring(splitIdx + 1).replace(/[)）]/g, '').trim().toUpperCase();
                          tibText = tibText.substring(0, splitIdx).trim();
                        }
                      }
                      return (
                        <div key={i} data-active-part={isThisPlaying} className="flex flex-row items-start gap-3 w-full scroll-mt-24">
                          
                          {/* The original Avatar Button (Kept intact) */}
                          <button onClick={() => matchingAudio && replayAudio(matchingAudio, isTibetan)} disabled={!matchingAudio && !showSpinner} className={`relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 transition-all duration-300 mt-1 ${isThisPlaying ? 'ring-4 ring-amber-500 scale-110 shadow-lg' : 'border border-[#e8e4d9] shadow-sm'} ${matchingAudio ? 'cursor-pointer' : 'cursor-default'}`}>
                            <img src={isTibetan ? "/yogi.png" : "/dakini.png"} alt="Avatar" className={`w-full h-full object-cover ${isThisPlaying ? 'animate-pulse' : ''} ${showSpinner ? 'opacity-40 grayscale' : ''}`} />
                            {showSpinner && <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin text-stone-700" /></div>}
                          </button>
                          
                          {/* The Text Bubble containing both the text AND the new Listen Button */}
                          <div className={`px-5 py-4 rounded-2xl shadow-sm rounded-tl-none w-fit max-w-[85%] border ${isTibetan ? 'bg-[#f8f6f0] border-[#e8e4d9]' : 'bg-white border-stone-200 text-stone-800'}`}>
                            {isTibetan ? (
                              <div className="flex flex-row items-center justify-between gap-6 sm:gap-8">
                                <div className="flex flex-col gap-2">
                                  <span className="text-2xl sm:text-3xl font-medium">{tibText}</span>
                                  {phonetics && <span className="text-[12px] text-stone-500 font-bold tracking-widest uppercase">{phonetics}</span>}
                                  {translation && <span className="text-sm text-stone-600 font-medium italic mt-1 border-t border-amber-200/50 pt-2">{translation}</span>}
                                </div>
                                
                                {/* The specific Play Listen Button injected on the right side */}
                                <button 
                                  onClick={() => matchingAudio && replayAudio(matchingAudio, isTibetan)}
                                  disabled={!matchingAudio && !showSpinner}
                                  className={`flex items-center gap-1.5 px-3 py-2 bg-white border border-[#e8e4d9] rounded-lg shadow-sm text-sm font-bold text-stone-700 shrink-0 transition-all ${matchingAudio ? 'hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 cursor-pointer' : 'opacity-50 cursor-default'}`}
                                >
                                  {showSpinner ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} className="fill-currentColor" />} Listen
                                </button>
                                
                              </div>
                            ) : (
                              <div className="flex items-start justify-between gap-4">
                                <p className="whitespace-pre-wrap text-[16px] leading-relaxed">{trimmed}</p>
                                
                                {/* A subtle play button added to English/Base conversational text as well */}
                                {matchingAudio && (
                                  <button 
                                    onClick={() => replayAudio(matchingAudio, isTibetan)}
                                    className="mt-1 shrink-0 text-stone-400 hover:text-amber-500 transition-colors"
                                    title="Listen"
                                  >
                                    <Play size={16} className="fill-currentColor" />
                                  </button>
                                )}
                                
                              </div>
                            )}
                          </div>
                          
                        </div>
                      );
                    })}
                  </div>
                )}
                {msg.role === "user" && <div className="p-4 rounded-2xl shadow-sm bg-stone-800 text-white rounded-br-none w-fit max-w-[80%] whitespace-pre-wrap"><p>{msg.content}</p></div>}
              </div>
            </div>
          ))}
          {isLoading && !isPlaying && <div className="flex items-center gap-3 text-stone-500 p-2 ml-14"><Loader2 className="w-5 h-5 animate-spin" /><span className="text-sm font-bold">{t.thinking}</span></div>}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* INPUT AREA */}
      <div className="p-4 bg-white border-t border-[#e8e4d9] shrink-0">
        <div className="w-full max-w-3xl mx-auto flex justify-center items-center gap-3 mb-3">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">{t.letTaraLead}</span>
          <button onClick={() => sendAutomatedMessage(messages.length === 0 ? t.start : t.continue)} disabled={!userId || isLoading || isRecording || isTranscribing || isPlaying || !isTtsReady} className="px-8 py-1.5 bg-amber-500 text-white rounded-full font-bold shadow-sm hover:bg-amber-600 transition disabled:opacity-50">
            {t.continue}
          </button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); executeSubmission(); }} className="flex items-end gap-2 w-full max-w-3xl mx-auto">
          <button type="button" onClick={isRecording ? stopRecording : startRecording} disabled={!userId || isLoading || isTranscribing || isPlaying || !isTtsReady} className={`w-12 h-12 flex items-center justify-center rounded-xl transition-colors shrink-0 mb-1 ${isRecording ? "bg-red-500" : "bg-stone-100 hover:bg-stone-200"} disabled:opacity-50`}>
            {isTranscribing ? <Loader2 size={18} className="animate-spin text-stone-400" /> : isRecording ? <Square size={18} className="fill-white text-white" /> : <Mic size={20} className="text-stone-600" />}
          </button>
          <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); executeSubmission(); } }} disabled={!userId || isLoading || isTranscribing || isPlaying || !isTtsReady} placeholder={!isTtsReady ? t.wakingUp : isTranscribing ? "Transcribing..." : t.typePlaceholder} className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-3.5 text-[16px] text-stone-800 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 resize-none custom-scrollbar" style={{ minHeight: '48px', maxHeight: '120px' }} />
          <button type="submit" disabled={!userId || !inputText.trim() || isLoading || isTranscribing || isPlaying || !isTtsReady} className="w-12 h-12 flex items-center justify-center bg-amber-500 text-white rounded-xl hover:bg-amber-600 disabled:opacity-50 transition-colors shrink-0 mb-1"><Send size={18} /></button>
          <button type="button" onClick={handleInterrupt} disabled={!(isLoading || isPlaying)} className="w-12 h-12 flex items-center justify-center bg-rose-100 text-rose-600 rounded-xl hover:bg-rose-200 disabled:opacity-50 transition-colors shrink-0 mb-1"><StopCircle size={20} /></button>
        </form>
      </div>

      {/* HISTORY DRAWER */}
      {isHistoryOpen && (
        <div className="absolute inset-y-0 right-0 w-80 bg-white shadow-2xl border-l border-[#e8e4d9] flex flex-col z-50 animate-in slide-in-from-right-8">
          <div className="flex items-center justify-between p-4 border-b border-[#e8e4d9] bg-[#f8f6f0]">
            <h3 className="font-bold text-stone-800">Chat History</h3>
            <button onClick={() => setIsHistoryOpen(false)} className="p-1 hover:bg-stone-200 rounded text-stone-500"><X size={20}/></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <button onClick={startNewChat} className="w-full bg-stone-800 text-white py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-stone-700 mb-4"><Plus size={16}/> New Chat</button>
            {pastConversations.map(c => (
               <div key={c.id} className="w-full text-left p-3 rounded-xl border border-stone-100 hover:border-amber-300 hover:bg-amber-50 transition cursor-pointer" onClick={() => loadConversation(c.id, c.mode)}>
                 <div className="text-sm font-bold text-stone-700 capitalize">{c.mode} Session</div>
                 <div className="text-[10px] text-stone-400 mt-1">{new Date(c.created_at).toLocaleString()}</div>
               </div>
            ))}
          </div>
        </div>
      )}

      {/* NEW: ALPHABET POP-UP MODAL */}
      {isAlphabetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={() => setIsAlphabetOpen(false)}></div>
          <div className="relative bg-[#fdfbf7] rounded-2xl shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between mb-6 border-b border-[#e8e4d9] pb-4">
              <div>
                <h2 className="text-2xl font-bold font-serif text-stone-900">The 30 Consonants</h2>
                <p className="text-sm text-stone-500">Tap any letter to hear its pronunciation.</p>
              </div>
              <button onClick={() => setIsAlphabetOpen(false)} className="text-stone-400 hover:bg-stone-200 p-2 rounded-lg transition"><X size={24}/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-4">
              <div className="grid grid-cols-4 gap-3 sm:gap-4">
                {TIBETAN_ALPHABET.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => playAlphabetLetter(item.letter)}
                    disabled={playingLetter !== null}
                    className="flex flex-col items-center justify-center p-4 bg-white border border-[#e8e4d9] rounded-xl hover:border-amber-400 hover:shadow-md transition-all group relative"
                  >
                    <span className="text-3xl sm:text-4xl font-medium text-stone-800 mb-2 group-hover:text-amber-600 transition-colors">{item.letter}</span>
                    <span className="text-[10px] font-bold tracking-widest text-stone-400 uppercase">{item.phonetics}</span>
                    
                    {playingLetter === item.letter && (
                      <div className="absolute inset-0 bg-white/80 rounded-xl flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-amber-500" size={40} /></div>}>
      <ChatInterface />
    </Suspense>
  );
}