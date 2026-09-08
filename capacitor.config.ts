import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.learntibetan.app',
  appName: 'Learn Tibetan',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  }
};

export default config;