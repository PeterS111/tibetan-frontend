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
  latencyMs?: number;
}

interface HealthStatus {
  ready: boolean;
  monlam_configured: boolean;
  gemini_configured: boolean;
  default_model: string;
}

const TUTOR_MODES = [
  { id: "conversation", label: "Free Chat" },
  { id: "beginner_drill", label: "Beginner 1–2 Drill" },
  { id: "grammar", label: "Grammar Coach" },
  { id: "pronunciation", label: "Speaking Practice" },
];

const GEMINI_MODELS = [
  { id: "gemini-4-hydrogen", label: "Gemini 4 Hydrogen (Default)" },
  { id: "gemini-3.8-flash", label: "Gemini 3.8 Flash" },
  { id: "gemini-3.5-flash-lite", label: "Gemini 3.5 Flash-Lite" },
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

export default function AiTutorPage() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const { isDevUnlocked, isChecking } = useDevBypass();
  const { isNative } = usePlatform();

  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [mode, setMode] = useState("conversation");
  const [selectedModel, setSelectedModel] = useState("gemini-4-hydrogen");
  const [selectedVoice, setSelectedVoice] = useState("lhasa_female");

  const [autoPlayTts, setAutoPlayTts] = useState(true);
  const [autoSendVoice, setAutoSendVoice] = useState(true);
  const [showTranslations, setShowTranslations] = useState(true);
  const [showControls, setShowControls] = useState(false);

  const [isSending, setIsSending] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  const [playingMsgId, setPlayingMsgId] = useState<string | null>(null);
  const [loadingAudioMsgId, setLoadingAudioMsgId] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cancelRecordRef = useRef<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const stopPlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } catch {}
      audioRef.current = null;
    }
    setPlayingMsgId(null);
  }, []);

  const cleanupRecorder = useCallback(() => {
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
  }, []);

  useEffect(() => {
    return () => {
      stopPlayback();
      cleanupRecorder();
    };
  }, [stopPlayback, cleanupRecorder]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending, isTranscribing]);

  // Check backend readiness (Monlam + Gemini keys configured)
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
          if (data?.default_model) {
            setSelectedModel(data.default_model);
          }
        }
      } catch {}
    };
    checkHealth();
    return () => {
      active = false;
    };
  }, [isChecking, isDevUnlocked, user, getToken]);

  const speakTibetan = useCallback(
    async (msgId: string, tibetanText: string) => {
      const clean = tibetanText.trim();
      if (!clean) return;

      if (playingMsgId === msgId) {
        stopPlayback();
        return;
      }

      stopPlayback();
      setLoadingAudioMsgId(msgId);

      try {
        const token = await getToken();
        if (!token) throw new Error("Authentication unavailable.");

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai/tts`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: clean,
            voice_name: selectedVoice,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data?.audio_base64) {
          throw new Error(data?.error || "Monlam TTS playback failed.");
        }

        const mime = data.mime_type || "audio/wav";
        const audio = new Audio(`data:${mime};base64,${data.audio_base64}`);
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

        await audio.play();
      } catch (err: any) {
        setLoadingAudioMsgId(null);
        setPlayingMsgId(null);
        setErrorBanner(err?.message || "Could not play Monlam AI audio.");
      }
    },
    [getToken, playingMsgId, selectedVoice, stopPlayback]
  );

  const sendMessage = useCallback(
    async (textOverride?: string) => {
      const content = (textOverride ?? inputText).trim();
      if (!content || isSending) return;

      setErrorBanner(null);
      if (textOverride === undefined) {
        setInputText("");
      }

      const userMsgId = `u_${Date.now()}`;
      const userMessage: ChatMessage = {
        id: userMsgId,
        role: "user",
        tibetan: content,
      };

      const historyPayload = messages.map((m) => ({
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
            mode,
            model: selectedModel,
          }),
        });

        const data = await res.json();
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
          latencyMs: data.latency_ms,
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setIsSending(false);

        if (autoPlayTts && assistantMessage.tibetan) {
          speakTibetan(assistantId, assistantMessage.tibetan);
        }
      } catch (err: any) {
        setIsSending(false);
        setErrorBanner(err?.message || "Could not reach AI Tutor backend.");
      }
    },
    [inputText, isSending, messages, getToken, mode, selectedModel, autoPlayTts, speakTibetan]
  );

  const transcribeAudioBlob = useCallback(
    async (blob: Blob, mimeType: string) => {
      setIsTranscribing(true);
      setErrorBanner(null);

      try {
        const token = await getToken();
        if (!token) throw new Error("Authentication unavailable.");

        const ext = mimeType.includes("mp4")
          ? "mp4"
          : mimeType.includes("ogg")
          ? "ogg"
          : "webm";

        const formData = new FormData();
        formData.append("audio", blob, `recording.${ext}`);
        formData.append("language", "bo");

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai/stt`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error || "Monlam Speech-to-Text failed.");
        }

        const transcript = (data?.transcript || "").trim();
        setIsTranscribing(false);

        if (!transcript) {
          setErrorBanner("No speech detected. Try speaking a bit closer to the microphone.");
          return;
        }

        if (autoSendVoice) {
          await sendMessage(transcript);
        } else {
          setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      } catch (err: any) {
        setIsTranscribing(false);
        setErrorBanner(err?.message || "Speech transcription failed.");
      }
    },
    [getToken, autoSendVoice, sendMessage]
  );

  const startRecording = async () => {
    if (isRecording || isTranscribing || isSending) return;
    setErrorBanner(null);
    stopPlayback();

    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setErrorBanner("Microphone access is not supported on this device or browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

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
        cleanupRecorder();
        if (!wasCancelled && chunks.length > 0) {
          const blob = new Blob(chunks, { type: activeMime });
          transcribeAudioBlob(blob, activeMime);
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start(250);
      setIsRecording(true);
      setRecordSeconds(0);

      recordTimerRef.current = setInterval(() => {
        setRecordSeconds((s) => s + 1);
      }, 1000);
    } catch (err: any) {
      cleanupRecorder();
      setErrorBanner(
        err?.name === "NotAllowedError"
          ? "Microphone permission was denied. Please enable mic access in your browser/app settings."
          : "Could not start microphone recording."
      );
    }
  };

  const stopRecording = (cancel = false) => {
    cancelRecordRef.current = cancel;
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    } else {
      cleanupRecorder();
    }
  };

  const handleResetChat = () => {
    stopPlayback();
    setMessages([]);
    setErrorBanner(null);
  };

  // Strict render gate: never flash content to non-dev users
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

  return (
    <div
      className={`flex flex-col ${
        isNative ? "h-[calc(100dvh-7.5rem)] pt-10 px-4" : "h-full max-w-4xl mx-auto"
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
              <div className="text-[11px] text-ink-muted mt-1 flex items-center gap-1.5">
                {health === null ? (
                  <span>Connecting to Monlam AI &amp; Gemini...</span>
                ) : health.ready ? (
                  <>
                    <CheckCircle2 size={12} className="text-emerald-600" />
                    <span>Monlam STT/TTS + {selectedModel}</span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={12} className="text-amber-600" />
                    <span>
                      Missing env key:{" "}
                      {!health.monlam_configured ? "MONLAM_API_KEY " : ""}
                      {!health.gemini_configured ? "GEMINI_API_KEY" : ""}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
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

            <button
              type="button"
              onClick={() => setShowControls((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-colors ${
                showControls
                  ? "bg-ink text-white border-ink"
                  : "bg-surface border-border-subtle text-ink-light hover:border-ink"
              }`}
            >
              <SlidersHorizontal size={14} />
              <span className="hidden sm:inline">Dev Config</span>
            </button>

            {messages.length > 0 && (
              <button
                type="button"
                onClick={handleResetChat}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-border-subtle text-xs font-bold text-ink-light hover:border-ink transition-colors"
                title="Reset conversation"
              >
                <RotateCcw size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Scenario Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
          {TUTOR_MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                mode === m.id
                  ? "bg-brand text-ink shadow-sm"
                  : "bg-surface border border-border-subtle text-ink-light hover:border-ink"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Collapsible Dev Configuration Strip */}
        {showControls && (
          <div className="mt-2.5 p-3.5 bg-surface border border-border-subtle rounded-2xl shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs animate-in fade-in">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-1">
                Gemini Brain Model
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
                Monlam TTS Voice
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

            <div className="sm:col-span-2 flex flex-wrap items-center gap-4 pt-1">
              <label className="inline-flex items-center gap-2 cursor-pointer font-medium text-ink">
                <input
                  type="checkbox"
                  checked={autoPlayTts}
                  onChange={(e) => setAutoPlayTts(e.target.checked)}
                  className="accent-ink w-4 h-4 rounded"
                />
                Auto-speak tutor replies (Monlam TTS)
              </label>

              <label className="inline-flex items-center gap-2 cursor-pointer font-medium text-ink">
                <input
                  type="checkbox"
                  checked={autoSendVoice}
                  onChange={(e) => setAutoSendVoice(e.target.checked)}
                  className="accent-ink w-4 h-4 rounded"
                />
                Auto-send after voice transcription (Monlam STT)
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Error Banner */}
      {errorBanner && (
        <div className="shrink-0 mb-3 px-4 py-2.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0" />
            <span>{errorBanner}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorBanner(null)}
            className="text-rose-600 hover:text-rose-900"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Chat Transcript */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1 space-y-4 pb-4">
        {messages.length === 0 ? (
          <div className="bg-surface border border-border-subtle rounded-[1.5rem] p-6 md:p-8 shadow-sm text-center my-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-light text-brand-dark flex items-center justify-center mx-auto mb-3">
              <MessageCircle size={22} />
            </div>
            <h2 className="font-serif text-xl md:text-2xl text-ink mb-2">
              <span className="font-tibetan text-2xl md:text-3xl mr-2">བཀྲ་ཤིས་བདེ་ལེགས།</span>
              Practice Speaking &amp; Reading Tibetan
            </h2>
            <p className="text-sm text-ink-light max-w-lg mx-auto mb-6">
              Tap the microphone to speak in Tibetan (transcribed by Monlam AI), or type in
              Tibetan, phonetic spelling, or English. Gen-la will respond in natural Lhasa
              Tibetan and read it aloud.
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
                <div key={msg.id} className="flex justify-end">
                  <div className="max-w-[85%] sm:max-w-[75%] bg-ink text-white rounded-[1.25rem] rounded-br-sm px-4 py-3 shadow-sm">
                    <div className="font-tibetan text-xl leading-[1.8] text-white">
                      {msg.tibetan}
                    </div>
                  </div>
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
                    <button
                      type="button"
                      onClick={() => speakTibetan(msg.id, msg.tibetan)}
                      disabled={isLoadingAudio}
                      className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        isPlaying
                          ? "bg-brand text-ink"
                          : "bg-paper border border-border-subtle text-ink hover:border-ink"
                      }`}
                      title={isPlaying ? "Stop audio" : "Play Monlam AI voice"}
                    >
                      {isLoadingAudio ? (
                        <Loader2 size={17} className="animate-spin" />
                      ) : isPlaying ? (
                        <Square size={15} fill="currentColor" />
                      ) : (
                        <Volume2 size={18} />
                      )}
                    </button>
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
                      {msg.feedback}
                    </div>
                  )}

                  {(msg.modelUsed || msg.latencyMs) && (
                    <div className="mt-2.5 text-[10px] font-mono text-ink-muted/70">
                      {msg.modelUsed}
                      {msg.latencyMs ? ` · ${msg.latencyMs}ms` : ""}
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
                ? "Transcribing Tibetan speech with Monlam STT..."
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
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-sm font-bold text-ink">
                Listening... {formatTimer(recordSeconds)}
              </span>
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
              onClick={startRecording}
              disabled={isTranscribing || isSending}
              className="w-11 h-11 rounded-full bg-brand text-ink hover:bg-brand-dark disabled:opacity-50 flex items-center justify-center shrink-0 transition-transform active:scale-95"
              title="Speak in Tibetan (Monlam STT)"
            >
              <Mic size={20} />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type Tibetan, phonetic, or English..."
              className="flex-1 min-w-0 bg-transparent px-2 py-2 text-sm md:text-base text-ink placeholder:text-ink-muted focus:outline-none font-tibetan"
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
    </div>
  );
}
