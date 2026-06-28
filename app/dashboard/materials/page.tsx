"use client";

import { FileText, Download, BookOpen, Volume2 } from "lucide-react";

export default function MaterialsPage() {
  const resources = [
    { type: "PDF", title: "Franziska Oertle: Beginner Reference", desc: "The complete textbook foundations. 48 pages.", size: "3.2 MB" },
    { type: "PDF", title: "Unit 3 Vocabulary List", desc: "Printable vocabulary list for Relations & Proximity.", size: "1.1 MB" },
    { type: "AUDIO", title: "Pronunciation Drills (Vowels)", desc: "12 minutes of native speaker pronunciation.", size: "Audio" },
    { type: "GRAMMAR", title: "Grammar Notes: The Ergative Case", desc: "Detailed breakdown of the agentive particle.", size: "8 Min Read" },
  ];

  return (
    <div className="max-w-5xl mx-auto p-8 pb-24 animate-in fade-in duration-500">
      <div className="mb-10">
        <h2 className="text-[11px] font-bold text-amber-600 uppercase tracking-[0.2em] mb-3">Library</h2>
        <h1 className="text-3xl md:text-4xl font-bold font-serif text-stone-900 border-b border-[#e8e4d9] pb-6">
          Textbook Materials
        </h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {resources.map((res, i) => (
          <div key={i} className="bg-white border border-[#e8e4d9] p-6 rounded-2xl hover:border-amber-300 transition-colors flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-stone-50 text-amber-700 rounded-lg">
                {res.type === "PDF" ? <FileText size={20} /> : res.type === "AUDIO" ? <Volume2 size={20} /> : <BookOpen size={20} />}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{res.type}</span>
            </div>
            
            <h3 className="text-xl font-bold text-stone-800 mb-2 font-serif">{res.title}</h3>
            <p className="text-sm text-stone-500 mb-6 flex-1">{res.desc}</p>
            
            <div className="flex items-center justify-between pt-4 border-t border-[#e8e4d9]">
              <button className="flex items-center gap-2 text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors">
                <Download size={16} /> Download
              </button>
              <span className="text-xs font-medium text-stone-400">{res.size}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}