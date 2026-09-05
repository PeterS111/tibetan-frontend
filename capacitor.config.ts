import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.learntibetan.app',
  appName: 'Learn Tibetan',
  webDir: 'public', 
  server: {
    url: 'http://localhost:3000',
    cleartext: true,
    allowNavigation: ['*'] // <-- THIS KEEPS ALL REDIRECTS INSIDE THE APP
  }
};

export default config;