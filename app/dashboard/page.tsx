// app/dashboard/page.tsx
"use client";

import { useUser, useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { usePlatform } from "@/hooks/usePlatform";

import { WebDashboard } from "../components/dashboard/WebDashboard";
import { MobileHome } from "../components/dashboard/MobileHome";

// ... Keep your FALLBACK_MODULES definition ...
const FALLBACK_MODULES = [
  { id: 1, module_id: 1, title: "The 30 Consonants", description: "The foundation of the Tibetan alphabet, script, tones, and essential root vocabulary.", progress: 0, status: "active", lesson_count: 8 },
  { id: 2, module_id: 2, title: "The Four Vowels", description: "The four diacritic marks, their shapes, positions, pronunciation, and spelling math.", progress: 0, status: "locked", lesson_count: 7 },
  { id: 3, module_id: 3, title: "The Three Superscripts", description: "The superscripts ར, ལ, and ས, their consonant combinations, tone changes, and vocabulary.", progress: 0, status: "locked", lesson_count: 5 },
  { id: 4, module_id: 4, title: "The Four Subscripts", description: "The Subscripts (ya-ra-la-wa) and their complex sound shifts.", progress: 0, status: "locked", lesson_count: 6 },
  { id: 5, module_id: 5, title: "The Prefix Letters", description: "The five prefix letters and their complex role in Tibetan spelling and pronunciation.", progress: 0, status: "locked", lesson_count: 7 },
  { id: 6, module_id: 6, title: "The Suffix Letters", description: "The ten suffix letters and the two secondary suffixes.", progress: 0, status: "locked", lesson_count: 9 },
  { id: 7, module_id: 7, title: "Final Assessment", description: "A short mixed assessment drawing on every step so far. Score 80% or higher to pass.", progress: 0, status: "locked", lesson_count: 3 }
];

export default function UnifiedDashboard() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const { isNative } = usePlatform(); // <-- THE MAGIC ROUTER

  const [profile, setProfile] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // --- DATA FETCHING (The Shared Brain) ---
  useEffect(() => {
    let isMounted = true;
    const safetyTimer = setTimeout(() => {
      if (isMounted) { setModules(FALLBACK_MODULES); setLoading(false); }
    }, 2000);

    const fetchData = async () => {
      if (!isLoaded) return;
      if (isLoaded && !user) {
         if (isMounted) { setModules(FALLBACK_MODULES); setLoading(false); }
         clearTimeout(safetyTimer); return;
      }
      if (isLoaded && user) {
        try {
          const token = await Promise.race([
            getToken(),
            new Promise((_, reject) => setTimeout(() => reject(new Error("Token timeout")), 1500))
          ]);
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/progress?user_id=${user.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          if (isMounted) {
            if (data.profile) setProfile(data.profile);
            if (data.modules && Array.isArray(data.modules) && data.modules.length > 0) {
              setModules(data.modules);
            } else {
              setModules(FALLBACK_MODULES);
            }
          }
        } catch(e) {
          if (isMounted) setModules(FALLBACK_MODULES);
        } finally {
          if (isMounted) setLoading(false);
          clearTimeout(safetyTimer);
        }
      }
    };
    fetchData();
    return () => { isMounted = false; clearTimeout(safetyTimer); };
  }, [user, isLoaded, getToken]);

  if (loading) return <div className="flex items-center justify-center h-[60vh]"><Loader2 size={40} className="animate-spin text-brand" /></div>;

  // Calculate logic once
  const visibleModules = [...modules].sort((a, b) => Number(a.module_id) - Number(b.module_id));
  const nextModule = visibleModules.find(m => m.status !== "completed") || visibleModules[visibleModules.length - 1] || FALLBACK_MODULES[0];
  const wordsKnown = profile?.words_known || 0;

  // --- RENDERING (The Different Bodies) ---
  if (isNative) {
    return <MobileHome nextModule={nextModule} profile={profile} />;
  }

  return <WebDashboard modules={visibleModules} nextModule={nextModule} wordsKnown={wordsKnown} />;
}