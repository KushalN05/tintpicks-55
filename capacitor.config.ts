import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.caa761b3130843fd9a147e6cfc880877',
  appName: 'tintpicks',
  webDir: 'dist',
  server: {
    url: 'https://caa761b3-1308-43fd-9a14-7e6cfc880877.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#F8FAFC",
      showSpinner: false
    }
  }
};

export default config;