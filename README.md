# Nine months, organised

A private pregnancy-to-parenting companion. React + Vite + TypeScript, with React Router for pages and Motion for animation.
Everything is saved in the browser through one async file (`src/lib/storage.ts`). There's no account, no server and no tracking.

## Run it

```bash
npm install
npm run dev            # http://localhost:5173/mama-tracker/
npm run build          # production build in dist/ (plus 404.html so deep links work on GitHub Pages)
npm run build:preview  # one self-contained HTML file in dist-preview/ (in-memory routes)
```

## Routes

| Path | Page |
|---|---|
| `/` | Landing page with the interactive baby and the week slider |
| `/start/hello` → `you` → `look` → `when` → `baby` → `likes` → `ready` | Onboarding |
| `/start/<step>?edit=1` | Edit a single onboarding step from the profile page |
| `/home` | Her home: week, size, progress ring, facts, her tools in the order she picked |
| `/profile` | Profile summary, edit links, start over |

## Where things live

```
src/
  lib/storage.ts         the only file that touches localStorage (swap it for a backend later)
  lib/profile.ts         Profile type, avatar options, date arithmetic (week, due date, baby's age)
  lib/weeks.ts           fruit sizes, weekly facts, month → week mapping
  lib/ProfileContext.tsx saved profile + onboarding draft
  components/WombBaby    animated baby in a bubble (theme, accessory, skin, scale, tap-to-hello)
  components/MamaAvatar  avatar builder output (hair, skin, hair or scarf colour, outfit, bump)
  pages/                 Landing, Onboarding, Home, Profile
```

## Deploy (GitHub Pages)

1. Push to `main` in the `mama-tracker` repo.
2. In GitHub, go to **Settings → Pages → Source** and choose **GitHub Actions**.
3. `.github/workflows/deploy.yml` builds the app and publishes it to `https://<user>.github.io/mama-tracker/`.

If the repo name changes, update `base` in `vite.config.ts`.

## What this app does not do

It doesn't diagnose, give medicine information, check symptoms, or guess the baby's sex. In India, revealing the baby's sex before birth is prohibited under the PCPNDT Act. Every number it shows is arithmetic on a date she typed.

## iOS

Two ways to get this onto a phone. The first works today and costs nothing; the
second is a real app, and needs a Mac.

### 1. Installed web app (no App Store)

Open the site in **Safari** on the iPhone → Share → **Add to Home Screen**. It
launches full-screen with the icon, works offline (the service worker caches the
shell), and stores everything in the browser on that device. Nothing to build,
nothing to pay, no review.

What it cannot do: appear in the App Store, receive push notifications reliably
(iOS only allows web push for installed web apps since 16.4, and it is patchy),
or survive the user clearing Safari data.

### 2. Native shell (Capacitor)

The Xcode project is already in `ios/`. It ships the same `dist/` build that
GitHub Pages serves, so there is one codebase and two homes.

On a Mac with Xcode:

```bash
npm install
npm run ios          # build the web app, then sync it into ios/
npm run ios:open     # opens ios/App/App.xcodeproj in Xcode
```

Then in Xcode: choose the App target → **Signing & Capabilities** → your team →
run on a simulator, or on a device after trusting the developer certificate.
First launch on a physical device needs a free Apple ID; the App Store needs a
paid account.

### Why storage changed

`src/lib/storage.ts` now uses **@capacitor/preferences** when running natively,
which maps to `UserDefaults`. This is not a detail: WKWebView's `localStorage`
can be **evicted by iOS** when the device is low on space, and for a pregnancy
record that means silently losing a scan report. The browser path still uses
`localStorage`, and the API is unchanged, so nothing above it had to move.

Note that the installed web app and the native app do **not** share storage —
they are different containers. Moving between them means exporting and
re-importing, which is what `storage.all()` exists for.

### App Store, if it ever comes to that

- Apple Developer Program: 99 USD/year.
- A privacy policy is mandatory. This app's honest one is short: *no account, no
  server, no analytics, everything stays on the device* — which is also its
  strongest selling point in review.
- Health-adjacent apps attract scrutiny. The app already refuses to diagnose,
  prescribe or guess the baby's sex (PCPCNT/PCPNDT), and those refusals should be
  stated in the review notes rather than discovered by a reviewer.
