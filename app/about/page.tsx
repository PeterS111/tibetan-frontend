// app/about/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  Globe,
  ExternalLink,
  X,
} from "lucide-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/clerk-react";

const STATS = [
  {
    motif: "/motif_butter_lamp.png",
    value: "10+",
    label: "Years of Teaching",
    sub: "Experience",
  },
  {
    motif: "/motif_prayer_wheel.png",
    value: "57K+",
    label: "Social Media Followers",
    sub: "on Instagram & Facebook",
  },
  {
    motif: "/motif_mandala.png",
    value: "6",
    label: "Proficiency Levels",
    sub: "Across 3 Courses",
  },
];

interface TeamHighlight {
  motif: string;
  text: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  initial: string;
  avatar?: string;
  avatarMode?: "contain" | "cover";
  paragraphs: string[];
  sectionLabel: string;
  highlights: TeamHighlight[];
  email?: string;
  website?: string;
  websiteLabel?: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "tenzin",
    name: "Tenzin Choephel Ju",
    role: "Founder, Director & Teacher",
    initial: "T",
    avatar: "/icon.png",
    avatarMode: "contain",
    paragraphs: [
      "Tenzin has taught Tibetan for more than a decade, beginning at Sarah College of Higher Tibetan Studies in India and continuing at SOAS, University of London, the Tibetan Language Summer School in Oxford, and Buddhist centres across the UK.",
      "That classroom experience shapes everything Loplao publishes: the order of the lessons, the examples we choose, and the care we take with pronunciation, politeness and culture.",
    ],
    sectionLabel: "Teaching & Work",
    highlights: [
      {
        motif: "/motif_pecha.png",
        text: "Sarah College of Higher Tibetan Studies, India",
      },
      { motif: "/motif_stupa.png", text: "SOAS, University of London" },
      {
        motif: "/motif_butter_lamp.png",
        text: "Tibetan Language Summer School, Oxford",
      },
      {
        motif: "/motif_prayer_wheel.png",
        text: "Buddhist centres across the UK",
      },
    ],
    email: "loplao.academy@gmail.com",
    website: "https://www.loplao.com/",
    websiteLabel: "www.loplao.com",
  },
  {
    id: "peter",
    name: "Peter Smith",
    role: "AI Specialist & Lead Developer",
    initial: "P",
    avatar: "/peter.jpg",
    avatarMode: "cover",
    paragraphs: [
      "Peter is an AI specialist, programmer, and platform architect. Since 2023 he has worked alongside Tenzin on Tibetan language tools, native applications, and Large Language Model projects.",
      "His work looks at how artificial intelligence and modern digital infrastructure can make Tibetan easier to learn, search and use inside modern software — so the language has a place in the tools people already open every day.",
    ],
    sectionLabel: "Technology & Research",
    highlights: [
      {
        motif: "/motif_mandala.png",
        text: "Artificial Intelligence & Platform Architecture",
      },
      {
        motif: "/motif_wind_horse.png",
        text: "Tibetan language tools since 2023",
      },
      { motif: "/motif_vajra.png", text: "Large Language Model projects" },
      {
        motif: "/motif_bell.png",
        text: "Web & native mobile application development",
      },
    ],
    email: "p.sm1549c@gmail.com",
  },
  {
    id: "kunga",
    name: "Kunga Jampa",
    role: "Social Media Manager & Teacher",
    initial: "K",
    paragraphs: [
      "Kunga specialises in classical Tibetan literature and Buddhist philosophy. With a background in monastic education, he brings unparalleled depth to our intermediate and advanced courses.",
      "Alongside teaching, he manages Loplao's educational posts and daily language outreach across Instagram and Facebook.",
    ],
    sectionLabel: "Teaching & Community",
    highlights: [
      { motif: "/motif_pecha.png", text: "Classical Tibetan literature" },
      {
        motif: "/motif_stupa.png",
        text: "Buddhist philosophy & monastic study",
      },
      {
        motif: "/motif_prayer_flags.png",
        text: "Social media & global community",
      },
    ],
  },
  {
    id: "wang",
    name: "Wang Bhumo",
    role: "Tutor — Colloquial Tibetan",
    initial: "W",
    paragraphs: [
      "Wang Bhumo grew up speaking Tibetan in her family home and brings warmth and authenticity to every class.",
      "She specialises in conversational Tibetan and cultural immersion, helping students speak naturally and confidently in everyday life.",
    ],
    sectionLabel: "Teaching & Focus",
    highlights: [
      { motif: "/motif_khata.png", text: "Spoken & colloquial Tibetan" },
      {
        motif: "/motif_singing_bowl.png",
        text: "Everyday conversation practice",
      },
      { motif: "/motif_yak.png", text: "Tibetan cultural immersion" },
    ],
  },
];

export default function AboutPage() {
  const router = useRouter();
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  return (
    <div className="min-h-screen bg-paper text-ink font-sans selection:bg-brand-light selection:text-brand-dark overflow-x-hidden">
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
            <Link
              href="/about"
              className="text-brand font-semibold transition-colors"
            >
              About
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
          2. HERO SECTION (MONASTERY BANNER + FAINT CENTER-UPPER MANDALA)
      ==================================================================== */}
      <header className="relative bg-ink text-white pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/about_hero_monastery.jpg"
            onError={(e) => {
              e.currentTarget.src = "/loplao-hero-scene.jpg";
            }}
            alt="Tibetan Monastery in the Himalayas"
            className="w-full h-full object-cover object-center opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40" />
        </div>

        {/* Faint Gold Mandala Watermark in Upper-Middle Space */}
        <img
          src="/motif_mandala_gold.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute top-14 left-[56%] -translate-x-1/2 w-72 h-72 md:w-80 md:h-80 object-contain opacity-[0.04]"
        />

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/70 hover:text-brand transition-colors mb-8 cursor-pointer"
          >
            <ArrowLeft size={15} /> Back
          </button>

          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand mb-3">
            Our Story
          </div>

          <h1 className="font-serif font-normal text-5xl sm:text-6xl md:text-[64px] leading-[1.1] text-white mb-5">
            About Loplao
          </h1>

          <p className="font-serif italic text-xl sm:text-2xl text-white/90 max-w-xl leading-relaxed mb-8">
            Promoting and advancing Tibetan language and culture worldwide — one
            lesson, one story, one connection at a time.
          </p>

          <div className="flex items-center gap-4">
            <span className="w-12 h-[1px] bg-brand/60" />
            <img
              src="/motif_butter_lamp_gold.png"
              alt=""
              className="w-6 h-6 object-contain"
            />
            <span className="w-12 h-[1px] bg-brand/60" />
          </div>
        </div>
      </header>

      {/* ====================================================================
          3. OUR MISSION ("ABOUT LOPLAO སློབ་སླའོ།" + PRAYER FLAGS STUPA PHOTO)
      ==================================================================== */}
      <section className="py-20 md:py-24 bg-paper">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <span className="inline-block bg-brand text-ink text-[10px] font-bold uppercase tracking-[0.2em] px-3.5 py-1 rounded-full mb-4">
              Our Mission
            </span>
            <h2 className="font-serif font-normal text-3xl sm:text-4xl text-ink mb-6 flex flex-wrap items-baseline gap-3">
              <span>About Loplao</span>
              <span className="font-tibetan text-2xl sm:text-3xl text-ink-light">
                སློབ་སླའོ།
              </span>
            </h2>

            <div className="space-y-4 text-sm sm:text-[15px] text-ink-light leading-relaxed mb-8">
              <p>
                We believe the Tibetan language is one of humanity&apos;s great
                treasures — a living expression of history, knowledge, wisdom
                and culture that deserves to be preserved, celebrated and shared
                with the world.
              </p>
              <p>
                Founded in 2019 at the University of Oxford, Loplao began with a
                simple ambition: to make learning Tibetan more accessible,
                engaging and enjoyable for everyone. Our name, Loplao (
                <span className="font-tibetan text-base text-ink">
                  སློབ་སླའོ།
                </span>
                ), reflects this spirit: making teaching and learning easier for
                all.
              </p>
              <p>
                Since then, we have welcomed over 300 students from more than 30
                countries, bringing people together through Tibetan language
                courses, cultural stories, learning resources and community
                events. Our native-speaking tutors bring not only linguistic
                expertise but also a deep connection to the culture and
                traditions they teach. We have also been fortunate to
                collaborate with respected institutions, including the British
                Library, the University of Oxford and Sarnath International
                Nyingma Institute.
              </p>
              <p>
                As an Oxford-based Community Interest Company (CIC), our mission
                goes beyond teaching a language. We want to build a vibrant
                global community where Tibetan language and culture can thrive
                across generations and borders. By bringing together experienced
                teachers, academically grounded resources and innovative digital
                technologies, we hope to make Tibetan learning accessible to
                anyone, anywhere.
              </p>
              <p>
                Because preserving a language is not simply about keeping its
                words alive; it is about keeping its stories, knowledge and
                culture alive for generations to come.
              </p>
            </div>

            <Link href="/courses">
              <button className="bg-brand hover:bg-brand-dark text-ink font-bold text-xs sm:text-sm px-7 py-3.5 rounded-full transition-all shadow-sm inline-flex items-center gap-2 cursor-pointer">
                Explore Our Courses <ArrowRight size={15} />
              </button>
            </Link>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl overflow-hidden border border-border-subtle shadow-lg bg-surface">
              <img
                src="/about_prayer_flags.jpg"
                onError={(e) => {
                  e.currentTarget.src = "/about_classroom-JsxUlfTo.jpg";
                }}
                alt="Tibetan Stupa and Prayer Flags"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          4. 3-COLUMN STATS BAR (CUSTOM DESIGNER MOTIFS)
      ==================================================================== */}
      <section className="py-14 bg-surface border-y border-border-subtle">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border-subtle">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center text-center px-4 py-6 sm:py-2"
              >
                <div className="w-12 h-12 rounded-full bg-paper border border-border-subtle flex items-center justify-center mb-3 shadow-2xs">
                  <img
                    src={stat.motif}
                    alt={stat.label}
                    className="w-7 h-7 object-contain"
                  />
                </div>
                <div className="font-serif font-normal text-3xl sm:text-4xl text-ink mb-1">
                  {stat.value}
                </div>
                <div className="text-xs font-bold text-ink">{stat.label}</div>
                <div className="text-[11px] text-ink-muted mt-0.5">
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          5. OUR TEACHING HERITAGE (CHRIST CHURCH OXFORD PHOTO)
      ==================================================================== */}
      <section className="py-20 md:py-24 bg-paper">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="rounded-3xl overflow-hidden border border-border-subtle shadow-lg bg-surface">
              <img
                src="/about_oxford_christ_church.jpg"
                onError={(e) => {
                  e.currentTarget.src = "/about_oxford-tJAq0B4-.jpg";
                }}
                alt="Christ Church, Oxford"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2">
            <span className="inline-block bg-brand text-ink text-[10px] font-bold uppercase tracking-[0.2em] px-3.5 py-1 rounded-full mb-4">
              Our Teaching Heritage
            </span>
            <h2 className="font-serif font-normal text-3xl sm:text-4xl text-ink mb-6">
              Over a Decade of Experience
            </h2>
            <div className="space-y-4 text-sm sm:text-base text-ink-light leading-relaxed">
              <p>
                Loplao&apos;s lessons and educational content are grounded in
                more than a decade of Tibetan language teaching experience. This
                journey began with Tenzin&apos;s teaching work at Sarah College
                of Higher Tibetan Studies in India and continued through
                teaching at SOAS, University of London, the Tibetan Language
                Summer School in Oxford, and various Buddhist centres across the
                UK.
              </p>
              <p>
                Our teaching team brings together experienced Tibetan language
                educators, many of whom graduated from{" "}
                <strong className="text-ink font-semibold">
                  Sarah College of Higher Tibetan Studies in India
                </strong>
                . Our teachers have taught at respected Tibetan educational and
                cultural institutions, including the{" "}
                <strong className="text-ink font-semibold">
                  Library of Tibetan Works and Archives
                </strong>
                , <strong className="text-ink font-semibold">Esukhia</strong>,
                and the{" "}
                <strong className="text-ink font-semibold">
                  College for Higher Tibetan Studies
                </strong>
                .
              </p>
              <p>
                These experiences have shaped our teaching philosophy: combining
                traditional Tibetan language education with practical, engaging
                and accessible approaches for learners from different
                backgrounds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          6. OUR GLOBAL COMMUNITY (57K+ FOLLOWERS + INSTAGRAM SCREENSHOT)
      ==================================================================== */}
      <section className="py-20 md:py-24 bg-surface border-y border-border-subtle">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <span className="inline-block bg-brand text-ink text-[10px] font-bold uppercase tracking-[0.2em] px-3.5 py-1 rounded-full mb-4">
              Our Global Community
            </span>
            <h2 className="font-serif font-normal text-3xl sm:text-4xl text-ink mb-6">
              A Growing Community Since 2019
            </h2>
            <div className="space-y-4 text-sm sm:text-base text-ink-light leading-relaxed mb-8">
              <p>
                Since 2019, we have been creating Tibetan language learning
                content across Instagram and Facebook, building an international
                community of learners with{" "}
                <strong className="text-ink font-semibold">
                  more than 57,000 combined followers
                </strong>
                .
              </p>
              <p>
                Through short educational videos, language explanations and
                interactive content, we have helped introduce Tibetan to a wider
                audience and make language learning part of everyday digital
                life.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href="https://www.instagram.com/easytibetan/"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-paper hover:bg-brand-light/30 border border-border-subtle hover:border-brand rounded-2xl p-5 transition-all shadow-2xs"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-ink text-white flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-ink">Instagram</div>
                      <div className="text-[11px] text-ink-muted">
                        @easytibetan
                      </div>
                    </div>
                  </div>
                  <ExternalLink
                    size={14}
                    className="text-ink-muted group-hover:text-brand-dark transition-colors"
                  />
                </div>
                <div className="font-serif font-normal text-3xl text-ink mb-0.5">
                  31.7K
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-2.5">
                  Followers · 965 Posts
                </div>
                <p className="text-xs text-ink-light leading-relaxed">
                  &ldquo;Tibetan language made easy&rdquo; — daily posts, reels
                  and stories that bring Tibetan into the feed.
                </p>
              </a>

              <a
                href="https://www.facebook.com/TibEasy"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-paper hover:bg-brand-light/30 border border-border-subtle hover:border-brand rounded-2xl p-5 transition-all shadow-2xs"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-ink text-white flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-ink">Facebook</div>
                      <div className="text-[11px] text-ink-muted">
                        EasyTibetan
                      </div>
                    </div>
                  </div>
                  <ExternalLink
                    size={14}
                    className="text-ink-muted group-hover:text-brand-dark transition-colors"
                  />
                </div>
                <div className="font-serif font-normal text-3xl text-ink mb-0.5">
                  27K
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-2.5">
                  Followers
                </div>
                <p className="text-xs text-ink-light leading-relaxed">
                  Established to promote and advance Tibetan language and
                  culture worldwide.
                </p>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="w-[260px] sm:w-[285px] rounded-[36px] border-[6px] border-ink bg-white shadow-2xl overflow-hidden">
              <img
                src="/about_community_instagram.webp"
                alt="EasyTibetan Instagram Community"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          7. MEET OUR TEAM (EXACT SCREENSHOT CARD STYLE, SCALED FOR 4 PEOPLE)
      ==================================================================== */}
      <section className="py-20 md:py-24 bg-paper">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="inline-block bg-brand text-ink text-[10px] font-bold uppercase tracking-[0.2em] px-3.5 py-1 rounded-full mb-3">
              The People Behind Loplao
            </span>
            <h2 className="font-serif font-normal text-3xl sm:text-4xl text-ink mb-3">
              Meet Our Team
            </h2>
            <p className="text-sm sm:text-base text-ink-muted">
              A small team with one shared belief: that Tibetan deserves to be
              taught properly and kept alive online.
            </p>
          </div>

          {/* 4-Column Grid in the Exact Screenshot Style (Compact Enough to Fit All 4) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TEAM_MEMBERS.map((member) => (
              <div
                key={member.id}
                onClick={() => setSelectedMember(member)}
                className="group bg-surface border border-border-subtle hover:border-brand rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col cursor-pointer"
              >
                {/* Top Dark Navy Banner with Corner Gold Mandala + Circular Gold-Bordered Avatar */}
                <div className="relative bg-ink h-36 flex items-center justify-center overflow-hidden shrink-0">
                  <img
                    src="/motif_mandala_gold.png"
                    alt=""
                    aria-hidden="true"
                    className="pointer-events-none select-none absolute -bottom-8 -right-8 w-32 h-32 object-contain opacity-15"
                  />

                  <div className="relative z-10 w-20 h-20 rounded-full border-2 border-brand bg-white shadow-xl flex items-center justify-center overflow-hidden">
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className={
                          member.avatarMode === "contain"
                            ? "w-full h-full object-contain p-2.5"
                            : "w-full h-full object-cover object-center"
                        }
                      />
                    ) : (
                      <span className="font-serif text-3xl text-ink">
                        {member.initial}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-brand-dark mb-1">
                    {member.role}
                  </div>
                  <h3 className="font-serif font-normal text-xl text-ink mb-3 group-hover:text-brand-dark transition-colors">
                    {member.name}
                  </h3>

                  <div className="space-y-2.5 text-xs text-ink-light leading-relaxed mb-5">
                    {member.paragraphs.map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>

                  {/* Highlights with Custom Motif Icons */}
                  <div className="pt-4 border-t border-border-subtle mt-auto">
                    <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-ink-muted mb-2.5">
                      {member.sectionLabel}
                    </div>
                    <ul className="space-y-2 text-[11px] text-ink-light">
                      {member.highlights.map((h) => (
                        <li key={h.text} className="flex items-start gap-2">
                          <img
                            src={h.motif}
                            alt=""
                            className="w-3.5 h-3.5 object-contain shrink-0 mt-0.5"
                          />
                          <span className="leading-snug">{h.text}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Contact Footer (Only for Tenzin & Peter) */}
                    {(member.email || member.website) && (
                      <div
                        className="flex flex-col gap-1.5 pt-3.5 mt-4 border-t border-border-subtle text-[11px] font-bold text-ink-muted"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            className="inline-flex items-center gap-1.5 hover:text-ink transition-colors break-all"
                          >
                            <Mail size={12} className="shrink-0" />{" "}
                            {member.email}
                          </a>
                        )}
                        {member.website && (
                          <a
                            href={member.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 hover:text-ink transition-colors"
                          >
                            <Globe size={12} className="shrink-0" />{" "}
                            {member.websiteLabel}
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ENLARGED POP-UP VIEW WHEN CLICKING ANY TEAM CARD */}
      {selectedMember && (
        <div
          className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="bg-surface border border-border-subtle rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedMember(null)}
              aria-label="Close modal"
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="relative bg-ink h-44 flex items-center justify-center overflow-hidden">
              <img
                src="/motif_mandala_gold.png"
                alt=""
                aria-hidden="true"
                className="pointer-events-none select-none absolute -bottom-10 -right-10 w-40 h-40 object-contain opacity-15"
              />
              <div className="relative z-10 w-24 h-24 rounded-full border-2 border-brand bg-white shadow-xl flex items-center justify-center overflow-hidden">
                {selectedMember.avatar ? (
                  <img
                    src={selectedMember.avatar}
                    alt={selectedMember.name}
                    className={
                      selectedMember.avatarMode === "contain"
                        ? "w-full h-full object-contain p-3"
                        : "w-full h-full object-cover object-center"
                    }
                  />
                ) : (
                  <span className="font-serif text-4xl text-ink">
                    {selectedMember.initial}
                  </span>
                )}
              </div>
            </div>

            <div className="p-7 sm:p-8">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark mb-1">
                {selectedMember.role}
              </div>
              <h3 className="font-serif font-normal text-2xl sm:text-3xl text-ink mb-4">
                {selectedMember.name}
              </h3>

              <div className="space-y-3 text-sm text-ink-light leading-relaxed mb-6">
                {selectedMember.paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              <div className="pt-5 border-t border-border-subtle">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-muted mb-3">
                  {selectedMember.sectionLabel}
                </div>
                <ul className="space-y-2 text-xs text-ink-light">
                  {selectedMember.highlights.map((h) => (
                    <li key={h.text} className="flex items-center gap-2.5">
                      <img
                        src={h.motif}
                        alt=""
                        className="w-4 h-4 object-contain shrink-0"
                      />
                      <span>{h.text}</span>
                    </li>
                  ))}
                </ul>

                {(selectedMember.email || selectedMember.website) && (
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4 mt-5 border-t border-border-subtle text-xs font-bold text-ink-muted">
                    {selectedMember.email && (
                      <a
                        href={`mailto:${selectedMember.email}`}
                        className="inline-flex items-center gap-2 hover:text-ink transition-colors"
                      >
                        <Mail size={14} /> {selectedMember.email}
                      </a>
                    )}
                    {selectedMember.website && (
                      <a
                        href={selectedMember.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 hover:text-ink transition-colors"
                      >
                        <Globe size={14} /> {selectedMember.websiteLabel}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          8. GET INVOLVED SECTION
      ==================================================================== */}
      <section className="py-20 bg-surface border-t border-border-subtle">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="border-y border-border-subtle py-14 px-4">
            <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-dark mb-4">
              Get Involved
            </div>
            <h2 className="font-serif font-normal text-2xl sm:text-3xl md:text-[34px] text-ink leading-snug mb-6">
              We are always looking to grow our community and bring new
              educational materials to learners across different areas of the
              Tibetan language.
            </h2>
            <p className="text-sm sm:text-base text-ink-light max-w-2xl mx-auto leading-relaxed mb-5">
              As a Community Interest Company, we are particularly seeking new
              talent in marketing, fundraising, and educational content, as well
              as contributors to resources in every way possible.
            </p>
            <p className="text-sm sm:text-base text-ink-light max-w-2xl mx-auto leading-relaxed">
              If you would like to join our mission and get involved as a
              contributor, please get in touch:{" "}
              <a
                href="mailto:loplao.academy@gmail.com"
                className="font-semibold text-ink underline decoration-brand decoration-2 underline-offset-4 hover:text-brand-dark transition-colors"
              >
                loplao.academy@gmail.com
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ====================================================================
          9. CLOSING CALL TO ACTION BANNER
      ==================================================================== */}
      <section className="py-24 bg-ink text-white relative overflow-hidden">
        <img
          src="/motif_mandala_gold.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute -top-20 -right-20 w-80 h-80 object-contain opacity-[0.06]"
        />
        <img
          src="/motif_mandala_gold.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute -bottom-24 -left-24 w-80 h-80 object-contain opacity-[0.06]"
        />

        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <p className="font-serif italic text-2xl sm:text-3xl text-white/95 max-w-2xl mx-auto leading-relaxed mb-8">
            Join us at Loplao and be part of a vibrant community celebrating
            Tibetan wisdom.
          </p>

          <div className="font-tibetan text-2xl sm:text-4xl text-brand leading-normal mb-2">
            བོད་ཀྱི་སྐད་ཡིག་ནི་བོད་མི་རིགས་ཀྱི་སྲོག་རྩ་ཡིན།
          </div>
          <p className="font-serif italic text-sm sm:text-base text-white/80 mb-10">
            &ldquo;The Tibetan language is the lifeline of the Tibetan
            people.&rdquo;
          </p>

          <div className="flex items-center justify-center gap-4 mb-9">
            <span className="w-12 h-[1px] bg-white/20" />
            <img
              src="/motif_butter_lamp_gold.png"
              alt=""
              className="w-6 h-6 object-contain"
            />
            <span className="w-12 h-[1px] bg-white/20" />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <SignedOut>
              <SignUpButton mode="modal">
                <button className="bg-brand hover:bg-brand-dark text-ink font-bold text-xs sm:text-sm px-7 py-3.5 rounded-lg transition-all shadow-md cursor-pointer">
                  Start learning free
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <button className="bg-brand hover:bg-brand-dark text-ink font-bold text-xs sm:text-sm px-7 py-3.5 rounded-lg transition-all shadow-md cursor-pointer">
                  Go to Dashboard
                </button>
              </Link>
            </SignedIn>

            <Link href="/">
              <button className="border border-white/30 hover:border-white hover:bg-white/10 text-white font-bold text-xs sm:text-sm px-7 py-3.5 rounded-lg transition-all cursor-pointer">
                Back to home
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ====================================================================
          10. FOOTER (PRAJNAPARAMITA EMBLEM & WISDOM BLESSING)
      ==================================================================== */}
      <footer className="bg-[#091e36] text-white/70 py-14 border-t border-white/10 text-center">
        <div className="max-w-4xl mx-auto px-6 flex flex-col items-center">
          <div className="mb-5">
            <img
              src="/motif_Prajnaparamita.png"
              alt="Goddess Prajnaparamita"
              className="w-24 h-24 sm:w-28 sm:h-28 object-contain mx-auto opacity-95 hover:scale-105 transition-transform"
            />
          </div>

          <div className="font-tibetan text-2xl sm:text-3xl text-white mb-1.5">
            ཤེས་རབ་ལྷ་མོས་དངོས་གྲུབ་སྩོལ།
          </div>
          <p className="font-serif italic text-xs sm:text-sm text-white/60 mb-8">
            &ldquo;May the goddess of wisdom bestow accomplishment.&rdquo;
          </p>

          <div className="flex items-center justify-center gap-4 mb-6">
            <a
              href="https://www.facebook.com/TibEasy"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Loplao on Facebook"
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-brand hover:text-ink border border-white/15 hover:border-brand flex items-center justify-center text-white/80 transition-all"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/easytibetan/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Loplao on Instagram"
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-brand hover:text-ink border border-white/15 hover:border-brand flex items-center justify-center text-white/80 transition-all"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-white/70 mb-4">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/courses" className="hover:text-white transition-colors">
              Live Courses
            </Link>
            <Link href="/shop" className="hover:text-white transition-colors">
              Shop
            </Link>
            <Link
              href="/about"
              className="text-white font-bold transition-colors"
            >
              About
            </Link>
            <Link href="/support" className="hover:text-white transition-colors">
              Contact
            </Link>
            <Link
              href="/donate"
              className="text-brand hover:text-brand-light font-bold transition-colors"
            >
              Donate
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
          </div>

          <div className="text-[11px] text-white/45">
            © {new Date().getFullYear()} Loplao · Learn Tibetan UK
          </div>
        </div>
      </footer>
    </div>
  );
}