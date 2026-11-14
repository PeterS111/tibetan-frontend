// app/support/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Send,
  CheckCircle2,
  Loader2,
  MapPin,
} from "lucide-react";

const TOPICS = [
  { value: "general", label: "General Inquiry" },
  { value: "courses", label: "Live Tibetan Courses & Private Classes" },
  { value: "shop", label: "Shop & Learning Materials" },
  { value: "support", label: "App Technical Support" },
  { value: "collaborate", label: "Get Involved / Collaborate" },
];

export default function SupportPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [region, setRegion] = useState("");
  const [topic, setTopic] = useState("general");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSending(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, region, topic, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send message.");
      setSent(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Could not send message. Please email us directly.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper text-ink font-sans selection:bg-brand-light selection:text-brand-dark">
      {/* Dark Navy Hero Header */}
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
            Help &amp; Contact
          </div>
          <h1 className="font-serif font-normal text-4xl sm:text-5xl text-white mb-3">
            Get in Touch
          </h1>
          <p className="text-sm sm:text-base text-white/80 max-w-xl leading-relaxed">
            Have a question about our live Tibetan courses, learning materials,
            technical support, or collaborating with Loplao? Send us a message
            below.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-14 pb-24 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Form Column */}
        <div className="md:col-span-8 bg-surface border border-border-subtle rounded-3xl p-6 sm:p-8 shadow-sm">
          {sent ? (
            <div className="py-10 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="font-serif font-normal text-2xl sm:text-3xl text-ink mb-2">
                Thank you — message received!
              </h2>
              <p className="text-sm text-ink-light max-w-md mb-8 leading-relaxed">
                We have received your message and will reply to{" "}
                <strong className="text-ink">{email}</strong> as soon as
                possible.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  setMessage("");
                }}
                className="bg-ink text-white hover:bg-ink-light font-bold text-xs px-6 py-3 rounded-full transition-colors cursor-pointer"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-muted mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tashi Tsering"
                    className="w-full bg-paper/60 border border-border-subtle focus:border-brand rounded-xl px-4 py-3 text-sm text-ink outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-muted mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-paper/60 border border-border-subtle focus:border-brand rounded-xl px-4 py-3 text-sm text-ink outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-muted mb-1.5">
                    Topic
                  </label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full bg-paper/60 border border-border-subtle focus:border-brand rounded-xl px-4 py-3 text-sm text-ink outline-none"
                  >
                    {TOPICS.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-muted mb-1.5">
                    City / Country (Optional)
                  </label>
                  <div className="relative">
                    <MapPin
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted"
                    />
                    <input
                      type="text"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      placeholder="Oxford, UK"
                      className="w-full bg-paper/60 border border-border-subtle focus:border-brand rounded-xl pl-9 pr-4 py-3 text-sm text-ink outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-muted mb-1.5">
                  Message *
                </label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help you?"
                  className="w-full bg-paper/60 border border-border-subtle focus:border-brand rounded-xl p-4 text-sm text-ink outline-none resize-y"
                />
              </div>

              {errorMsg && (
                <div className="text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={isSending}
                className="w-full sm:w-auto bg-brand hover:bg-brand-dark text-ink font-bold text-sm px-8 py-3.5 rounded-full transition-all shadow-sm inline-flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isSending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={15} />
                )}
                Send Message
              </button>
            </form>
          )}
        </div>

        {/* Right Direct Contact Card */}
        <div className="md:col-span-4 space-y-5">
          <div className="bg-surface border border-border-subtle rounded-3xl p-6 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-paper border border-border-subtle flex items-center justify-center mb-4">
              <img
                src="/motif_khata.png"
                alt=""
                className="w-7 h-7 object-contain"
              />
            </div>
            <h3 className="font-serif font-normal text-xl text-ink mb-2">
              Direct Email
            </h3>
            <p className="text-xs text-ink-light leading-relaxed mb-4">
              Prefer writing from your own email client? Reach the Loplao team
              directly at:
            </p>
            <a
              href="mailto:loplao.academy@gmail.com"
              className="inline-flex items-center gap-2 text-xs font-bold text-brand-dark hover:text-ink transition-colors break-all"
            >
              <Mail size={14} className="shrink-0" /> loplao.academy@gmail.com
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}