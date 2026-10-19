import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.learntibetan.app',
  appName: 'Learn Tibetan',
  webDir: 'out',
  plugins: {
    CapacitorCookies: {
      enabled: true,
    },
    SplashScreen: {
      launchAutoHide: false,      // We will hide it manually via code!
      backgroundColor: "#FAF6EC", // Matches your app's bg-paper
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    }
  },
  server: {
    androidScheme: 'https',
    iosScheme: 'https'
  }
};

export default config;