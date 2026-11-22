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
