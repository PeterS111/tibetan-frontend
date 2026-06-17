import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 mb-8 transition">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200 prose prose-slate max-w-none">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">Privacy Policy</h1>
          <p className="text-sm text-slate-500 mb-8">Last Updated: June 2026</p>
          
          <h3 className="text-xl font-bold mt-6 mb-3">1. Information We Collect</h3>
          <p className="mb-4">We collect information you provide directly to us when you create an account, such as your email address (via Clerk Auth), and the chat messages/audio queries you submit to the AI tutor.</p>
          
          <h3 className="text-xl font-bold mt-6 mb-3">2. How We Use Your Data</h3>
          <p className="mb-4">Your text and voice prompts are securely processed by our AI engines (Google Gemini and our custom Hugging Face TTS endpoints) solely to provide language tutoring responses. We store your chat history in our secure Supabase database so you can access your past study sessions.</p>
          
          <h3 className="text-xl font-bold mt-6 mb-3">3. Data Sharing</h3>
          <p className="mb-4">We do not sell your personal data. Chat prompts are sent to third-party AI providers (Google) via secure API exclusively for processing the conversation. Audio dictation uses your device's native Web Speech API.</p>
          
          <h3 className="text-xl font-bold mt-6 mb-3">4. Contact</h3>
          <p>For questions about this policy, contact us at support@learntibetan.uk.</p>
        </div>
      </div>
    </div>
  );
}