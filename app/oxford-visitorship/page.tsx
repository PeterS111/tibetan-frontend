// app/oxford-visitorship/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  Check,
  Globe,
  GraduationCap,
  Handshake,
  Mail,
  Menu,
  Phone,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/clerk-react";
import { usePlatform } from "@/hooks/usePlatform";
import { SiteFooter } from "@/app/components/ui/SiteFooter";
import { Reveal } from "@/app/components/ui/Reveal";

// ============================================================================
// EDITABLE PAGE CONTENT — REPLACE ANY PARAGRAPH TEXT HERE FREELY
// ============================================================================

const HERO_COPY = {
  eyebrow: "Scholar in Residence · Since 2011",
  titlePrefix: "The",
  titleHighlight: "Oxford",
  titleSuffix: "Visitorship",
  subtitle:
    "Each year, Loplao and SINI partner with Oxford Tibetan and Himalayan Studies to welcome a classically trained Tibetan Buddhist scholar to Oxford — fostering dialogue between monastic learning and university research.",
  tibetanLine: "བོད་ཀྱི་མཁས་པ་གདན་ཞུ།",
  heroImage: "/oxford-visitorship-hero.jpg",
};

const ANNOUNCEMENT_COPY = {
  eyebrow: "2027 Announcement · Applications Open",
  heading: "The 2027 Oxford Tibetan Buddhist Visitorship",
  intro:
    "Applications are now invited for the 2027 Oxford Tibetan Buddhist Visitorship. We welcome expressions of interest from qualified Tibetan Buddhist monastic scholars currently based in Bhutan, India, or Nepal.",
};

const HIGHLIGHT_CARDS = [
  {
    id: "partnership",
    icon: "handshake" as const,
    title: "A Renewed Partnership",
    body: "Starting in 2027, the programme brings together Oxford's Tibetan and Himalayan Studies community, the Sarnath International Nyingma Institute (SINI), and Loplao to deepen collaboration between traditional monastic scholarship and modern academic study.",
  },
  {
    id: "residency",
    icon: "calendar" as const,
    title: "Residency & Dates",
    body: "The selected visiting scholar stays at the Oxford Buddha Vihara for roughly two months — 23 April to 19 June 2027, aligned with Oxford's summer term — before returning home to share insights with their institution.",
  },
  {
    id: "non-sectarian",
    icon: "book" as const,
    title: "A Non-Sectarian Approach",
    body: "Eligible scholars from every major Tibetan Buddhist lineage — Kagyu, Nyingma, Gelug, and Sakya — are warmly encouraged to apply. Bringing varied traditions into conversation enriches learning for everyone involved.",
  },
];

const CANDIDATE_REQUIREMENTS = [
  "Strong grounding in Buddhist philosophy, textual study, and history",
  "Command of both classical and spoken Tibetan, alongside confident English",
  "Prior experience lecturing or teaching on Buddhist philosophy and related fields",
  "Readiness to converse with international audiences and scholars across disciplines",
  "Thoughtful engagement with contemporary questions in Tibetan culture and Buddhism",
  "Dedication to sharing knowledge and supporting Dharma preservation back at home",
];

const HOW_TO_APPLY_COPY = {
  heading: "How to Apply",
  intro:
    "Please prepare your application in English, enclosing an up-to-date CV together with a one-page statement outlining your scholarly focus, teaching background, and motivation for applying.",
  deadlineLabel: "Application deadline:",
  deadlineValue: "To be announced.",
  interviewNote:
    "Candidates selected for the shortlist will be invited to join an online interview, where full details on scheduling and the 2027 term residency will be shared.",
  ctaLabel: "Apply by Email",
  ctaHref:
    "mailto:loplao.academy@gmail.com?subject=2027%20Oxford%20Tibetan%20Buddhist%20Visitorship%20Application",
  accommodationNote:
    "Please note: residency applications are currently limited to monks, as the Oxford Buddha Vihara does not presently have facilities to host female monastics.",
  email: "loplao.academy@gmail.com",
  phone: "+44 7856 149455",
  phoneHref: "tel:+447856149455",
};

const VALUE_PILLARS = [
  {
    id: "exchange",
    icon: "graduation" as const,
    tibetan: "ཤེས་རིག་བརྗེ་རེས།",
    title: "Scholarly Exchange",
    body: "Open talks, seminars, and small-group tutorials connecting traditional monastic learning with Oxford's academic community.",
  },
  {
    id: "bridge",
    icon: "globe" as const,
    tibetan: "རིག་གཞུང་ཟམ་པ།",
    title: "Cultural Bridge",
    body: "Creating meaningful pathways for Tibetan Buddhist educators to engage with international universities and public audiences.",
  },
  {
    id: "tradition",
    icon: "users" as const,
    tibetan: "རིག་གཞུང་གསོན་པོ།",
    title: "Living Tradition",
    body: "Welcoming one classically trained scholar to Oxford each year for an immersive term before returning to share the experience home.",
  },
];

const HISTORY_COPY = {
  eyebrow: "Background Story",
  heading: "A Fifteen-Year Journey",
  paragraphs: [
    "Established in 2011, the Visitorship began as a joint initiative between So-Wide and Oxford's Tibetan and Himalayan Studies community. Following the untimely passing of So-Wide founder Geoff Bamford, the programme entered a temporary hiatus.",
    "In 2024, Loplao — a UK-registered Community Interest Company dedicated to advancing Tibetan language and heritage worldwide — partnered with Oxford Tibetan and Himalayan Studies to renew the fellowship. It offers a vital platform for Tibetan monastic scholars to represent their living traditions directly within Oxford's academic environment.",
    "Beyond university seminars, inviting Tibetan monastic educators to institutions like Oxford opens lasting international channels of dialogue and strengthens the global visibility of Tibetan language, philosophy, and cultural heritage.",
    "Each year, the fellowship invites one traditionally trained scholar for a term-long residency in Oxford, encouraging mutual exchange among students, researchers, and practitioners. Distinguished past visitors have included Dzongsar Khyentse, Arja Rinpoche, Kyabje Yangteng Rinpoche, and Geshe Soepa, each contributing public lectures and teachings before carrying their Oxford experience back to their home institutions in India or Nepal.",
  ],
};

interface VisitingScholar {
  id: string;
  name: string;
  role: string;
  image: string;
}

const SCHOLARS: VisitingScholar[] = [
  {
    id: "arja-rinpoche",
    name: "Arja Rinpoche",
    role: "8th Arja Rinpoche",
    image: "/arja-rinpoche.jpg",
  },
  {
    id: "kyabje-yangteng-rinpoche",
    name: "Kyabje Yangteng Rinpoche",
    role: "Geshe Lharampa & Teacher",
    image: "/kyabje-yangteng-rinpoche.jpg",
  },
  {
    id: "geshe-soepa",
    name: "Geshe Soepa",
    role: "Buddhist Teacher",
    image: "/geshe-soepa.jpg",
  },
  {
    id: "shanta-negi",
    name: "Shanta Negi",
    role: "Tibetan Buddhist Scholar",
    image: "/shanta-negi.jpg",
  },
  {
    id: "minyak-rinpoche",
    name: "Minyak Rinpoche",
    role: "Tibetan Buddhist Scholar",
    image: "/minyak-rinpoche.jpg",
  },
  {
    id: "lopon-tenzin-sherpa",
    name: "Lopon Tenzin Sherpa",
    role: "Lopon & Buddhist Scholar",
    image: "/lopon-tenzin-sherpa.jpg",
  },
  {
    id: "khenpo-ngawang-tenzin",
    name: "Khenpo Ngawang Tenzin",
    role: "Khenpo & Lecturer",
    image: "/khenpo-ngawang-tenzin.jpg",
  },
  {
    id: "ven-jampa-gyaltsen",
    name: "Ven Jampa Gyaltsen",
    role: "Tibetan Buddhist Scholar",
    image: "/ven-jampa-gyaltsen.jpg",
  },
];

const SUPPORT_CTA_COPY = {
  tibetan: "བོད་ཀྱི་མཁས་པ་གདན་ཞུ།",
  heading: "Support the Visitorship",
  body: "Whether you wish to recommend a scholar, become a patron, collaborate on future residencies, or attend an upcoming talk, our team would love to hear from you.",
};

const NAV_LINKS = [
  { href: "/#levels", label: "Curriculum" },
  { href: "/courses", label: "Live Courses" },
  { href: "/shop", label: "Shop" },
  { href: "/oxford-visitorship", label: "Visitorship", active: true },
  { href: "/about", label: "About" },
  { href: "/support", label: "Contact" },
];

function HighlightIcon({ kind }: { kind: "handshake" | "calendar" | "book" }) {
  if (kind === "handshake") return <Handshake size={18} />;
  if (kind === "calendar") return <Calendar size={18} />;
  return <BookOpen size={18} />;
}

function PillarIcon({ kind }: { kind: "graduation" | "globe" | "users" }) {
  if (kind === "graduation") return <GraduationCap size={18} />;
  if (kind === "globe") return <Globe size={18} />;
  return <Users size={18} />;
}

export default function OxfordVisitorshipPage() {
  const router = useRouter();
  const { isCapacitor } = usePlatform();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeScholar, setActiveScholar] = useState<VisitingScholar | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink font-sans selection:bg-brand-light selection:text-brand-dark overflow-x-hidden">
      {/* ====================================================================
          1. NAVIGATION (COMPACT NATIVE BAR IN CAPACITOR, FULL NAV + MOBILE DRAWER ON WEB)
      ==================================================================== */}
      {isCapacitor ? (
        <header className="sticky top-0 z-50 bg-ink/95 backdrop-blur-md border-b border-white/10 text-white pt-safe">
          <div className="px-4 py-3.5 flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white/85 hover:text-brand transition-colors cursor-pointer"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <span className="font-serif text-sm text-white">Oxford Visitorship</span>
            <Link
              href="/donate"
              className="text-[11px] font-bold bg-brand text-ink px-3 py-1 rounded-full"
            >
              Donate
            </Link>
          </div>
        </header>
      ) : (
        <nav className="fixed top-0 left-0 right-0 w-full z-50 bg-ink/95 backdrop-blur-md border-b border-white/10 text-white">
          <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
            {/* Brand Logo */}
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

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-5 lg:gap-7 text-sm font-medium text-white/75">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={
                    link.active
                      ? "text-brand font-semibold transition-colors"
                      : "hover:text-white transition-colors"
                  }
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Controls + Mobile Hamburger */}
            <div className="flex items-center gap-2.5">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="hidden sm:inline-block px-4 py-2 text-xs sm:text-sm font-medium text-white border border-white/30 hover:border-white hover:bg-white/10 rounded-lg transition-all cursor-pointer">
                    Log in
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold bg-brand hover:bg-brand-dark text-ink rounded-lg transition-all shadow-sm cursor-pointer">
                    Sign up
                  </button>
                </SignUpButton>
              </SignedOut>

              <SignedIn>
                <Link href="/dashboard">
                  <button className="px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold bg-brand hover:bg-brand-dark text-ink rounded-lg transition-all shadow-sm flex items-center gap-1.5 cursor-pointer">
                    Dashboard <ArrowRight size={14} strokeWidth={2.5} />
                  </button>
                </Link>
              </SignedIn>

              <button
                type="button"
                onClick={() => setMobileMenuOpen((v) => !v)}
                aria-label="Toggle navigation menu"
                className="md:hidden p-2 rounded-lg border border-white/20 text-white/90 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Slide-Down Drawer */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-[#091e36] border-t border-white/10 px-6 py-5 space-y-2 animate-in fade-in duration-150">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2.5 text-sm font-medium border-b border-white/10 last:border-b-0 ${
                    link.active ? "text-brand font-bold" : "text-white/85 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/donate"
                onClick={() => setMobileMenuOpen(false)}
                className="block pt-2 text-sm font-bold text-brand"
              >
                Donate to Loplao →
              </Link>
            </div>
          )}
        </nav>
      )}

      {/* ====================================================================
          2. FULL-BLEED OXFORD SKYLINE HERO
      ==================================================================== */}
      <header
        className={`relative bg-ink text-white overflow-hidden ${
          isCapacitor ? "pt-12 pb-16" : "pt-32 pb-20 md:pt-40 md:pb-28"
        }`}
      >
        <div className="absolute inset-0 z-0">
          <img
            src={HERO_COPY.heroImage}
            onError={(e) => {
              e.currentTarget.src = "/about_oxford_christ_church.jpg";
            }}
            alt="Historic skyline of Oxford at golden hour"
            className="w-full h-full object-cover object-center opacity-50 scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/65 to-ink/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40" />
        </div>

        <Reveal className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand mb-3">
            {HERO_COPY.eyebrow}
          </div>

          <h1 className="font-serif font-normal text-4xl sm:text-5xl md:text-[62px] leading-[1.08] text-white mb-5">
            {HERO_COPY.titlePrefix}{" "}
            <span className="text-brand">{HERO_COPY.titleHighlight}</span>{" "}
            {HERO_COPY.titleSuffix}
          </h1>

          <p className="text-sm sm:text-base md:text-[17px] text-white/85 max-w-xl leading-relaxed mb-6">
            {HERO_COPY.subtitle}
          </p>

          <div className="font-tibetan text-2xl sm:text-[26px] text-brand leading-[1.8]">
            {HERO_COPY.tibetanLine}
          </div>
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

      <main className="flex-1 w-full">
        {/* ==================================================================
            3. THE 2027 OXFORD TIBETAN BUDDHIST VISITORSHIP + APPLICATION
        ================================================================== */}
        <section className="py-16 sm:py-20 md:py-24 bg-surface">
          <div className="max-w-5xl mx-auto px-6">
            {/* Section Header */}
            <Reveal className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
              <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand-dark mb-2.5">
                {ANNOUNCEMENT_COPY.eyebrow}
              </div>
              <h2 className="font-serif font-normal text-3xl sm:text-4xl text-ink leading-tight mb-4">
                {ANNOUNCEMENT_COPY.heading}
              </h2>
              <p className="text-sm sm:text-base text-ink-light leading-relaxed">
                {ANNOUNCEMENT_COPY.intro}
              </p>
            </Reveal>

            {/* 3 Warm Highlight Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {HIGHLIGHT_CARDS.map((card, idx) => (
                <Reveal key={card.id} delay={idx * 90} className="h-full">
                  <div className="h-full bg-paper border border-border-subtle rounded-2xl p-6 sm:p-7 shadow-2xs flex flex-col">
                    <div className="w-10 h-10 rounded-xl bg-brand-light border border-brand/30 text-brand-dark flex items-center justify-center mb-4 shrink-0">
                      <HighlightIcon kind={card.icon} />
                    </div>
                    <h3 className="font-serif font-normal text-xl text-ink mb-2.5">
                      {card.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-ink-light leading-relaxed">
                      {card.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* 2-Column Application Block: Requirements (Light) + How to Apply (Dark Navy) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Left: Candidate Requirements */}
              <Reveal className="lg:col-span-6 h-full">
                <div className="h-full bg-[#F4F7FA] border border-border-subtle rounded-2xl p-6 sm:p-8 flex flex-col">
                  <h3 className="font-serif font-normal text-2xl text-ink mb-5">
                    Candidate Requirements
                  </h3>
                  <ul className="space-y-3.5 text-xs sm:text-sm text-ink-light leading-relaxed">
                    {CANDIDATE_REQUIREMENTS.map((req) => (
                      <li key={req} className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-brand-light border border-brand/40 text-brand-dark flex items-center justify-center shrink-0 mt-0.5">
                          <Check size={12} strokeWidth={2.75} />
                        </span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              {/* Right: How to Apply (Dark Navy Card) */}
              <Reveal delay={100} className="lg:col-span-6 h-full">
                <div className="h-full bg-ink text-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-lg relative overflow-hidden">
                  <img
                    src="/motif_mandala_gold.png"
                    alt=""
                    aria-hidden="true"
                    className="pointer-events-none select-none absolute -bottom-16 -right-16 w-48 h-48 object-contain opacity-[0.06]"
                  />

                  <div className="relative z-10">
                    <h3 className="font-serif font-normal text-2xl text-white mb-4">
                      {HOW_TO_APPLY_COPY.heading}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/80 leading-relaxed mb-4">
                      {HOW_TO_APPLY_COPY.intro}
                    </p>
                    <p className="text-xs sm:text-sm text-white/90 mb-4">
                      <strong className="text-brand">
                        {HOW_TO_APPLY_COPY.deadlineLabel}
                      </strong>{" "}
                      {HOW_TO_APPLY_COPY.deadlineValue}
                    </p>
                    <p className="text-xs sm:text-sm text-white/75 leading-relaxed mb-7">
                      {HOW_TO_APPLY_COPY.interviewNote}
                    </p>
                  </div>

                  <div className="relative z-10">
                    <a
                      href={HOW_TO_APPLY_COPY.ctaHref}
                      className="w-full bg-brand hover:bg-brand-dark text-ink font-bold text-xs sm:text-sm py-3.5 px-6 rounded-xl transition-all shadow-md inline-flex items-center justify-center gap-2"
                    >
                      <span>{HOW_TO_APPLY_COPY.ctaLabel}</span>
                      <Mail size={15} />
                    </a>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Footnote & Contact Line */}
            <Reveal delay={140} className="mt-8 text-center max-w-xl mx-auto">
              <p className="text-xs text-ink-muted leading-relaxed mb-3.5">
                {HOW_TO_APPLY_COPY.accommodationNote}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-ink-light">
                <a
                  href={`mailto:${HOW_TO_APPLY_COPY.email}`}
                  className="inline-flex items-center gap-1.5 hover:text-brand-dark transition-colors"
                >
                  <Mail size={13} className="text-brand-dark" />
                  <span>{HOW_TO_APPLY_COPY.email}</span>
                </a>
                <a
                  href={HOW_TO_APPLY_COPY.phoneHref}
                  className="inline-flex items-center gap-1.5 hover:text-brand-dark transition-colors"
                >
                  <Phone size={13} className="text-brand-dark" />
                  <span>{HOW_TO_APPLY_COPY.phone}</span>
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ==================================================================
            4. THREE VALUE PILLARS BAND (WARM PAPER BACKGROUND)
        ================================================================== */}
        <section className="py-16 sm:py-20 bg-paper border-y border-border-subtle">
          <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {VALUE_PILLARS.map((pillar, idx) => (
              <Reveal key={pillar.id} delay={idx * 90} className="h-full">
                <div className="h-full bg-surface border border-border-subtle rounded-2xl p-6 sm:p-7 shadow-2xs flex flex-col">
                  <div className="w-10 h-10 rounded-xl bg-brand-light border border-brand/30 text-brand-dark flex items-center justify-center mb-4">
                    <PillarIcon kind={pillar.icon} />
                  </div>
                  <div className="font-tibetan text-base text-brand-dark leading-[1.8] mb-1">
                    {pillar.tibetan}
                  </div>
                  <h3 className="font-serif font-normal text-xl text-ink mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-ink-light leading-relaxed">
                    {pillar.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ==================================================================
            5. BACKGROUND STORY: "A FIFTEEN-YEAR JOURNEY"
        ================================================================== */}
        <section className="py-16 sm:py-20 md:py-24 bg-surface">
          <Reveal className="max-w-3xl mx-auto px-6">
            <div className="text-center mb-10">
              <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand-dark mb-2">
                {HISTORY_COPY.eyebrow}
              </div>
              <h2 className="font-serif font-normal text-3xl sm:text-4xl text-ink">
                {HISTORY_COPY.heading}
              </h2>
            </div>

            <div className="space-y-5 text-sm sm:text-[15px] text-ink-light leading-relaxed">
              {HISTORY_COPY.paragraphs.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </Reveal>
        </section>

        {/* ==================================================================
            6. OUR VISITORS — 8-CARD VISITING SCHOLARS GRID (4x2 ON DESKTOP)
        ================================================================== */}
        <section className="py-16 sm:py-20 md:py-24 bg-paper border-t border-border-subtle">
          <div className="max-w-5xl mx-auto px-6">
            <Reveal className="text-center max-w-xl mx-auto mb-12">
              <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand-dark mb-2">
                Our Visitors
              </div>
              <h2 className="font-serif font-normal text-3xl sm:text-4xl text-ink mb-3">
                Scholars
              </h2>
              <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
                Tibetan Buddhist teachers and scholars who have shared their learning and
                insights with the Oxford community.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {SCHOLARS.map((scholar, idx) => (
                <Reveal
                  key={scholar.id}
                  delay={(idx % 4) * 80}
                  className="h-full flex"
                >
                  <button
                    type="button"
                    onClick={() => setActiveScholar(scholar)}
                    className="w-full text-left group bg-surface border border-border-subtle hover:border-brand rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer"
                  >
                    <div className="aspect-[4/5] w-full overflow-hidden bg-ink/5 border-b border-border-subtle/70">
                      <img
                        src={scholar.image}
                        alt={scholar.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4 sm:p-5 flex-1 flex flex-col">
                      <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-brand-dark mb-1">
                        Visiting Scholar
                      </div>
                      <h3 className="font-serif font-normal text-lg text-ink group-hover:text-brand-dark transition-colors leading-snug mb-1">
                        {scholar.name}
                      </h3>
                      <p className="text-xs text-ink-muted leading-snug">
                        {scholar.role}
                      </p>
                    </div>
                  </button>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ==================================================================
            7. DARK NAVY "SUPPORT THE VISITORSHIP" CTA BANNER
        ================================================================== */}
        <section className="relative bg-ink text-white py-20 md:py-24 overflow-hidden">
          <img
            src="/motif_mandala_gold.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none select-none absolute -top-20 -right-20 w-72 h-72 object-contain opacity-[0.05]"
          />
          <img
            src="/motif_mandala_gold.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none select-none absolute -bottom-24 -left-24 w-72 h-72 object-contain opacity-[0.05]"
          />

          <Reveal className="max-w-2xl mx-auto px-6 text-center relative z-10">
            <div className="font-tibetan text-2xl sm:text-3xl text-brand leading-[1.8] mb-2">
              {SUPPORT_CTA_COPY.tibetan}
            </div>
            <h2 className="font-serif font-normal text-3xl sm:text-4xl text-white mb-4">
              {SUPPORT_CTA_COPY.heading}
            </h2>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed mb-9">
              {SUPPORT_CTA_COPY.body}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3.5">
              <Link
                href="/donate"
                className="bg-brand hover:bg-brand-dark text-ink font-bold text-xs sm:text-sm px-7 py-3.5 rounded-lg transition-all shadow-md inline-flex items-center gap-2"
              >
                <Sparkles size={14} />
                <span>Donate Now</span>
              </Link>
              <Link
                href="/support"
                className="border border-white/30 hover:border-white hover:bg-white/10 text-white font-bold text-xs sm:text-sm px-7 py-3.5 rounded-lg transition-all inline-flex items-center gap-2"
              >
                <span>Get in Touch</span>
                <ArrowRight size={14} />
              </Link>
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
          8. SCHOLAR PORTRAIT QUICK-VIEW MODAL
      ==================================================================== */}
      {activeScholar && (
        <div
          className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setActiveScholar(null)}
        >
          <div
            className="bg-surface border border-border-strong rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveScholar(null)}
              aria-label="Close scholar preview"
              className="absolute top-3.5 right-3.5 z-10 w-9 h-9 rounded-full bg-ink/70 hover:bg-ink text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
            <div className="aspect-[4/5] w-full bg-ink/10 overflow-hidden">
              <img
                src={activeScholar.image}
                alt={activeScholar.name}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="p-6 text-center">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark mb-1">
                Oxford Visiting Scholar
              </div>
              <h3 className="font-serif font-normal text-2xl text-ink mb-1">
                {activeScholar.name}
              </h3>
              <p className="text-sm text-ink-muted">{activeScholar.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          9. SHARED SITE FOOTER (HIDDEN INSIDE NATIVE CAPACITOR SHELL)
      ==================================================================== */}
      {!isCapacitor && <SiteFooter />}
    </div>
  );
}
