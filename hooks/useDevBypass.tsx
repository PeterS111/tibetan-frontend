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
  isDevUnlocked: boolean;
  isPaymentsOwner: boolean;
  isChecking: boolean;
  unlockDevBypass: (password: string) => Promise<{ ok: boolean; error?: string }>;
  lockDevBypass: () => Promise<void>;
}

const DevBypassContext = createContext<DevBypassContextValue>({
  isDevUnlocked: false,
  isPaymentsOwner: false,
  isChecking: true,
  unlockDevBypass: async () => ({ ok: false, error: "Not initialized" }),
  lockDevBypass: async () => {},
});

export function DevBypassProvider({ children }: { children: ReactNode }) {
  const { user, isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const { isNative } = usePlatform();

  const [isDevUnlocked, setIsDevUnlocked] = useState<boolean>(false);
  const [isPaymentsOwner, setIsPaymentsOwner] = useState<boolean>(false);
  const [modules, setModules] = useState<any[]>([]);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  const storageKey = user?.id ? `tibetan_dev_unlocked_${user.id}` : null;
  const ownerStorageKey = user?.id ? `tibetan_payments_owner_${user.id}` : null;

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn || !user) {
      setIsDevUnlocked(false);
      setIsPaymentsOwner(false);
      setIsChecking(false);
      return;
    }

    if (typeof window !== "undefined") {
      if (storageKey && localStorage.getItem(storageKey) === "true") {
        setIsDevUnlocked(true);
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

        const unlocked = Boolean(data?.profile?.is_dev_unlocked);
        const owner = Boolean(data?.profile?.is_payments_owner);
        setIsDevUnlocked(unlocked);
        setIsPaymentsOwner(owner);

        if (Array.isArray(data?.modules)) {
          setModules(data.modules);
        }
        if (typeof window !== "undefined") {
          if (storageKey) {
            localStorage.setItem(storageKey, unlocked ? "true" : "false");
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
  }, [user, isLoaded, isSignedIn, getToken, storageKey, ownerStorageKey]);

  // Global URL Route Guards
  useEffect(() => {
    if (isChecking || !pathname) return;

    // 1. Payments Vault: strictly restricted to Payments Owners (Developer Bypass does NOT grant access!)
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

  const unlockDevBypass = useCallback(
    async (password: string): Promise<{ ok: boolean; error?: string }> => {
      try {
        const token = await getToken();
        if (!token) return { ok: false, error: "Authentication token unavailable." };

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/dev-bypass/unlock`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ password }),
          }
        );
        const data = await res.json();

        if (!res.ok) {
          return { ok: false, error: data?.error || "Incorrect developer password." };
        }

        setIsDevUnlocked(true);
        if (typeof window !== "undefined" && storageKey) {
          localStorage.setItem(storageKey, "true");
        }
        return { ok: true };
      } catch {
        return { ok: false, error: "Could not reach server. Please try again." };
      }
    },
    [getToken, storageKey]
  );

  const lockDevBypass = useCallback(async () => {
    setIsDevUnlocked(false);
    if (typeof window !== "undefined" && storageKey) {
      localStorage.setItem(storageKey, "false");
    }
    try {
      const token = await getToken();
      if (!token) return;
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dev-bypass/lock`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {}
  }, [getToken, storageKey]);

  return (
    <DevBypassContext.Provider
      value={{ isDevUnlocked, isPaymentsOwner, isChecking, unlockDevBypass, lockDevBypass }}
    >
      {children}
    </DevBypassContext.Provider>
  );
}

export function useDevBypass() {
  return useContext(DevBypassContext);
}
