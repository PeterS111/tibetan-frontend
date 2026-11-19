// app/dashboard/practice/page.tsx

"use client";

import { useUser, useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { usePlatform } from "@/hooks/usePlatform";

import { WebPractice } from "@/app/components/dashboard/WebPractice";
import { MobilePractice } from "@/app/components/dashboard/MobilePractice";
import { FALLBACK_MODULES, isPracticeEligibleModule } from "@/app/data/syllabus";


export default function PracticeHubRouter() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const { isNative } = usePlatform();

  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch the modules data safely with fallback behavior
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
          if (data.modules && data.modules.length > 0) setModules(data.modules);
          else setModules(FALLBACK_MODULES);
        }
      } catch(e) {
        if (isMounted) setModules(FALLBACK_MODULES);
      } finally {
        if (isMounted) setLoading(false);
        clearTimeout(safetyTimer);
      }
    };
    
    fetchData();
    return () => { isMounted = false; clearTimeout(safetyTimer); };
  }, [user, isLoaded, getToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 size={40} className="animate-spin text-brand" />
      </div>
    );
  }

  // Filter out Unit 7 (Capstone) as it does not have a Practice Suite
  const visibleModules = modules
    .filter(m => isPracticeEligibleModule(m.module_id))
    .sort((a, b) => Number(a.module_id) - Number(b.module_id));

  if (isNative) {
    return <MobilePractice modules={visibleModules} />;
  }

  return <WebPractice modules={visibleModules} />;
}