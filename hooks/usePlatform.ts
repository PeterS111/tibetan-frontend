// hooks/usePlatform.ts
import { useEffect, useLayoutEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function usePlatform() {
  // Default to false during static HTML export build
  const [isNative, setIsNative] = useState<boolean>(false);
  const [isCapacitor, setIsCapacitor] = useState<boolean>(false);
  const [platform, setPlatform] = useState<string>("web");
  const [isReady, setIsReady] = useState<boolean>(false);

  useIsoLayoutEffect(() => {
    const capNative = Capacitor.isNativePlatform();
    const capPlatform = Capacitor.getPlatform(); // 'web', 'ios', or 'android'

    setIsCapacitor(capNative);
    setPlatform(capPlatform);

    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const checkIsMobileExperience = () => {
      // Detect mobile phone user-agents (iPhone, Android phones, in-app browsers)
      // Excludes iPads/tablets unless their viewport is phone-sized (< 768px)
      const isMobilePhoneUA =
        /Android.*Mobile|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent || ""
        );

      setIsNative(capNative || isMobilePhoneUA || mediaQuery.matches);
      setIsReady(true);
    };

    checkIsMobileExperience();

    // Listen for viewport changes (e.g., testing mobile view on PC browser)
    mediaQuery.addEventListener("change", checkIsMobileExperience);
    return () => {
      mediaQuery.removeEventListener("change", checkIsMobileExperience);
    };
  }, []);

  return { isNative, isCapacitor, platform, isReady };
}