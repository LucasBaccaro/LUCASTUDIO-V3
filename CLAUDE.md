# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Luca Studio marketing/landing page — a single-page React app (Spanish language) with an Express backend. Originally generated from a Figma design. Deployed on Railway.

## Commands

- `npm run dev` — Start Vite dev server (frontend only, hot reload)
- `npm run server` — Start Express backend (port 3001, needed for chatbot API)
- `npm run build` — Build for production (outputs to `dist/`)
- `npm start` — Production server (serves built `dist/` + API routes)

For local development, run both `npm run dev` and `npm run server` in separate terminals. The frontend proxies API calls to `localhost:3001` in dev mode.

## Architecture

**Frontend:** React 18 + Vite + Tailwind CSS v4 + Radix UI primitives (shadcn/ui style). Animations via `motion` (Framer Motion). No router — single page with sections.

**Backend:** `server.js` — Express v5 server with two API endpoints:
- `POST /api/chatkit/session` — Creates OpenAI ChatKit sessions (proxies API key)
- `POST /api/send-email` — Sends notification emails via Resend when the chatbot collects user contact info

**Chatbot:** Uses `@openai/chatkit-react` with an OpenAI workflow. Session tokens are managed in `src/lib/chatkit.ts` with device ID persistence in localStorage and session caching in sessionStorage. The `Chatbot.tsx` component handles a client-side tool (`enviar_notificacion_email`) that triggers the email endpoint.

## Key Paths

- `src/app/App.tsx` — Root component, assembles page sections
- `src/app/components/` — Page sections (Hero, Services, Navigation, etc.)
- `src/app/components/ui/` — Reusable UI primitives (shadcn/ui pattern)
- `src/styles/theme.css` — Design tokens (CSS custom properties)
- `src/lib/chatkit.ts` — ChatKit session management
- `server.js` — Express backend (API routes)

## Design System

- Dark theme by default: background `#000000`, primary accent `#c4ff0d` (lime green)
- Base font size: 14px, font family: Inter
- Path alias: `@` maps to `./src`
- UI components follow shadcn/ui conventions using `class-variance-authority` + `tailwind-merge` + `clsx`

## Environment Variables

See `.env.example`. Required for backend:
- `OPENAI_API_KEY` — For ChatKit session creation
- `RESEND_API_KEY` — For email notifications
