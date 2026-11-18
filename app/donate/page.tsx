// app/donate/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Heart,
  Loader2,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/clerk-react";
import { SiteFooter } from "@/app/components/ui/SiteFooter";
import { Reveal } from "@/app/components/ui/Reveal";

const PRESET_AMOUNTS = [5, 10, 25, 50];

const IMPACT_PILLARS = [
  {
    motif: "/motif_pecha.png",
    title: "Empowering Our Team and Contributors",
    desc: "Loplao's work depends on the knowledge, dedication and expertise of educators, translators, researchers and other contributors. Your support helps us develop our team, recognise their valuable contributions and create opportunities for skilled people to participate in meaningful projects.",
  },
  {
    motif: "/motif_butter_lamp.png",
    title: "Opening Doors to Tibetan Learning",
    desc: "We want financial circumstances to be less of a barrier to discovering the Tibetan language. Your contribution helps us provide scholarships, maintain free study materials, offer accessible lessons and organise online workshops for learners around the world.",
  },
  {
    motif: "/motif_prayer_wheel.png",
    title: "Preserving Language, Literature and Heritage",
    desc: "Language is more than a means of communication; it carries the knowledge, stories and traditions of generations. We are committed to developing resources that encourage deeper engagement with Tibetan language, literature and cultural heritage, ensuring that this knowledge continues to reach new audiences.",
  },
  {
    motif: "/motif_mandala.png",
    title: "Building Academic and Cultural Bridges",
    desc: "We believe Tibetan knowledge has an important place in international academic and cultural exchange. Loplao has collaborated with the University of Oxford, the Oxford Centre for Buddhist Studies and Sini to create opportunities for Tibetan monks to visit Oxford as visiting scholars. We hope to build on these connections and develop further opportunities for meaningful exchange between Tibetan and international communities.",
  },
];

export default function DonatePage() {
  const [frequency, setFrequency] = useState<"one_time" | "monthly">(
    "one_time"
  );
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
    if (effectiveAmount < 1) {
      setErrorMsg("Minimum donation is £1.");
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
            origin:
              typeof window !== "undefined"
                ? window.location.origin
                : undefined,
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
    <div className="min-h-screen flex flex-col bg-paper text-ink font-sans selection:bg-brand-light selection:text-brand-dark overflow-x-hidden">
      {/* ====================================================================
          1. FIXED TOP NAVIGATION BAR
      ==================================================================== */}
      <nav className="fixed top-0 left-0 right-0 w-full z-50 bg-ink/95 backdrop-blur-md border-b border-white/10 text-white">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3.5 group">
            <img
              src="/icon_t.png"
              onError={(e) => {
                e.currentTarget.src = "/icon.png";
              }}
              alt="Loplao Logo"
              className="w-10 h-10 object-contain brightness-0 invert opacity-95 group-hover:opacity-100 transition-opacity"
            />
            <div className="flex flex-col justify-center">
              <span className="font-tibetan text-base leading-none text-brand tracking-wide pb-1">
                སློབ་སླའོ།
              </span>
              <span className="w-full h-[1px] bg-white/30 my-0.5" />
              <span className="font-serif font-medium text-lg leading-none text-white pt-0.5">
                Loplao
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-7 text-sm font-medium text-white/75">
            <Link href="/#levels" className="hover:text-white transition-colors">
              Curriculum
            </Link>
            <Link href="/courses" className="hover:text-white transition-colors">
              Live Courses
            </Link>
            <Link href="/shop" className="hover:text-white transition-colors">
              Shop
            </Link>
            <Link href="/#faq" className="hover:text-white transition-colors">
              FAQ
            </Link>
            <Link href="/about" className="hover:text-white transition-colors">
              About
            </Link>
            <Link href="/support" className="hover:text-white transition-colors">
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-4 py-2 text-xs sm:text-sm font-medium text-white border border-white/30 hover:border-white hover:bg-white/10 rounded-lg transition-all cursor-pointer">
                  Log in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-5 py-2 text-xs sm:text-sm font-bold bg-brand hover:bg-brand-dark text-ink rounded-lg transition-all shadow-sm cursor-pointer">
                  Sign up
                </button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <Link href="/dashboard">
                <button className="px-5 py-2.5 text-xs sm:text-sm font-bold bg-brand hover:bg-brand-dark text-ink rounded-lg transition-all shadow-sm flex items-center gap-2 cursor-pointer">
                  Dashboard <ArrowRight size={15} strokeWidth={2.5} />
                </button>
              </Link>
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* ====================================================================
          2. POTALA HERO BANNER (/fable-potala.jpg)
      ==================================================================== */}
      <header className="relative bg-ink text-white pt-32 pb-16 md:pt-36 md:pb-22 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/fable-potala.jpg"
            onError={(e) => {
              e.currentTarget.src = "/about_hero_monastery.jpg";
            }}
            alt="Potala Palace in Lhasa"
            className="w-full h-full object-cover object-center opacity-45 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/70 to-ink/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40" />
        </div>

        <Reveal className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand mb-3">
            Support the Project
          </div>

          <h1 className="font-serif font-normal text-4xl sm:text-5xl md:text-[56px] leading-[1.1] text-white mb-4 flex flex-wrap items-baseline gap-x-3.5 gap-y-1">
            <span>Donate</span>
            <span className="font-tibetan text-3xl sm:text-4xl md:text-[44px] text-white/95 leading-normal">
              ཞལ་འདེབས།
            </span>
          </h1>

          <p className="text-sm sm:text-base text-white/85 max-w-xl leading-relaxed">
            Support Tibetan learning. Preserve a living heritage. Inspire future
            generations.
          </p>
        </Reveal>

        {/* Subtle 5-Element Tibetan Accent Strip */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] grid grid-cols-5 z-10">
          <div className="bg-[#1E4E8C]" />
          <div className="bg-[#FAF6EC]" />
          <div className="bg-brand" />
          <div className="bg-[#1E7A46]" />
          <div className="bg-[#9E2A2B]" />
        </div>
      </header>

      {/* ====================================================================
          3. TWO-COLUMN MISSION NARRATIVE + DONATION CARD
      ==================================================================== */}
      <main className="flex-1 w-full">
        <section className="max-w-5xl mx-auto px-6 py-16 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Mission Copy */}
          <Reveal className="lg:col-span-6">
            {isSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-start gap-3 text-emerald-800 mb-6">
                <CheckCircle2
                  size={22}
                  className="shrink-0 mt-0.5 text-emerald-600"
                />
                <div>
                  <div className="font-bold text-sm mb-1">
                    ཐུགས་རྗེ་ཆེ། — Thank you deeply for your generosity!
                  </div>
                  <p className="text-xs leading-relaxed">
                    Your support directly helps us sustain our projects, develop
                    new learning resources, and share Tibetan language and
                    culture worldwide.
                  </p>
                </div>
              </div>
            )}

            {/* Custom Loplao Butter Lamp Medallion */}
            <div className="w-20 h-20 rounded-full bg-surface border border-border-subtle flex items-center justify-center shadow-xs mb-5">
              <img
                src="/motif_butter_lamp.png"
                alt="Tibetan Butter Lamp"
                className="w-14 h-14 object-contain"
              />
            </div>

            <h2 className="font-serif font-normal text-3xl sm:text-4xl text-ink leading-tight mb-5">
              Help Keep Tibetan Language and Culture Alive
            </h2>

            <div className="space-y-4 text-sm sm:text-[15px] text-ink-light leading-relaxed">
              <p>
                At Loplao, we believe that Tibetan language and culture deserve
                to be celebrated, preserved and passed on to future generations.
              </p>
              <p>
                As an independent, not-for-profit Community Interest Company, we
                work to make Tibetan language learning more accessible, develop
                high-quality educational resources and create meaningful
                opportunities for people around the world to engage with Tibetan
                heritage.
              </p>
              <p>
                Our work spans language courses, free learning materials,
                scholarships and online workshops, alongside wider educational
                and cultural initiatives. We also collaborate with academic
                institutions to bring Tibetan knowledge and scholarship to a
                wider international audience.
              </p>
              <p>
                This work requires considerable time, expertise and resources.
                Your generosity helps us sustain our existing projects, develop
                new initiatives and reach more learners and communities.
              </p>
            </div>
          </Reveal>

          {/* Right Column: Stripe Donation Box */}
          <Reveal
            delay={120}
            className="lg:col-span-6 bg-surface border border-border-subtle rounded-3xl p-6 sm:p-8 shadow-sm"
          >
            {/* One-Time vs Monthly Toggle */}
            <div className="grid grid-cols-2 bg-[#EEF4FA] p-1 rounded-full border border-border-subtle mb-6">
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
            <div className="grid grid-cols-4 gap-2.5 mb-5">
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
                    className={`py-3 rounded-xl border font-serif text-base sm:text-lg transition-all cursor-pointer ${
                      active
                        ? "bg-brand-light border-brand text-ink font-semibold shadow-2xs"
                        : "bg-surface border-border-subtle text-ink-light hover:border-brand/60"
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
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-serif text-base text-ink-muted">
                  £
                </span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Other amount"
                  className="w-full bg-paper/75 border border-border-subtle focus:border-brand rounded-xl pl-9 pr-4 py-3 text-sm text-ink placeholder:text-ink-muted/70 outline-none transition-colors"
                />
              </div>
              <div className="text-[11px] text-ink-muted mt-1.5">
                Minimum donation: £1.
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
                <Heart size={15} className="fill-ink" />
              )}
              Donate £{effectiveAmount || 0}
              {frequency === "monthly" ? " / month" : ""}
            </button>

            <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-ink-muted">
              <ShieldCheck size={14} className="text-ink-muted shrink-0" />
              <span>
                Secure checkout via Stripe · Apple Pay, Google Pay, PayPal &amp;
                Card
              </span>
            </div>
          </Reveal>
        </section>

        {/* ====================================================================
            4. YOUR IMPACT SECTION (CUSTOM LOPLAO CULTURAL MOTIFS)
        ==================================================================== */}
        <section className="bg-surface border-t border-border-subtle py-20">
          <div className="max-w-5xl mx-auto px-6">
            <Reveal className="max-w-xl mb-12">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark mb-2">
                Your Impact
              </div>
              <h2 className="font-serif font-normal text-3xl sm:text-4xl text-ink mb-3">
                Where your support goes
              </h2>
              <p className="text-sm sm:text-base text-ink-light leading-relaxed">
                Every contribution directly sustains our educational work as an
                independent Community Interest Company.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {IMPACT_PILLARS.map((pillar, idx) => (
                <Reveal key={pillar.title} delay={idx * 90} className="h-full">
                  <div className="h-full bg-paper border border-border-subtle rounded-2xl p-6 sm:p-7 flex flex-col items-start text-left shadow-2xs hover:shadow-md transition-shadow">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-surface border border-border-subtle flex items-center justify-center mb-6 shadow-xs">
                      <img
                        src={pillar.motif}
                        alt={pillar.title}
                        className="w-14 h-14 sm:w-[68px] sm:h-[68px] object-contain"
                      />
                    </div>
                    <h3 className="font-serif font-normal text-xl text-ink mb-2">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-ink-light leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ====================================================================
            5. DARK NAVY "BE PART OF OUR JOURNEY" & CIC BANNER ABOVE FOOTER
        ==================================================================== */}
        <section className="relative bg-ink text-white py-20 md:py-24 border-t border-white/10 overflow-hidden">
          <Reveal className="max-w-3xl mx-auto px-6 text-center relative z-10">
            <div className="font-tibetan text-2xl sm:text-3xl text-brand mb-3">
              ཞལ་འདེབས།
            </div>

            <h2 className="font-serif font-normal text-3xl sm:text-4xl md:text-[42px] text-white leading-tight mb-6">
              Be Part of Our Journey
            </h2>

            <p className="text-sm sm:text-base text-white/80 leading-relaxed mb-5">
              Preserving a language and its cultural heritage is a shared
              responsibility. By helping Loplao grow, you are contributing to a
              future in which more people can learn Tibetan, engage with its
              rich intellectual traditions and appreciate its cultural
              significance.
            </p>

            <p className="text-sm sm:text-base text-white/80 leading-relaxed mb-5">
              Every contribution brings us closer to making that vision a
              reality.
            </p>

            <p className="text-sm sm:text-base font-bold text-white leading-relaxed mb-10">
              Thank you for being part of our journey and helping Tibetan
              language and culture flourish.
            </p>

            <div className="text-xs text-white/45 leading-relaxed">
              Loplao is a Community Interest Company (CIC), registered in
              England and Wales. Company Registration Number: 14581119.
            </div>
          </Reveal>
        </section>

        {/* Subtle 5-Element Tibetan Divider Above Footer */}
        <div className="h-[3px] w-full grid grid-cols-5">
          <div className="bg-[#1E4E8C]" />
          <div className="bg-[#FAF6EC]" />
          <div className="bg-brand" />
          <div className="bg-[#1E7A46]" />
          <div className="bg-[#9E2A2B]" />
        </div>
      </main>

      {/* ====================================================================
          6. SHARED SITE FOOTER (UNCHANGED)
      ==================================================================== */}
      <SiteFooter />
    </div>
  );
}