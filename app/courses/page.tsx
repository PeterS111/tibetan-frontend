// app/courses/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  Clock,
  Users,
  Video,
  CheckCircle2,
  Loader2,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/clerk-react";

type CourseTabId = "winter" | "summer" | "flexible" | "private";

interface PackageOption {
  id: string;
  label: string;
  priceLabel: string;
  priceGbp: number;
}

const COURSE_PACKAGES_BY_TAB: Record<CourseTabId, PackageOption[]> = {
  winter: [
    {
      id: "winter-school",
      label: "Winter School (Online via Zoom)",
      priceLabel: "£350",
      priceGbp: 350,
    },
  ],
  summer: [
    {
      id: "summer-school-online",
      label: "Summer School — Online (Zoom)",
      priceLabel: "£350",
      priceGbp: 350,
    },
    {
      id: "summer-school-oxford",
      label: "Summer School — In Person (Oxford)",
      priceLabel: "£500",
      priceGbp: 500,
    },
  ],
  flexible: [
    {
      id: "flexible-lessons",
      label: "Flexible Online Course (15 Weeks via Zoom)",
      priceLabel: "£200",
      priceGbp: 200,
    },
  ],
  private: [
    {
      id: "private-taster",
      label: "Taster Session (30-min Private Lesson)",
      priceLabel: "Free (£0)",
      priceGbp: 0,
    },
    {
      id: "text-consultation",
      label: "Tibetan Text & Research Consultation (60 min)",
      priceLabel: "£50",
      priceGbp: 50,
    },
    {
      id: "private-8-pack",
      label: "8-Lesson Private Package (£30 / lesson)",
      priceLabel: "£240",
      priceGbp: 240,
    },
    {
      id: "private-10-pack",
      label: "10-Lesson Private Package (£27.50 / lesson · Best Value)",
      priceLabel: "£275",
      priceGbp: 275,
    },
  ],
};

const LEVEL_OPTIONS = [
  "Beginner",
  "Pre-Intermediate",
  "Intermediate",
  "Advanced",
];

export default function CoursesPage() {
  const [activeTab, setActiveTab] = useState<CourseTabId>("winter");
  const formRef = useRef<HTMLDivElement>(null);

  // Registration Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [region, setRegion] = useState("");
  const [message, setMessage] = useState("");
  const [selectedPackages, setSelectedPackages] = useState<string[]>([
    "winter-school",
  ]);
  const [level, setLevel] = useState("");

  // Submission & Return Banners
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [paidSuccess, setPaidSuccess] = useState(false);
  const [freeConfirmed, setFreeConfirmed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab") as CourseTabId | null;
    if (tabParam && COURSE_PACKAGES_BY_TAB[tabParam]) {
      setActiveTab(tabParam);
      setSelectedPackages([COURSE_PACKAGES_BY_TAB[tabParam][0].id]);
    }
    if (params.get("success") === "1") {
      setPaidSuccess(true);
    }
  }, []);

  const switchTab = (tab: CourseTabId, preselectPackageId?: string) => {
    setActiveTab(tab);
    setErrorMsg(null);
    setFreeConfirmed(false);
    const defaultPkg = preselectPackageId || COURSE_PACKAGES_BY_TAB[tab][0].id;
    setSelectedPackages([defaultPkg]);
  };

  const selectPackageAndScroll = (pkgId: string) => {
    setSelectedPackages([pkgId]);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const togglePackage = (pkgId: string) => {
    setSelectedPackages((prev) =>
      prev.includes(pkgId) ? prev.filter((id) => id !== pkgId) : [...prev, pkgId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPackages.length === 0) {
      setErrorMsg("Please select at least one course or package.");
      return;
    }
    if (!level) {
      setErrorMsg("Please select your current Tibetan level.");
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);

    const tabTitles: Record<CourseTabId, string> = {
      winter: "Winter School",
      summer: "Summer School",
      flexible: "Flexible Lessons",
      private: "Private Classes",
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/courses/checkout`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName,
            lastName,
            phone,
            email,
            region,
            courseCategory: tabTitles[activeTab],
            packageIds: selectedPackages,
            level,
            message,
            origin:
              typeof window !== "undefined" ? window.location.origin : undefined,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed.");

      if (data.status === "free_confirmed") {
        setFreeConfirmed(true);
        setIsSubmitting(false);
        return;
      }

      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      }
    } catch (err: any) {
      setErrorMsg(err.message);
      setIsSubmitting(false);
    }
  };

  const heroMeta: Record<
    CourseTabId,
    { title: string; tib: string; sub: string; bgImg: string }
  > = {
    winter: {
      title: "Winter School",
      tib: "དགུན་ཁའི་སློབ་གྲྭ།",
      sub: "Long-term online Tibetan language immersion from winter through spring.",
      bgImg: "/02_four_vowels.jpg",
    },
    summer: {
      title: "Summer School",
      tib: "དབྱར་ཁའི་སློབ་གྲྭ།",
      sub: "2026 Intensive two-week programme — Online via Zoom or In-Person in Oxford.",
      bgImg: "/about_oxford-tJAq0B4-.jpg",
    },
    flexible: {
      title: "Flexible Lessons",
      tib: "སྟབས་བདེའི་འཛིན་གྲྭ།",
      sub: "15-week live Beginner cohort scheduled around enrolled students' time zones.",
      bgImg: "/05_five_prefixes.jpg",
    },
    private: {
      title: "Private Classes & Text Consultation",
      tib: "སྒེར་གྱི་འཛིན་གྲྭ།",
      sub: "Personalised 1-to-1 Tibetan instruction and specialist research consultation.",
      bgImg: "/about_classroom-JsxUlfTo.jpg",
    },
  };

  const currentHero = heroMeta[activeTab];

  return (
    <div className="min-h-screen bg-paper text-ink font-sans selection:bg-brand-light selection:text-brand-dark overflow-x-hidden">
      {/* ====================================================================
          1. FIXED TOP NAVIGATION BAR
      ==================================================================== */}
      <nav className="fixed top-0 left-0 right-0 w-full z-40 bg-ink/95 backdrop-blur-md border-b border-white/10 text-white">
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
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <Link
              href="/courses"
              className="text-brand font-semibold transition-colors"
            >
              Live Courses
            </Link>
            <Link href="/shop" className="hover:text-white transition-colors">
              Shop
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
                <button className="hidden sm:inline-block px-4 py-2 text-xs sm:text-sm font-medium text-white border border-white/30 hover:border-white hover:bg-white/10 rounded-lg transition-all cursor-pointer">
                  Log in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-4 py-2 text-xs sm:text-sm font-bold bg-brand hover:bg-brand-dark text-ink rounded-lg transition-all shadow-sm cursor-pointer">
                  Sign up
                </button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <Link href="/dashboard">
                <button className="px-4 py-2 text-xs sm:text-sm font-bold bg-brand hover:bg-brand-dark text-ink rounded-lg transition-all shadow-sm flex items-center gap-1.5 cursor-pointer">
                  App <ArrowRight size={14} strokeWidth={2.5} />
                </button>
              </Link>
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* ====================================================================
          2. DYNAMIC COURSE HERO + 4-COURSE SWITCHER TABS
      ==================================================================== */}
      <header className="relative bg-ink text-white pt-32 pb-16 md:pt-36 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={currentHero.bgImg}
            alt={currentHero.title}
            className="w-full h-full object-cover object-center opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/85 to-ink/60" />
        </div>

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          {/* Course Switcher Pills */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 bg-white/10 p-1.5 rounded-full border border-white/15 mb-10">
            {[
              { id: "winter", label: "Winter School" },
              { id: "summer", label: "Summer School" },
              { id: "flexible", label: "Flexible Lessons" },
              { id: "private", label: "Private Classes" },
            ].map((t) => {
              const active = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => switchTab(t.id as CourseTabId)}
                  className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    active
                      ? "bg-brand text-ink shadow-sm"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          <div className="font-tibetan text-2xl sm:text-3xl text-brand mb-3">
            {currentHero.tib}
          </div>
          <h1 className="font-serif font-normal text-4xl sm:text-5xl md:text-6xl text-white mb-4">
            {currentHero.title}
          </h1>
          <p className="text-sm sm:text-base text-white/80 max-w-xl mx-auto leading-relaxed">
            {currentHero.sub}
          </p>
        </div>
      </header>

      {/* ====================================================================
          3. COURSE CONTENT BY TAB
      ==================================================================== */}
      <main className="max-w-5xl mx-auto px-6 py-14">
        {paidSuccess && (
          <div className="mb-12 bg-emerald-50 border border-emerald-200 rounded-3xl p-6 flex items-start gap-4 text-emerald-900 shadow-xs">
            <CheckCircle2
              size={26}
              className="text-emerald-600 shrink-0 mt-0.5"
            />
            <div>
              <h2 className="font-serif font-normal text-2xl text-emerald-950 mb-1">
                ཐུགས་རྗེ་ཆེ། — Course Registration &amp; Payment Confirmed!
              </h2>
              <p className="text-sm text-emerald-800 leading-relaxed">
                Welcome to Loplao! Your enrollment and payment have been
                received. Our teaching team will email you with your Zoom
                classroom link, schedule details, and welcome materials.
              </p>
            </div>
          </div>
        )}

        {/* ==================== TAB 1: WINTER SCHOOL ==================== */}
        {activeTab === "winter" && (
          <div className="space-y-12 animate-in fade-in duration-300">
            <div className="max-w-3xl mx-auto text-center">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark mb-2">
                December — April
              </div>
              <h2 className="font-serif font-normal text-3xl sm:text-4xl text-ink mb-4">
                Long-Term Winter Course
              </h2>
              <p className="text-sm sm:text-base text-ink-light leading-relaxed">
                Our Tibetan Language Winter School runs between December and
                April, offering a long-term, immersive learning experience.
                Designed for learners at Beginner and Pre-Intermediate levels,
                lessons are delivered live via Zoom and scheduled across time
                zones, with dedicated weekly conversation classes.
              </p>
            </div>

            {/* Course Details Card + Levels */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
              <div className="md:col-span-7 bg-surface border border-brand/40 rounded-3xl p-7 shadow-xs">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark mb-2">
                  Online Course Details (Zoom)
                </div>
                <h3 className="font-serif font-normal text-2xl text-ink mb-5">
                  Programme Overview · £350
                </h3>
                <ul className="space-y-3 text-sm text-ink-light">
                  <li className="flex items-center gap-3">
                    <Video size={16} className="text-brand-dark shrink-0" />
                    <span>
                      <strong className="text-ink">Venue:</strong> Online live
                      via Zoom
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Calendar size={16} className="text-brand-dark shrink-0" />
                    <span>
                      <strong className="text-ink">Term:</strong> Winter through
                      Spring (Starts 12th December 2026)
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Users size={16} className="text-brand-dark shrink-0" />
                    <span>
                      <strong className="text-ink">Class Size:</strong> Average
                      10, maximum 15 students (Age 13+)
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Clock size={16} className="text-brand-dark shrink-0" />
                    <span>
                      <strong className="text-ink">Hours:</strong> 1.5-hour
                      weekly core lessons + extra conversation labs
                    </span>
                  </li>
                </ul>
              </div>

              <div className="md:col-span-5 flex flex-col gap-4">
                <div className="bg-surface border border-border-subtle rounded-2xl p-6 flex-1">
                  <div className="text-xs font-bold text-brand-dark uppercase tracking-wider mb-1">
                    Beginner Level
                  </div>
                  <p className="text-xs sm:text-sm text-ink-light leading-relaxed">
                    For those with little or no prior knowledge of Tibetan.
                    Master the script, foundational grammar, and everyday
                    spoken expressions.
                  </p>
                </div>
                <div className="bg-surface border border-border-subtle rounded-2xl p-6 flex-1">
                  <div className="text-xs font-bold text-brand-dark uppercase tracking-wider mb-1">
                    Pre-Intermediate
                  </div>
                  <p className="text-xs sm:text-sm text-ink-light leading-relaxed">
                    For students who can already read Tibetan script. Build
                    conversational fluency, intermediate grammar, and Buddhist
                    terminology.
                  </p>
                </div>
              </div>
            </div>

            {/* Timetable */}
            <div className="bg-surface border border-border-subtle rounded-3xl p-7 text-center">
              <h3 className="font-serif font-normal text-2xl text-ink mb-2">
                Provisional Weekly Timetable
              </h3>
              <p className="text-xs text-ink-muted mb-6">
                All classes follow London Time (GMT). Times may adjust slightly
                to accommodate enrolled students.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                <div className="bg-paper rounded-2xl p-5 border border-border-subtle">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-brand-dark mb-1">
                    Start Date
                  </div>
                  <div className="font-serif text-xl text-ink">
                    12th December 2026
                  </div>
                </div>
                <div className="bg-paper rounded-2xl p-5 border border-border-subtle">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-brand-dark mb-1">
                    Beginners Level
                  </div>
                  <div className="font-serif text-xl text-ink">14:00 – 15:30</div>
                </div>
                <div className="bg-paper rounded-2xl p-5 border border-border-subtle">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-brand-dark mb-1">
                    Pre-Intermediate
                  </div>
                  <div className="font-serif text-xl text-ink">16:00 – 17:30</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: SUMMER SCHOOL ==================== */}
        {activeTab === "summer" && (
          <div className="space-y-12 animate-in fade-in duration-300">
            <div className="max-w-3xl mx-auto text-center">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark mb-2">
                27th July — 7th August 2026
              </div>
              <h2 className="font-serif font-normal text-3xl sm:text-4xl text-ink mb-4">
                2026 Intensive Tibetan Summer School
              </h2>
              <p className="text-sm sm:text-base text-ink-light leading-relaxed">
                Applications are now open! Join our intensive two-week summer
                programme designed for steady daily progress — available either
                online via Zoom (£350) or in person in Oxford (£500).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-surface border border-border-subtle rounded-3xl p-6">
                <div className="text-xs font-bold uppercase tracking-wider text-brand-dark mb-2">
                  Beginner Level
                </div>
                <p className="text-sm text-ink-light leading-relaxed">
                  For students new to Tibetan. Master the 30 consonants, vowels,
                  pronunciation rules, basic grammar, and daily conversation.
                </p>
              </div>
              <div className="bg-surface border border-border-subtle rounded-3xl p-6">
                <div className="text-xs font-bold uppercase tracking-wider text-brand-dark mb-2">
                  Pre-Intermediate
                </div>
                <p className="text-sm text-ink-light leading-relaxed">
                  For students who can read Tibetan script. Develop spoken
                  fluency, tense structures, reading comprehension, and literary
                  vocabulary.
                </p>
              </div>
              <div className="bg-surface border border-brand/40 rounded-3xl p-6">
                <div className="text-xs font-bold uppercase tracking-wider text-brand-dark mb-2">
                  Course Details
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-ink-light">
                  <li>
                    <strong className="text-ink">Length:</strong> 2 weeks
                    intensive (Mon–Fri)
                  </li>
                  <li>
                    <strong className="text-ink">Hours:</strong> Two 1.5-hour
                    lessons per day
                  </li>
                  <li>
                    <strong className="text-ink">Class Size:</strong> Avg. 10
                    students (Age 13+)
                  </li>
                  <li>
                    <strong className="text-ink">Fees:</strong> £350 (Zoom) ·
                    £500 (Oxford)
                  </li>
                </ul>
              </div>
            </div>

            {/* Summer Timetable */}
            <div className="bg-surface border border-border-subtle rounded-3xl p-7 text-center">
              <h3 className="font-serif font-normal text-2xl text-ink mb-2">
                Summer Timetable (Monday – Friday)
              </h3>
              <p className="text-xs text-ink-muted mb-6">
                All times displayed in BST (London). Two daily sessions per
                cohort.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                <div className="bg-paper rounded-2xl p-5 border border-border-subtle">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-brand-dark mb-1">
                    Programme Dates
                  </div>
                  <div className="font-serif text-lg text-ink">
                    27th July – 7th August 2026
                  </div>
                </div>
                <div className="bg-paper rounded-2xl p-5 border border-border-subtle">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-brand-dark mb-1">
                    Pre-Intermediate (Mon–Fri)
                  </div>
                  <div className="font-serif text-lg text-ink">
                    09:00 – 10:30 &amp; 13:30 – 15:00
                  </div>
                </div>
                <div className="bg-paper rounded-2xl p-5 border border-border-subtle">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-brand-dark mb-1">
                    Beginners Level (Mon–Fri)
                  </div>
                  <div className="font-serif text-lg text-ink">
                    10:30 – 12:00 &amp; 15:30 – 17:00
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 3: FLEXIBLE LESSONS ==================== */}
        {activeTab === "flexible" && (
          <div className="space-y-10 animate-in fade-in duration-300 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark mb-2">
                15-Week Cohort · Beginner Level
              </div>
              <h2 className="font-serif font-normal text-3xl sm:text-4xl text-ink mb-4">
                Flexible Online Learning
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-ink-light leading-relaxed text-left bg-surface border border-border-subtle rounded-3xl p-7">
                <p>
                  Our Flexible Learning programme is designed around the
                  schedules of students from around the world. The next intake
                  begins once <strong className="text-ink">8 students</strong>{" "}
                  have enrolled, at which point weekly class times are arranged
                  to suit the regions and time zones of the group.
                </p>
                <p>
                  This intake is tailored specifically for{" "}
                  <strong className="text-ink">Beginner level</strong> students.
                  You will attend one 1.5-hour live class per week while
                  building foundations in reading and grammar — and once the
                  group reads Tibetan script, an additional 1-hour weekly
                  conversation class is introduced at no extra cost.
                </p>
              </div>
            </div>

            <div className="bg-surface border border-brand/40 rounded-3xl p-7">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark mb-2">
                Flexible Online Course Details (Zoom)
              </div>
              <h3 className="font-serif font-normal text-2xl text-ink mb-4">
                15-Week Beginner Programme · £200
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-ink-light">
                <div>
                  <strong className="text-ink">Venue:</strong> Online (Zoom)
                </div>
                <div>
                  <strong className="text-ink">Duration:</strong> 15 weeks
                  (Sept–March)
                </div>
                <div>
                  <strong className="text-ink">Class Size:</strong> Avg. 8, max
                  15 students
                </div>
                <div>
                  <strong className="text-ink">Course Fee:</strong> £200 full
                  programme
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 4: PRIVATE CLASSES ==================== */}
        {activeTab === "private" && (
          <div className="space-y-10 animate-in fade-in duration-300">
            <div className="text-center max-w-2xl mx-auto">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark mb-2">
                1-to-1 Live Instruction
              </div>
              <h2 className="font-serif font-normal text-3xl sm:text-4xl text-ink mb-3">
                Private Tibetan Language &amp; Text Consultation
              </h2>
              <p className="text-sm sm:text-base text-ink-light">
                Personalised one-to-one Tibetan tuition and specialist classical
                text consultation, tailored to your level, pace, and research
                goals.
              </p>
            </div>

            {/* 3 Private Lesson Packages */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Taster */}
              <div className="bg-surface border border-border-subtle rounded-3xl p-7 flex flex-col">
                <div className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-2">
                  Taster Session
                </div>
                <div className="font-serif text-4xl text-ink mb-1">£0</div>
                <div className="text-xs text-ink-muted mb-5">
                  30-minute private Tibetan lesson
                </div>
                <ul className="space-y-2 text-xs text-ink-light mb-7 flex-1">
                  <li>• Live 1-to-1 session on Zoom</li>
                  <li>• Suitable for complete beginners to advanced</li>
                  <li>• Assess your current Tibetan level</li>
                  <li>• Discuss your goals &amp; personalised study plan</li>
                </ul>
                <button
                  type="button"
                  onClick={() => selectPackageAndScroll("private-taster")}
                  className="w-full bg-ink hover:bg-ink-light text-white font-bold text-xs py-3 rounded-full transition-colors cursor-pointer"
                >
                  Book Free Taster
                </button>
              </div>

              {/* 8-Lesson Package */}
              <div className="bg-surface border border-border-subtle rounded-3xl p-7 flex flex-col">
                <div className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-2">
                  8-Lesson Package
                </div>
                <div className="font-serif text-4xl text-ink mb-1">£240</div>
                <div className="text-xs text-ink-muted mb-5">
                  £30 per 60-minute lesson
                </div>
                <ul className="space-y-2 text-xs text-ink-light mb-7 flex-1">
                  <li>• 8 personalised 1-to-1 lessons on Zoom</li>
                  <li>• Flexible scheduling around your week</li>
                  <li>• Personalised learning syllabus</li>
                  <li>• Ongoing progression &amp; study support</li>
                </ul>
                <button
                  type="button"
                  onClick={() => selectPackageAndScroll("private-8-pack")}
                  className="w-full bg-ink hover:bg-ink-light text-white font-bold text-xs py-3 rounded-full transition-colors cursor-pointer"
                >
                  Choose 8 Lessons
                </button>
              </div>

              {/* 10-Lesson Package */}
              <div className="bg-surface border-2 border-brand rounded-3xl p-7 flex flex-col relative shadow-sm">
                <span className="absolute -top-3 right-6 bg-brand text-ink text-[10px] font-bold uppercase tracking-widest px-3 py-0.5 rounded-full">
                  Best Value
                </span>
                <div className="text-xs font-bold uppercase tracking-wider text-brand-dark mb-2">
                  10-Lesson Package
                </div>
                <div className="font-serif text-4xl text-ink mb-1">£275</div>
                <div className="text-xs text-ink-muted mb-5">
                  £27.50 per 60-minute lesson
                </div>
                <ul className="space-y-2 text-xs text-ink-light mb-7 flex-1">
                  <li>• 10 personalised 1-to-1 lessons on Zoom</li>
                  <li>• Flexible scheduling</li>
                  <li>• Personalised learning plan</li>
                  <li>• Ideal for consistent, deeper fluency</li>
                </ul>
                <button
                  type="button"
                  onClick={() => selectPackageAndScroll("private-10-pack")}
                  className="w-full bg-brand hover:bg-brand-dark text-ink font-bold text-xs py-3 rounded-full transition-colors cursor-pointer"
                >
                  Choose 10 Lessons
                </button>
              </div>
            </div>

            {/* Specialist Text & Research Consultation Card */}
            <div className="bg-surface border border-border-subtle rounded-3xl p-7 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-7">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark mb-1">
                  Specialist Academic &amp; Dharma Support
                </div>
                <h3 className="font-serif font-normal text-2xl sm:text-3xl text-ink mb-2">
                  Tibetan Text &amp; Research Consultation · £50
                </h3>
                <p className="text-xs text-ink-muted mb-3">
                  60-minute specialist consultation · Live 1-to-1 on Zoom
                </p>
                <p className="text-sm text-ink-light leading-relaxed mb-5">
                  Designed for researchers, translators, and practitioners
                  working through difficult Classical Tibetan texts, Buddhist
                  literature, manuscripts, or academic sources. Send your
                  passage and questions in advance so your teacher can prepare
                  annotated notes and line-by-line grammatical analysis.
                </p>
                <button
                  type="button"
                  onClick={() => selectPackageAndScroll("text-consultation")}
                  className="bg-ink hover:bg-ink-light text-white font-bold text-xs px-6 py-3 rounded-full transition-colors cursor-pointer"
                >
                  Book a Consultation (£50)
                </button>
              </div>
              <div className="md:col-span-5 bg-paper rounded-2xl p-5 border border-border-subtle text-xs text-ink-light space-y-2">
                <div className="font-bold text-ink mb-1">What is included:</div>
                <div>• Pre-session review of your Tibetan text</div>
                <div>• Detailed breakdown of vocabulary, grammar &amp; syntax</div>
                <div>• Line-by-line translation &amp; interpretation support</div>
                <div>• Annotated notes on the passage</div>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            4. UNIFIED REGISTRATION & LIVE CHECKOUT FORM
        ==================================================================== */}
        <section ref={formRef} className="mt-16 pt-12 border-t border-border-subtle">
          <div className="bg-brand text-ink rounded-2xl py-3 px-6 text-center font-serif text-lg sm:text-xl mb-8 shadow-2xs flex items-center justify-center gap-2">
            <Sparkles size={18} /> Limited Spots Available — Reserve Your Place
          </div>

          <div className="max-w-2xl mx-auto bg-surface border border-border-strong rounded-3xl p-6 sm:p-10 shadow-sm">
            {freeConfirmed ? (
              <div className="py-8 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="font-serif font-normal text-3xl text-ink mb-2">
                  Free Taster Session Requested!
                </h3>
                <p className="text-sm text-ink-light max-w-md mx-auto leading-relaxed mb-6">
                  Thank you, <strong>{firstName}</strong>! We have received your
                  registration and will email{" "}
                  <strong className="text-ink">{email}</strong> shortly to
                  schedule your 30-minute 1-to-1 Zoom session.
                </p>
                <button
                  type="button"
                  onClick={() => setFreeConfirmed(false)}
                  className="bg-ink text-white text-xs font-bold px-6 py-3 rounded-full cursor-pointer"
                >
                  Register for another course
                </button>
              </div>
            ) : (
              <>
                <h3 className="font-serif font-normal text-2xl sm:text-3xl text-ink mb-1">
                  {currentHero.title} Registration
                </h3>
                <p className="text-xs text-ink-muted mb-6">
                  Complete your details below. Paid courses redirect securely to
                  checkout after submission.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-muted mb-1.5">
                        First name *
                      </label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full bg-paper/50 border border-border-subtle focus:border-brand rounded-xl px-4 py-3 text-sm text-ink outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-muted mb-1.5">
                        Last name *
                      </label>
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full bg-paper/50 border border-border-subtle focus:border-brand rounded-xl px-4 py-3 text-sm text-ink outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-muted mb-1.5">
                        Phone number
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+44 ..."
                        className="w-full bg-paper/50 border border-border-subtle focus:border-brand rounded-xl px-4 py-3 text-sm text-ink outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-muted mb-1.5">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-paper/50 border border-border-subtle focus:border-brand rounded-xl px-4 py-3 text-sm text-ink outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-muted mb-1.5">
                      City / Country &amp; Time Zone (Optional)
                    </label>
                    <input
                      type="text"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      placeholder="e.g. London, UK (GMT)"
                      className="w-full bg-paper/50 border border-border-subtle focus:border-brand rounded-xl px-4 py-3 text-sm text-ink outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-muted mb-1.5">
                      Message (optional)
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us briefly about your background or preferred availability..."
                      className="w-full bg-paper/50 border border-border-subtle focus:border-brand rounded-xl p-3.5 text-sm text-ink outline-none"
                    />
                  </div>

                  {/* Course / Package Checkboxes */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-muted mb-2">
                      Choose your course *
                    </label>
                    <div className="space-y-2.5">
                      {COURSE_PACKAGES_BY_TAB[activeTab].map((pkg) => {
                        const checked = selectedPackages.includes(pkg.id);
                        return (
                          <label
                            key={pkg.id}
                            onClick={() => togglePackage(pkg.id)}
                            className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                              checked
                                ? "bg-brand-light/60 border-brand"
                                : "bg-paper/40 border-border-subtle hover:border-brand/50"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => {}}
                                className="w-4 h-4 accent-ink"
                              />
                              <span className="text-sm font-medium text-ink">
                                {pkg.label}
                              </span>
                            </div>
                            <span className="font-serif text-lg text-ink font-bold">
                              {pkg.priceLabel}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Level Dropdown */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-muted mb-1.5">
                      Choose your level *
                    </label>
                    <select
                      required
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      className="w-full bg-paper/50 border border-border-subtle focus:border-brand rounded-xl px-4 py-3 text-sm text-ink outline-none cursor-pointer"
                    >
                      <option value="">Choose one</option>
                      {LEVEL_OPTIONS.map((lvl) => (
                        <option key={lvl} value={lvl}>
                          {lvl}
                        </option>
                      ))}
                    </select>
                  </div>

                  {errorMsg && (
                    <div className="flex items-start gap-2 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl p-3.5">
                      <AlertCircle size={15} className="shrink-0 mt-0.5" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-ink hover:bg-ink-light text-white font-bold py-4 rounded-full text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />{" "}
                        Redirecting to checkout...
                      </>
                    ) : (
                      "Submit & Continue"
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </section>
      </main>

      {/* ====================================================================
          5. FOOTER
      ==================================================================== */}
      <footer className="bg-[#091e36] text-white/70 py-14 border-t border-white/10 text-center">
        <div className="max-w-4xl mx-auto px-6 flex flex-col items-center">
          // <div className="mb-5">
            // <img
              // src="/symbol_pecha_gold.png"
              // alt="Tibetan Pecha Scripture"
              // className="w-20 h-20 object-contain mx-auto opacity-95"
            // />
          // </div>
		  
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

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-white/70 mb-4">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/courses" className="text-white font-bold">
              Live Courses
            </Link>
            <Link href="/shop" className="hover:text-white transition-colors">
              Shop
            </Link>
            <Link href="/about" className="hover:text-white transition-colors">
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
          </div>
          <div className="text-[11px] text-white/45">
            © {new Date().getFullYear()} Loplao · Learn Tibetan UK
          </div>
        </div>
      </footer>
    </div>
  );
}