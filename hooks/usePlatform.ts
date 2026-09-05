// hooks/usePlatform.ts
import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';

export function usePlatform() {
  // Default to false for SSR safety
  const [isNative, setIsNative] = useState<boolean>(false);
  const [platform, setPlatform] = useState<string>('web');

  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform());
    setPlatform(Capacitor.getPlatform()); // returns 'web', 'ios', or 'android'
  }, []);

  return { isNative, platform };
}