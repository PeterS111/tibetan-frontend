import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 mb-8 transition">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200 prose prose-slate max-w-none">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">Terms of Service</h1>
          <p className="text-sm text-slate-500 mb-8">Last Updated: June 2026</p>
          
          <h3 className="text-xl font-bold mt-6 mb-3">1. Acceptance of Terms</h3>
          <p className="mb-4">By accessing or using Learn Tibetan UK (Dolma AI), you agree to be bound by these Terms. If you do not agree, please do not use the service.</p>
          
          <h3 className="text-xl font-bold mt-6 mb-3">2. AI-Generated Content</h3>
          <p className="mb-4">Dolma AI utilizes generative artificial intelligence. While we strive for high accuracy in grammar, translation, and pronunciation, the AI can make mistakes. You acknowledge that AI output should be used as a study aid and not an infallible source.</p>
          
          <h3 className="text-xl font-bold mt-6 mb-3">3. User Conduct</h3>
          <p className="mb-4">You agree not to use the platform to generate harmful, illegal, or abusive content. We reserve the right to suspend accounts that abuse the platform or attempt to bypass rate limits.</p>
          
          <h3 className="text-xl font-bold mt-6 mb-3">4. Account Access</h3>
          <p>Currently, the platform operates on an invite/approved basis. We reserve the right to terminate or suspend access to our service immediately, without prior notice, for any reason whatsoever.</p>
        </div>
      </div>
    </div>
  );
}