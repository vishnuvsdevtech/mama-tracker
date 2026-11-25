import type { CapacitorConfig } from '@capacitor/cli'

/**
 * The web app, wrapped. `webDir` points at the Vite build, so the iOS shell ships
 * exactly the same HTML/CSS/JS that GitHub Pages serves — one codebase, two homes.
 *
 * Everything the app stores stays on the device: Preferences maps to UserDefaults
 * on iOS, which survives where WKWebView's localStorage can be evicted under
 * storage pressure — the reason a pregnancy record should not live in localStorage
 * on a phone.
 */
const config: CapacitorConfig = {
  appId: 'com.vishnuvsdevtech.mamatracker',
  appName: 'Nine months',
  webDir: 'dist',
  ios: {
    contentInset: 'never',
    backgroundColor: '#FFF3F6',
  },
  plugins: {
    Preferences: { group: 'mama' },
  },
}

export default config
