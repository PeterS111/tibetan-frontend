import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 mb-8 transition">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-lg text-slate-600">Start learning for free. Upgrade when you are ready to master the language.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Free Tier */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Basic Scholar</h2>
            <div className="text-4xl font-extrabold text-slate-900 mb-6">Free</div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-slate-600"><Check size={20} className="text-green-500" /> Basic Quick Chat Access</li>
              <li className="flex items-center gap-3 text-slate-600"><Check size={20} className="text-green-500" /> Standard English/Tibetan Audio</li>
              <li className="flex items-center gap-3 text-slate-600"><Check size={20} className="text-green-500" /> 10 Messages per Day</li>
            </ul>
            <Link href="/" className="text-center w-full bg-slate-100 text-slate-800 font-bold py-3 rounded-xl hover:bg-slate-200 transition">Current Plan</Link>
          </div>

          {/* Pro Tier */}
          <div className="bg-blue-600 p-8 rounded-3xl shadow-xl border border-blue-500 flex flex-col text-white relative transform md:-translate-y-4">
            <div className="absolute top-0 right-6 transform -translate-y-1/2 bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm">Recommended</div>
            <h2 className="text-2xl font-bold mb-2">Master Yogi</h2>
            <div className="text-4xl font-extrabold mb-6">£15<span className="text-lg font-medium text-blue-200">/mo</span></div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-blue-50"><Check size={20} className="text-green-300" /> Unlimited Quick Chat</li>
              <li className="flex items-center gap-3 text-blue-50"><Check size={20} className="text-green-300" /> Full Syllabus Study Book Access</li>
              <li className="flex items-center gap-3 text-blue-50"><Check size={20} className="text-green-300" /> Custom Text Analysis Mode</li>
              <li className="flex items-center gap-3 text-blue-50"><Check size={20} className="text-green-300" /> Priority Server Processing</li>
            </ul>
            <button className="w-full bg-white text-blue-700 font-bold py-3 rounded-xl hover:bg-slate-50 shadow-md transition">Subscribe Now</button>
          </div>
        </div>
      </div>
    </div>
  );
}