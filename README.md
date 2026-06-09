# Salsawala Studios — Website Redesign

[![CI — Build & Type Check](https://github.com/Shuvendu29/salsawala-studios/actions/workflows/ci.yml/badge.svg)](https://github.com/Shuvendu29/salsawala-studios/actions/workflows/ci.yml)

**Kolkata's Premier Dance Studio** — A full-stack web app built with Next.js 14, Firebase, and TailwindCSS.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Shuvendu29/salsawala-studios&env=NEXT_PUBLIC_FIREBASE_API_KEY,NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,NEXT_PUBLIC_FIREBASE_PROJECT_ID,NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,NEXT_PUBLIC_FIREBASE_APP_ID&envDescription=Firebase%20configuration%20from%20your%20Firebase%20console&project-name=salsawala-studios&repository-name=salsawala-studios)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) |
| Styling | TailwindCSS — dark theme (crimson/gold) |
| Auth | Firebase Authentication (Email + Google) |
| Database | Firebase Firestore |
| Storage | Firebase Storage |
| Notifications | Firebase Cloud Messaging (FCM) |
| Payments | Razorpay (ready to wire up) |
| Hosting | Firebase Hosting / Vercel |
| PWA | Web App Manifest |

## Features

### Three Role-Based Sessions

| Role | Access |
|---|---|
| **User** | Browse & book classes, track attendance, submit reviews |
| **Faculty** | View assigned students, mark attendance, send feedback |
| **Admin** | Full CMS — manage classes, events, faculty; view analytics & revenue |

### Pages
- `/` — Home with Hero, Stats, Dance Styles, Schedule, Faculty, Testimonials, Gallery, Events, CTA, Contact
- `/about` — Studio story, values, team, timeline
- `/classes` — Full schedule with all 15+ dance styles
- `/events` — Upcoming workshops, socials, performances
- `/gallery` — Photo/video grid (connect Firebase Storage)
- `/contact` — Contact form + FAQ
- `/login` — Email + Google sign-in
- `/register` — Account creation
- `/dashboard` — User dashboard (bookings, progress, activity)
- `/faculty` — Faculty dashboard (attendance marking)
- `/admin` — Admin panel (classes, events, analytics)

---

## Quick Start

### 1. Clone & install

```bash
git clone https://github.com/Shuvendu29/salsawala-studios.git
cd salsawala-studios
npm install --legacy-peer-deps
```

### 2. Set up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a project (e.g. `salsawala-studios`)
3. Enable **Authentication** → Email/Password + Google
4. Enable **Firestore Database** (start in test mode)
5. Enable **Storage**
6. Copy your config from **Project Settings → Your apps**

### 3. Configure environment

```bash
cp .env.example .env.local
# Fill in your Firebase credentials in .env.local
```

### 4. Run locally

```bash
npm run dev
# Open http://localhost:3000
```

---

## Deploy to Vercel (Recommended)

### One-Click Deploy
Click the **Deploy with Vercel** button above — add your Firebase env vars when prompted.

### Manual via Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Via GitHub Actions
1. Get your Vercel token from [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Add `VERCEL_TOKEN` to GitHub → Settings → Secrets → Actions
3. Every push to `main` auto-deploys

---

## Deploy to Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

---

## Setting User Roles

After a user signs up, set their role in Firestore:

```
Firestore → users → {uid} → role: "admin" | "faculty" | "user"
```

Use the Firebase console or a one-time admin script.

---

## Project Structure

```
salsawala-studios/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Home
│   ├── about/
│   ├── classes/
│   ├── events/
│   ├── gallery/
│   ├── contact/
│   ├── login/
│   ├── register/
│   ├── dashboard/          # User dashboard
│   ├── faculty/            # Faculty dashboard
│   └── admin/              # Admin panel
├── components/
│   ├── home/               # Home page sections
│   ├── layout/             # Navbar, Footer
│   ├── providers/          # AuthProvider, Toaster
│   └── ui/                 # Button, Badge, Card, etc.
├── lib/
│   ├── firebase/           # config, auth, firestore
│   ├── data/               # Static mock data
│   ├── hooks/              # useAuth
│   ├── types/              # TypeScript types
│   └── utils/              # cn (classnames)
└── public/
    └── manifest.json       # PWA manifest
```

---

## Studio Details

- **Location**: Near Park Street, Kolkata — 700016
- **Phone**: +91 98301 58223
- **Email**: salsawalastudios@gmail.com
- **Instagram**: [@salsawalastudios](https://www.instagram.com/salsawalastudios/)
- **Facebook**: [salsawalastudios](https://www.facebook.com/salsawalastudios/)

---

*Built with Next.js 14 + Firebase + TailwindCSS*
