# Immersify

## Overview

Immersify is a serverless, browser‑based brand audit and strategy platform. It guides founders through tiered questionnaires (Seed → Superbrand) to assess brand maturity, then uses Google Gemini to generate insights, scores, and strategic direction. The dashboard now features a full‑screen, immersive map view with a glass staircase visual and a mission‑control HUD.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with Vite
- **Routing**: React Router DOM
- **State Management**: Lightweight custom store (`src/lib/store.js`)
- **Styling**: Tailwind CSS (dark‑first)
- **UI Components**: Radix UI primitives + custom components
- **Animations**: Framer Motion
- **Path Aliasing**: `@/` maps to `./src/`

### Runtime & Data
- **Serverless**: Runs entirely in the browser (no backend server)
- **Storage**: Local Storage for answers and progress

### AI Integration
- **Provider**: Google Generative AI (Gemini)
- **Client‑Side Calls**: API key entered in Settings and stored locally

### Development Setup
- Frontend runs on port 5000 (Vite dev server)
- Backend runs on port 3000 (Express)
- Vite proxies API calls to backend during development

## External Dependencies

### AI Services
- **Google Gemini API**: Requires `GEMINI_API_KEY` (entered in Settings)

### Key NPM Packages
- `@google/generative-ai` - Google Gemini AI SDK
- `@radix-ui/*` - Accessible UI component primitives
- `tailwindcss` - Utility-first CSS framework
- `framer-motion` - Animation library
- `lucide-react` - Icon set
