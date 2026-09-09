# Sahayak — Smart Emergency Assistance

**Fewer decisions. Faster action.**

Sahayak is a September 2026 hackathon prototype by **Code Nova**. It brings essential emergency-support tools into one calm interface: SOS event recording, one-time location sharing, trusted contacts, a private Medical ID, offline-friendly guides, and emergency-service information.

> **Important:** This is a prototype. It does not automatically dispatch police, ambulance, fire services, or guarantee emergency response. Real emergency response must use the appropriate official service.

## Features
- One-tap-style SOS flow with confirmation and private event logging
- Browser Geolocation API → Google Maps link; no continuous tracking
- CRUD emergency contacts
- Private Medical ID
- Static/cache-friendly first-aid and emergency guides
- India emergency-number information
- Supabase email/password auth, password reset, protected dashboard
- Row Level Security for private user data
- Responsive, mobile-first premium UI

## Stack
- Next.js + React + TypeScript
- Tailwind CSS
- Supabase Auth + Postgres + RLS
- Vercel deployment
- GitHub source control

## 1. Install
```bash
npm install
```

## 2. Create Supabase project
Create a free project in Supabase. In **SQL Editor**, run `sql/schema.sql`.

Then configure Authentication → URL Configuration with your local and deployed URLs. For local development, use `http://localhost:3000`.

## 3. Environment variables
Copy `.env.example` to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Only use the public anon key in frontend-accessible variables. **Never expose a Supabase service-role key in client code.**

## 4. Run locally
```bash
npm run dev
```
Open `http://localhost:3000`.

## 5. GitHub
```bash
git init
git add .
git commit -m "Initial Sahayak emergency assistance app"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

Do not commit `.env.local`.

## 6. Vercel
1. Import the GitHub repository into Vercel.
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel project settings.
3. Deploy.
4. Add the deployed URL to Supabase Auth → URL Configuration / Redirect URLs.

## 7. Security
- Passwords are handled by Supabase Auth; this project never stores them in localStorage.
- Private tables use RLS with `auth.uid()` ownership checks.
- No service-role key is used in the browser.
- Medical data is not exposed through public pages.
- SOS/location features are deliberately explicit and permission-based.

## 8. Prototype limitations
- SOS currently records an event in Supabase; it does not dispatch emergency services.
- Location sharing is a one-time browser permission flow and copies a Google Maps link.
- Browser notifications are not wired to a backend notification provider in this prototype.
- Offline guides are static/cache-friendly content. For stronger offline behavior, add a PWA service worker and pre-cache the guide routes/assets.
- Emergency numbers can vary by region/service; users should verify local official procedures.
- A production emergency system would require verified service integrations, monitoring, abuse prevention, audit logging, privacy/legal review, incident response, and reliability testing.

## Suggested next production steps
1. Add PWA/service-worker offline caching.
2. Add verified SMS/push provider only after consent and abuse controls.
3. Add server-side audit/event monitoring.
4. Add automated tests and end-to-end tests.
5. Conduct accessibility, privacy, threat-model, and emergency UX reviews.
