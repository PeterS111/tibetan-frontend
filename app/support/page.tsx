// app/support/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Mail,
  Phone,
  Clock,
  MessageSquare,
  Send,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/clerk-react";
import { SiteFooter } from "@/app/components/ui/SiteFooter";
import { Reveal } from "@/app/components/ui/Reveal";

const INTEREST_OPTIONS = [
  { value: "", label: "Select an option..." },
  { value: "Live Tibetan Courses (Winter / Summer / Flexible)", label: "Live Tibetan Courses (Winter / Summer / Flexible)" },
  { value: "1-to-1 Private Classes & Text Consultation", label: "1-to-1 Private Classes & Text Consultation" },
  { value: "Choosing the Right Course Level", label: "Help Choosing the Right Course Level" },
  { value: "Shop & Learning Materials", label: "Shop & Learning Materials (Books, Mugs, Cards)" },
  { value: "App Technical Support", label: "App Technical Support" },
  { value: "Collaborate / Get Involved", label: "Collaborate / Get Involved with Loplao" },
  { value: "General Inquiry", label: "General Inquiry" },
];

const QUICK_LINKS = [
  { href: "/courses", label: "Browse our live courses" },
  { href: "/#levels", label: "Explore the app curriculum" },
  { href: "/courses?tab=private", label: "Book a 1-to-1 private lesson" },
  { href: "/shop", label: "Visit the shop" },
  { href: "/#faq", label: "Read our FAQs" },
  { href: "/about", label: "About Loplao & our team" },
  { href: "/donate", label: "Support & donate to Loplao" },
];

export default function SupportPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSending(true);

    const formattedMessage = subject.trim()
      ? `Subject: ${subject.trim()}\n\n${message.trim()}`
      : message.trim();

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          region: "",
          topic: interest || "General Inquiry",
          message: formattedMessage,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send message.");
      setSent(true);
    } catch (err: any) {
      setErrorMsg(
        err.message || "Could not send message. Please email us directly."
      );
    } finally {
      setIsSending(false);
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
            <Link
              href="/support"
              className="text-brand font-semibold transition-colors"
            >
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
          2. DARK NAVY HERO BANNER WITH TIBETAN WATERMARK
      ==================================================================== */}
      <header className="relative bg-ink text-white pt-32 pb-16 md:pt-36 md:pb-20 overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none select-none absolute right-4 sm:right-10 lg:right-20 top-1/2 -translate-y-1/2 font-tibetan text-[130px] sm:text-[180px] md:text-[220px] leading-none text-white/[0.04]"
        >
          འབྲེལ
        </div>

        <Reveal className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand mb-3">
            Get in Touch
          </div>
          <h1 className="font-serif font-normal text-4xl sm:text-5xl md:text-[56px] leading-[1.1] text-white mb-4">
            Contact Us
          </h1>
          <p className="text-sm sm:text-base text-white/80 max-w-xl leading-relaxed">
            Have a question about our courses, products, or anything else?
            We&apos;d love to hear from you. Our team typically responds within
            24 hours.
          </p>
        </Reveal>

        {/* Subtle 5-Element Tibetan Accent Strip */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] grid grid-cols-5">
          <div className="bg-[#1E4E8C]" />
          <div className="bg-[#FAF6EC]" />
          <div className="bg-brand" />
          <div className="bg-[#1E7A46]" />
          <div className="bg-[#9E2A2B]" />
        </div>
      </header>

      {/* ====================================================================
          3. TWO-COLUMN MAIN CONTENT ("LET'S TALK" + "SEND A MESSAGE")
      ==================================================================== */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* LEFT COLUMN: Let's Talk + Contact Channels + Expanded Quick Links */}
          <Reveal className="lg:col-span-5 space-y-8">
            <div>
              <h2 className="font-serif font-normal text-2xl sm:text-3xl text-ink mb-3.5">
                Let&apos;s Talk
              </h2>
              <p className="text-sm text-ink-light leading-relaxed">
                Whether you&apos;re interested in learning Tibetan, need help
                choosing the right course level, have questions about our
                learning resources or technical support, or would like to
                explore opportunities to collaborate with Loplao, we&apos;d love
                to hear from you. Simply send us a message below, and we&apos;ll
                be happy to help!
              </p>
            </div>

            {/* 4 Contact Info Rows */}
            <div className="space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-surface border border-border-subtle flex items-center justify-center text-ink-light shrink-0 shadow-2xs">
                  <Mail size={17} />
                </div>
                <div>
                  <div className="text-[11px] text-ink-muted leading-tight">
                    Email
                  </div>
                  <a
                    href="mailto:loplao.academy@gmail.com"
                    className="text-sm font-medium text-ink hover:text-brand-dark transition-colors"
                  >
                    loplao.academy@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-surface border border-border-subtle flex items-center justify-center text-ink-light shrink-0 shadow-2xs">
                  <Phone size={17} />
                </div>
                <div>
                  <div className="text-[11px] text-ink-muted leading-tight">
                    Phone / WhatsApp
                  </div>
                  <a
                    href="tel:+447856149455"
                    className="text-sm font-medium text-ink hover:text-brand-dark transition-colors"
                  >
                    +44 7856 149455
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-surface border border-border-subtle flex items-center justify-center text-ink-light shrink-0 shadow-2xs">
                  <Clock size={17} />
                </div>
                <div>
                  <div className="text-[11px] text-ink-muted leading-tight">
                    Response Time
                  </div>
                  <div className="text-sm font-medium text-ink">
                    Within 24 hours
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-surface border border-border-subtle flex items-center justify-center text-ink-light shrink-0 shadow-2xs">
                  <MessageSquare size={17} />
                </div>
                <div>
                  <div className="text-[11px] text-ink-muted leading-tight">
                    WhatsApp Chat
                  </div>
                  <a
                    href="https://wa.me/447856149455"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-ink hover:text-brand-dark transition-colors"
                  >
                    Chat with us on WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Links Card (Expanded) */}
            <div className="bg-[#EEF4FA] border border-border-subtle rounded-2xl p-6">
              <h3 className="font-serif font-normal text-base text-ink mb-3.5">
                Quick Links
              </h3>
              <ul className="space-y-2.5">
                {QUICK_LINKS.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="group inline-flex items-center gap-2.5 text-xs sm:text-[13px] font-medium text-ink-light hover:text-ink transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0 group-hover:scale-125 transition-transform" />
                      <span className="group-hover:underline underline-offset-4 decoration-brand">
                        {item.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* RIGHT COLUMN: Send a Message Form Card */}
          <Reveal delay={120} className="lg:col-span-7 bg-surface border border-border-subtle rounded-3xl p-6 sm:p-9 shadow-sm">
            {sent ? (
              <div className="py-12 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
                  <CheckCircle2 size={32} />
                </div>
                <h2 className="font-serif font-normal text-2xl sm:text-3xl text-ink mb-2">
                  Thank you — message received!
                </h2>
                <p className="text-sm text-ink-light max-w-md mb-8 leading-relaxed">
                  We have received your message and will reply to{" "}
                  <strong className="text-ink">{email}</strong> within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSent(false);
                    setSubject("");
                    setMessage("");
                  }}
                  className="bg-ink text-white hover:bg-ink-light font-bold text-xs px-7 py-3.5 rounded-xl transition-colors cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h2 className="font-serif font-normal text-2xl sm:text-3xl text-ink mb-6">
                  Send a Message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-ink mb-1.5">
                        Full Name <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full bg-surface border border-border-subtle focus:border-brand rounded-xl px-4 py-3 text-sm text-ink placeholder:text-ink-muted/70 outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-ink mb-1.5">
                        Email Address <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full bg-surface border border-border-subtle focus:border-brand rounded-xl px-4 py-3 text-sm text-ink placeholder:text-ink-muted/70 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1.5">
                      I&apos;m interested in
                    </label>
                    <select
                      value={interest}
                      onChange={(e) => setInterest(e.target.value)}
                      className="w-full bg-surface border border-border-subtle focus:border-brand rounded-xl px-4 py-3 text-sm text-ink outline-none transition-colors cursor-pointer"
                    >
                      {INTEREST_OPTIONS.map((opt) => (
                        <option key={opt.label} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1.5">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="What is your message about?"
                      className="w-full bg-surface border border-border-subtle focus:border-brand rounded-xl px-4 py-3 text-sm text-ink placeholder:text-ink-muted/70 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1.5">
                      Message <span className="text-destructive">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us how we can help you..."
                      className="w-full bg-surface border border-border-subtle focus:border-brand rounded-xl p-4 text-sm text-ink placeholder:text-ink-muted/70 outline-none resize-y transition-colors"
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
                    className="w-full bg-ink hover:bg-ink-light text-white font-bold text-sm py-4 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {isSending ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Send size={15} />
                    )}
                    Send Message
                  </button>
                </form>
              </>
            )}
          </Reveal>
        </div>
      </main>

      {/* ====================================================================
          4. SHARED SITE FOOTER (UNCHANGED)
      ==================================================================== */}
      <SiteFooter />
    </div>
  );
}