import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-[100dvh] bg-slate-50 text-slate-800 p-6 md:p-12">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Navigation back to home */}
        <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition font-semibold">
          <ArrowLeft size={20} /> Back to Tutor
        </Link>

        {/* Page Content */}
        <h1 className="text-4xl font-bold text-slate-900">About Learn Tibetan UK</h1>
        <p className="text-lg leading-relaxed text-slate-700">
          Welcome to the our Tibetan Language AI Tutor. Our platform uses state-of-the-art AI and text-to-speech technology to help you practice and learn conversational Tibetan seamlessly.
        </p>
      </div>
    </main>
  );
}