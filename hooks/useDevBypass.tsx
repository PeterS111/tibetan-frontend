// hooks/useDevBypass.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { usePathname, useRouter } from "next/navigation";
import { usePlatform } from "@/hooks/usePlatform";

interface DevBypassContextValue {
  isDevApproved: boolean;
  isPreviewingStudent: boolean;
  isDevUnlocked: boolean;
  isPaymentsOwner: boolean;
  isChecking: boolean;
  setPreviewAsStudent: (preview: boolean) => Promise<{ ok: boolean; error?: string }>;
}

const DevBypassContext = createContext<DevBypassContextValue>({
  isDevApproved: false,
  isPreviewingStudent: false,
  isDevUnlocked: false,
  isPaymentsOwner: false,
  isChecking: true,
  setPreviewAsStudent: async () => ({ ok: false, error: "Not initialized" }),
});

export function DevBypassProvider({ children }: { children: ReactNode }) {
  const { user, isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const { isNative } = usePlatform();

  const [isDevApproved, setIsDevApproved] = useState<boolean>(false);
  const [isPreviewingStudent, setIsPreviewingStudent] = useState<boolean>(false);
  const [isPaymentsOwner, setIsPaymentsOwner] = useState<boolean>(false);
  const [modules, setModules] = useState<any[]>([]);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  const isDevUnlocked = isDevApproved && !isPreviewingStudent;

  const approvedKey = user?.id ? `tibetan_dev_approved_${user.id}` : null;
  const previewKey = user?.id ? `tibetan_dev_preview_${user.id}` : null;
  const ownerStorageKey = user?.id ? `tibetan_payments_owner_${user.id}` : null;

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn || !user) {
      setIsDevApproved(false);
      setIsPreviewingStudent(false);
      setIsPaymentsOwner(false);
      setIsChecking(false);
      return;
    }

    if (typeof window !== "undefined") {
      if (approvedKey && localStorage.getItem(approvedKey) === "true") {
        setIsDevApproved(true);
      }
      if (previewKey && localStorage.getItem(previewKey) === "true") {
        setIsPreviewingStudent(true);
      }
      if (ownerStorageKey && localStorage.getItem(ownerStorageKey) === "true") {
        setIsPaymentsOwner(true);
      }
    }

    let isMounted = true;
    const syncStatus = async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/progress?user_id=${user.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (!isMounted) return;

        const approved = Boolean(
          data?.profile?.is_dev_approved ?? data?.profile?.is_dev_unlocked
        );
        const previewing = Boolean(data?.profile?.dev_preview_student) && approved;
        const owner = Boolean(data?.profile?.is_payments_owner);

        setIsDevApproved(approved);
        setIsPreviewingStudent(previewing);
        setIsPaymentsOwner(owner);

        if (Array.isArray(data?.modules)) {
          setModules(data.modules);
        }
        if (typeof window !== "undefined") {
          if (approvedKey) {
            localStorage.setItem(approvedKey, approved ? "true" : "false");
          }
          if (previewKey) {
            localStorage.setItem(previewKey, previewing ? "true" : "false");
          }
          if (ownerStorageKey) {
            localStorage.setItem(ownerStorageKey, owner ? "true" : "false");
          }
        }
      } catch {
        // Keep cached state if offline
      } finally {
        if (isMounted) setIsChecking(false);
      }
    };

    syncStatus();
    return () => {
      isMounted = false;
    };
  }, [user, isLoaded, isSignedIn, getToken, approvedKey, previewKey, ownerStorageKey]);

  // Global URL Route Guards
  useEffect(() => {
    if (isChecking || !pathname) return;

    // 1. Owner Vault: strictly restricted to Payments Owners
    if (pathname.startsWith("/dashboard/payments")) {
      if (!isPaymentsOwner) {
        router.replace("/dashboard");
      }
      return;
    }

    // 2. Developer-only AI Tutor & standard lesson locks
    if (isDevUnlocked) return;

    if (pathname.startsWith("/dashboard/ai-tutor") || pathname === "/dashboard/ai") {
      router.replace("/dashboard");
      return;
    }

    if (modules.length === 0) return;

    const lessonMatch = pathname.match(/^\/dashboard\/lessons\/(\d+)/);
    if (lessonMatch) {
      const targetId = parseInt(lessonMatch[1], 10);
      if (targetId > 1) {
        const targetMod = modules.find((m) => Number(m.module_id) === targetId);
        if (!targetMod || targetMod.status === "locked") {
          router.replace(isNative ? "/dashboard/lessons" : "/dashboard");
          return;
        }
      }
    }

    if (pathname.startsWith("/dashboard/certificate")) {
      const mod7 = modules.find((m) => Number(m.module_id) === 7);
      if (!mod7 || mod7.status !== "completed") {
        router.replace("/dashboard");
      }
    }
  }, [pathname, isChecking, isDevUnlocked, isPaymentsOwner, modules, router, isNative]);

  const setPreviewAsStudent = useCallback(
    async (preview: boolean): Promise<{ ok: boolean; error?: string }> => {
      try {
        const token = await getToken();
        if (!token) return { ok: false, error: "Authentication token unavailable." };

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/dev-mode/preview`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ preview_student: preview }),
          }
        );
        const data = await res.json();

        if (!res.ok) {
          return { ok: false, error: data?.error || "Could not update preview mode." };
        }

        const nextPreview = Boolean(data?.dev_preview_student);
        setIsPreviewingStudent(nextPreview);
        if (typeof window !== "undefined" && previewKey) {
          localStorage.setItem(previewKey, nextPreview ? "true" : "false");
        }
        return { ok: true };
      } catch {
        return { ok: false, error: "Could not reach server. Please try again." };
      }
    },
    [getToken, previewKey]
  );

  return (
    <DevBypassContext.Provider
      value={{
        isDevApproved,
        isPreviewingStudent,
        isDevUnlocked,
        isPaymentsOwner,
        isChecking,
        setPreviewAsStudent,
      }}
    >
      {children}
    </DevBypassContext.Provider>
  );
}

export function useDevBypass() {
  return useContext(DevBypassContext);
}
