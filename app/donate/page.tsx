import Link from "next/link";
import { ArrowLeft, Heart, Coffee } from "lucide-react";

export default function DonatePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 mb-8 transition">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Heart size={32} className="fill-red-500" />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4">Support Our Mission</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Tara AI is built with passion and is currently 100% free to use. Running advanced AI models and voice generation costs money. If this tool has helped you learn Tibetan, consider supporting our development!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Tip Jar Placeholder */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4"><Coffee size={24} /></div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Tip Jar</h2>
            <p className="text-slate-600 mb-8 flex-1">Make a one-time donation to buy us a coffee and help keep the servers running.</p>
            <button disabled className="w-full bg-slate-100 text-slate-400 font-bold py-3 rounded-xl cursor-not-allowed border border-slate-200">
              Coming Soon
            </button>
          </div>

          {/* Patreon Placeholder */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4"><Heart size={24} /></div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Patreon</h2>
            <p className="text-slate-600 mb-8 flex-1">Become a monthly supporter and get behind-the-scenes updates on our upcoming features.</p>
            <button disabled className="w-full bg-slate-100 text-slate-400 font-bold py-3 rounded-xl cursor-not-allowed border border-slate-200">
              Coming Soon
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}