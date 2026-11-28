// app/components/admin/OwnerAiAndDevTabs.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/clerk-react";
import {
  RefreshCw,
  Download,
  Search,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Plus,
  Trash2,
  Coins,
  Cpu,
  Volume2,
  Activity,
  Database,
  CheckCircle2,
  Clock,
  Users,
} from "lucide-react";

interface AiPricingRates {
  gemini_input_per_1m_usd: number;
  gemini_cached_per_1m_usd: number;
  gemini_output_per_1m_usd: number;
  monlam_tts_per_1k_chars_usd: number;
  usd_to_gbp: number;
}

interface AiUsageSummary {
  days: number;
  since_date: string;
  total_requests: number;
  chat_requests: number;
  stt_requests: number;
  eval_requests: number;
  tts_live_requests: number;
  tts_cache_hits: number;
  tts_local_hits: number;
  tts_error_requests: number;
  tts_live_chars: number;
  tts_total_chars: number;
  tts_cache_hit_rate_pct: number;
  input_tokens: number;
  cached_input_tokens: number;
  output_tokens: number;
  thought_tokens: number;
  total_tokens: number;
  audio_seconds: number;
  total_cost_usd: number;
  total_cost_gbp: number;
  gemini_cost_usd: number;
  tts_cost_usd: number;
  unique_users: number;
  unique_conversations: number;
}

interface DailyUserRow {
  usage_date: string;
  user_id: string;
  user_email: string;
  request_count: number;
  chat_count: number;
  stt_count: number;
  eval_count: number;
  tts_live_count: number;
  tts_cache_hits: number;
  input_tokens: number;
  cached_input_tokens: number;
  output_tokens: number;
  thought_tokens: number;
  total_tokens: number;
  audio_seconds: number;
  tts_live_chars: number;
  cost_usd: number;
  cost_gbp: number;
}

interface ConversationRow {
  conversation_id: string;
  user_id: string;
  user_email: string;
  mode: string;
  started_at: string;
  last_activity_at: string;
  request_count: number;
  chat_count: number;
  stt_count: number;
  eval_count: number;
  tts_live_count: number;
  tts_cache_hits: number;
  input_tokens: number;
  cached_input_tokens: number;
  output_tokens: number;
  thought_tokens: number;
  total_tokens: number;
  tts_live_chars: number;
  cost_usd: number;
  cost_gbp: number;
}

interface RequestRow {
  id: number;
  created_at: string;
  user_email: string;
  conversation_id: string;
  endpoint: string;
  mode: string;
  level: string;
  dialect: string;
  input_tokens: number;
  cached_input_tokens: number;
  output_tokens: number;
  thought_tokens: number;
  total_tokens: number;
  audio_seconds: number;
  tts_chars: number;
  tts_source: string;
  latency_ms: number;
  status: string;
  error_code: string;
  cost_usd: number;
  cost_gbp: number;
}

interface TtsCacheStats {
  cached_clips: number;
  total_hits: number;
  total_kb: number;
}

interface AiUsagePayload {
  pricing: AiPricingRates;
  summary: AiUsageSummary;
  daily_by_user: DailyUserRow[];
  by_conversation: ConversationRow[];
  recent_requests: RequestRow[];
  tts_cache_stats: TtsCacheStats;
}

interface AllowlistRow {
  email: string;
  note: string;
  is_owner: boolean;
  added_by: string;
  created_at: string;
}

function fmtUsd(val: number): string {
  const n = Number(val) || 0;
  if (n > 0 && n < 0.01) return `$${n.toFixed(4)}`;
  return `$${n.toFixed(2)}`;
}

function fmtGbp(val: number): string {
  const n = Number(val) || 0;
  if (n > 0 && n < 0.01) return `£${n.toFixed(4)}`;
  return `£${n.toFixed(2)}`;
}

function fmtInt(val: number): string {
  return (Number(val) || 0).toLocaleString("en-GB");
}

function fmtTimeShort(iso: string): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function csvCell(v: unknown): string {
  const s = String(v ?? "").replace(/\r?\n/g, " ");
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

// ============================================================================
// TAB 2: AI USAGE & COST METERING
// ============================================================================
export function OwnerAiUsageTab({
  vaultToken,
  onUnauthorized,
}: {
  vaultToken: string;
  onUnauthorized: (notice?: string) => void;
}) {
  const { getToken } = useAuth();

  const [days, setDays] = useState<number>(30);
  const [emailFilter, setEmailFilter] = useState<string>("");
  const [activeSubView, setActiveSubView] = useState<"daily" | "conversations" | "requests">("daily");
  const [data, setData] = useState<AiUsagePayload | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadUsage = useCallback(
    async (isRefresh = false) => {
      if (!vaultToken) return;
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setErrorMsg(null);

      try {
        const clerkToken = await getToken();
        if (!clerkToken) throw new Error("Authentication unavailable.");

        const qs = new URLSearchParams({ days: String(days) });
        if (emailFilter.trim()) qs.set("user_email", emailFilter.trim());

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/ai-usage?${qs.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${clerkToken}`,
              "X-Payments-Token": vaultToken,
            },
          }
        );

        if (res.status === 401) {
          onUnauthorized("Your Owner Vault session expired. Please unlock again.");
          return;
        }

        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || "Could not load AI usage analytics.");
        setData(json);
      } catch (err: unknown) {
        setErrorMsg(err instanceof Error ? err.message : "Could not load AI usage analytics.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [vaultToken, days, emailFilter, getToken, onUnauthorized]
  );

  useEffect(() => {
    loadUsage(false);
  }, [loadUsage]);

  const handleExportCsv = () => {
    if (!data) return;
    let headers: string[] = [];
    let rows: unknown[][] = [];
    let filename = `loplao-ai-usage-${activeSubView}-${days}d.csv`;

    if (activeSubView === "daily") {
      headers = [
        "Date (UTC)",
        "User Email",
        "Total Requests",
        "Chat",
        "STT",
        "Pronunciation Eval",
        "TTS Live Calls",
        "TTS Cache/Local Hits",
        "TTS Live Chars",
        "Input Tokens",
        "Cached Tokens",
        "Output Tokens",
        "Thought Tokens",
        "Total Tokens",
        "Audio Seconds",
        "Cost (USD)",
        "Cost (GBP)",
      ];
      rows = data.daily_by_user.map((d) => [
        d.usage_date,
        d.user_email,
        d.request_count,
        d.chat_count,
        d.stt_count,
        d.eval_count,
        d.tts_live_count,
        d.tts_cache_hits,
        d.tts_live_chars,
        d.input_tokens,
        d.cached_input_tokens,
        d.output_tokens,
        d.thought_tokens,
        d.total_tokens,
        d.audio_seconds,
        d.cost_usd.toFixed(6),
        d.cost_gbp.toFixed(6),
      ]);
    } else if (activeSubView === "conversations") {
      headers = [
        "Conversation ID",
        "User Email",
        "Mode",
        "Started At",
        "Last Activity",
        "Requests",
        "Chat",
        "STT",
        "Eval",
        "TTS Live",
        "TTS Cache Hits",
        "TTS Live Chars",
        "Total Tokens",
        "Cost (USD)",
        "Cost (GBP)",
      ];
      rows = data.by_conversation.map((c) => [
        c.conversation_id,
        c.user_email,
        c.mode,
        c.started_at,
        c.last_activity_at,
        c.request_count,
        c.chat_count,
        c.stt_count,
        c.eval_count,
        c.tts_live_count,
        c.tts_cache_hits,
        c.tts_live_chars,
        c.total_tokens,
        c.cost_usd.toFixed(6),
        c.cost_gbp.toFixed(6),
      ]);
    } else {
      headers = [
        "Timestamp",
        "User Email",
        "Conversation ID",
        "Endpoint",
        "Mode",
        "Level",
        "Dialect",
        "Input Tokens",
        "Cached Tokens",
        "Output Tokens",
        "Thought Tokens",
        "Total Tokens",
        "Audio Seconds",
        "TTS Chars",
        "TTS Source",
        "Latency (ms)",
        "Status",
        "Error Code",
        "Cost (USD)",
        "Cost (GBP)",
      ];
      rows = data.recent_requests.map((r) => [
        r.created_at,
        r.user_email,
        r.conversation_id,
        r.endpoint,
        r.mode,
        r.level,
        r.dialect,
        r.input_tokens,
        r.cached_input_tokens,
        r.output_tokens,
        r.thought_tokens,
        r.total_tokens,
        r.audio_seconds,
        r.tts_chars,
        r.tts_source,
        r.latency_ms,
        r.status,
        r.error_code,
        r.cost_usd.toFixed(6),
        r.cost_gbp.toFixed(6),
      ]);
    }

    const csv = [headers, ...rows].map((line) => line.map(csvCell).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-ink-muted">
        <Loader2 size={30} className="animate-spin text-brand mb-3" />
        <p className="text-sm font-medium">Loading AI token &amp; cost metering...</p>
      </div>
    );
  }

  const s = data?.summary;
  const p = data?.pricing;
  const cacheStats = data?.tts_cache_stats;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Controls Bar */}
      <div className="bg-surface border border-border-subtle rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input
              type="text"
              value={emailFilter}
              onChange={(e) => setEmailFilter(e.target.value)}
              placeholder="Filter by developer email..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-paper/70 border border-border-subtle focus:border-ink text-xs sm:text-sm text-ink placeholder:text-ink-muted focus:outline-none"
            />
          </div>

          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="px-3.5 py-2 rounded-xl bg-paper/70 border border-border-subtle focus:border-ink text-xs sm:text-sm font-semibold text-ink focus:outline-none cursor-pointer"
          >
            <option value={1}>Today (UTC)</option>
            <option value={7}>Last 7 Days</option>
            <option value={30}>Last 30 Days</option>
            <option value={90}>Last 90 Days</option>
            <option value={365}>Last 365 Days</option>
          </select>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => loadUsage(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-paper border border-border-strong hover:border-ink text-xs font-bold text-ink cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={!data}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-ink hover:bg-ink-light text-white text-xs font-bold cursor-pointer disabled:opacity-40"
          >
            <Download size={13} />
            Export CSV
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center gap-2.5 text-sm text-rose-800">
          <AlertCircle size={17} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 4 KPI Summary Cards */}
      {s && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="bg-ink text-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand">
                Total Est. Cost ({s.days}d)
              </span>
              <Coins size={16} className="text-brand" />
            </div>
            <div className="font-serif text-3xl mb-1">{fmtGbp(s.total_cost_gbp)}</div>
            <div className="text-xs text-white/75">
              {fmtUsd(s.total_cost_usd)} · Voice: {fmtUsd(s.tts_cost_usd)}
            </div>
          </div>

          <div className="bg-surface border border-border-subtle rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-sky-700">
                Total AI Tokens
              </span>
              <Cpu size={16} className="text-sky-600" />
            </div>
            <div className="font-serif text-2xl sm:text-3xl text-ink mb-1">
              {fmtInt(s.total_tokens)}
            </div>
            <div className="text-[11px] text-ink-muted leading-snug">
              In: {fmtInt(s.input_tokens)} · Cached: {fmtInt(s.cached_input_tokens)} · Out+Think:{" "}
              {fmtInt(s.output_tokens + s.thought_tokens)}
            </div>
          </div>

          <div className="bg-surface border border-border-subtle rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                TTS Cache Hit Rate
              </span>
              <Volume2 size={16} className="text-emerald-600" />
            </div>
            <div className="font-serif text-2xl sm:text-3xl text-ink mb-1">
              {s.tts_cache_hit_rate_pct}%
            </div>
            <div className="text-[11px] text-ink-muted leading-snug">
              Live: {fmtInt(s.tts_live_requests)} ({fmtInt(s.tts_live_chars)} chars) · Free cache:{" "}
              {fmtInt(s.tts_cache_hits + s.tts_local_hits)}
            </div>
          </div>

          <div className="bg-surface border border-border-subtle rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-dark">
                Requests &amp; Audio
              </span>
              <Activity size={16} className="text-brand-dark" />
            </div>
            <div className="font-serif text-2xl sm:text-3xl text-ink mb-1">
              {fmtInt(s.total_requests)}
            </div>
            <div className="text-[11px] text-ink-muted leading-snug">
              {s.unique_users} user(s) · {s.unique_conversations} conv(s) ·{" "}
              {Math.round(s.audio_seconds)}s audio
            </div>
          </div>
        </div>
      )}

      {/* Pricing Basis & Cache Health Banner */}
      {p && cacheStats && (
        <div className="bg-brand-light/55 border border-brand/35 rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs text-ink">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <strong className="uppercase tracking-wider text-[10px] text-brand-dark">
              Active Cost Formula:
            </strong>
            <span>Input ${p.gemini_input_per_1m_usd}/1M</span>
            <span>·</span>
            <span>Cached ${p.gemini_cached_per_1m_usd}/1M</span>
            <span>·</span>
            <span>Output+Thinking ${p.gemini_output_per_1m_usd}/1M</span>
            <span>·</span>
            <span>
              TTS ${p.monlam_tts_per_1k_chars_usd}/1K chars{" "}
              {p.monlam_tts_per_1k_chars_usd === 0 ? "(set Render env once rate confirmed)" : ""}
            </span>
          </div>
          <div className="inline-flex items-center gap-1.5 font-semibold text-ink-light">
            <Database size={13} className="text-brand-dark" />
            <span>
              Global TTS Cache: {fmtInt(cacheStats.cached_clips)} clips ({cacheStats.total_kb} KB ·{" "}
              {fmtInt(cacheStats.total_hits)} total saves)
            </span>
          </div>
        </div>
      )}

      {/* Sub-View Switcher */}
      <div className="flex flex-wrap items-center gap-2">
        {(
          [
            { id: "daily", label: `Daily by User (${data?.daily_by_user.length ?? 0})` },
            { id: "conversations", label: `By Conversation (${data?.by_conversation.length ?? 0})` },
            { id: "requests", label: `Every Request (${data?.recent_requests.length ?? 0})` },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSubView(tab.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-colors cursor-pointer ${
              activeSubView === tab.id
                ? "bg-ink text-white shadow-2xs"
                : "bg-surface border border-border-subtle text-ink-light hover:border-ink"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TABLE 1: DAILY USAGE & COST PER USER */}
      {activeSubView === "daily" && (
        <div className="bg-surface border border-border-subtle rounded-2xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-paper border-b border-border-subtle text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                <tr>
                  <th className="px-4 py-3">Date (UTC)</th>
                  <th className="px-4 py-3">Developer</th>
                  <th className="px-4 py-3">Calls (Chat / STT / Eval)</th>
                  <th className="px-4 py-3">TTS (Live / Cache / Chars)</th>
                  <th className="px-4 py-3">Tokens (In / Cached / Out+Think)</th>
                  <th className="px-4 py-3 text-right">Daily Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {(!data || data.daily_by_user.length === 0) && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-ink-muted">
                      No AI Tutor usage recorded yet for this window. Start chatting in AI Tutor and hit Refresh.
                    </td>
                  </tr>
                )}
                {data?.daily_by_user.map((row) => (
                  <tr key={`${row.usage_date}_${row.user_id}`} className="hover:bg-paper/50">
                    <td className="px-4 py-3 font-mono font-bold text-ink whitespace-nowrap">
                      {row.usage_date}
                    </td>
                    <td className="px-4 py-3 font-medium text-ink">{row.user_email}</td>
                    <td className="px-4 py-3 text-ink-light whitespace-nowrap">
                      {row.chat_count} / {row.stt_count} / {row.eval_count}
                      {row.audio_seconds > 0 && (
                        <span className="text-[11px] text-ink-muted ml-1">
                          ({Math.round(row.audio_seconds)}s)
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-ink-light whitespace-nowrap">
                      <span className="font-semibold text-ink">{row.tts_live_count}</span> live ·{" "}
                      <span className="text-emerald-700 font-semibold">{row.tts_cache_hits}</span> free ·{" "}
                      {fmtInt(row.tts_live_chars)} ch
                    </td>
                    <td className="px-4 py-3 text-ink-light whitespace-nowrap font-mono text-[11px]">
                      {fmtInt(row.input_tokens)} / {fmtInt(row.cached_input_tokens)} /{" "}
                      {fmtInt(row.output_tokens + row.thought_tokens)}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="font-bold text-ink">{fmtGbp(row.cost_gbp)}</div>
                      <div className="text-[10px] text-ink-muted">{fmtUsd(row.cost_usd)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TABLE 2: PER-CONVERSATION TOTAL COST */}
      {activeSubView === "conversations" && (
        <div className="bg-surface border border-border-subtle rounded-2xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-paper border-b border-border-subtle text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                <tr>
                  <th className="px-4 py-3">Last Active</th>
                  <th className="px-4 py-3">Developer</th>
                  <th className="px-4 py-3">Mode &amp; Conv ID</th>
                  <th className="px-4 py-3">Turns (Chat / STT / Eval)</th>
                  <th className="px-4 py-3">TTS (Live / Cache)</th>
                  <th className="px-4 py-3">Total Tokens</th>
                  <th className="px-4 py-3 text-right">Conversation Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {(!data || data.by_conversation.length === 0) && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-ink-muted">
                      No conversations recorded yet for this window.
                    </td>
                  </tr>
                )}
                {data?.by_conversation.map((c) => (
                  <tr key={c.conversation_id} className="hover:bg-paper/50">
                    <td className="px-4 py-3 text-ink-muted whitespace-nowrap">
                      {fmtTimeShort(c.last_activity_at)}
                    </td>
                    <td className="px-4 py-3 font-medium text-ink">{c.user_email}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-brand-light text-ink text-[10px] font-bold uppercase tracking-wider mr-1.5">
                        {c.mode || "chat"}
                      </span>
                      <span className="font-mono text-[10px] text-ink-muted">
                        {c.conversation_id.slice(0, 22)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ink-light whitespace-nowrap">
                      {c.chat_count} / {c.stt_count} / {c.eval_count}
                    </td>
                    <td className="px-4 py-3 text-ink-light whitespace-nowrap">
                      {c.tts_live_count} live ({fmtInt(c.tts_live_chars)} ch) ·{" "}
                      <span className="text-emerald-700 font-semibold">{c.tts_cache_hits}</span> free
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-ink">
                      {fmtInt(c.total_tokens)}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="font-bold text-ink">{fmtGbp(c.cost_gbp)}</div>
                      <div className="text-[10px] text-ink-muted">{fmtUsd(c.cost_usd)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TABLE 3: EVERY INDIVIDUAL REQUEST */}
      {activeSubView === "requests" && (
        <div className="bg-surface border border-border-subtle rounded-2xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-paper border-b border-border-subtle text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                <tr>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Developer</th>
                  <th className="px-4 py-3">Endpoint &amp; Mode</th>
                  <th className="px-4 py-3">Tokens / Chars</th>
                  <th className="px-4 py-3">Latency &amp; Status</th>
                  <th className="px-4 py-3 text-right">Request Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {(!data || data.recent_requests.length === 0) && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-ink-muted">
                      No requests logged yet for this window.
                    </td>
                  </tr>
                )}
                {data?.recent_requests.map((r) => (
                  <tr key={r.id} className="hover:bg-paper/50">
                    <td className="px-4 py-2.5 text-ink-muted whitespace-nowrap">
                      {fmtTimeShort(r.created_at)}
                    </td>
                    <td className="px-4 py-2.5 font-medium text-ink max-w-[170px] truncate">
                      {r.user_email}
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mr-1.5 ${
                          r.endpoint === "tts"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : r.endpoint === "chat"
                            ? "bg-sky-50 text-sky-800 border border-sky-200"
                            : "bg-brand-light text-ink border border-brand/30"
                        }`}
                      >
                        {r.endpoint}
                      </span>
                      {r.mode && <span className="text-[11px] text-ink-muted">{r.mode}</span>}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-[11px] text-ink-light whitespace-nowrap">
                      {r.endpoint === "tts" ? (
                        <span>
                          {fmtInt(r.tts_chars)} chars ·{" "}
                          <strong
                            className={
                              r.tts_source === "monlam_live" ? "text-amber-700" : "text-emerald-700"
                            }
                          >
                            {r.tts_source === "monlam_live"
                              ? "Live API"
                              : r.tts_source === "local_wav"
                              ? "Local WAV (Free)"
                              : "Cache (Free)"}
                          </strong>
                        </span>
                      ) : (
                        <span>
                          In {fmtInt(r.input_tokens)} · Ca {fmtInt(r.cached_input_tokens)} · Out{" "}
                          {fmtInt(r.output_tokens + r.thought_tokens)}
                          {r.audio_seconds > 0 ? ` · ${r.audio_seconds}s` : ""}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[11px] text-ink-muted mr-2">
                        <Clock size={11} /> {r.latency_ms}ms
                      </span>
                      {r.status === "ok" ? (
                        <span className="text-[10px] font-bold text-emerald-700">OK</span>
                      ) : (
                        <span className="text-[10px] font-bold text-rose-700">
                          {r.status} {r.error_code ? `(${r.error_code})` : ""}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-right whitespace-nowrap">
                      <div className="font-bold text-ink">{fmtGbp(r.cost_gbp)}</div>
                      <div className="text-[10px] text-ink-muted">{fmtUsd(r.cost_usd)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// TAB 3: DEVELOPER ACCESS ALLOWLIST (EMAIL-BASED, ZERO REDEPLOYS)
// ============================================================================
export function OwnerDevAllowlistTab({
  vaultToken,
  onUnauthorized,
}: {
  vaultToken: string;
  onUnauthorized: (notice?: string) => void;
}) {
  const { getToken } = useAuth();

  const [emails, setEmails] = useState<AllowlistRow[]>([]);
  const [clerkSecretConfigured, setClerkSecretConfigured] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [newEmail, setNewEmail] = useState<string>("");
  const [newNote, setNewNote] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [removingEmail, setRemovingEmail] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadAllowlist = useCallback(async () => {
    if (!vaultToken) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const clerkToken = await getToken();
      if (!clerkToken) throw new Error("Authentication unavailable.");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/dev-allowlist`, {
        headers: {
          Authorization: `Bearer ${clerkToken}`,
          "X-Payments-Token": vaultToken,
        },
      });
      if (res.status === 401) {
        onUnauthorized("Your Owner Vault session expired. Please unlock again.");
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Could not load Developer Allowlist.");
      setEmails(Array.isArray(data?.emails) ? data.emails : []);
      setClerkSecretConfigured(Boolean(data?.clerk_secret_configured));
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Could not load Developer Allowlist.");
    } finally {
      setLoading(false);
    }
  }, [vaultToken, getToken, onUnauthorized]);

  useEffect(() => {
    loadAllowlist();
  }, [loadAllowlist]);

  const handleAddEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newEmail.trim().toLowerCase();
    if (!clean || submitting) return;

    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const clerkToken = await getToken();
      if (!clerkToken) throw new Error("Authentication unavailable.");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/dev-allowlist`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${clerkToken}`,
          "X-Payments-Token": vaultToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: clean, note: newNote.trim() }),
      });
      if (res.status === 401) {
        onUnauthorized("Your Owner Vault session expired. Please unlock again.");
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Could not add email.");

      setNewEmail("");
      setNewNote("");
      setSuccessMsg(`${clean} now has automatic Developer Access (AI Tutor & unlocked lessons).`);
      await loadAllowlist();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Could not add email.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveEmail = async (email: string) => {
    if (removingEmail) return;
    setRemovingEmail(email);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const clerkToken = await getToken();
      if (!clerkToken) throw new Error("Authentication unavailable.");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/dev-allowlist?email=${encodeURIComponent(
          email
        )}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${clerkToken}`,
            "X-Payments-Token": vaultToken,
          },
        }
      );
      if (res.status === 401) {
        onUnauthorized("Your Owner Vault session expired. Please unlock again.");
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Could not remove email.");

      setSuccessMsg(`Removed ${email} from Developer Access.`);
      await loadAllowlist();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Could not remove email.");
    } finally {
      setRemovingEmail(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Verification Security Status */}
      <div
        className={`rounded-2xl p-4 border flex items-start gap-3 text-xs leading-relaxed ${
          clerkSecretConfigured
            ? "bg-emerald-50 border-emerald-200 text-emerald-900"
            : "bg-amber-50 border-amber-200 text-amber-900"
        }`}
      >
        {clerkSecretConfigured ? (
          <CheckCircle2 size={17} className="text-emerald-600 shrink-0 mt-0.5" />
        ) : (
          <AlertCircle size={17} className="text-amber-600 shrink-0 mt-0.5" />
        )}
        <div>
          <strong className="block mb-0.5">
            {clerkSecretConfigured
              ? "Clerk Verified Email Protection Active"
              : "CLERK_SECRET_KEY Not Detected on Backend"}
          </strong>
          <span>
            {clerkSecretConfigured
              ? "Approved emails below automatically unlock AI Tutor and all lessons upon signing in — and NEVER grant access to this Owner Vault."
              : "Add CLERK_SECRET_KEY to Render Environment Variables so the backend verifies Clerk emails directly."}
          </span>
        </div>
      </div>

      {/* Add New Developer Form */}
      <form
        onSubmit={handleAddEmail}
        className="bg-surface border border-border-subtle rounded-2xl p-5 shadow-2xs space-y-4"
      >
        <div>
          <h3 className="font-serif text-xl text-ink mb-1">Add Approved Developer Email</h3>
          <p className="text-xs text-ink-muted">
            Works immediately with zero redeploys — even if this person hasn&apos;t created a Loplao account yet.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-5">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="tester@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-paper/70 border border-border-strong focus:border-ink text-sm text-ink focus:outline-none"
            />
          </div>
          <div className="md:col-span-5">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-1">
              Note (Optional)
            </label>
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="e.g. Tibetan teacher / Beta tester"
              className="w-full px-3.5 py-2.5 rounded-xl bg-paper/70 border border-border-subtle focus:border-ink text-sm text-ink focus:outline-none"
            />
          </div>
          <div className="md:col-span-2 flex items-end">
            <button
              type="submit"
              disabled={submitting || !newEmail.trim()}
              className="w-full py-2.5 px-4 rounded-xl bg-ink hover:bg-ink-light text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {submitting ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              Approve
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3.5 py-2.5">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-2.5">
            {successMsg}
          </div>
        )}
      </form>

      {/* Approved Emails List */}
      <div className="bg-surface border border-border-subtle rounded-2xl overflow-hidden shadow-2xs">
        <div className="px-5 py-3.5 bg-paper border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-ink">
            <Users size={15} className="text-brand-dark" />
            <span>Approved Developer Accounts ({emails.length})</span>
          </div>
          <button
            type="button"
            onClick={loadAllowlist}
            className="text-xs font-bold text-ink-muted hover:text-ink inline-flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw size={12} /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <Loader2 size={24} className="animate-spin text-brand" />
          </div>
        ) : (
          <div className="divide-y divide-border-subtle">
            {emails.map((row) => (
              <div
                key={row.email}
                className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-sm font-bold text-ink">{row.email}</span>
                    {row.is_owner ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-light text-brand-dark border border-brand/40 text-[10px] font-bold uppercase tracking-wider">
                        <ShieldCheck size={11} /> Owner · Protected
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider">
                        Developer
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-ink-muted mt-0.5">
                    {row.note || "Approved Developer"}
                    {row.added_by && row.added_by !== "system" ? ` · Added by ${row.added_by}` : ""}
                  </div>
                </div>

                {!row.is_owner && (
                  <button
                    type="button"
                    disabled={removingEmail === row.email}
                    onClick={() => handleRemoveEmail(row.email)}
                    className="self-start sm:self-center inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {removingEmail === row.email ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Trash2 size={12} />
                    )}
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
