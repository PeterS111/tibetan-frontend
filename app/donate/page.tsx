// app/donate/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Heart, Loader2, CheckCircle2, ShieldCheck } from "lucide-react";

const PRESET_AMOUNTS = [5, 10, 25, 50];

export default function DonatePage() {
  const router = useRouter();
  const [frequency, setFrequency] = useState<"one_time" | "monthly">("one_time");
  const [selectedAmount, setSelectedAmount] = useState<number>(10);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("success") === "1") setIsSuccess(true);
    }
  }, []);

  const effectiveAmount = customAmount
    ? parseFloat(customAmount) || 0
    : selectedAmount;

  const handleDonate = async () => {
    if (effectiveAmount < 2) {
      setErrorMsg("Minimum contribution is £2.");
      return;
    }
    setErrorMsg(null);
    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/donate/checkout`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amountGbp: effectiveAmount,
            frequency,
            origin: typeof window !== "undefined" ? window.location.origin : undefined,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to start checkout.");
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      }
    } catch (err: any) {
      setErrorMsg(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper text-ink font-sans selection:bg-brand-light selection:text-brand-dark">
      {/* Dark Navy Hero */}
      <header className="relative bg-ink text-white pt-12 pb-16 overflow-hidden">
        <img
          src="/motif_mandala_gold.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute -right-16 -top-16 w-72 h-72 object-contain opacity-[0.06]"
        />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="flex items-center justify-between mb-10">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/75 hover:text-brand transition-colors cursor-pointer"
            >
              <ArrowLeft size={15} /> Back
            </button>

            <Link href="/" className="flex items-center gap-3">
              <img
                src="/icon_t.png"
                onError={(e) => {
                  e.currentTarget.src = "/icon.png";
                }}
                alt="Loplao"
                className="w-8 h-8 object-contain brightness-0 invert"
              />
              <span className="font-serif text-lg text-white">Loplao</span>
            </Link>
          </div>

          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand mb-3">
            Support the Project
          </div>
          <h1 className="font-serif font-normal text-4xl sm:text-5xl text-white mb-4">
            Help Keep Tibetan Alive Online
          </h1>
          <p className="text-sm sm:text-base text-white/80 max-w-xl leading-relaxed">
            Our structured Tibetan language app is open and free to learners
            around the world. Your contribution directly supports native speaker
            audio recordings, hosting, and new curriculum levels.
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-14 pb-24 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Editorial Narrative */}
        <div className="md:col-span-6 space-y-5 text-sm sm:text-base text-ink-light leading-relaxed">
          {isSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-start gap-3 text-emerald-800 mb-4">
              <CheckCircle2 size={22} className="shrink-0 mt-0.5 text-emerald-600" />
              <div>
                <div className="font-bold text-sm mb-1">
                  ཐུགས་རྗེ་ཆེ། — Thank you deeply for your generosity!
                </div>
                <p className="text-xs leading-relaxed">
                  Your support directly helps us build new lessons and preserve
                  the Tibetan language for students everywhere.
                </p>
              </div>
            </div>
          )}

          <div className="w-16 h-16 rounded-full bg-surface border border-border-subtle flex items-center justify-center shadow-2xs">
            <img
              src="/motif_butter_lamp.png"
              alt=""
              className="w-10 h-10 object-contain"
            />
          </div>

          <h2 className="font-serif font-normal text-2xl sm:text-3xl text-ink">
            Free Access, Built With Care
          </h2>
          <p>
            We believe financial barriers should never prevent someone from
            connecting with the Tibetan language and its literary heritage.
          </p>
          <p>
            Maintaining cloud servers, recording authentic native pronunciation
            for thousands of words, and writing our Pre-Intermediate,
            Intermediate, and Advanced courses takes continuous work. Every
            contribution — large or small — goes directly into building Loplao.
          </p>
        </div>

        {/* Right Donation Box */}
        <div className="md:col-span-6 bg-surface border border-border-subtle rounded-3xl p-6 sm:p-8 shadow-sm">
          {/* One-Time vs Monthly Toggle */}
          <div className="grid grid-cols-2 bg-paper p-1 rounded-full border border-border-subtle mb-6">
            <button
              type="button"
              onClick={() => setFrequency("one_time")}
              className={`py-2.5 text-xs font-bold rounded-full transition-all cursor-pointer ${
                frequency === "one_time"
                  ? "bg-ink text-white shadow-xs"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              One-Time
            </button>
            <button
              type="button"
              onClick={() => setFrequency("monthly")}
              className={`py-2.5 text-xs font-bold rounded-full transition-all cursor-pointer ${
                frequency === "monthly"
                  ? "bg-ink text-white shadow-xs"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              Monthly
            </button>
          </div>

          {/* Preset GBP Amounts */}
          <div className="grid grid-cols-4 gap-2.5 mb-4">
            {PRESET_AMOUNTS.map((amt) => {
              const active = !customAmount && selectedAmount === amt;
              return (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    setSelectedAmount(amt);
                    setCustomAmount("");
                  }}
                  className={`py-3 rounded-xl border font-serif text-lg transition-all cursor-pointer ${
                    active
                      ? "bg-brand-light border-brand text-ink font-bold shadow-2xs"
                      : "bg-paper/50 border-border-subtle text-ink-light hover:border-brand/60"
                  }`}
                >
                  £{amt}
                </button>
              );
            })}
          </div>

          {/* Custom Amount */}
          <div className="mb-6">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-1.5">
              Or enter custom amount (£ GBP)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-serif text-lg text-ink-muted">
                £
              </span>
              <input
                type="number"
                min="2"
                step="1"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="Other amount"
                className="w-full bg-paper/60 border border-border-subtle focus:border-brand rounded-xl pl-9 pr-4 py-3 text-sm text-ink outline-none"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="mb-4 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
              {errorMsg}
            </div>
          )}

          <button
            type="button"
            onClick={handleDonate}
            disabled={isLoading}
            className="w-full bg-brand hover:bg-brand-dark text-ink font-bold py-4 rounded-full text-sm transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Heart size={16} className="fill-ink" />
            )}
            Donate £{effectiveAmount || 0}
            {frequency === "monthly" ? " / month" : ""}
          </button>

          <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-ink-muted">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>Secure checkout via Stripe · Apple Pay, Google Pay, PayPal &amp; Card</span>
          </div>
        </div>
      </main>
    </div>
  );
}