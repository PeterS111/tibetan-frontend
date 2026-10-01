import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.learntibetan.app',
  appName: 'Learn Tibetan',
  webDir: 'out',
  plugins: {
    CapacitorCookies: {
      enabled: true,
    },
  },
  server: {
    androidScheme: 'https',
    iosScheme: 'https'
  }
};

export default config;