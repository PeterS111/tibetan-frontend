// app/dashboard/lessons/page.tsx
"use client";

import { useUser, useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { MobileLessons } from "@/app/components/dashboard/MobileLessons";
import { FALLBACK_MODULES, mergeWithFallbackModules } from "@/app/data/syllabus";


export default function LessonsPageRouter() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();

  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch the modules data
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      if (!isLoaded) return;
      if (isLoaded && !user) {
         if (isMounted) { setModules(FALLBACK_MODULES); setLoading(false); }
         return;
      }
      try {
        const token = await getToken();
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/progress?user_id=${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (isMounted) {
          if (data.modules && data.modules.length > 0) setModules(mergeWithFallbackModules(data.modules));
          else setModules(FALLBACK_MODULES);
        }
      } catch(e) {
        if (isMounted) setModules(FALLBACK_MODULES);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, [user, isLoaded, getToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 size={40} className="animate-spin text-brand" />
      </div>
    );
  }

  return <MobileLessons modules={modules} />;
}