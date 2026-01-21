# Immersify

## Overview

Immersify is a brand audit and analysis platform that helps founders assess their brand maturity. The application guides users through questionnaires to evaluate their brand health, then uses AI (Google Gemini) to generate comprehensive brand health reports with scores, strengths, weaknesses, and recommendations.

The platform categorizes brands into maturity tiers (Seed, Sprout, Star, Superbrand) and provides personalized feedback based on assessment responses.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with Vite as the build tool
- **Routing**: React Router DOM for client-side navigation
- **State Management**: TanStack React Query for server state and data fetching
- **Styling**: Tailwind CSS with CSS variables for theming (supports dark mode)
- **UI Components**: Radix UI primitives (Dialog, Tabs, Accordion, etc.) with custom styling
- **Animations**: Framer Motion for UI transitions
- **Path Aliasing**: `@/` maps to `./src/` directory

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **API Pattern**: RESTful endpoints under `/api/` prefix
- **File Uploads**: Multer middleware storing files in `/uploads` directory
- **Development Proxy**: Vite proxies `/api` and `/uploads` requests to Express server on port 3000

### Data Storage
- **Database**: SQLite via better-sqlite3
- **Schema**: Three main tables:
  - `users` - Basic user info with email, name, role
  - `questionnaires` - Brand audit data with maturity tier, assessment JSON, completion tracking
  - `analyses` - Generated brand health reports with scores and full report JSON
- **Seeding**: Demo user auto-created on first run

### AI Integration
- **Provider**: Google Generative AI (Gemini 1.5 Flash)
- **Endpoints**: Separate routes for quick feedback vs full brand analysis
- **Response Handling**: JSON cleaning utility to strip markdown code blocks from AI responses

### Development Setup
- Frontend runs on port 5000 (Vite dev server)
- Backend runs on port 3000 (Express)
- Vite proxies API calls to backend during development

## External Dependencies

### AI Services
- **Google Gemini API**: Requires `GEMINI_API_KEY` environment variable for brand analysis and feedback generation

### Database
- **SQLite**: Local file-based database (`immersify.db`), no external database service required

### Key NPM Packages
- `@google/generative-ai` - Google Gemini AI SDK
- `better-sqlite3` - SQLite database driver
- `express` - HTTP server framework
- `multer` - File upload handling
- `@tanstack/react-query` - Data fetching and caching
- `@radix-ui/*` - Accessible UI component primitives
- `tailwindcss` - Utility-first CSS framework
- `framer-motion` - Animation library
- `recharts` - Charting library for data visualization