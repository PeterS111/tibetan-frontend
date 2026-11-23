// app/dashboard/ai-tutor/page.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import {
  Sparkles,
  Mic,
  Square,
  Send,
  Volume2,
  Loader2,
  RotateCcw,
  SlidersHorizontal,
  Eye,
  EyeOff,
  X,
  AlertCircle,
  CheckCircle2,
  MessageCircle,
  ShieldCheck,
  BookOpen,
  Award,
  Gauge,
} from "lucide-react";
import { useDevBypass } from "@/hooks/useDevBypass";
import { usePlatform } from "@/hooks/usePlatform";

interface SuggestedReply {
  tibetan: string;
  phonetic: string;
  english: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  tibetan: string;
  phonetic?: string;
  english?: string;
  feedback?: string;
  suggestedReplies?: SuggestedReply[];
  modelUsed?: string;
  tokensUsed?: number;
  latencyMs?: number;
  sttProvider?: string;
  needsTapToPlay?: boolean;
}

interface ReadingWordEval {
  target: string;
  status: "correct" | "needs_work" | "missed" | string;
  expected_phonetic: string;
  heard_as: string;
  tip: string;
}

interface ReadingEvaluation {
  overall_score: number;
  grade_label: string;
  what_was_heard: string;
  summary_feedback: string;
  word_evaluations: ReadingWordEval[];
  next_focus: string;
  modelUsed?: string;
  tokensUsed?: number;
  latencyMs?: number;
}

interface QuotaTierInfo {
  used: number;
  limit: number;
  global_used?: number;
  global_limit?: number;
}

interface QuotaSnapshot {
  date_utc: string;
  frontier: QuotaTierInfo;
  fast: QuotaTierInfo;
  lite: QuotaTierInfo;
}

interface HealthStatus {
  ready: boolean;
  monlam_configured: boolean;
  gemini_configured: boolean;
  jwks_verified?: boolean;
  default_model: string;
  quota?: QuotaSnapshot;
}

interface AudioInputDevice {
  deviceId: string;
  label: string;
}

const TUTOR_MODES = [
  { id: "conversation", label: "Free Chat" },
  { id: "beginner_drill", label: "Beginner 1–2 Drill" },
  { id: "grammar", label: "Grammar Coach" },
  { id: "pronunciation", label: "Speaking Practice" },
  { id: "reading", label: "Reading Practice" },
];

const GEMINI_MODELS = [
  { id: "gemini-4-hydrogen", label: "Gemini 4 Hydrogen (Fast Default)" },
  { id: "gemini-4-argon", label: "Gemini 4 Argon (Frontier · Capped)" },
  { id: "gemini-4-carbon", label: "Gemini 4 Carbon (Deepest · Capped)" },
  { id: "gemini-4-neon", label: "Gemini 4 Neon (High Accuracy · Capped)" },
  { id: "gemini-3.8-flash", label: "Gemini 3.8 Flash" },
  { id: "gemini-3.5-flash-lite", label: "Gemini 3.5 Flash-Lite" },
];

const FRONTIER_MODEL_IDS = new Set([
  "gemini-4-neon",
  "gemini-4-argon",
  "gemini-4-carbon",
]);

const STT_PROVIDERS = [
  { id: "auto", label: "Auto (Monlam → Gemini Fallback)" },
  { id: "monlam", label: "Monlam STT Only" },
  { id: "gemini", label: "Gemini 4 Hydrogen Audio" },
];

const TTS_PROVIDERS = [
  { id: "auto", label: "Auto (Monlam → Gemini 3.8 TTS)" },
  { id: "monlam", label: "Monlam TTS Only" },
  { id: "gemini_flash", label: "Gemini 3.8 Flash TTS" },
  { id: "gemini_lite", label: "Gemini 3.8 Flash-Lite TTS" },
];

const MONLAM_VOICES = [
  { id: "lhasa_female", label: "Lhasa Female (Default)" },
  { id: "lhasa_male", label: "Lhasa Male" },
  { id: "dolkar_lhasa_female", label: "Dolkar (Lhasa F)" },
  { id: "yangchen_lhasa_female", label: "Yangchen (Lhasa F)" },
  { id: "darjeeyalphel_lhasa_male", label: "Darjeeyalphel (Lhasa M)" },
  { id: "sonamtsering_lhasa_male", label: "Sonam Tsering (Lhasa M)" },
  { id: "amdo_female", label: "Amdo Female" },
  { id: "amdo_male", label: "Amdo Male" },
  { id: "kham_female", label: "Kham Female" },
  { id: "kham_male", label: "Kham Male" },
];

const STARTER_PROMPTS: SuggestedReply[] = [
  {
    tibetan: "བཀྲ་ཤིས་བདེ་ལེགས། ང་བོད་སྐད་སྦྱོང་གི་ཡོད།",
    phonetic: "Tashi delek! Nga Bö-ke jong-gi yö.",
    english: "Hello! I am learning Tibetan.",
  },
  {
    tibetan: "རྒན་ལགས། ཁྱེད་རང་སྐུ་ཁམས་བཟང་ངམ།",
    phonetic: "Gen-la, khye-rang ku-kham sang-ngam?",
    english: "Teacher, how are you?",
  },
  {
    tibetan: "དེ་རིང་གཟའ་གང་རེད།",
    phonetic: "De-ring za gang re?",
    english: "What day of the week is today?",
  },
];

const READING_PRESETS = [
  {
    id: "classroom",
    title: "Classroom (Beginner 1–2)",
    tibetan: "བཀྲ་ཤིས་བདེ་ལེགས། ང་བོད་སྐད་སྦྱོང་གི་ཡོད། དེ་རིང་གཟའ་ཟླ་བ་རེད།",
    english: "Hello! I am learning Tibetan. Today is Monday.",
  },
  {
    id: "everyday",
    title: "Everyday Lhasa",
    tibetan: "ཁྱེད་རང་གང་ནས་ཡིན་པས། ང་དབྱིན་ཡུལ་ནས་ཡིན། ང་བོད་ཇ་མངར་མོ་ལ་དགའ་པོ་ཡོད།",
    english: "Where are you from? I am from the UK. I like sweet Tibetan tea.",
  },
  {
    id: "refuge",
    title: "Dharma · Refuge",
    tibetan: "སངས་རྒྱས་ཆོས་དང་ཚོགས་ཀྱི་མཆོག་རྣམས་ལ། བྱང་ཆུབ་བར་དུ་བདག་ནི་སྐྱབས་སུ་མཆི།",
    english: "In the Buddha, the Dharma, and the Supreme Assembly, I take refuge until enlightenment.",
  },
  {
    id: "simhamukha",
    title: "Dharma · Simhamukha",
    tibetan: "མཁའ་འགྲོ་སེང་གེ་གདོང་མ་ལ་ཕྱག་འཚལ་ལོ། བར་ཆད་ཐམས་ཅད་ཞི་བར་མཛོད།",
    english: "Homage to Dakini Simhamukha; please pacify all obstacles.",
  },
];

const SESSION_CHAT_KEY = "loplao_dev_ai_tutor_messages_v1";
const PREFS_KEY = "loplao_dev_ai_tutor_prefs_v3";

function renderRichFeedback(text: string) {
  const parts = text.split(/([\u0F00-\u0FFF]+)/g);
  return parts.map((part, idx) =>
    /[\u0F00-\u0FFF]/.test(part) ? (
      <span
        key={idx}
        className="font-tibetan text-[17px] leading-relaxed text-ink mx-0.5 inline-block"
      >
        {part}
      </span>
    ) : (
      <span key={idx}>{part}</span>
    )
  );
}

export default function AiTutorPage() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const { isDevUnlocked, isChecking } = useDevBypass();
  const { isNative } = usePlatform();

  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [quota, setQuota] = useState<QuotaSnapshot | null>(null);
  const [quotaExceededError, setQuotaExceededError] = useState<boolean>(false);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [mode, setMode] = useState("conversation");
  const [selectedModel, setSelectedModel] = useState("gemini-4-hydrogen");
  const [readingModel, setReadingModel] = useState("gemini-4-argon");
  const [selectedVoice, setSelectedVoice] = useState("lhasa_female");
  const [sttProvider, setSttProvider] = useState("auto");
  const [ttsProvider, setTtsProvider] = useState("auto");

  // Reading Practice state
  const [readingText, setReadingText] = useState(READING_PRESETS[0].tibetan);
  const [readingEval, setReadingEval] = useState<ReadingEvaluation | null>(null);
  const [isEvaluatingReading, setIsEvaluatingReading] = useState(false);

  const [audioDevices, setAudioDevices] = useState<AudioInputDevice[]>([]);
  const [selectedMicId, setSelectedMicId] = useState<string>("");
  const [micLevel, setMicLevel] = useState<number>(0);

  const [autoPlayTts, setAutoPlayTts] = useState(true);
  const [autoSendVoice, setAutoSendVoice] = useState(true);
  const [showTranslations, setShowTranslations] = useState(true);
  const [showControls, setShowControls] = useState(false);

  const [isSending, setIsSending] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [infoNotice, setInfoNotice] = useState<string | null>(null);

  const [playingMsgId, setPlayingMsgId] = useState<string | null>(null);
  const [loadingAudioMsgId, setLoadingAudioMsgId] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ttsCacheRef = useRef<Map<string, string>>(new Map());
  const ttsReqIdRef = useRef<number>(0);
  const ttsAbortRef = useRef<AbortController | null>(null);
  const chatReqIdRef = useRef<number>(0);
  const chatAbortRef = useRef<AbortController | null>(null);
  const messagesRef = useRef<ChatMessage[]>([]);
  const recordIntentRef = useRef<"chat" | "reading">("chat");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cancelRecordRef = useRef<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafMeterRef = useRef<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Restore saved chat & dev config preferences
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const savedChat = sessionStorage.getItem(SESSION_CHAT_KEY);
      if (savedChat) {
        const parsed = JSON.parse(savedChat);
        if (Array.isArray(parsed)) setMessages(parsed);
      }
      const savedPrefs = localStorage.getItem(PREFS_KEY);
      if (savedPrefs) {
        const p = JSON.parse(savedPrefs);
        if (p.mode) setMode(p.mode);
        if (p.selectedModel && GEMINI_MODELS.some((m) => m.id === p.selectedModel)) {
          setSelectedModel(p.selectedModel);
        }
        if (p.readingModel && GEMINI_MODELS.some((m) => m.id === p.readingModel)) {
          setReadingModel(p.readingModel);
        }
        if (p.selectedVoice) setSelectedVoice(p.selectedVoice);
        if (p.sttProvider) setSttProvider(p.sttProvider);
        if (p.ttsProvider) setTtsProvider(p.ttsProvider);
        if (typeof p.autoPlayTts === "boolean") setAutoPlayTts(p.autoPlayTts);
        if (typeof p.autoSendVoice === "boolean") setAutoSendVoice(p.autoSendVoice);
        if (typeof p.showTranslations === "boolean") setShowTranslations(p.showTranslations);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      sessionStorage.setItem(SESSION_CHAT_KEY, JSON.stringify(messages.slice(-40)));
    } catch {}
  }, [messages]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(
        PREFS_KEY,
        JSON.stringify({
          mode,
          selectedModel,
          readingModel,
          selectedVoice,
          sttProvider,
          ttsProvider,
          autoPlayTts,
          autoSendVoice,
          showTranslations,
        })
      );
    } catch {}
  }, [
    mode,
    selectedModel,
    readingModel,
    selectedVoice,
    sttProvider,
    ttsProvider,
    autoPlayTts,
    autoSendVoice,
    showTranslations,
  ]);

  const refreshMicrophones = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.enumerateDevices) return;
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const mics = devices
        .filter((d) => d.kind === "audioinput")
        .map((d, idx) => ({
          deviceId: d.deviceId,
          label: d.label || `Microphone ${idx + 1}`,
        }));
      setAudioDevices(mics);
    } catch {}
  }, []);

  const clearTtsCache = useCallback(() => {
    ttsCacheRef.current.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch {}
    });
    ttsCacheRef.current.clear();
  }, []);

  const stopPlayback = useCallback(() => {
    ttsReqIdRef.current += 1;
    if (ttsAbortRef.current) {
      ttsAbortRef.current.abort();
      ttsAbortRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } catch {}
      audioRef.current = null;
    }
    setLoadingAudioMsgId(null);
    setPlayingMsgId(null);
  }, []);

  const cleanupRecorder = useCallback(() => {
    if (rafMeterRef.current !== null) {
      cancelAnimationFrame(rafMeterRef.current);
      rafMeterRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch {}
      audioCtxRef.current = null;
    }
    if (recordTimerRef.current) {
      clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    mediaRecorderRef.current = null;
    setIsRecording(false);
    setRecordSeconds(0);
    setMicLevel(0);
  }, []);

  useEffect(() => {
    refreshMicrophones();
    return () => {
      stopPlayback();
      cleanupRecorder();
      clearTtsCache();
      if (chatAbortRef.current) chatAbortRef.current.abort();
    };
  }, [refreshMicrophones, stopPlayback, cleanupRecorder, clearTtsCache]);

  useEffect(() => {
    if (mode !== "reading") {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isSending, isTranscribing, mode]);

  useEffect(() => {
    if (isChecking || !isDevUnlocked || !user) return;
    let active = true;
    const checkHealth = async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai/health`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        if (active) {
          setHealth(data);
          if (data?.quota) setQuota(data.quota);
        }
      } catch {}
    };
    checkHealth();
    return () => {
      active = false;
    };
  }, [isChecking, isDevUnlocked, user, getToken]);

  const speakTibetan = useCallback(
    async (msgId: string, tibetanText: string, isAutoPlay = false) => {
      const clean = tibetanText.trim();
      if (!clean) return;

      if (playingMsgId === msgId) {
        stopPlayback();
        return;
      }

      stopPlayback();
      const myReqId = ++ttsReqIdRef.current;
      const cacheKey = `${msgId}:${ttsProvider}:${selectedVoice}:${clean}`;
      const cachedUrl = ttsCacheRef.current.get(cacheKey);

      const playBlobUrl = async (blobUrl: string) => {
        if (myReqId !== ttsReqIdRef.current) return;
        const audio = new Audio(blobUrl);
        audioRef.current = audio;
        setLoadingAudioMsgId(null);
        setPlayingMsgId(msgId);

        audio.onended = () => {
          if (audioRef.current === audio) {
            audioRef.current = null;
            setPlayingMsgId(null);
          }
        };
        audio.onerror = () => {
          if (audioRef.current === audio) {
            audioRef.current = null;
            setPlayingMsgId(null);
          }
        };

        try {
          await audio.play();
          setMessages((prev) =>
            prev.map((m) => (m.id === msgId ? { ...m, needsTapToPlay: false } : m))
          );
        } catch (playErr: unknown) {
          if (audioRef.current === audio) {
            audioRef.current = null;
          }
          setPlayingMsgId(null);
          const errName = playErr instanceof Error ? playErr.name : "";
          if (errName === "NotAllowedError" && isAutoPlay) {
            setMessages((prev) =>
              prev.map((m) => (m.id === msgId ? { ...m, needsTapToPlay: true } : m))
            );
          } else if (errName !== "AbortError") {
            setInfoNotice(
              "Audio playback was blocked or unavailable — Speech-to-Text and Chat still work normally."
            );
          }
        }
      };

      if (cachedUrl) {
        await playBlobUrl(cachedUrl);
        return;
      }

      setLoadingAudioMsgId(msgId);
      const controller = new AbortController();
      ttsAbortRef.current = controller;

      try {
        const token = await getToken();
        if (!token) throw new Error("Authentication unavailable.");
        if (myReqId !== ttsReqIdRef.current) return;

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai/tts`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: clean,
            voice_name: selectedVoice,
            tts_provider: ttsProvider,
          }),
          signal: controller.signal,
        });

        if (myReqId !== ttsReqIdRef.current) return;

        if (!res.ok) {
          let errMsg =
            "Voice playback is temporarily unavailable — Speech-to-Text, Chat, and Reading Practice still work normally.";
          try {
            const errJson = await res.json();
            if (errJson?.error) errMsg = errJson.error;
          } catch {}
          // Non-breaking notice so STT/chat continue smoothly
          setLoadingAudioMsgId(null);
          setPlayingMsgId(null);
          setInfoNotice(errMsg);
          return;
        }

        const usedProvider = (res.headers.get("x-tts-provider") || "").toLowerCase();
        if (usedProvider === "gemini_fallback") {
          setInfoNotice("Monlam TTS was unavailable — playing Gemini 3.8 Flash TTS fallback.");
        }

        const ctype = (res.headers.get("content-type") || "").toLowerCase();
        let blobUrl: string;
        if (ctype.includes("application/json")) {
          const data = await res.json();
          if (!data?.audio_base64) throw new Error(data?.error || "Empty audio response.");
          const raw = atob(data.audio_base64);
          const bytes = new Uint8Array(raw.length);
          for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
          blobUrl = URL.createObjectURL(new Blob([bytes], { type: data.mime_type || "audio/wav" }));
        } else {
          const blob = await res.blob();
          blobUrl = URL.createObjectURL(blob);
        }

        if (myReqId !== ttsReqIdRef.current) {
          URL.revokeObjectURL(blobUrl);
          return;
        }

        ttsCacheRef.current.set(cacheKey, blobUrl);
        await playBlobUrl(blobUrl);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        if (myReqId === ttsReqIdRef.current) {
          setLoadingAudioMsgId(null);
          setPlayingMsgId(null);
          const msg =
            err instanceof Error
              ? `${err.message} (Speech-to-Text and Chat still work normally.)`
              : "Voice playback unavailable — Speech-to-Text and Chat still work normally.";
          setInfoNotice(msg);
        }
      }
    },
    [getToken, playingMsgId, selectedVoice, ttsProvider, stopPlayback]
  );

  const sendMessage = useCallback(
    async (textOverride?: string, sttProviderTag?: string) => {
      const content = (textOverride ?? inputText).trim();
      if (!content || isSending) return;

      setErrorBanner(null);
      setQuotaExceededError(false);
      if (textOverride === undefined) {
        setInputText("");
      }

      const myChatId = ++chatReqIdRef.current;
      if (chatAbortRef.current) chatAbortRef.current.abort();
      const controller = new AbortController();
      chatAbortRef.current = controller;

      const userMessage: ChatMessage = {
        id: `u_${Date.now()}`,
        role: "user",
        tibetan: content,
        sttProvider: sttProviderTag,
      };

      const historyPayload = messagesRef.current.map((m) => ({
        role: m.role,
        text: m.role === "assistant" ? `${m.tibetan} (${m.english || ""})` : m.tibetan,
      }));

      setMessages((prev) => [...prev, userMessage]);
      setIsSending(true);

      try {
        const token = await getToken();
        if (!token) throw new Error("Authentication unavailable.");

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai/chat`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: content,
            history: historyPayload,
            mode: mode === "reading" ? "conversation" : mode,
            model: selectedModel,
          }),
          signal: controller.signal,
        });

        const data = await res.json();
        if (myChatId !== chatReqIdRef.current) return;

        if (data?.quota) setQuota(data.quota);

        if (res.status === 429 || data?.code === "quota_exceeded") {
          setIsSending(false);
          setQuotaExceededError(true);
          setErrorBanner(data?.error || "Daily token quota reached for this model.");
          return;
        }

        if (!res.ok || !data?.reply) {
          throw new Error(data?.error || "Tutor request failed.");
        }

        const assistantId = `a_${Date.now()}`;
        const reply = data.reply;
        const assistantMessage: ChatMessage = {
          id: assistantId,
          role: "assistant",
          tibetan: reply.tibetan || "",
          phonetic: reply.phonetic || "",
          english: reply.english || "",
          feedback: reply.feedback || "",
          suggestedReplies: Array.isArray(reply.suggested_replies)
            ? reply.suggested_replies
            : [],
          modelUsed: data.model_used,
          tokensUsed: data.tokens_used,
          latencyMs: data.latency_ms,
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setIsSending(false);

        if (autoPlayTts && assistantMessage.tibetan) {
          speakTibetan(assistantId, assistantMessage.tibetan, true);
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        if (myChatId === chatReqIdRef.current) {
          setIsSending(false);
          const msg = err instanceof Error ? err.message : "Could not reach AI Tutor backend.";
          setErrorBanner(msg);
        }
      }
    },
    [inputText, isSending, getToken, mode, selectedModel, autoPlayTts, speakTibetan]
  );

  const transcribeAudioBlob = useCallback(
    async (blob: Blob, mimeType: string) => {
      setIsTranscribing(true);
      setErrorBanner(null);
      setQuotaExceededError(false);

      try {
        const token = await getToken();
        if (!token) throw new Error("Authentication unavailable.");

        const ext = mimeType.includes("mp4")
          ? "mp4"
          : mimeType.includes("ogg")
          ? "ogg"
          : "webm";

        const lastAssistant = [...messagesRef.current]
          .reverse()
          .find((m) => m.role === "assistant");
        const contextHint = lastAssistant
          ? `${lastAssistant.tibetan} (${lastAssistant.english || ""})`
          : "";

        const formData = new FormData();
        formData.append("audio", blob, `recording.${ext}`);
        formData.append("language", "bo");
        formData.append("stt_provider", sttProvider);
        if (contextHint) {
          formData.append("context_hint", contextHint);
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai/stt`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        const data = await res.json();
        if (data?.quota) setQuota(data.quota);

        if (!res.ok) {
          throw new Error(data?.error || "Speech-to-Text failed.");
        }

        const transcript = (data?.transcript || "").trim();
        const usedProvider = data?.provider || "";
        setIsTranscribing(false);

        if (usedProvider === "gemini_fallback") {
          setInfoNotice("Monlam STT returned 503 — automatically transcribed using Gemini 4 Hydrogen audio.");
        }

        if (!transcript) {
          const dbg = data?.debug;
          if (dbg?.reason === "silent_mic") {
            setShowControls(true);
            setErrorBanner(
              `Microphone recorded silence (RMS=${dbg.rms_level}). Open Dev Config above to pick your active microphone.`
            );
          } else {
            setErrorBanner("No speech detected. Try speaking clearly for 1–3 seconds.");
          }
          return;
        }

        if (autoSendVoice) {
          await sendMessage(transcript, usedProvider);
        } else {
          setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      } catch (err: unknown) {
        setIsTranscribing(false);
        const msg = err instanceof Error ? err.message : "Speech transcription failed.";
        setErrorBanner(msg);
      }
    },
    [getToken, sttProvider, autoSendVoice, sendMessage]
  );

  const evaluateReadingBlob = useCallback(
    async (blob: Blob, mimeType: string) => {
      const target = readingText.trim();
      if (!target) {
        setErrorBanner("Please enter or choose a Tibetan passage to read first.");
        return;
      }

      setIsEvaluatingReading(true);
      setErrorBanner(null);
      setQuotaExceededError(false);

      try {
        const token = await getToken();
        if (!token) throw new Error("Authentication unavailable.");

        const ext = mimeType.includes("mp4")
          ? "mp4"
          : mimeType.includes("ogg")
          ? "ogg"
          : "webm";

        const formData = new FormData();
        formData.append("audio", blob, `reading.${ext}`);
        formData.append("target_text", target);
        formData.append("model", readingModel);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai/evaluate-reading`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        const data = await res.json();
        if (data?.quota) setQuota(data.quota);

        if (res.status === 429 || data?.code === "quota_exceeded") {
          setIsEvaluatingReading(false);
          setQuotaExceededError(true);
          setErrorBanner(data?.error || "Daily token limit reached for Frontier models.");
          return;
        }

        if (!res.ok || !data?.evaluation) {
          throw new Error(data?.error || "Reading evaluation failed.");
        }

        setReadingEval({
          ...data.evaluation,
          modelUsed: data.model_used,
          tokensUsed: data.tokens_used,
          latencyMs: data.latency_ms,
        });
        setIsEvaluatingReading(false);
      } catch (err: unknown) {
        setIsEvaluatingReading(false);
        const msg = err instanceof Error ? err.message : "Could not evaluate your reading.";
        setErrorBanner(msg);
      }
    },
    [getToken, readingText, readingModel]
  );

  const startRecording = async (intent: "chat" | "reading") => {
    if (isRecording || isTranscribing || isSending || isEvaluatingReading) return;
    if (intent === "reading" && !readingText.trim()) {
      setErrorBanner("Enter or pick a Tibetan passage before recording.");
      return;
    }

    setErrorBanner(null);
    setQuotaExceededError(false);
    stopPlayback();
    recordIntentRef.current = intent;

    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setErrorBanner("Microphone access is not supported on this device or browser.");
      return;
    }

    try {
      const audioConstraints: MediaTrackConstraints = selectedMicId
        ? {
            deviceId: { exact: selectedMicId },
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          }
        : {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          };

      const stream = await navigator.mediaDevices.getUserMedia({ audio: audioConstraints });
      mediaStreamRef.current = stream;
      refreshMicrophones();

      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          audioCtxRef.current = ctx;
          const source = ctx.createMediaStreamSource(stream);
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 256;
          source.connect(analyser);
          const dataArr = new Uint8Array(analyser.frequencyBinCount);

          const tickMeter = () => {
            analyser.getByteTimeDomainData(dataArr);
            let sum = 0;
            for (let i = 0; i < dataArr.length; i++) {
              const v = (dataArr[i] - 128) / 128;
              sum += v * v;
            }
            const rms = Math.sqrt(sum / dataArr.length);
            setMicLevel(Math.min(100, Math.round(rms * 420)));
            rafMeterRef.current = requestAnimationFrame(tickMeter);
          };
          tickMeter();
        }
      } catch {}

      const candidateTypes = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/mp4",
        "audio/ogg;codecs=opus",
      ];
      const supportedMime =
        typeof MediaRecorder !== "undefined"
          ? candidateTypes.find((t) => MediaRecorder.isTypeSupported(t)) || ""
          : "";

      const recorder = supportedMime
        ? new MediaRecorder(stream, { mimeType: supportedMime })
        : new MediaRecorder(stream);

      const activeMime = recorder.mimeType || supportedMime || "audio/webm";
      recordedChunksRef.current = [];
      cancelRecordRef.current = false;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const wasCancelled = cancelRecordRef.current;
        const chunks = recordedChunksRef.current;
        const activeIntent = recordIntentRef.current;
        cleanupRecorder();
        if (!wasCancelled && chunks.length > 0) {
          const blob = new Blob(chunks, { type: activeMime });
          if (activeIntent === "reading") {
            evaluateReadingBlob(blob, activeMime);
          } else {
            transcribeAudioBlob(blob, activeMime);
          }
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      setRecordSeconds(0);

      recordTimerRef.current = setInterval(() => {
        setRecordSeconds((s) => s + 1);
      }, 1000);
    } catch (err: unknown) {
      cleanupRecorder();
      const errName = err instanceof Error ? err.name : "";
      setErrorBanner(
        errName === "NotAllowedError"
          ? "Microphone permission was denied. Please enable mic access in your browser/app settings."
          : "Could not start microphone recording. Check Dev Config to select a valid microphone."
      );
    }
  };

  const stopRecording = (cancel = false) => {
    cancelRecordRef.current = cancel;
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.requestData();
      } catch {}
      mediaRecorderRef.current.stop();
    } else {
      cleanupRecorder();
    }
  };

  const handleModeChange = (nextMode: string) => {
    if (isRecording) stopRecording(true);
    setErrorBanner(null);
    setQuotaExceededError(false);
    setMode(nextMode);
  };

  const handleResetChat = () => {
    chatReqIdRef.current += 1;
    if (chatAbortRef.current) {
      chatAbortRef.current.abort();
      chatAbortRef.current = null;
    }
    stopPlayback();
    clearTtsCache();
    setIsSending(false);
    setMessages([]);
    setReadingEval(null);
    setErrorBanner(null);
    setQuotaExceededError(false);
    setInfoNotice(null);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(SESSION_CHAT_KEY);
    }
  };

  const handleSwitchToHydrogen = () => {
    if (mode === "reading") {
      setReadingModel("gemini-4-hydrogen");
    } else {
      setSelectedModel("gemini-4-hydrogen");
    }
    setErrorBanner(null);
    setQuotaExceededError(false);
    setInfoNotice("Switched to Gemini 4 Hydrogen (higher daily token budget).");
  };

  if (isChecking) {
    return <div className="min-h-[60vh] bg-paper" />;
  }
  if (!isDevUnlocked) {
    return null;
  }

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const isReadingMode = mode === "reading";
  const activeHeaderModel = isReadingMode ? readingModel : selectedModel;
  const isUsingFrontier = FRONTIER_MODEL_IDS.has(activeHeaderModel);

  const frontierPct = quota
    ? Math.min(100, Math.round((quota.frontier.used / Math.max(1, quota.frontier.limit)) * 100))
    : 0;
  const fastPct = quota
    ? Math.min(100, Math.round((quota.fast.used / Math.max(1, quota.fast.limit)) * 100))
    : 0;

  const getScoreColors = (score: number) => {
    if (score >= 85) return "bg-emerald-50 text-emerald-800 border-emerald-200";
    if (score >= 65) return "bg-amber-50 text-amber-800 border-amber-200";
    return "bg-rose-50 text-rose-800 border-rose-200";
  };

  const getWordChipColors = (status: string) => {
    if (status === "correct")
      return "bg-emerald-50 text-emerald-900 border-emerald-200 hover:border-emerald-500";
    if (status === "missed")
      return "bg-rose-50 text-rose-900 border-rose-200 hover:border-rose-500";
    return "bg-amber-50 text-amber-900 border-amber-300 hover:border-amber-500";
  };

  return (
    <div
      className={`flex flex-col ${
        isNative ? "h-full pt-safe px-4" : "h-full max-w-4xl mx-auto"
      }`}
    >
      {/* Top Bar */}
      <div className="shrink-0 mb-3">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-ink text-brand flex items-center justify-center shadow-sm">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-xl md:text-2xl text-ink leading-none">
                  Tibetan AI Tutor
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-brand-light text-brand-dark border border-brand/30 text-[9px] font-bold uppercase tracking-widest">
                  Dev Only
                </span>
              </div>
              <div className="text-[11px] text-ink-muted mt-1 flex flex-wrap items-center gap-1.5">
                {health === null ? (
                  <span>Connecting to Monlam AI &amp; Gemini...</span>
                ) : health.ready ? (
                  <>
                    <CheckCircle2 size={12} className="text-emerald-600" />
                    <span>{activeHeaderModel}</span>
                    {health.jwks_verified && (
                      <span
                        className="inline-flex items-center gap-0.5 text-[10px] text-emerald-700 font-bold"
                        title="Clerk RS256 JWKS Signature Verified"
                      >
                        <ShieldCheck size={11} /> JWKS
                      </span>
                    )}
                    {quota && isUsingFrontier && (
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          frontierPct >= 100
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : frontierPct >= 75
                            ? "bg-amber-50 text-amber-800 border-amber-200"
                            : "bg-surface text-ink-light border-border-subtle"
                        }`}
                        title="Daily Frontier (Neon/Argon/Carbon) token cap"
                      >
                        <Gauge size={10} />
                        {quota.frontier.used.toLocaleString()} /{" "}
                        {quota.frontier.limit.toLocaleString()} tok
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <AlertCircle size={12} className="text-amber-600" />
                    <span>Missing GEMINI_API_KEY on backend</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {!isReadingMode && (
              <button
                type="button"
                onClick={() => setShowTranslations((v) => !v)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-border-subtle text-xs font-bold text-ink-light hover:border-ink transition-colors"
                title="Toggle phonetics & English"
              >
                {showTranslations ? <Eye size={14} /> : <EyeOff size={14} />}
                <span className="hidden sm:inline">
                  {showTranslations ? "Gloss On" : "Tibetan Only"}
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                refreshMicrophones();
                setShowControls((v) => !v);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-colors ${
                showControls
                  ? "bg-ink text-white border-ink"
                  : "bg-surface border-border-subtle text-ink-light hover:border-ink"
              }`}
            >
              <SlidersHorizontal size={14} />
              <span className="hidden sm:inline">Dev Config</span>
            </button>

            {(messages.length > 0 || readingEval) && (
              <button
                type="button"
                onClick={handleResetChat}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-border-subtle text-xs font-bold text-ink-light hover:border-ink transition-colors"
                title="Reset session"
              >
                <RotateCcw size={14} />
              </button>
            )}
          </div>
        </div>

        {/* 5 Mode Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
          {TUTOR_MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => handleModeChange(m.id)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                mode === m.id
                  ? "bg-brand text-ink shadow-sm"
                  : "bg-surface border border-border-subtle text-ink-light hover:border-ink"
              }`}
            >
              {m.id === "reading" && <BookOpen size={13} />}
              {m.label}
            </button>
          ))}
        </div>

        {/* Collapsible Dev Configuration Strip */}
        {showControls && (
          <div className="mt-2.5 p-3.5 bg-surface border border-border-subtle rounded-2xl shadow-sm space-y-3 text-xs animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-1">
                  Chat Model
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-border-strong text-ink font-medium focus:outline-none focus:border-brand"
                >
                  {GEMINI_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-1">
                  Reading Eval Model
                </label>
                <select
                  value={readingModel}
                  onChange={(e) => setReadingModel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-border-strong text-ink font-medium focus:outline-none focus:border-brand"
                >
                  {GEMINI_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-1">
                  Speech-to-Text Engine
                </label>
                <select
                  value={sttProvider}
                  onChange={(e) => setSttProvider(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-border-strong text-ink font-medium focus:outline-none focus:border-brand"
                >
                  {STT_PROVIDERS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-1">
                  TTS Voice Engine
                </label>
                <select
                  value={ttsProvider}
                  onChange={(e) => setTtsProvider(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-border-strong text-ink font-medium focus:outline-none focus:border-brand"
                >
                  {TTS_PROVIDERS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-1">
                  Speaker Voice
                </label>
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-border-strong text-ink font-medium focus:outline-none focus:border-brand"
                >
                  {MONLAM_VOICES.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-1">
                  Microphone Input
                </label>
                <select
                  value={selectedMicId}
                  onChange={(e) => setSelectedMicId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-border-strong text-ink font-medium focus:outline-none focus:border-brand"
                >
                  <option value="">System Default Mic</option>
                  {audioDevices.map((d) => (
                    <option key={d.deviceId} value={d.deviceId}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Daily Token Quota Meters */}
            {quota && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border-subtle">
                <div>
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-1">
                    <span>Frontier (Neon / Argon / Carbon)</span>
                    <span className={frontierPct >= 85 ? "text-rose-600" : "text-ink"}>
                      {quota.frontier.used.toLocaleString()} /{" "}
                      {quota.frontier.limit.toLocaleString()} tok
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-paper overflow-hidden border border-border-subtle">
                    <div
                      className={`h-full transition-all ${
                        frontierPct >= 95
                          ? "bg-rose-500"
                          : frontierPct >= 75
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${frontierPct}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-1">
                    <span>Fast (Hydrogen / 3.8 Flash)</span>
                    <span className="text-ink">
                      {quota.fast.used.toLocaleString()} / {quota.fast.limit.toLocaleString()} tok
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-paper overflow-hidden border border-border-subtle">
                    <div
                      className="h-full bg-ink transition-all"
                      style={{ width: `${fastPct}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <label className="inline-flex items-center gap-2 cursor-pointer font-medium text-ink">
                <input
                  type="checkbox"
                  checked={autoPlayTts}
                  onChange={(e) => setAutoPlayTts(e.target.checked)}
                  className="accent-ink w-4 h-4 rounded"
                />
                Auto-speak chat replies
              </label>

              <label className="inline-flex items-center gap-2 cursor-pointer font-medium text-ink">
                <input
                  type="checkbox"
                  checked={autoSendVoice}
                  onChange={(e) => setAutoSendVoice(e.target.checked)}
                  className="accent-ink w-4 h-4 rounded"
                />
                Auto-send after voice transcription
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Non-Breaking Info Notice (TTS fallback, STT fallback, TTS outage notice) */}
      {infoNotice && (
        <div className="shrink-0 mb-2.5 px-4 py-2 rounded-2xl bg-brand-light border border-brand/30 text-ink text-xs font-medium flex items-center justify-between gap-2">
          <span className="break-words">{infoNotice}</span>
          <button
            type="button"
            onClick={() => setInfoNotice(null)}
            className="text-ink-muted hover:text-ink shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Error Banner (with 1-click Hydrogen switch on Frontier quota limit) */}
      {errorBanner && (
        <div className="shrink-0 mb-2.5 px-4 py-2.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <AlertCircle size={15} className="shrink-0" />
            <span className="break-words">{errorBanner}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {quotaExceededError && (
              <button
                type="button"
                onClick={handleSwitchToHydrogen}
                className="px-3 py-1 rounded-full bg-ink text-white text-[11px] font-bold hover:bg-ink-light transition-colors"
              >
                Switch to Hydrogen
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setErrorBanner(null);
                setQuotaExceededError(false);
              }}
              className="text-rose-600 hover:text-rose-900"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: READING PRACTICE STUDIO                           */}
      {/* ======================================================== */}
      {isReadingMode ? (
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1 space-y-4 pb-6">
          <div className="bg-surface border border-border-subtle rounded-[1.5rem] p-4 sm:p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div>
                <div className="text-eyebrow mb-1">Reading Verification Studio</div>
                <h2 className="font-serif text-lg sm:text-xl text-ink">
                  Choose a Passage or Paste Your Own Tibetan Text
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={readingModel}
                  onChange={(e) => setReadingModel(e.target.value)}
                  className="px-3 py-1.5 rounded-full bg-paper border border-border-strong text-xs font-bold text-ink focus:outline-none focus:border-brand"
                  title="Model used to evaluate your reading audio"
                >
                  {GEMINI_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      Eval: {m.id}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {READING_PRESETS.map((preset) => {
                const isSelected = readingText.trim() === preset.tibetan.trim();
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setReadingText(preset.tibetan);
                      setReadingEval(null);
                      setErrorBanner(null);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                      isSelected
                        ? "bg-ink text-white"
                        : "bg-paper border border-border-subtle text-ink-light hover:border-ink"
                    }`}
                  >
                    {preset.title}
                  </button>
                );
              })}
            </div>

            <div className="relative">
              <textarea
                value={readingText}
                maxLength={1500}
                onChange={(e) => {
                  setReadingText(e.target.value);
                  if (readingEval) setReadingEval(null);
                }}
                rows={3}
                placeholder="Paste or type any Tibetan Uchen passage you want Gen-la to verify..."
                className="w-full p-4 sm:p-5 rounded-2xl bg-paper/70 border border-border-strong focus:border-ink focus:outline-none font-tibetan text-[26px] sm:text-[32px] leading-[1.95] text-ink resize-y"
              />
              {readingText && (
                <button
                  type="button"
                  onClick={() => {
                    setReadingText("");
                    setReadingEval(null);
                  }}
                  className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-surface border border-border-subtle text-[10px] font-bold uppercase tracking-wider text-ink-muted hover:text-ink"
                >
                  Clear
                </button>
              )}
            </div>

            {READING_PRESETS.find((p) => p.tibetan.trim() === readingText.trim()) && (
              <p className="text-xs text-ink-muted mt-2 pl-1">
                Meaning:{" "}
                {READING_PRESETS.find((p) => p.tibetan.trim() === readingText.trim())?.english}
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => speakTibetan("reading_model_passage", readingText, false)}
                disabled={!readingText.trim() || loadingAudioMsgId === "reading_model_passage"}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full border text-xs font-bold transition-colors disabled:opacity-40 ${
                  playingMsgId === "reading_model_passage"
                    ? "bg-brand text-ink border-brand"
                    : "bg-paper border-border-strong text-ink hover:border-ink"
                }`}
              >
                {loadingAudioMsgId === "reading_model_passage" ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : playingMsgId === "reading_model_passage" ? (
                  <Square size={13} fill="currentColor" />
                ) : (
                  <Volume2 size={16} />
                )}
                {playingMsgId === "reading_model_passage"
                  ? "Stop Model Voice"
                  : "Listen First (Model Voice)"}
              </button>

              {isRecording ? (
                <div className="flex flex-wrap items-center gap-2.5 bg-rose-50 border-2 border-rose-400 rounded-full px-4 py-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                  <span className="text-xs font-bold text-ink">
                    Recording... {formatTimer(recordSeconds)}
                  </span>
                  <div className="hidden sm:flex items-center gap-1 h-4">
                    {[10, 22, 36, 50, 66, 82].map((thresh, idx) => (
                      <span
                        key={idx}
                        className={`w-1.5 rounded-full transition-all duration-75 ${
                          micLevel >= thresh ? "bg-emerald-500 h-4" : "bg-border-subtle h-1.5"
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => stopRecording(true)}
                    className="px-2.5 py-1 text-xs font-bold text-ink-muted hover:text-ink"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => stopRecording(false)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-600 text-white text-xs font-bold hover:bg-rose-700"
                  >
                    <Square size={11} fill="currentColor" />
                    Stop &amp; Evaluate
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => startRecording("reading")}
                  disabled={!readingText.trim() || isEvaluatingReading}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand text-ink hover:bg-brand-dark disabled:opacity-40 text-sm font-bold shadow-sm transition-transform active:scale-[0.98]"
                >
                  {isEvaluatingReading ? (
                    <>
                      <Loader2 size={17} className="animate-spin" />
                      Evaluating with {readingModel}...
                    </>
                  ) : (
                    <>
                      <Mic size={18} />
                      Read Aloud &amp; Verify
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {isEvaluatingReading && (
            <div className="bg-surface border border-border-subtle rounded-[1.5rem] p-6 text-center shadow-sm">
              <Loader2 size={24} className="animate-spin text-brand-dark mx-auto mb-2" />
              <p className="text-sm font-bold text-ink">
                Listening closely to your Tibetan pronunciation...
              </p>
              <p className="text-xs text-ink-muted mt-1">
                Checking silent prefixes, stacked consonants, vowel shifts, and tone register with{" "}
                <span className="font-mono">{readingModel}</span>
              </p>
            </div>
          )}

          {readingEval && !isEvaluatingReading && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-surface border border-border-subtle rounded-[1.5rem] p-5 sm:p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border-subtle">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-16 h-16 rounded-2xl border flex flex-col items-center justify-center shrink-0 ${getScoreColors(
                        readingEval.overall_score
                      )}`}
                    >
                      <span className="font-serif text-2xl font-bold leading-none">
                        {readingEval.overall_score}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-widest mt-0.5">
                        / 100
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Award size={16} className="text-brand-dark" />
                        <h3 className="font-serif text-xl text-ink">
                          {readingEval.grade_label || "Reading Evaluation"}
                        </h3>
                      </div>
                      <p className="text-[11px] font-mono text-ink-muted mt-1">
                        {readingEval.modelUsed}
                        {readingEval.latencyMs ? ` · ${readingEval.latencyMs}ms` : ""}
                        {readingEval.tokensUsed ? ` · ${readingEval.tokensUsed.toLocaleString()} tok` : ""}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => startRecording("reading")}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ink text-white hover:bg-ink-light text-xs font-bold transition-colors"
                  >
                    <Mic size={14} /> Try Reading Again
                  </button>
                </div>

                {readingEval.word_evaluations.length > 0 && (
                  <div className="py-4 border-b border-border-subtle">
                    <div className="text-eyebrow mb-2">
                      Word-by-Word Accuracy (Tap any word to hear pronunciation)
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {readingEval.word_evaluations.map((w, idx) => {
                        const wId = `eval_word_${idx}`;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => speakTibetan(wId, w.target, false)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors ${getWordChipColors(
                              w.status
                            )}`}
                            title={`${w.expected_phonetic} — ${w.heard_as}`}
                          >
                            <span className="font-tibetan text-xl leading-[1.7]">{w.target}</span>
                            {loadingAudioMsgId === wId ? (
                              <Loader2 size={12} className="animate-spin opacity-70" />
                            ) : (
                              <Volume2 size={12} className="opacity-60" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="pt-4 space-y-3 text-sm">
                  {readingEval.what_was_heard && (
                    <div className="p-3.5 rounded-xl bg-paper border border-border-subtle">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-1">
                        What Gen-la Heard in Your Audio
                      </div>
                      <div className="text-ink leading-relaxed">
                        {renderRichFeedback(readingEval.what_was_heard)}
                      </div>
                    </div>
                  )}

                  {readingEval.summary_feedback && (
                    <div className="text-ink-light leading-relaxed">
                      {renderRichFeedback(readingEval.summary_feedback)}
                    </div>
                  )}

                  {readingEval.next_focus && (
                    <div className="px-4 py-3 rounded-xl bg-brand-light/70 border border-brand/30 text-xs text-ink leading-relaxed">
                      <span className="font-bold uppercase tracking-wider text-[10px] text-brand-dark mr-1.5">
                        Next Attempt Focus:
                      </span>
                      {renderRichFeedback(readingEval.next_focus)}
                    </div>
                  )}
                </div>
              </div>

              {readingEval.word_evaluations.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {readingEval.word_evaluations.map((w, idx) => {
                    const wId = `eval_card_${idx}`;
                    const statusBadge =
                      w.status === "correct"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : w.status === "missed"
                        ? "bg-rose-50 text-rose-700 border-rose-200"
                        : "bg-amber-50 text-amber-800 border-amber-200";

                    const statusText =
                      w.status === "correct"
                        ? "Correct"
                        : w.status === "missed"
                        ? "Missed"
                        : "Needs Work";

                    return (
                      <div
                        key={idx}
                        className="bg-surface border border-border-subtle rounded-2xl p-4 shadow-sm flex flex-col justify-between gap-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-tibetan text-2xl leading-[1.8] text-ink">
                              {w.target}
                            </div>
                            <div className="text-xs font-medium text-ink-light italic">
                              Expected: {w.expected_phonetic}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <span
                              className={`px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-widest ${statusBadge}`}
                            >
                              {statusText}
                            </span>
                            <button
                              type="button"
                              onClick={() => speakTibetan(wId, w.target, false)}
                              className="w-8 h-8 rounded-full bg-paper border border-border-subtle hover:border-ink flex items-center justify-center text-ink"
                              title="Hear model pronunciation"
                            >
                              {loadingAudioMsgId === wId ? (
                                <Loader2 size={13} className="animate-spin" />
                              ) : playingMsgId === wId ? (
                                <Square size={11} fill="currentColor" />
                              ) : (
                                <Volume2 size={14} />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="text-xs text-ink-muted pt-1 border-t border-border-subtle/60 space-y-1">
                          <div>
                            <span className="font-bold text-ink">Heard:</span>{" "}
                            {renderRichFeedback(w.heard_as)}
                          </div>
                          {w.tip && (
                            <div>
                              <span className="font-bold text-brand-dark">Tip:</span>{" "}
                              {renderRichFeedback(w.tip)}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* ======================================================== */
        /* TABS 1–4: VOICE & TEXT CHAT WORKSPACE                    */
        /* ======================================================== */
        <>
          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1 space-y-4 pb-4">
            {messages.length === 0 ? (
              <div className="bg-surface border border-border-subtle rounded-[1.5rem] p-6 md:p-8 shadow-sm text-center my-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-light text-brand-dark flex items-center justify-center mx-auto mb-3">
                  <MessageCircle size={22} />
                </div>
                <h2 className="font-serif text-xl md:text-2xl text-ink mb-2">
                  <span className="font-tibetan text-2xl md:text-3xl mr-2">
                    བཀྲ་ཤིས་བདེ་ལེགས།
                  </span>
                  Practice Speaking &amp; Reading Tibetan
                </h2>
                <p className="text-sm text-ink-light max-w-lg mx-auto mb-6">
                  Tap the microphone to speak in Tibetan (Monlam STT with automatic Gemini 4
                  Hydrogen audio fallback), or type in Tibetan, phonetic spelling, or English.
                  Gen-la can discuss everyday life, Dharma, prayers, philosophy, or grammar.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-left">
                  {STARTER_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => sendMessage(prompt.tibetan)}
                      className="p-3.5 rounded-2xl bg-paper/70 border border-border-subtle hover:border-ink transition-all text-left group"
                    >
                      <div className="font-tibetan text-xl leading-[1.8] text-ink mb-1">
                        {prompt.tibetan}
                      </div>
                      {showTranslations && (
                        <>
                          <div className="text-[11px] font-medium text-ink-light">
                            {prompt.phonetic}
                          </div>
                          <div className="text-[11px] text-ink-muted mt-0.5">
                            {prompt.english}
                          </div>
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => {
                const isLatestAssistant =
                  msg.role === "assistant" && idx === messages.length - 1;

                if (msg.role === "user") {
                  return (
                    <div key={msg.id} className="flex flex-col items-end gap-1">
                      <div className="max-w-[85%] sm:max-w-[75%] bg-ink text-white rounded-[1.25rem] rounded-br-sm px-4 py-3 shadow-sm">
                        <div className="font-tibetan text-xl leading-[1.8] text-white">
                          {msg.tibetan}
                        </div>
                      </div>
                      {msg.sttProvider && (
                        <span className="text-[10px] font-mono text-ink-muted/80 pr-1">
                          {msg.sttProvider === "monlam"
                            ? "Voice · Monlam STT"
                            : msg.sttProvider === "gemini_fallback"
                            ? "Voice · Gemini Audio Fallback"
                            : "Voice · Gemini Audio"}
                        </span>
                      )}
                    </div>
                  );
                }

                const isPlaying = playingMsgId === msg.id;
                const isLoadingAudio = loadingAudioMsgId === msg.id;

                return (
                  <div key={msg.id} className="flex flex-col items-start gap-2">
                    <div className="max-w-[95%] sm:max-w-[85%] bg-surface border border-border-subtle rounded-[1.25rem] rounded-bl-sm p-4 sm:p-5 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div className="font-tibetan text-[24px] sm:text-[28px] leading-[1.9] pb-1 text-ink">
                          {msg.tibetan}
                        </div>
                        <div className="flex flex-col items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => speakTibetan(msg.id, msg.tibetan, false)}
                            disabled={isLoadingAudio}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                              isPlaying
                                ? "bg-brand text-ink"
                                : "bg-paper border border-border-subtle text-ink hover:border-ink"
                            }`}
                            title={isPlaying ? "Stop audio" : "Play voice"}
                          >
                            {isLoadingAudio ? (
                              <Loader2 size={17} className="animate-spin" />
                            ) : isPlaying ? (
                              <Square size={15} fill="currentColor" />
                            ) : (
                              <Volume2 size={18} />
                            )}
                          </button>
                          {msg.needsTapToPlay && !isPlaying && (
                            <span className="text-[9px] font-bold uppercase tracking-wider text-brand-dark">
                              Tap
                            </span>
                          )}
                        </div>
                      </div>

                      {showTranslations && (msg.phonetic || msg.english) && (
                        <div className="mt-2 pt-2.5 border-t border-border-subtle/70 space-y-1">
                          {msg.phonetic && (
                            <p className="text-xs sm:text-sm font-medium text-ink-light italic">
                              {msg.phonetic}
                            </p>
                          )}
                          {msg.english && (
                            <p className="text-xs sm:text-sm text-ink-muted">{msg.english}</p>
                          )}
                        </div>
                      )}

                      {msg.feedback && (
                        <div className="mt-3 px-3.5 py-2.5 rounded-xl bg-brand-light/60 border border-brand/25 text-xs text-ink leading-relaxed">
                          <span className="font-bold uppercase tracking-wider text-[10px] text-brand-dark mr-1.5">
                            Gen-la Tip:
                          </span>
                          {renderRichFeedback(msg.feedback)}
                        </div>
                      )}

                      {(msg.modelUsed || msg.latencyMs) && (
                        <div className="mt-2.5 text-[10px] font-mono text-ink-muted/70">
                          {msg.modelUsed}
                          {msg.latencyMs ? ` · ${msg.latencyMs}ms` : ""}
                          {msg.tokensUsed ? ` · ${msg.tokensUsed.toLocaleString()} tok` : ""}
                        </div>
                      )}
                    </div>

                    {isLatestAssistant &&
                      msg.suggestedReplies &&
                      msg.suggestedReplies.length > 0 &&
                      !isSending && (
                        <div className="flex flex-wrap gap-2 pl-1">
                          {msg.suggestedReplies.map((sr, sIdx) => (
                            <button
                              key={sIdx}
                              type="button"
                              onClick={() => sendMessage(sr.tibetan)}
                              className="px-3.5 py-2 rounded-2xl bg-surface border border-border-subtle hover:border-ink text-left transition-all shadow-sm active:scale-[0.99]"
                            >
                              <div className="font-tibetan text-base leading-[1.7] text-ink">
                                {sr.tibetan}
                              </div>
                              {showTranslations && (
                                <div className="text-[10px] text-ink-muted">
                                  {sr.phonetic} · {sr.english}
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                  </div>
                );
              })
            )}

            {(isTranscribing || isSending) && (
              <div className="flex items-center gap-2 text-xs font-bold text-ink-muted px-2">
                <Loader2 size={14} className="animate-spin text-brand-dark" />
                <span>
                  {isTranscribing
                    ? "Transcribing your voice..."
                    : `Gen-la is thinking (${selectedModel})...`}
                </span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Bottom Voice + Text Composer */}
          <div className="shrink-0 pt-2">
            {isRecording ? (
              <div className="bg-surface border-2 border-rose-400 rounded-full px-4 py-2.5 flex items-center justify-between gap-3 shadow-md">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse shrink-0" />
                  <span className="text-sm font-bold text-ink">
                    Listening... {formatTimer(recordSeconds)}
                  </span>

                  <div className="hidden sm:flex items-center gap-1 h-5">
                    {[10, 22, 36, 50, 66, 82].map((thresh, idx) => (
                      <span
                        key={idx}
                        className={`w-1.5 rounded-full transition-all duration-75 ${
                          micLevel >= thresh ? "bg-emerald-500 h-4" : "bg-border-subtle h-1.5"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => stopRecording(true)}
                    className="px-3 py-1.5 rounded-full text-xs font-bold text-ink-muted hover:text-ink"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => stopRecording(false)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors"
                  >
                    <Square size={12} fill="currentColor" />
                    Stop &amp; Transcribe
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                className="bg-surface border border-border-strong rounded-full p-1.5 flex items-center gap-2 shadow-sm focus-within:border-ink transition-colors"
              >
                <button
                  type="button"
                  onClick={() => startRecording("chat")}
                  disabled={isTranscribing || isSending}
                  className="w-11 h-11 rounded-full bg-brand text-ink hover:bg-brand-dark disabled:opacity-50 flex items-center justify-center shrink-0 transition-transform active:scale-95"
                  title="Speak in Tibetan"
                >
                  <Mic size={20} />
                </button>

                <input
                  type="text"
                  value={inputText}
                  maxLength={1500}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type Tibetan, phonetic, or English..."
                  className="flex-1 min-w-0 bg-transparent px-2 py-2 text-sm md:text-base text-ink placeholder:text-ink-muted focus:outline-none font-sans"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim() || isSending || isTranscribing}
                  className="w-11 h-11 rounded-full bg-ink text-white hover:bg-ink-light disabled:opacity-40 flex items-center justify-center shrink-0 transition-transform active:scale-95"
                  title="Send message"
                >
                  {isSending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
              </form>
            )}
          </div>
        </>
      )}
    </div>
  );
}
