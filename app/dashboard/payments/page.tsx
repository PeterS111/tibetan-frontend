// app/dashboard/payments/page.tsx
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import {
  Receipt,
  BookOpen,
  ShoppingBag,
  Heart,
  Search,
  Download,
  RefreshCw,
  Copy,
  Check,
  Package,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Loader2,
  AlertCircle,
  FileText,
  Calendar,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  X,
  Cpu,
  Users,
} from "lucide-react";
import { useDevBypass } from "@/hooks/useDevBypass";
import { usePlatform } from "@/hooks/usePlatform";
import { OwnerAiUsageTab, OwnerDevAllowlistTab } from "@/app/components/admin/OwnerAiAndDevTabs";

interface PaymentItemDetail {
  id?: string;
  name?: string;
  qty?: number;
  unit_pence?: number;
}

interface PaymentRecord {
  id: number;
  reference_id: string;
  category: "course" | "shop" | "donation";
  sub_type: string;
  status: "paid" | "refunded" | "partially_refunded";
  amount_gbp: number;
  subtotal_gbp?: number | null;
  shipping_gbp?: number | null;
  currency: string;
  payer_name: string;
  payer_email: string;
  payer_phone: string;
  item_summary: string;
  shipping_address_text: string;
  details?: {
    items?: PaymentItemDetail[];
    order_kind?: string;
    has_ebook?: boolean;
    course_category?: string;
    packages?: string[];
    level?: string;
    region?: string;
    message?: string;
    frequency?: string;
    renewal?: boolean;
    original_reference_id?: string;
  };
  fulfillment_status: string;
  fulfillment_note: string;
  stripe_session_id?: string | null;
  stripe_payment_intent_id?: string | null;
  stripe_invoice_id?: string | null;
  stripe_subscription_id?: string | null;
  paid_at: string;
}

interface PaymentSummary {
  total_gbp: number;
  total_count: number;
  course_gbp: number;
  course_count: number;
  shop_gbp: number;
  shop_count: number;
  shop_action_needed: number;
  donation_gbp: number;
  donation_count: number;
  refunded_gbp: number;
  refunded_count: number;
}

interface OwnerEmailOption {
  index: number;
  masked: string;
}

const VAULT_TOKEN_KEY = "loplao_payments_vault_token_v1";

const EMPTY_SUMMARY: PaymentSummary = {
  total_gbp: 0,
  total_count: 0,
  course_gbp: 0,
  course_count: 0,
  shop_gbp: 0,
  shop_count: 0,
  shop_action_needed: 0,
  donation_gbp: 0,
  donation_count: 0,
  refunded_gbp: 0,
  refunded_count: 0,
};

function formatGBP(amount: number | string | null | undefined): string {
  const num = Number(amount) || 0;
  return `£${num.toLocaleString("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatUKDate(isoStr: string): string {
  try {
    const d = new Date(isoStr);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return isoStr;
  }
}

function formatUKTime(isoStr: string): string {
  try {
    const d = new Date(isoStr);
    return d.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

function getMonthKey(isoStr: string): string {
  try {
    const d = new Date(isoStr);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    return `${y}-${m}`;
  } catch {
    return "";
  }
}

function formatMonthLabel(monthKey: string): string {
  try {
    const [y, m] = monthKey.split("-").map(Number);
    const d = new Date(y, (m || 1) - 1, 1);
    return d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  } catch {
    return monthKey;
  }
}

function escapeCsvCell(value: unknown): string {
  const str = String(value ?? "").replace(/\r?\n/g, ", ");
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export default function AdminPaymentsPage() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const { isPaymentsOwner, isChecking } = useDevBypass();
  const { isNative } = usePlatform();

  // Vault Auth State (separate from Developer Bypass)
  const [vaultChecking, setVaultChecking] = useState(true);
  const [passwordConfigured, setPasswordConfigured] = useState(true);
  const [vaultToken, setVaultToken] = useState<string | null>(null);
  const [vaultTab, setVaultTab] = useState<"payments" | "ai_usage" | "dev_access">("payments");
  const [ownerEmailOptions, setOwnerEmailOptions] = useState<OwnerEmailOption[]>([]);

  // Unlock form state
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authNotice, setAuthNotice] = useState<string | null>(null);

  // Email-verified password setup / change flow state
  const [showResetFlow, setShowResetFlow] = useState(false);
  const [selectedEmailIndex, setSelectedEmailIndex] = useState(0);
  const [resetStep, setResetStep] = useState<"choose_email" | "enter_code">("choose_email");
  const [sendingCode, setSendingCode] = useState(false);
  const [codeSentToMasked, setCodeSentToMasked] = useState<string | null>(null);
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  // Payments Ledger State
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [summary, setSummary] = useState<PaymentSummary>(EMPTY_SUMMARY);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState<"all" | "course" | "shop" | "donation">("all");
  const [monthFilter, setMonthFilter] = useState<string>("all");
  const [onlyActionNeeded, setOnlyActionNeeded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Micro-interaction states
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [noteDrafts, setNoteDrafts] = useState<Record<number, string>>({});
  const [savedNoteId, setSavedNoteId] = useState<number | null>(null);

  const lockVault = useCallback((notice?: string) => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(VAULT_TOKEN_KEY);
    }
    setVaultToken(null);
    setPayments([]);
    setSummary(EMPTY_SUMMARY);
    setPasswordInput("");
    setShowResetFlow(false);
    if (notice) setAuthNotice(notice);
  }, []);

  const fetchPayments = useCallback(
    async (activeVaultToken: string, isManualRefresh = false) => {
      if (!user || !activeVaultToken) return;
      if (isManualRefresh) setRefreshing(true);
      else setLoading(true);
      setErrorMsg(null);

      try {
        const clerkToken = await getToken();
        if (!clerkToken) throw new Error("Authentication unavailable.");

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/payments`, {
          headers: {
            Authorization: `Bearer ${clerkToken}`,
            "X-Payments-Token": activeVaultToken,
          },
        });

        if (res.status === 401) {
          lockVault("Your Payments session expired or the password was updated. Please unlock again.");
          return;
        }

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error || "Could not load payments.");
        }

        const list: PaymentRecord[] = Array.isArray(data?.payments) ? data.payments : [];
        setPayments(list);
        if (data?.summary) setSummary(data.summary);

        const drafts: Record<number, string> = {};
        for (const p of list) {
          drafts[p.id] = p.fulfillment_note || "";
        }
        setNoteDrafts(drafts);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Could not load payments.";
        setErrorMsg(msg);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [user, getToken, lockVault]
  );

  // Check Vault status on mount
  useEffect(() => {
    if (isChecking || !isPaymentsOwner || !user) return;
    let active = true;

    const checkVault = async () => {
      setVaultChecking(true);
      setAuthError(null);
      try {
        const clerkToken = await getToken();
        if (!clerkToken) return;

        const savedToken =
          typeof window !== "undefined" ? sessionStorage.getItem(VAULT_TOKEN_KEY) : null;

        const headers: Record<string, string> = {
          Authorization: `Bearer ${clerkToken}`,
        };
        if (savedToken) {
          headers["X-Payments-Token"] = savedToken;
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments-auth/status`, {
          headers,
        });
        const data = await res.json();
        if (!active) return;

        if (!res.ok) {
          setAuthError(data?.detail || data?.error || "Could not verify Payments access.");
          setVaultChecking(false);
          return;
        }

        const configured = Boolean(data?.password_configured);
        setPasswordConfigured(configured);
        if (Array.isArray(data?.owner_email_options)) {
          setOwnerEmailOptions(data.owner_email_options);
        }

        if (configured && data?.unlocked && savedToken) {
          setVaultToken(savedToken);
          setVaultChecking(false);
          fetchPayments(savedToken, false);
        } else {
          if (typeof window !== "undefined") {
            sessionStorage.removeItem(VAULT_TOKEN_KEY);
          }
          setVaultToken(null);
          if (!configured) {
            setShowResetFlow(true);
            setResetStep("choose_email");
          }
          setVaultChecking(false);
        }
      } catch {
        if (active) {
          setAuthError("Could not reach server to check Payments lock status.");
          setVaultChecking(false);
        }
      }
    };

    checkVault();
    return () => {
      active = false;
    };
  }, [isChecking, isPaymentsOwner, user, getToken, fetchPayments]);

  const handleUnlockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim() || unlocking) return;

    setUnlocking(true);
    setAuthError(null);
    setAuthNotice(null);

    try {
      const clerkToken = await getToken();
      if (!clerkToken) throw new Error("Authentication unavailable.");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments-auth/unlock`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${clerkToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: passwordInput }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          setPasswordConfigured(false);
          setShowResetFlow(true);
          setResetStep("choose_email");
        }
        throw new Error(data?.error || data?.detail || "Incorrect password.");
      }

      const token = data?.token as string;
      if (!token) throw new Error("No session token received.");

      if (typeof window !== "undefined") {
        sessionStorage.setItem(VAULT_TOKEN_KEY, token);
      }
      setVaultToken(token);
      setPasswordInput("");
      fetchPayments(token, false);
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : "Could not unlock Payments.");
    } finally {
      setUnlocking(false);
    }
  };

  const openResetFlow = () => {
    setShowResetFlow(true);
    setResetStep("choose_email");
    setResetError(null);
    setOtpCode("");
    setNewPassword("");
    setConfirmNewPassword("");
    setCodeSentToMasked(null);
  };

  const handleSendResetCode = async () => {
    if (sendingCode) return;
    setSendingCode(true);
    setResetError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    try {
      const clerkToken = await getToken();
      if (!clerkToken) throw new Error("Authentication unavailable.");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payments-auth/request-reset`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${clerkToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ emailIndex: selectedEmailIndex }),
          signal: controller.signal,
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || data?.detail || "Could not send verification email.");
      }

      setCodeSentToMasked(data?.sent_to_masked || "owner email");
      setResetStep("enter_code");
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        setResetError(
          "The server took too long to respond. If the 6-digit code arrived in your email, click 'Already received a code? Enter it here' below."
        );
      } else {
        setResetError(err instanceof Error ? err.message : "Could not send verification email.");
      }
    } finally {
      clearTimeout(timeoutId);
      setSendingCode(false);
    }
  };

  const handleConfirmPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmingReset) return;

    const cleanCode = otpCode.replace(/\s+/g, "");
    if (!/^\d{6}$/.test(cleanCode)) {
      setResetError("Please enter the 6-digit code sent to your email.");
      return;
    }
    if (newPassword.trim().length < 10) {
      setResetError("Password must be at least 10 characters long.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setResetError("The two password fields do not match.");
      return;
    }

    setConfirmingReset(true);
    setResetError(null);

    try {
      const clerkToken = await getToken();
      if (!clerkToken) throw new Error("Authentication unavailable.");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payments-auth/confirm-reset`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${clerkToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: cleanCode,
            newPassword: newPassword.trim(),
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || data?.detail || "Could not update password.");
      }

      const freshToken = data?.token as string;
      if (freshToken && typeof window !== "undefined") {
        sessionStorage.setItem(VAULT_TOKEN_KEY, freshToken);
      }

      setPasswordConfigured(true);
      setVaultToken(freshToken || null);
      setShowResetFlow(false);
      setOtpCode("");
      setNewPassword("");
      setConfirmNewPassword("");
      setAuthNotice("Your Payments password has been updated and verified via email.");

      if (freshToken) {
        fetchPayments(freshToken, false);
      }
    } catch (err: unknown) {
      setResetError(err instanceof Error ? err.message : "Could not update password.");
    } finally {
      setConfirmingReset(false);
    }
  };

  const availableMonths = useMemo(() => {
    const set = new Set<string>();
    for (const p of payments) {
      const mk = getMonthKey(p.paid_at);
      if (mk) set.add(mk);
    }
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [payments]);

  const filteredPayments = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return payments.filter((p) => {
      if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
      if (monthFilter !== "all" && getMonthKey(p.paid_at) !== monthFilter) return false;
      if (
        onlyActionNeeded &&
        !(
          p.category === "shop" &&
          (p.fulfillment_status === "to_dispatch" || p.fulfillment_status === "digital_to_send")
        )
      ) {
        return false;
      }
      if (q) {
        const haystack = [
          p.reference_id,
          p.payer_name,
          p.payer_email,
          p.payer_phone,
          p.item_summary,
          p.shipping_address_text,
          p.sub_type,
          p.fulfillment_note,
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [payments, categoryFilter, monthFilter, onlyActionNeeded, searchQuery]);

  const filteredNetTotal = useMemo(() => {
    return filteredPayments.reduce((acc, p) => {
      if (p.status === "refunded") return acc;
      return acc + (Number(p.amount_gbp) || 0);
    }, 0);
  }, [filteredPayments]);

  const handleCopy = async (key: string, text: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey((curr) => (curr === key ? null : curr)), 2000);
    } catch {}
  };

  const handleUpdateFulfillment = async (
    payment: PaymentRecord,
    nextStatus?: string,
    nextNote?: string
  ) => {
    if (!vaultToken) return;
    setSavingId(payment.id);
    setErrorMsg(null);
    try {
      const clerkToken = await getToken();
      if (!clerkToken) throw new Error("Authentication unavailable.");

      const payload: Record<string, string> = {};
      if (nextStatus !== undefined) payload.fulfillment_status = nextStatus;
      if (nextNote !== undefined) payload.fulfillment_note = nextNote;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/payments/${payment.id}/fulfillment`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${clerkToken}`,
            "X-Payments-Token": vaultToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (res.status === 401) {
        lockVault("Your Payments session expired. Please unlock again.");
        return;
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Could not save update.");

      setPayments((prev) => {
        const updatedList = prev.map((row) =>
          row.id === payment.id
            ? {
                ...row,
                fulfillment_status: nextStatus ?? row.fulfillment_status,
                fulfillment_note: nextNote ?? row.fulfillment_note,
              }
            : row
        );

        const actionCount = updatedList.filter(
          (r) =>
            r.category === "shop" &&
            r.status !== "refunded" &&
            (r.fulfillment_status === "to_dispatch" || r.fulfillment_status === "digital_to_send")
        ).length;
        setSummary((s) => ({ ...s, shop_action_needed: actionCount }));
        return updatedList;
      });

      if (nextNote !== undefined) {
        setSavedNoteId(payment.id);
        setTimeout(() => setSavedNoteId((curr) => (curr === payment.id ? null : curr)), 2000);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not save update.";
      setErrorMsg(msg);
    } finally {
      setSavingId(null);
    }
  };

  const handleDownloadCsv = () => {
    const headers = [
      "Reference ID",
      "Date",
      "Category",
      "Type",
      "Payment Status",
      "Amount (GBP)",
      "Shipping (GBP)",
      "Payer Name",
      "Payer Email",
      "Payer Phone",
      "What Was Paid For",
      "Delivery Address",
      "Dispatch / Fulfillment Status",
      "Notes",
    ];

    const rows = filteredPayments.map((p) => [
      p.reference_id,
      `${formatUKDate(p.paid_at)} ${formatUKTime(p.paid_at)}`,
      p.category.toUpperCase(),
      p.sub_type,
      p.status,
      Number(p.amount_gbp || 0).toFixed(2),
      Number(p.shipping_gbp || 0).toFixed(2),
      p.payer_name,
      p.payer_email,
      p.payer_phone,
      p.item_summary,
      p.shipping_address_text,
      p.fulfillment_status,
      p.fulfillment_note,
    ]);

    const csvLines = [headers, ...rows]
      .map((line) => line.map(escapeCsvCell).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csvLines], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const today = new Date().toISOString().slice(0, 10);
    const catPart = categoryFilter === "all" ? "all" : categoryFilter;
    const monthPart = monthFilter === "all" ? "" : `-${monthFilter}`;
    a.href = url;
    a.download = `loplao-payments-${catPart}${monthPart}-${today}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isChecking || vaultChecking) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-paper text-ink-muted">
        <Loader2 size={32} className="animate-spin text-brand mb-3" />
        <p className="text-xs font-bold uppercase tracking-widest">Checking Owner Access...</p>
      </div>
    );
  }

  if (!isPaymentsOwner) {
    return null;
  }

  // Reusable 2-step Email-Verified Password Setup / Change Panel
  const renderEmailPasswordFlow = (isModal: boolean) => (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark mb-1">
            Email-Verified Security
          </div>
          <h2 className="font-serif font-normal text-2xl text-ink">
            {passwordConfigured ? "Change Payments Password" : "Set Up Your Payments Password"}
          </h2>
        </div>
        {(isModal || passwordConfigured) && (
          <button
            type="button"
            onClick={() => {
              setShowResetFlow(false);
              setResetError(null);
            }}
            className="w-8 h-8 rounded-full bg-paper border border-border-subtle flex items-center justify-center text-ink-muted hover:text-ink cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {resetStep === "choose_email" ? (
        <div className="space-y-4">
          <p className="text-sm text-ink-light leading-relaxed">
            For your security, setting or changing the Payments password requires a{" "}
            <strong className="text-ink">6-digit verification code</strong> sent to an authorised
            owner email address.
          </p>

          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-ink-muted">
              Send verification code to:
            </label>
            {ownerEmailOptions.map((opt) => (
              <label
                key={opt.index}
                onClick={() => setSelectedEmailIndex(opt.index)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl border cursor-pointer transition-colors ${
                  selectedEmailIndex === opt.index
                    ? "bg-brand-light/70 border-brand text-ink"
                    : "bg-paper/60 border-border-subtle text-ink-light hover:border-ink"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="ownerEmailChoice"
                    checked={selectedEmailIndex === opt.index}
                    onChange={() => setSelectedEmailIndex(opt.index)}
                    className="accent-ink"
                  />
                  <span className="font-mono text-sm font-semibold">{opt.masked}</span>
                </div>
                <Mail size={15} className="text-ink-muted" />
              </label>
            ))}
          </div>

          {resetError && (
            <div className="flex items-start gap-2 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl p-3">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{resetError}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleSendResetCode}
            disabled={sendingCode}
            className="w-full py-3.5 rounded-full bg-ink hover:bg-ink-light text-white text-sm font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {sendingCode ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Sending 6-digit code...
              </>
            ) : (
              <>
                <Mail size={15} /> Send 6-Digit Verification Code
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setResetError(null);
              setCodeSentToMasked(
                ownerEmailOptions[selectedEmailIndex]?.masked || "your owner email"
              );
              setResetStep("enter_code");
            }}
            className="w-full text-center text-xs font-medium text-ink-muted hover:text-ink py-1 cursor-pointer"
          >
            Already received a 6-digit code? Enter it here
          </button>
        </div>
      ) : (
        <form onSubmit={handleConfirmPasswordChange} className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-900 leading-relaxed">
            A 6-digit verification code has been sent to{" "}
            <strong className="font-mono">{codeSentToMasked}</strong>. It expires in 10 minutes.
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-1.5">
              6-Digit Code from Email
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              required
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              className="w-full px-4 py-3 rounded-xl bg-paper/70 border border-border-strong focus:border-ink font-mono text-xl tracking-[0.4em] text-center text-ink focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-1.5">
              New Payments Password (min. 10 characters)
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                required
                minLength={10}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Choose a strong private password"
                autoComplete="new-password"
                className="w-full px-4 py-3 pr-11 rounded-xl bg-paper/70 border border-border-strong focus:border-ink text-sm text-ink focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink cursor-pointer"
                aria-label="Toggle password visibility"
              >
                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-1.5">
              Confirm New Password
            </label>
            <input
              type={showNewPassword ? "text" : "password"}
              required
              minLength={10}
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="Re-enter your new password"
              autoComplete="new-password"
              className="w-full px-4 py-3 rounded-xl bg-paper/70 border border-border-strong focus:border-ink text-sm text-ink focus:outline-none"
            />
          </div>

          {resetError && (
            <div className="flex items-start gap-2 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl p-3">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{resetError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={confirmingReset}
            className="w-full py-3.5 rounded-full bg-brand hover:bg-brand-dark text-ink text-sm font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-xs"
          >
            {confirmingReset ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Saving Password...
              </>
            ) : (
              <>
                <ShieldCheck size={16} /> Save Password &amp; Open Payments
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setResetStep("choose_email");
              setResetError(null);
            }}
            className="w-full text-center text-xs font-medium text-ink-muted hover:text-ink py-1 cursor-pointer"
          >
            Didn&apos;t receive the code? Send again or pick another owner email
          </button>
        </form>
      )}
    </div>
  );

  // ============================================================================
  // LOCKED VIEW (Owner must enter dedicated Payments Password)
  // ============================================================================
  if (!vaultToken) {
    return (
      <div
        className={`max-w-lg mx-auto py-8 sm:py-14 animate-in fade-in duration-300 ${
          isNative ? "px-4 pt-12" : ""
        }`}
      >
        <div className="bg-surface border border-border-subtle rounded-3xl p-7 sm:p-9 shadow-sm">
          {showResetFlow || !passwordConfigured ? (
            renderEmailPasswordFlow(false)
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-ink text-brand flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Lock size={24} />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark mb-1">
                  Owner Vault
                </div>
                <h1 className="font-serif font-normal text-3xl text-ink mb-2">
                  Payments &amp; Orders
                </h1>
                <p className="text-sm text-ink-light leading-relaxed">
                  Enter your private Payments password to view Course fees, Shop orders &amp;
                  delivery addresses, and Donations.
                </p>
              </div>

              {authNotice && (
                <div className="bg-brand-light/70 border border-brand/40 rounded-xl p-3.5 text-xs text-ink leading-relaxed">
                  {authNotice}
                </div>
              )}

              <form onSubmit={handleUnlockSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-1.5">
                    Payments Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      autoFocus
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Enter your Payments password"
                      autoComplete="current-password"
                      className="w-full px-4 py-3.5 pr-11 rounded-xl bg-paper/70 border border-border-strong focus:border-ink text-sm text-ink focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink cursor-pointer"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {authError && (
                  <div className="flex items-start gap-2 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl p-3">
                    <AlertCircle size={15} className="shrink-0 mt-0.5" />
                    <span>{authError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={unlocking || !passwordInput.trim()}
                  className="w-full py-3.5 rounded-full bg-ink hover:bg-ink-light text-white text-sm font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {unlocking ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Unlocking...
                    </>
                  ) : (
                    <>
                      <KeyRound size={15} /> Unlock Payments
                    </>
                  )}
                </button>
              </form>

              <div className="pt-4 border-t border-border-subtle text-center">
                <button
                  type="button"
                  onClick={openResetFlow}
                  className="text-xs font-bold text-ink-light hover:text-brand-dark underline decoration-border-strong underline-offset-4 cursor-pointer"
                >
                  Forgot or want to change password? Verify via email
                </button>
                <p className="text-[11px] text-ink-muted mt-2">
                  Auto-locks after 2 hours or when you close this browser tab.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ============================================================================
  // UNLOCKED PAYMENTS & ORDERS DASHBOARD
  // ============================================================================
  return (
    <div
      className={`max-w-5xl mx-auto pb-24 animate-in fade-in duration-300 ${
        isNative ? "px-4 pt-10" : ""
      }`}
    >
      {/* 1. HEADER + ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark mb-1.5">
            Loplao Accounts &amp; Dispatch
          </div>
          <h1 className="font-serif font-normal text-3xl sm:text-4xl text-ink mb-1">
            Payments &amp; Orders
          </h1>
          <p className="text-sm text-ink-light">
            Manage Payments & Orders, AI Tutor token costs, and pre-approved Developer emails in one secure vault.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => fetchPayments(vaultToken, true)}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-surface border border-border-strong hover:border-ink text-xs font-bold text-ink transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>

          <button
            type="button"
            onClick={openResetFlow}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-surface border border-border-strong hover:border-ink text-xs font-bold text-ink transition-colors cursor-pointer"
          >
            <KeyRound size={13} />
            Change Password
          </button>

          <button
            type="button"
            onClick={() => lockVault("Payments vault locked.")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-surface border border-border-strong hover:border-rose-400 hover:text-rose-700 text-xs font-bold text-ink-light transition-colors cursor-pointer"
          >
            <Lock size={13} />
            Lock
          </button>

          <button
            type="button"
            onClick={handleDownloadCsv}
            disabled={filteredPayments.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ink hover:bg-ink-light text-white text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-40"
          >
            <Download size={13} />
            Download Spreadsheet (CSV)
          </button>
        </div>
      </div>

      {authNotice && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between gap-3 text-sm text-emerald-900">
          <div className="flex items-center gap-2.5">
            <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
            <span>{authNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setAuthNotice(null)}
            className="text-emerald-700 hover:text-emerald-950 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* OWNER_VAULT_TABS_START */}
      <div className="flex flex-wrap items-center gap-2 mb-7 pb-3 border-b border-border-subtle">
        <button
          type="button"
          onClick={() => setVaultTab("payments")}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
            vaultTab === "payments"
              ? "bg-ink text-white shadow-xs"
              : "bg-surface border border-border-subtle text-ink-light hover:border-ink"
          }`}
        >
          <Receipt size={15} />
          <span>Payments &amp; Orders</span>
        </button>

        <button
          type="button"
          onClick={() => setVaultTab("ai_usage")}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
            vaultTab === "ai_usage"
              ? "bg-ink text-white shadow-xs"
              : "bg-surface border border-border-subtle text-ink-light hover:border-ink"
          }`}
        >
          <Cpu size={15} />
          <span>AI Usage &amp; Costs</span>
        </button>

        <button
          type="button"
          onClick={() => setVaultTab("dev_access")}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
            vaultTab === "dev_access"
              ? "bg-ink text-white shadow-xs"
              : "bg-surface border border-border-subtle text-ink-light hover:border-ink"
          }`}
        >
          <Users size={15} />
          <span>Developer Access</span>
        </button>
      </div>

      {vaultTab === "ai_usage" && (
        <OwnerAiUsageTab vaultToken={vaultToken} onUnauthorized={lockVault} />
      )}

      {vaultTab === "dev_access" && (
        <OwnerDevAllowlistTab vaultToken={vaultToken} onUnauthorized={lockVault} />
      )}

      {vaultTab === "payments" && (
        <>
      {/* OWNER_VAULT_TABS_END */}
      {/* 2. FOUR COLOUR-CODED CATEGORY SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-8">
        <button
          type="button"
          onClick={() => {
            setCategoryFilter("all");
            setOnlyActionNeeded(false);
          }}
          className={`text-left rounded-2xl p-5 border transition-all cursor-pointer ${
            categoryFilter === "all" && !onlyActionNeeded
              ? "bg-ink text-white border-ink shadow-md"
              : "bg-surface text-ink border-border-subtle hover:border-ink"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span
              className={`text-[10px] font-bold uppercase tracking-widest ${
                categoryFilter === "all" && !onlyActionNeeded ? "text-brand" : "text-ink-muted"
              }`}
            >
              All Payments
            </span>
            <Receipt
              size={17}
              className={
                categoryFilter === "all" && !onlyActionNeeded ? "text-brand" : "text-ink-muted"
              }
            />
          </div>
          <div className="font-serif text-2xl sm:text-3xl mb-1">
            {formatGBP(summary.total_gbp)}
          </div>
          <div
            className={`text-xs ${
              categoryFilter === "all" && !onlyActionNeeded ? "text-white/75" : "text-ink-muted"
            }`}
          >
            {summary.total_count} {summary.total_count === 1 ? "payment" : "payments"}
            {summary.refunded_count > 0 ? ` · ${summary.refunded_count} refunded` : ""}
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            setCategoryFilter("course");
            setOnlyActionNeeded(false);
          }}
          className={`text-left rounded-2xl p-5 border transition-all cursor-pointer ${
            categoryFilter === "course"
              ? "bg-sky-50 border-sky-500 ring-2 ring-sky-200 shadow-sm"
              : "bg-surface border-border-subtle hover:border-sky-400"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-sky-700">
              Courses
            </span>
            <BookOpen size={17} className="text-sky-600" />
          </div>
          <div className="font-serif text-2xl sm:text-3xl text-ink mb-1">
            {formatGBP(summary.course_gbp)}
          </div>
          <div className="text-xs text-ink-muted">
            {summary.course_count} {summary.course_count === 1 ? "enrollment" : "enrollments"}
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            setCategoryFilter("shop");
            setOnlyActionNeeded(false);
          }}
          className={`text-left rounded-2xl p-5 border transition-all cursor-pointer ${
            categoryFilter === "shop"
              ? "bg-brand-light border-brand ring-2 ring-brand/30 shadow-sm"
              : "bg-surface border-border-subtle hover:border-brand"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-dark">
              Shop
            </span>
            <ShoppingBag size={17} className="text-brand-dark" />
          </div>
          <div className="font-serif text-2xl sm:text-3xl text-ink mb-1">
            {formatGBP(summary.shop_gbp)}
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-ink-muted">
            <span>
              {summary.shop_count} {summary.shop_count === 1 ? "order" : "orders"}
            </span>
            {summary.shop_action_needed > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                {summary.shop_action_needed} to send
              </span>
            )}
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            setCategoryFilter("donation");
            setOnlyActionNeeded(false);
          }}
          className={`text-left rounded-2xl p-5 border transition-all cursor-pointer ${
            categoryFilter === "donation"
              ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-200 shadow-sm"
              : "bg-surface border-border-subtle hover:border-emerald-400"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">
              Donations
            </span>
            <Heart size={17} className="text-emerald-600" />
          </div>
          <div className="font-serif text-2xl sm:text-3xl text-ink mb-1">
            {formatGBP(summary.donation_gbp)}
          </div>
          <div className="text-xs text-ink-muted">
            {summary.donation_count} {summary.donation_count === 1 ? "donation" : "donations"}
          </div>
        </button>
      </div>

      {/* 3. FILTER & SEARCH BAR */}
      <div className="bg-surface border border-border-subtle rounded-2xl p-4 mb-6 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by person's name, email, item, address, or Reference ID..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-paper/70 border border-border-subtle focus:border-ink text-sm text-ink placeholder:text-ink-muted focus:outline-none"
            />
          </div>

          <div className="relative shrink-0">
            <Calendar
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none"
            />
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="w-full md:w-auto pl-9 pr-8 py-2.5 rounded-xl bg-paper/70 border border-border-subtle focus:border-ink text-sm font-medium text-ink focus:outline-none cursor-pointer"
            >
              <option value="all">All Months</option>
              {availableMonths.map((mk) => (
                <option key={mk} value={mk}>
                  {formatMonthLabel(mk)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                { id: "all", label: "All" },
                { id: "course", label: "Course" },
                { id: "shop", label: "Shop" },
                { id: "donation", label: "Donation" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setCategoryFilter(tab.id);
                  if (tab.id !== "shop" && tab.id !== "all") setOnlyActionNeeded(false);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                  categoryFilter === tab.id && !onlyActionNeeded
                    ? "bg-ink text-white"
                    : "bg-paper border border-border-subtle text-ink-light hover:border-ink"
                }`}
              >
                {tab.label}
              </button>
            ))}

            {summary.shop_action_needed > 0 && (
              <button
                type="button"
                onClick={() => {
                  setOnlyActionNeeded((v) => !v);
                  setCategoryFilter("shop");
                }}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                  onlyActionNeeded
                    ? "bg-amber-600 text-white"
                    : "bg-amber-50 border border-amber-300 text-amber-900 hover:bg-amber-100"
                }`}
              >
                <Package size={13} />
                Shop Orders To Post / Send ({summary.shop_action_needed})
              </button>
            )}
          </div>

          <div className="text-xs font-medium text-ink-muted">
            Showing <strong className="text-ink">{filteredPayments.length}</strong>{" "}
            {filteredPayments.length === 1 ? "payment" : "payments"} · Subtotal{" "}
            <strong className="text-ink">{formatGBP(filteredNetTotal)}</strong>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center gap-3 text-sm text-rose-800">
          <AlertCircle size={18} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 4. PAYMENTS LIST */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-ink-muted">
          <Loader2 size={32} className="animate-spin text-brand mb-3" />
          <p className="text-sm font-medium">Loading payments...</p>
        </div>
      ) : filteredPayments.length === 0 ? (
        <div className="bg-surface border border-border-subtle rounded-3xl p-12 text-center shadow-2xs">
          <Receipt size={38} className="mx-auto text-border-strong mb-4" strokeWidth={1.5} />
          <h2 className="font-serif text-2xl text-ink mb-2">No payments to show yet</h2>
          <p className="text-sm text-ink-light max-w-md mx-auto">
            {payments.length === 0
              ? "As soon as someone pays for a Course, buys from the Shop, or makes a Donation, it will appear right here with its full Reference ID and details."
              : "No payments match your current filter or search. Try switching back to All."}
          </p>
          {payments.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setCategoryFilter("all");
                setMonthFilter("all");
                setOnlyActionNeeded(false);
                setSearchQuery("");
              }}
              className="mt-5 px-5 py-2.5 rounded-full bg-ink text-white text-xs font-bold cursor-pointer"
            >
              Show All Payments
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPayments.map((p) => {
            const isShop = p.category === "shop";
            const isCourse = p.category === "course";
            const isDonation = p.category === "donation";
            const isRefunded = p.status === "refunded";
            const isEbookOnly =
              isShop &&
              (p.sub_type === "ebook" || (!p.shipping_address_text && p.details?.has_ebook));
            const needsAction =
              isShop &&
              !isRefunded &&
              (p.fulfillment_status === "to_dispatch" ||
                p.fulfillment_status === "digital_to_send");

            const catBadgeClass = isCourse
              ? "bg-sky-100 text-sky-900 border-sky-200"
              : isShop
              ? "bg-brand-light text-amber-950 border-brand/50"
              : "bg-emerald-100 text-emerald-900 border-emerald-200";

            const catLabel = isCourse ? "COURSE" : isShop ? "SHOP" : "DONATION";
            const itemsArray = Array.isArray(p.details?.items) ? p.details.items : [];
            const isSavingThis = savingId === p.id;
            const noteVal = noteDrafts[p.id] ?? p.fulfillment_note ?? "";

            return (
              <div
                key={p.id}
                className={`bg-surface rounded-2xl border shadow-2xs overflow-hidden transition-all ${
                  needsAction
                    ? "border-amber-400 ring-1 ring-amber-200/70"
                    : isRefunded
                    ? "border-rose-200 opacity-80"
                    : "border-border-subtle"
                }`}
              >
                <div className="px-5 py-4 bg-paper/60 border-b border-border-subtle flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-extrabold uppercase tracking-widest ${catBadgeClass}`}
                    >
                      {isCourse && <BookOpen size={12} />}
                      {isShop && <ShoppingBag size={12} />}
                      {isDonation && <Heart size={12} />}
                      {catLabel}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleCopy(`ref-${p.id}`, p.reference_id)}
                      title="Copy Reference ID"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-border-subtle hover:border-ink font-mono text-xs font-bold text-ink cursor-pointer"
                    >
                      <span>{p.reference_id}</span>
                      {copiedKey === `ref-${p.id}` ? (
                        <Check size={12} className="text-emerald-600" />
                      ) : (
                        <Copy size={11} className="text-ink-muted" />
                      )}
                    </button>

                    <span className="text-xs text-ink-muted font-medium">
                      {formatUKDate(p.paid_at)} · {formatUKTime(p.paid_at)}
                    </span>

                    {p.status === "refunded" && (
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 text-[10px] font-bold uppercase tracking-wider">
                        Refunded
                      </span>
                    )}
                    {p.status === "partially_refunded" && (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-bold uppercase tracking-wider">
                        Partially Refunded
                      </span>
                    )}
                  </div>

                  <div className="text-right">
                    <div
                      className={`font-serif text-2xl leading-none ${
                        isRefunded ? "line-through text-ink-muted" : "text-ink"
                      }`}
                    >
                      {formatGBP(p.amount_gbp)}
                    </div>
                    {isShop && Number(p.shipping_gbp || 0) > 0 && (
                      <div className="text-[10px] text-ink-muted mt-1">
                        includes {formatGBP(p.shipping_gbp)} delivery
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
                  <div className="lg:col-span-7 space-y-4">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-1">
                        Paid By
                      </div>
                      <div className="text-base font-bold text-ink">
                        {p.payer_name || "Unnamed Customer"}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-ink-light">
                        {p.payer_email && (
                          <a
                            href={`mailto:${p.payer_email}?subject=${encodeURIComponent(
                              `Loplao (${p.reference_id})`
                            )}`}
                            className="inline-flex items-center gap-1.5 hover:text-brand-dark underline decoration-border-strong underline-offset-2"
                          >
                            <Mail size={13} className="text-ink-muted" />
                            {p.payer_email}
                          </a>
                        )}
                        {p.payer_phone && (
                          <a
                            href={`tel:${p.payer_phone}`}
                            className="inline-flex items-center gap-1.5 hover:text-brand-dark"
                          >
                            <Phone size={13} className="text-ink-muted" />
                            {p.payer_phone}
                          </a>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-1.5">
                        {isShop
                          ? "Items Purchased"
                          : isCourse
                          ? "Course Details"
                          : "Donation Type"}
                      </div>

                      {isShop && itemsArray.length > 0 ? (
                        <ul className="space-y-1.5">
                          {itemsArray.map((item, idx) => (
                            <li
                              key={`${item.id || idx}`}
                              className="flex items-center justify-between gap-2 bg-paper/70 border border-border-subtle rounded-xl px-3.5 py-2 text-sm text-ink"
                            >
                              <span>
                                <strong className="text-brand-dark mr-1.5">
                                  {item.qty || 1}×
                                </strong>
                                {item.name}
                              </span>
                              {typeof item.unit_pence === "number" && (
                                <span className="text-xs font-medium text-ink-muted shrink-0">
                                  {formatGBP(((item.unit_pence || 0) * (item.qty || 1)) / 100)}
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-sm font-medium text-ink bg-paper/70 border border-border-subtle rounded-xl px-3.5 py-2.5">
                          {p.item_summary}
                        </div>
                      )}

                      {isCourse && p.details && (
                        <div className="mt-2.5 flex flex-wrap gap-2 text-xs text-ink-light">
                          {p.details.level && (
                            <span className="px-2.5 py-1 rounded-lg bg-sky-50 border border-sky-200 text-sky-900 font-semibold">
                              Level: {p.details.level}
                            </span>
                          )}
                          {p.details.region && (
                            <span className="px-2.5 py-1 rounded-lg bg-paper border border-border-subtle">
                              Location: {p.details.region}
                            </span>
                          )}
                          {p.details.message && (
                            <div className="w-full mt-1 p-3 rounded-xl bg-paper border border-border-subtle text-xs text-ink-light leading-relaxed">
                              <strong className="text-ink">Student Note:</strong>{" "}
                              {p.details.message}
                            </div>
                          )}
                        </div>
                      )}

                      {isDonation && (
                        <div className="mt-2 flex flex-wrap gap-2 text-xs">
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold">
                            {p.sub_type === "monthly_renewal"
                              ? "Monthly Supporter · Automatic Renewal"
                              : p.sub_type === "monthly_initial" || p.details?.frequency === "monthly"
                              ? "Monthly Supporter · First Payment"
                              : "One-Time Donation"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="lg:col-span-5 flex flex-col justify-between gap-3">
                    {isShop ? (
                      <div className="bg-paper border border-border-subtle rounded-2xl p-4 space-y-3.5">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-ink-muted">
                              {isEbookOnly ? <FileText size={13} /> : <MapPin size={13} />}
                              {isEbookOnly ? "Digital Delivery" : "Deliver To"}
                            </span>

                            {p.shipping_address_text && (
                              <button
                                type="button"
                                onClick={() => handleCopy(`addr-${p.id}`, p.shipping_address_text)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface border border-border-strong hover:border-ink text-[11px] font-bold text-ink transition-colors cursor-pointer"
                              >
                                {copiedKey === `addr-${p.id}` ? (
                                  <>
                                    <Check size={12} className="text-emerald-600" /> Copied!
                                  </>
                                ) : (
                                  <>
                                    <Copy size={11} /> Copy Address
                                  </>
                                )}
                              </button>
                            )}
                          </div>

                          {p.shipping_address_text ? (
                            <div className="bg-surface border border-border-subtle rounded-xl p-3 text-sm text-ink whitespace-pre-line leading-relaxed font-medium">
                              {p.shipping_address_text}
                            </div>
                          ) : (
                            <div className="bg-surface border border-border-subtle rounded-xl p-3 text-xs text-ink-light leading-relaxed">
                              Digital E-book order — email the PDF to{" "}
                              <strong className="text-ink">{p.payer_email}</strong>.
                            </div>
                          )}

                          {p.details?.has_ebook && p.shipping_address_text && (
                            <div className="mt-2 text-[11px] font-semibold text-amber-900 bg-brand-light/70 border border-brand/40 rounded-lg px-2.5 py-1.5">
                              Also includes E-book PDF — please email to {p.payer_email}.
                            </div>
                          )}
                        </div>

                        {!isRefunded && (
                          <div className="pt-2 border-t border-border-subtle space-y-2.5">
                            <div className="flex items-center justify-between gap-2">
                              {needsAction ? (
                                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800">
                                  <Package size={14} />
                                  {isEbookOnly ? "E-book not sent yet" : "Not posted yet"}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                                  <CheckCircle2 size={14} />
                                  {isEbookOnly ? "E-book Sent" : "Dispatched"}
                                </span>
                              )}

                              {needsAction ? (
                                <button
                                  type="button"
                                  disabled={isSavingThis}
                                  onClick={() =>
                                    handleUpdateFulfillment(
                                      p,
                                      isEbookOnly ? "digital_sent" : "dispatched"
                                    )
                                  }
                                  className="px-4 py-2 rounded-full bg-ink hover:bg-ink-light text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                                >
                                  {isSavingThis ? (
                                    <Loader2 size={13} className="animate-spin" />
                                  ) : isEbookOnly ? (
                                    "Mark E-book Sent"
                                  ) : (
                                    "Mark as Dispatched"
                                  )}
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  disabled={isSavingThis}
                                  onClick={() =>
                                    handleUpdateFulfillment(
                                      p,
                                      isEbookOnly ? "digital_to_send" : "to_dispatch"
                                    )
                                  }
                                  className="px-3 py-1.5 rounded-full bg-surface border border-border-strong hover:border-ink text-[11px] font-bold text-ink-muted hover:text-ink transition-colors cursor-pointer disabled:opacity-50"
                                >
                                  Undo
                                </button>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                value={noteVal}
                                onChange={(e) =>
                                  setNoteDrafts((prev) => ({
                                    ...prev,
                                    [p.id]: e.target.value,
                                  }))
                                }
                                placeholder="Add tracking number or posting note..."
                                className="flex-1 min-w-0 px-3 py-1.5 rounded-lg bg-surface border border-border-subtle focus:border-ink text-xs text-ink placeholder:text-ink-muted/70 focus:outline-none"
                              />
                              <button
                                type="button"
                                disabled={isSavingThis}
                                onClick={() => handleUpdateFulfillment(p, undefined, noteVal)}
                                className="px-3 py-1.5 rounded-lg bg-surface border border-border-strong hover:border-ink text-[11px] font-bold text-ink shrink-0 cursor-pointer"
                              >
                                {savedNoteId === p.id ? "Saved!" : "Save"}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-paper border border-border-subtle rounded-2xl p-4 space-y-3">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">
                          Quick Actions
                        </div>
                        <p className="text-xs text-ink-light leading-relaxed">
                          {isCourse
                            ? "Confirmation email has been sent to the student. Use the button below to email them their Zoom link and welcome pack."
                            : "Thank-you receipt email has been sent automatically to the supporter."}
                        </p>
                        {p.payer_email && (
                          <a
                            href={`mailto:${p.payer_email}?subject=${encodeURIComponent(
                              isCourse
                                ? `Loplao Course Welcome — ${p.reference_id}`
                                : `Thank you from Loplao — ${p.reference_id}`
                            )}`}
                            className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-full bg-surface border border-border-strong hover:border-ink text-xs font-bold text-ink transition-colors"
                          >
                            <Mail size={13} />
                            {isCourse ? "Email Student" : "Email Supporter"}
                          </a>
                        )}
                      </div>
                    )}

                    {p.stripe_payment_intent_id && (
                      <div className="flex justify-end">
                        <a
                          href={`https://dashboard.stripe.com/payments/${p.stripe_payment_intent_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-ink-muted hover:text-ink transition-colors"
                        >
                          Open in Stripe <ExternalLink size={11} />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

        </>
      )}

      {/* Modal for Email-Verified Change Password (when already unlocked) */}
      {showResetFlow && (
        <div
          className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowResetFlow(false)}
        >
          <div
            className="bg-surface border border-border-strong rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {renderEmailPasswordFlow(true)}
          </div>
        </div>
      )}
    </div>
  );
}
