# DeepLabs Doomsday Reveal Site

Next.js 14 (App Router) + Tailwind + Framer Motion. Problem statements, reveal state, and PDF URLs use the existing JSON file API and `data/problems.json` storage.

## Setup

1. Copy `.env.example` to `.env.local` and set `ADMIN_PASSWORD`.
2. Run `npm install && npm run dev`.
3. Open `/admin/login` to manage the 12 challenges.

PDF files remain hosted externally, such as a raw HTTPS GitHub URL. The admin panel validates and stores one PDF URL per challenge. A PDF URL is returned publicly only while its challenge is revealed.

## Deployment and persistence

The app writes changes to `data/problems.json`. Render's default filesystem is ephemeral, so JSON changes can be lost on restart or redeploy. Configure a Render persistent disk mounted at the project path if durable file storage is required, or accept that limitation for the deployment. The app does not provide database-backed persistence.

Visitors poll the public API every five seconds and also refresh when the browser tab becomes visible.
