// app/about/page.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  Globe,
  ExternalLink,
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
  {
    motif: "/motif_stupa.png",
    value: "2023",
    label: "AI Collaboration Began",
    sub: "with Peter",
  },
];

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-paper text-ink font-sans selection:bg-brand-light selection:text-brand-dark overflow-x-hidden">
      {/* ====================================================================
          1. FIXED TOP NAVIGATION BAR (CONSISTENT WITH WEBLANDING)
      ==================================================================== */}
      <nav className="fixed top-0 left-0 right-0 w-full z-50 bg-ink/95 backdrop-blur-md border-b border-white/10 text-white">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Brand Logo (White) + སློབ་སླའོ། on Top + Divider Line + Loplao Underneath */}
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

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/75">
            <Link href="/#levels" className="hover:text-white transition-colors">
              Curriculum
            </Link>
            <Link
              href="/#methodology"
              className="hover:text-white transition-colors"
            >
              Methodology
            </Link>
            <Link href="/#culture" className="hover:text-white transition-colors">
              Culture
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

          {/* Clerk Authentication Buttons */}
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
          2. HERO SECTION (MOUNTAIN SCENE + EDITORIAL SERIF HEADING)
      ==================================================================== */}
      <header className="relative bg-ink text-white pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* Background Mountain Image with Rich Navy Editorial Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/loplao-hero-scene.jpg"
            onError={(e) => {
              e.currentTarget.src = "/02_four_vowels.jpg";
            }}
            alt="Himalayan Landscape"
            className="w-full h-full object-cover object-center opacity-35 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40" />
        </div>

        {/* Subtle Gold Mandala Watermark (Centered Upper-Middle Between Text & Monastery) */}
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

          <h1 className="font-serif font-normal text-5xl sm:text-6xl md:text-[64px] leading-[1.1] text-white mb-5">
            About Us
          </h1>

          <p className="font-serif italic text-xl sm:text-2xl text-white/90 max-w-xl leading-relaxed mb-8">
            Learn Tibetan. Connect with its heritage.
            <br />
            Help keep the language alive.
          </p>

          {/* Gold Line + Custom Gold Butter Lamp Divider */}
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
          3. OUR MISSION ("DISCOVER LOPLAO" + CLASSROOM PHOTO)
      ==================================================================== */}
      <section className="py-20 md:py-24 bg-paper">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Copy */}
          <div className="lg:col-span-6">
            <span className="inline-block bg-brand text-ink text-[10px] font-bold uppercase tracking-[0.2em] px-3.5 py-1 rounded-full mb-4">
              Our Mission
            </span>
            <h2 className="font-serif font-normal text-3xl sm:text-4xl text-ink mb-6">
              Discover Loplao
            </h2>
            <div className="space-y-4 text-sm sm:text-base text-ink-light leading-relaxed mb-8">
              <p>
                At Loplao, we believe that preserving a language begins with making
                it accessible to everyone. Our mission goes beyond teaching Tibetan
                as a foreign language; we strive to create opportunities for people
                around the world to learn, study and engage with this remarkable
                linguistic and cultural heritage.
              </p>
              <p>
                In an increasingly digital world, minority and endangered languages
                often remain underrepresented in modern educational resources and
                technology. We aim to bridge this gap by combining experienced
                Tibetan language teaching, academically grounded learning materials
                and innovative digital tools to make Tibetan education accessible to
                a global audience.
              </p>
            </div>

            <SignedOut>
              <SignUpButton mode="modal">
                <button className="bg-brand hover:bg-brand-dark text-ink font-bold text-xs sm:text-sm px-7 py-3.5 rounded-full transition-all shadow-sm inline-flex items-center gap-2 cursor-pointer">
                  Explore Our Courses <ArrowRight size={15} />
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <button className="bg-brand hover:bg-brand-dark text-ink font-bold text-xs sm:text-sm px-7 py-3.5 rounded-full transition-all shadow-sm inline-flex items-center gap-2 cursor-pointer">
                  Explore Our Courses <ArrowRight size={15} />
                </button>
              </Link>
            </SignedIn>
          </div>

          {/* Right Classroom Image */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl overflow-hidden border border-border-subtle shadow-lg bg-surface">
              <img
                src="/about_classroom-JsxUlfTo.jpg"
                alt="Teaching Tibetan in the classroom"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          4. STATS BAR (USING CUSTOM DESIGNER MOTIFS)
      ==================================================================== */}
      <section className="py-14 bg-surface border-y border-border-subtle">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border-subtle">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center text-center px-4 py-6 md:py-2"
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
                <div className="text-[11px] text-ink-muted mt-0.5">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          5. OUR TEACHING HERITAGE ("OVER A DECADE OF EXPERIENCE" + OXFORD PHOTO)
      ==================================================================== */}
      <section className="py-20 md:py-24 bg-paper">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Oxford Image */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="rounded-3xl overflow-hidden border border-border-subtle shadow-lg bg-surface">
              <img
                src="/about_oxford-tJAq0B4-.jpg"
                alt="Oxford University architecture in spring"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Copy */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <span className="inline-block bg-brand text-ink text-[10px] font-bold uppercase tracking-[0.2em] px-3.5 py-1 rounded-full mb-4">
              Our Teaching Heritage
            </span>
            <h2 className="font-serif font-normal text-3xl sm:text-4xl text-ink mb-6">
              Over a Decade of Experience
            </h2>
            <div className="space-y-4 text-sm sm:text-base text-ink-light leading-relaxed">
              <p>
                Loplao&apos;s lessons and educational content are grounded in more
                than a decade of Tibetan language teaching experience. This journey
                began with Tenzin&apos;s teaching work at Sarah College of Higher
                Tibetan Studies in India and continued through teaching at SOAS,
                University of London, the Tibetan Language Summer School in Oxford,
                and various Buddhist centres across the UK.
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
                ,{" "}
                <strong className="text-ink font-semibold">Esukhia</strong>, and the{" "}
                <strong className="text-ink font-semibold">
                  College for Higher Tibetan Studies
                </strong>
                .
              </p>
              <p>
                These experiences have shaped our teaching philosophy: combining
                traditional Tibetan language education with practical, engaging and
                accessible approaches for learners from different backgrounds.
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
          {/* Left Copy & Social Cards */}
          <div className="lg:col-span-7">
            <span className="inline-block bg-brand text-ink text-[10px] font-bold uppercase tracking-[0.2em] px-3.5 py-1 rounded-full mb-4">
              Our Global Community
            </span>
            <h2 className="font-serif font-normal text-3xl sm:text-4xl text-ink mb-6">
              A Growing Community Since 2019
            </h2>
            <div className="space-y-4 text-sm sm:text-base text-ink-light leading-relaxed mb-8">
              <p>
                Since 2019, we have been creating Tibetan language learning content
                across Instagram and Facebook, building an international community
                of learners with{" "}
                <strong className="text-ink font-semibold">
                  more than 57,000 combined followers
                </strong>
                .
              </p>
              <p>
                Through short educational videos, language explanations and
                interactive content, we have helped introduce Tibetan to a wider
                audience and make language learning part of everyday digital life.
              </p>
            </div>

            {/* Social Media Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Instagram Card */}
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
                      <div className="text-[11px] text-ink-muted">@easytibetan</div>
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
                  &ldquo;Tibetan language made easy&rdquo; — daily posts, reels and
                  stories that bring Tibetan into the feed.
                </p>
              </a>

              {/* Facebook Card */}
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
                      <div className="text-[11px] text-ink-muted">EasyTibetan</div>
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
                  Established to promote and advance Tibetan language and culture
                  worldwide.
                </p>
              </a>
            </div>
          </div>

          {/* Right Phone Frame with Instagram Screenshot */}
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
          7. THE TEAM BEHIND LOPLAO (ROUND AVATARS + ANONYMITY FOR PETER)
      ==================================================================== */}
      <section className="py-20 md:py-24 bg-paper">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="inline-block bg-brand text-ink text-[10px] font-bold uppercase tracking-[0.2em] px-3.5 py-1 rounded-full mb-3">
              Our People
            </span>
            <h2 className="font-serif font-normal text-3xl sm:text-4xl text-ink mb-3">
              The Team Behind Loplao
            </h2>
            <p className="text-sm sm:text-base text-ink-muted">
              Two people, one shared belief: that Tibetan deserves to be taught
              properly and kept alive online.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* ==================== TENZIN CHOEPHEL JU CARD ==================== */}
            <div className="bg-surface border border-border-subtle rounded-3xl overflow-hidden shadow-sm flex flex-col">
              {/* Top Navy Banner with Circular Avatar */}
              <div className="relative bg-ink h-52 flex items-center justify-center overflow-hidden">
                <img
                  src="/motif_mandala_gold.png"
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none select-none absolute -bottom-12 -right-10 w-44 h-44 object-contain opacity-15"
                />
                {/* Round Avatar featuring Tenzin's Original Loplao Emblem */}
                <div className="relative z-10 w-28 h-28 rounded-full border-2 border-brand bg-white p-3.5 shadow-xl flex items-center justify-center overflow-hidden">
                  <img
                    src="/icon.png"
                    alt="Tenzin Choephel Ju · Loplao"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Card Body */}
              <div className="p-7 sm:p-8 flex-1 flex flex-col">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark mb-1">
                  Tibetan Language Teacher · Curriculum &amp; Design
                </div>
                <h3 className="font-serif font-normal text-2xl sm:text-3xl text-ink mb-4">
                  Tenzin Choephel Ju
                </h3>

                <div className="space-y-3 text-sm text-ink-light leading-relaxed mb-6">
                  <p>
                    Tenzin has taught Tibetan for more than a decade, beginning at
                    Sarah College of Higher Tibetan Studies in India and continuing
                    at SOAS, University of London, the Tibetan Language Summer
                    School in Oxford, and Buddhist centres across the UK.
                  </p>
                  <p>
                    That classroom experience shapes everything Loplao publishes: the
                    order of the lessons, the examples we choose, and the care we
                    take with pronunciation, politeness and culture.
                  </p>
                </div>

                {/* Teaching & Work Highlights (Using Custom Motifs) */}
                <div className="pt-5 border-t border-border-subtle mt-auto">
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-muted mb-3">
                    Teaching &amp; Work
                  </div>
                  <ul className="space-y-2 text-xs text-ink-light mb-6">
                    <li className="flex items-center gap-2.5">
                      <img
                        src="/motif_pecha.png"
                        alt=""
                        className="w-4 h-4 object-contain shrink-0"
                      />
                      <span>Sarah College of Higher Tibetan Studies, India</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <img
                        src="/motif_stupa.png"
                        alt=""
                        className="w-4 h-4 object-contain shrink-0"
                      />
                      <span>SOAS, University of London</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <img
                        src="/motif_butter_lamp.png"
                        alt=""
                        className="w-4 h-4 object-contain shrink-0"
                      />
                      <span>Tibetan Language Summer School, Oxford</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <img
                        src="/motif_prayer_wheel.png"
                        alt=""
                        className="w-4 h-4 object-contain shrink-0"
                      />
                      <span>Buddhist centres across the UK</span>
                    </li>
                  </ul>

                  {/* Contact Links */}
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4 border-t border-border-subtle text-xs font-bold text-ink-muted">
                    <a
                      href="mailto:loplao.academy@gmail.com"
                      className="inline-flex items-center gap-2 hover:text-ink transition-colors"
                    >
                      <Mail size={14} /> loplao.academy@gmail.com
                    </a>
                    <a
                      href="https://www.loplao.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 hover:text-ink transition-colors"
                    >
                      <Globe size={14} /> www.loplao.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* ==================== PETER SMITH CARD ==================== */}
            <div className="bg-surface border border-border-subtle rounded-3xl overflow-hidden shadow-sm flex flex-col">
              {/* Top Navy Banner with Circular Egyptian King Avatar */}
              <div className="relative bg-ink h-52 flex items-center justify-center overflow-hidden">
                <img
                  src="/motif_mandala_gold.png"
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none select-none absolute -bottom-12 -right-10 w-44 h-44 object-contain opacity-15"
                />
                {/* Round Avatar featuring Peter's Egyptian King (/peter.jpg) */}
                <div className="relative z-10 w-28 h-28 rounded-full border-2 border-brand bg-white shadow-xl overflow-hidden">
                  <img
                    src="/peter.jpg"
                    alt="Peter Smith"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>

              {/* Card Body */}
              <div className="p-7 sm:p-8 flex-1 flex flex-col">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark mb-1">
                  AI Specialist &amp; Lead Developer
                </div>
                <h3 className="font-serif font-normal text-2xl sm:text-3xl text-ink mb-4">
                  Peter Smith
                </h3>

                <div className="space-y-3 text-sm text-ink-light leading-relaxed mb-6">
                  <p>
                    Peter is an AI specialist, programmer, and platform architect.
                    Since 2023 he has worked alongside Tenzin on Tibetan language
                    tools, native applications, and Large Language Model projects.
                  </p>
                  <p>
                    His work looks at how artificial intelligence and modern digital
                    infrastructure can make Tibetan easier to learn, search and use
                    inside modern software — so the language has a place in the
                    tools people already open every day.
                  </p>
                </div>

                {/* Focus & Architecture Highlights (Using Custom Motifs) */}
                <div className="pt-5 border-t border-border-subtle mt-auto">
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-muted mb-3">
                    Technology &amp; Research
                  </div>
                  <ul className="space-y-2 text-xs text-ink-light mb-6">
                    <li className="flex items-center gap-2.5">
                      <img
                        src="/motif_mandala.png"
                        alt=""
                        className="w-4 h-4 object-contain shrink-0"
                      />
                      <span>Artificial Intelligence &amp; Platform Architecture</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <img
                        src="/motif_wind_horse.png"
                        alt=""
                        className="w-4 h-4 object-contain shrink-0"
                      />
                      <span>Tibetan language tools since 2023</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <img
                        src="/motif_vajra.png"
                        alt=""
                        className="w-4 h-4 object-contain shrink-0"
                      />
                      <span>Large Language Model projects</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <img
                        src="/motif_bell.png"
                        alt=""
                        className="w-4 h-4 object-contain shrink-0"
                      />
                      <span>Web &amp; native mobile application development</span>
                    </li>
                  </ul>

                  {/* Contact Link */}
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4 border-t border-border-subtle text-xs font-bold text-ink-muted">
                    <a
                      href="mailto:p.sm1549c@gmail.com"
                      className="inline-flex items-center gap-2 hover:text-ink transition-colors"
                    >
                      <Mail size={14} /> p.sm1549c@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          8. TWO FEATURE CARDS: SCHOLARSHIP & TRADITION + TECHNOLOGY
      ==================================================================== */}
      <section className="pb-20 md:pb-24 bg-paper">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Rooted in Authentic Scholarship */}
          <div className="bg-surface border border-border-subtle rounded-3xl overflow-hidden shadow-sm flex flex-col">
            {/* Visual Header with Pecha Artwork */}
            <div className="relative h-48 bg-ink flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink-light/40 to-ink" />
              <img
                src="/motif_mandala_gold.png"
                alt=""
                aria-hidden="true"
                className="pointer-events-none select-none absolute -left-10 -top-10 w-44 h-44 object-contain opacity-10"
              />
              <img
                src="/symbol_pecha_gold.png"
                alt="Tibetan Pecha Scripture"
                className="relative z-10 w-28 h-28 object-contain drop-shadow-lg"
              />
            </div>

            <div className="p-7 sm:p-8 flex-1 flex flex-col">
              <div className="bg-brand text-ink text-[10px] font-bold uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full w-fit mb-4">
                Our Curriculum
              </div>
              <h3 className="font-serif font-normal text-2xl sm:text-3xl text-ink mb-4">
                Rooted in Authentic Scholarship
              </h3>
              <div className="space-y-3 text-sm text-ink-light leading-relaxed mb-8 flex-1">
                <p>
                  A strong language-learning journey requires more than isolated
                  vocabulary exercises or disconnected learning materials. That is
                  why our curriculum draws on a range of respected Tibetan language
                  textbooks and established teaching resources.
                </p>
                <p>
                  By bringing together the strengths of different educational
                  traditions, we have developed a structured learning pathway that
                  combines academic foundations with practical language skills —
                  rooted in authentic Tibetan linguistics while remaining accessible
                  to learners from diverse backgrounds.
                </p>
              </div>

              <SignedOut>
                <SignUpButton mode="modal">
                  <button className="bg-brand hover:bg-brand-dark text-ink font-bold text-xs px-6 py-3 rounded-full transition-colors w-fit inline-flex items-center gap-2 cursor-pointer">
                    Start Learning Tibetan for Free <ArrowRight size={14} />
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard">
                  <button className="bg-brand hover:bg-brand-dark text-ink font-bold text-xs px-6 py-3 rounded-full transition-colors w-fit inline-flex items-center gap-2 cursor-pointer">
                    Start Learning Tibetan for Free <ArrowRight size={14} />
                  </button>
                </Link>
              </SignedIn>
            </div>
          </div>

          {/* Card 2: Bridging Tradition and Technology (No University Reference) */}
          <div className="bg-surface border border-border-subtle rounded-3xl overflow-hidden shadow-sm flex flex-col">
            {/* Visual Header with Glowing Tibetan Syllable ཨ */}
            <div className="relative h-48 bg-[#07182c] flex items-center justify-center overflow-hidden">
              <img
                src="/motif_mandala_gold.png"
                alt=""
                aria-hidden="true"
                className="pointer-events-none select-none absolute w-56 h-56 object-contain opacity-15"
              />
              <div className="relative z-10 w-24 h-24 rounded-full border-2 border-brand/80 bg-ink/90 shadow-[0_0_35px_rgba(255,182,0,0.3)] flex items-center justify-center">
                <span className="font-tibetan text-5xl text-brand leading-none pt-2">
                  ཨ
                </span>
              </div>
            </div>

            <div className="p-7 sm:p-8 flex-1 flex flex-col">
              <div className="bg-brand text-ink text-[10px] font-bold uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full w-fit mb-4">
                Innovation For The Future
              </div>
              <h3 className="font-serif font-normal text-2xl sm:text-3xl text-ink mb-4">
                Bridging Tradition and Technology
              </h3>
              <div className="space-y-3 text-sm text-ink-light leading-relaxed mb-8 flex-1">
                <p>
                  Since 2023,{" "}
                  <strong className="text-ink font-semibold">
                    Peter and Tenzin have been collaborating on the development of
                    Tibetan language tools and Large Language Model (LLM) projects
                  </strong>
                  , exploring how artificial intelligence can support Tibetan
                  language learning, research and digital accessibility.
                </p>
                <p>
                  Peter&apos;s expertise in artificial intelligence and software
                  engineering, combined with Tenzin&apos;s extensive experience in
                  Tibetan language teaching, brings together technological
                  innovation and linguistic knowledge — helping make Tibetan more
                  accessible, searchable and usable in modern technology.
                </p>
              </div>

              <Link href="/#methodology">
                <button className="bg-brand hover:bg-brand-dark text-ink font-bold text-xs px-6 py-3 rounded-full transition-colors w-fit inline-flex items-center gap-2 cursor-pointer">
                  Learn More About Our Work <ArrowRight size={14} />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          9. THE PATHWAY + CLOSING CALL TO ACTION (DARK NAVY SECTION)
      ==================================================================== */}
      <section className="py-24 bg-ink text-white relative overflow-hidden">
        {/* Subtle Gold Mandala Watermarks */}
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

        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <span className="inline-block bg-brand text-ink text-[10px] font-bold uppercase tracking-[0.2em] px-3.5 py-1 rounded-full mb-4">
            The Pathway
          </span>
          <h2 className="font-serif font-normal text-3xl sm:text-5xl text-white leading-tight mb-6">
            Six Levels, Three Courses,
            <br />
            One Learning Journey
          </h2>

          <div className="space-y-4 text-sm sm:text-base text-white/80 leading-relaxed mb-16">
            <p>
              Our curriculum is organised into{" "}
              <strong className="text-white font-semibold">
                six proficiency levels across three main courses
              </strong>
              , guiding learners progressively from the fundamentals of Tibetan to
              more advanced language skills.
            </p>
            <p>
              Starting with the thirty consonants of the Tibetan alphabet, students
              gradually develop their understanding of pronunciation, vocabulary,
              grammar and everyday conversation. As they progress, they build the
              skills needed to read and understand increasingly complex texts,
              including classical Tibetan literature.
            </p>
            <p>
              Whether you are an academic researcher, a student of Tibetan Buddhism,
              someone reconnecting with your Tibetan heritage, or simply curious
              about the language, our structured curriculum provides a pathway to
              deepen your knowledge at your own pace.
            </p>
            <p>
              Most importantly, we believe that high-quality Tibetan language
              education should be accessible to everyone. By offering our structured
              learning resources free of charge, we hope to support a new generation
              of Tibetan learners and contribute to the long-term preservation and
              transmission of this remarkable language.
            </p>
          </div>

          {/* Closing Quote & CTA */}
          <div className="pt-14 border-t border-white/10 text-center">
            <p className="font-serif italic text-2xl sm:text-3xl text-white/95 max-w-2xl mx-auto leading-relaxed mb-6">
              Join us at Loplao and be part of a vibrant community celebrating
              Tibetan wisdom.
            </p>

            {/* Custom Motif Divider */}
            <div className="flex items-center justify-center gap-4 mb-8">
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
        </div>
      </section>

      {/* ====================================================================
          10. FOOTER (CONSISTENT WITH WEBLANDING - PECHA EMBLEM & BLESSING)
      ==================================================================== */}
      <footer className="bg-[#091e36] text-white/70 py-14 border-t border-white/10 text-center">
        <div className="max-w-4xl mx-auto px-6 flex flex-col items-center">
          {/* Single Pecha Scripture Emblem Above the Wisdom Blessing */}
          <div className="mb-5">
            <img
              src="/symbol_pecha_gold.png"
              alt="Tibetan Pecha Scripture"
              className="w-20 h-20 object-contain mx-auto opacity-95 hover:scale-105 transition-transform"
            />
          </div>

          {/* Tibetan Wisdom Blessing */}
          <div className="font-tibetan text-2xl sm:text-3xl text-white mb-1.5">
            ཤེས་རབ་ལྷ་མོས་དངོས་གྲུབ་སྩོལ།
          </div>
          <p className="font-serif italic text-xs sm:text-sm text-white/60 mb-8">
            &ldquo;May the goddess of wisdom bestow accomplishment.&rdquo;
          </p>

          {/* Social Media Icons (Facebook & Instagram) */}
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

          {/* Navigation & Legal Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-white/70 mb-4">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-white font-bold transition-colors">
              About
            </Link>
            <Link href="/support" className="hover:text-white transition-colors">
              Support
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
            <a
              href="mailto:loplao.academy@gmail.com"
              className="hover:text-white transition-colors"
            >
              loplao.academy@gmail.com
            </a>
          </div>

          <div className="text-[11px] text-white/45">
            © {new Date().getFullYear()} Loplao · Learn Tibetan UK
          </div>
        </div>
      </footer>
    </div>
  );
}