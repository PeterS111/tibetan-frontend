import Link from "next/link";
import { ArrowLeft, Mail, MessageCircle } from "lucide-react";

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 mb-8 transition">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">Support & Contact</h1>
          <p className="text-lg text-slate-600 leading-relaxed mb-10">
            Need assistance with your Tara AI account, encountered a bug, or have a feature request? We are here to help.
          </p>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 flex flex-col items-start">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mb-4"><Mail size={20} /></div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Email Us</h2>
              <p className="text-blue-700 font-medium mb-1">support@learntibetan.uk</p>
              <p className="text-sm text-slate-500">We typically reply within 24 hours.</p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-start">
              <div className="w-10 h-10 bg-slate-800 text-white rounded-full flex items-center justify-center mb-4"><MessageCircle size={20} /></div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">In-App Feedback</h2>
              <p className="text-slate-700 font-medium mb-1">Use the Feedback Icon</p>
              <p className="text-sm text-slate-500">Click the message bubble inside the chat app to report bugs directly.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}