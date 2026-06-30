"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { FileText, Download, BookOpen, Volume2, Loader2, Library, AlertTriangle } from "lucide-react";

type Material = {
  title: string;
  type: string;
  size: string;
  url: string;
  desc: string;
};

export default function MaterialsPage() {
  const { getToken, userId, isLoaded } = useAuth();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaterials = async () => {
      if (isLoaded && userId) {
        try {
          const token = await getToken();
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/materials`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          
          if (data.error) {
            setErrorMsg(data.error);
          } else if (data.materials) {
            setMaterials(data.materials);
          }
        } catch (e: any) {
          setErrorMsg(e.message || "Network connection failed.");
        }
        setIsLoading(false);
      }
    };
    fetchMaterials();
  }, [isLoaded, userId, getToken]);

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8 pb-24 animate-in fade-in duration-500">
      
      <div className="mb-10">
        <h2 className="text-[11px] font-bold text-amber-600 uppercase tracking-[0.2em] mb-3">Library</h2>
        <h1 className="text-3xl md:text-4xl font-bold font-serif text-stone-900 border-b border-[#e8e4d9] pb-6 flex items-center gap-3">
          <Library className="text-amber-500" size={32} /> Textbook Materials
        </h1>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-[40vh] text-stone-500">
          <Loader2 size={40} className="animate-spin text-amber-500 mb-4" />
          <p className="font-bold font-serif text-lg">Loading library...</p>
        </div>
      ) : errorMsg ? (
        <div className="flex flex-col items-center justify-center h-[40vh] bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center">
          <AlertTriangle size={40} className="text-rose-500 mb-4" />
          <h2 className="text-xl font-bold font-serif text-rose-800 mb-2">Failed to load materials</h2>
          <p className="text-rose-600 text-sm max-w-md font-mono bg-rose-100 p-3 rounded-lg border border-rose-200">
            {errorMsg}
          </p>
        </div>
      ) : materials.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[40vh] bg-white border border-[#e8e4d9] rounded-2xl border-dashed">
          <BookOpen size={40} className="text-stone-300 mb-4" />
          <h2 className="text-xl font-bold font-serif text-stone-700 mb-2">The library is empty</h2>
          <p className="text-stone-500 text-sm max-w-sm text-center">
            The professor hasn't uploaded any syllabus PDFs or audio files to the repository yet.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {materials.map((res, i) => (
            <div key={i} className="bg-white border border-[#e8e4d9] p-6 rounded-2xl hover:border-amber-400 hover:shadow-md transition-all duration-300 flex flex-col group">
              
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-xl transition-colors ${res.type === "PDF" ? "bg-rose-50 text-rose-600 group-hover:bg-rose-100" : res.type === "AUDIO" ? "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100" : "bg-stone-50 text-stone-600 group-hover:bg-stone-100"}`}>
                  {res.type === "PDF" ? <FileText size={24} /> : res.type === "AUDIO" ? <Volume2 size={24} /> : <BookOpen size={24} />}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{res.type}</span>
              </div>
              
              <h3 className="text-xl font-bold text-stone-800 mb-2 font-serif capitalize">{res.title}</h3>
              <p className="text-sm text-stone-500 mb-6 flex-1 font-medium">{res.desc}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-[#e8e4d9]">
                <a href={res.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors bg-amber-50 hover:bg-amber-100 px-4 py-2 rounded-lg">
                  <Download size={16} /> Download
                </a>
                <span className="text-xs font-bold text-stone-400 bg-stone-50 px-2 py-1 rounded">{res.size}</span>
              </div>
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
}