"use client";
import { Wrench } from "lucide-react";

export default function ProgressPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] p-8 text-center animate-in fade-in duration-500">
      <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mb-6 text-stone-400">
        <Wrench size={32} />
      </div>
      <h1 className="text-3xl font-bold font-serif text-stone-900 mb-3">Advanced Analytics Coming Soon</h1>
      <p className="text-stone-500 max-w-md mx-auto">
        A deep dive into your language progression, time tracking, and known vocabulary will be available on this page shortly.
      </p>
    </div>
  );
}