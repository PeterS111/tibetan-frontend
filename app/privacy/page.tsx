"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#fdfbf7] text-stone-800 font-sans selection:bg-amber-200">
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-amber-600 hover:text-amber-700 mb-10 transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <div className="bg-white p-8 md:p-14 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#e8e4d9]">
          <h1 className="text-4xl md:text-5xl font-medium text-stone-900 font-serif mb-4 tracking-tight">Privacy Policy</h1>
          <p className="text-[11px] font-bold text-stone-400 uppercase tracking-[0.2em] mb-12">Last Updated: July 2026</p>
          
          <div className="space-y-10 text-stone-600 leading-relaxed">
            
            <section>
              <h3 className="text-2xl font-serif font-medium text-stone-900 mb-4">1. Information We Collect</h3>
              <p>We collect information you provide directly to us when you create an account, such as your name and email address (via secure Clerk Authentication). We also collect the educational data generated during your sessions, including chat text messages, temporary voice recordings submitted to the AI tutor, and your curriculum progress metrics.</p>
            </section>
            
            <section>
              <h3 className="text-2xl font-serif font-medium text-stone-900 mb-4">2. How We Use Your Data</h3>
              <p>Your text and voice prompts are securely processed to provide real-time language tutoring responses and pronunciation feedback. We store your chat history, vocabulary retention, and learning streaks in our secure Supabase database so you can seamlessly resume past study sessions and track your progress.</p>
            </section>
            
            <section>
              <h3 className="text-2xl font-serif font-medium text-stone-900 mb-4">3. Third-Party Data Processors and Artificial Intelligence</h3>
              <p className="mb-4">To provide our core educational services, including the "Dolma AI Tutor" and speech-to-text dictation functionalities, we utilize several third-party service providers. By using our interactive features, you acknowledge that your inputs (text and audio) are processed securely by these entities:</p>
              <ul className="list-disc pl-6 space-y-3 mb-6 marker:text-amber-400">
                <li><strong className="text-stone-800 font-bold">Google (Gemini API):</strong> We use Google's API to process your chat messages and transcribe your voice recordings. The audio data and text you submit to the Dolma AI tutor are securely transmitted to Google strictly for real-time analysis and response generation.</li>
                <li><strong className="text-stone-800 font-bold">Hugging Face & Meta AI (MMS):</strong> To generate authentic Tibetan audio pronunciations, text outputs from the AI are sent to secure, hosted instances of Meta's Massively Multilingual Speech (MMS) models via Hugging Face.</li>
                <li><strong className="text-stone-800 font-bold">Microsoft (Edge TTS):</strong> We utilize Microsoft's text-to-speech services to generate the audio for your chosen base language (e.g., English, Spanish, etc.).</li>
                <li><strong className="text-stone-800 font-bold">Clerk & Supabase:</strong> We use Clerk for secure user authentication and account management, and Supabase for database hosting (which securely stores your curriculum progress, vocabulary metrics, and chat history).</li>
              </ul>
              <div className="bg-amber-50 border border-amber-200 p-5 rounded-xl text-amber-900">
                <strong className="font-bold">Data Training Restriction:</strong> We strictly configure our enterprise API agreements with these AI providers to ensure that your personal conversational data and audio recordings are utilized exclusively to provide our service to you. Your personal data is <strong>not</strong> used by Google, Meta, or Microsoft to train their public foundational AI models.
              </div>
            </section>
            
            <section>
              <h3 className="text-2xl font-serif font-medium text-stone-900 mb-4">4. Data Sharing and Security</h3>
              <p>We do not and will never sell your personal data. Chat prompts and voice data are sent to our third-party AI providers exclusively for real-time processing via secure, encrypted APIs. Voice recordings are processed temporarily for transcription and are not permanently stored on our servers.</p>
            </section>
            
            <section>
              <h3 className="text-2xl font-serif font-medium text-stone-900 mb-4">5. Contact</h3>
              <p>For questions about this policy, or to request the deletion of your account and associated data, please contact us at <a href="mailto:support@learntibetan.uk" className="text-amber-600 hover:text-amber-700 font-bold transition-colors">support@learntibetan.uk</a>.</p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}