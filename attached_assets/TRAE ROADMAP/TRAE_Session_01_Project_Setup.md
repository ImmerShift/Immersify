# TRAE SESSION 1: IMMERSIFY - COMPLETE PROJECT SETUP & INFRASTRUCTURE

## 🎯 SESSION OBJECTIVE
Initialize the Immersify web application with the current serverless Vite stack, verified local dev workflow, and correct project structure aligned to the existing codebase.

---

## 📦 PROJECT OVERVIEW

**Project Name:** Immersify  
**Type:** Serverless Web App (B2B/B2C)  
**Tech Stack:**
- **Frontend:** React 18 + Vite, Tailwind CSS
- **Routing:** React Router DOM
- **State:** Local store (`src/lib/store.js`) with Local Storage persistence
- **AI:** Google Gemini (client-side key via Settings)
- **Deployment:** Vercel/Netlify static hosting

**Repository Structure:** Single app repo (no monorepo)

---

## 📁 REQUIRED PROJECT STRUCTURE

```
immersify/
├── README.md
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── src/
│   ├── components/
│   │   ├── Dashboard/
│   │   ├── audit/
│   │   ├── reports/
│   │   ├── strategy/
│   │   └── ui/
│   ├── data/
│   │   └── questionnaires/
│   ├── lib/
│   ├── pages/
│   ├── utils/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
└── docs/
```

---

## 📝 CONFIGURATION FILES TO VERIFY

- `package.json` includes `dev`, `build`, `preview`
- `vite.config.js` includes `@/` alias
- `tailwind.config.js` + `postcss.config.js`
- `.env` for `VITE_GEMINI_API_KEY` (optional)

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**", "build/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "test": {
      "dependsOn": ["^build"]
    },
    "type-check": {
      "dependsOn": ["^build"]
    },
    "clean": {
      "cache": false
    }
  }
}
```

### 3. `.gitignore`

```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/
*.lcov

# Next.js
.next/
out/
build/
dist/

# Environment
.env
.env*.local
.env.production

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# OS
.DS_Store
*.pem
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Turbo
.turbo/

# Prisma
prisma/migrations/

# Build
*.tsbuildinfo
next-env.d.ts
```

### 4. `.env.example` (Root)

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/immersify"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
JWT_REFRESH_SECRET="your-refresh-token-secret"
JWT_REFRESH_EXPIRES_IN="30d"

# OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GOOGLE_CALLBACK_URL="http://localhost:3000/api/auth/google/callback"

# AI
GEMINI_API_KEY=""

# Stripe
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
STRIPE_PUBLISHABLE_KEY=""

# AWS S3
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_S3_BUCKET=""
AWS_REGION="us-east-1"

# Email
RESEND_API_KEY=""
RESEND_FROM_EMAIL="noreply@immersify.app"

# App
NODE_ENV="development"
API_URL="http://localhost:4000"
FRONTEND_URL="http://localhost:3000"
PORT=4000
```

---

## 📦 FRONTEND `apps/web/package.json`

```json
{
  "name": "@immersify/web",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "14.2.3",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-toast": "^1.1.5",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.1",
    "zustand": "^4.5.0",
    "@tanstack/react-query": "^5.28.0",
    "axios": "^1.6.7",
    "recharts": "^2.12.0",
    "framer-motion": "^11.0.5",
    "react-hook-form": "^7.50.1",
    "zod": "^3.22.4",
    "@hookform/resolvers": "^3.3.4",
    "date-fns": "^3.3.1",
    "lucide-react": "^0.344.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.24",
    "@types/react": "^18.2.61",
    "@types/react-dom": "^18.2.19",
    "typescript": "^5.3.3",
    "tailwindcss": "^3.4.1",
    "postcss": "^8.4.35",
    "autoprefixer": "^10.4.18",
    "eslint": "^8.57.0",
    "eslint-config-next": "14.2.3"
  }
}
```

---

## 📦 BACKEND `apps/api/package.json`

```json
{
  "name": "@immersify/api",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "nodemon",
    "build": "tsc",
    "start": "node dist/index.js",
    "lint": "eslint . --ext .ts",
    "type-check": "tsc --noEmit",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:seed": "ts-node prisma/seed.ts",
    "prisma:studio": "prisma studio"
  },
  "dependencies": {
    "express": "^4.18.3",
    "@prisma/client": "^5.10.2",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "redis": "^4.6.13",
    "zod": "^3.22.4",
    "winston": "^3.11.0",
    "dotenv": "^16.4.4",
    "@google/generative-ai": "^0.2.1",
    "stripe": "^14.18.0",
    "aws-sdk": "^2.1554.0",
    "resend": "^3.2.0",
    "passport": "^0.7.0",
    "passport-google-oauth20": "^2.0.0",
    "express-session": "^1.18.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.11.24",
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/cors": "^2.8.17",
    "@types/passport": "^1.0.16",
    "@types/passport-google-oauth20": "^2.0.14",
    "@types/express-session": "^1.17.10",
    "typescript": "^5.3.3",
    "prisma": "^5.10.2",
    "nodemon": "^3.0.3",
    "ts-node": "^10.9.2",
    "@typescript-eslint/eslint-plugin": "^7.0.2",
    "@typescript-eslint/parser": "^7.0.2",
    "eslint": "^8.57.0"
  }
}
```

---

## ⚙️ CONFIGURATION FILES

### `apps/web/next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['immersify-assets.s3.amazonaws.com'],
    formats: ['image/avif', 'image/webp'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.API_URL || 'http://localhost:4000',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_URL}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
```

### `apps/web/tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Immersify Brand Colors
        primary: {
          DEFAULT: '#2E5C8A',
          light: '#3D7AB8',
          dark: '#1E3A5F',
        },
        secondary: {
          DEFAULT: '#5A9BD5',
          light: '#7AAFE5',
          dark: '#3A7BB5',
        },
        tier: {
          seed: '#4CAF50',
          sprout: '#8BC34A',
          star: '#FFC107',
          superbrand: '#9C27B0',
        },
        neutral: {
          50: '#F5F5F5',
          100: '#E5E5E5',
          200: '#D4D4D4',
          300: '#A3A3A3',
          400: '#737373',
          500: '#525252',
          600: '#404040',
          700: '#262626',
          800: '#171717',
          900: '#0A0A0A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      fontSize: {
        'display': ['3rem', { lineHeight: '1.2' }],
        'h1': ['2.25rem', { lineHeight: '1.3' }],
        'h2': ['1.75rem', { lineHeight: '1.4' }],
        'h3': ['1.5rem', { lineHeight: '1.4' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'small': ['0.875rem', { lineHeight: '1.4' }],
        'tiny': ['0.75rem', { lineHeight: '1.4' }],
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
```

### `apps/web/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/store/*": ["./src/store/*"],
      "@/types/*": ["./src/types/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### `apps/api/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "paths": {
      "@/*": ["./src/*"],
      "@/config/*": ["./src/config/*"],
      "@/routes/*": ["./src/routes/*"],
      "@/controllers/*": ["./src/controllers/*"],
      "@/services/*": ["./src/services/*"],
      "@/middleware/*": ["./src/middleware/*"],
      "@/types/*": ["./src/types/*"],
      "@/utils/*": ["./src/utils/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### `apps/api/nodemon.json`

```json
{
  "watch": ["src"],
  "ext": "ts",
  "ignore": ["src/**/*.spec.ts"],
  "exec": "ts-node -r tsconfig-paths/register src/index.ts",
  "env": {
    "NODE_ENV": "development"
  }
}
```

---

## 🎯 CRITICAL IMPLEMENTATION REQUIREMENTS

### 1. **Install All Dependencies**
Run these commands in sequence:
```bash
# Root
npm install

# Frontend
cd apps/web && npm install

# Backend
cd ../api && npm install

# Return to root
cd ../..
```

### 2. **Create ALL Directory Structures**
Every folder listed in the tree above MUST exist, even if empty initially.

### 3. **Create Initial Files**

**Minimum required initial files to create:**

**Frontend (`apps/web/src/`):**
- `app/layout.tsx` - Root layout with font imports
- `app/page.tsx` - Homepage with "Immersify" hero
- `app/globals.css` - Tailwind directives
- `lib/api.ts` - Axios instance configured for API calls
- `types/index.ts` - Export all types

**Backend (`apps/api/src/`):**
- `index.ts` - Server entry point
- `app.ts` - Express app configuration
- `config/database.ts` - Prisma client singleton
- `config/env.ts` - Environment variable validation with Zod
- `routes/index.ts` - Route aggregator
- `routes/health.routes.ts` - Health check endpoint
- `middleware/error.middleware.ts` - Global error handler
- `types/express.d.ts` - Express type extensions

### 4. **Prisma Schema Initialization**

Create `apps/api/prisma/schema.prisma` with:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Initial user model (will expand in Session 2)
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 5. **README.md** (Root)

```markdown
# Immersify - AI-Powered Brand Building Platform

🌱 From Soil to Stars: Building Brands That Last

## Quick Start

\`\`\`bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Run database migrations
cd apps/api
npm run prisma:migrate

# Start development servers
cd ../..
npm run dev
\`\`\`

## Project Structure
- `apps/web` - Next.js 14 frontend
- `apps/api` - Express.js backend
- `packages/shared` - Shared utilities

## Tech Stack
- Frontend: Next.js 14, React 18, Tailwind CSS, Radix UI
- Backend: Node.js, Express, PostgreSQL, Prisma
- AI: Google Gemini 1.5
- Payments: Stripe

## Documentation
- [API Documentation](./docs/API.md)
- [Database Schema](./docs/DATABASE.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
```

---

## ✅ SUCCESS CRITERIA

After completing this session, you should have:

1. ✅ Complete monorepo structure with all folders created
2. ✅ All `package.json` files configured with correct dependencies
3. ✅ All configuration files created (Next.js, TypeScript, Tailwind, Prisma)
4. ✅ Basic frontend running on `http://localhost:3000`
5. ✅ Basic backend running on `http://localhost:4000`
6. ✅ Health check endpoint accessible at `GET http://localhost:4000/api/health`
7. ✅ Prisma client generated and connected to PostgreSQL
8. ✅ Git repository initialized with proper `.gitignore`

---

## 🚀 EXECUTION COMMAND FOR TRAE

**TRAE, please execute the following:**

1. **Create the COMPLETE project structure** as specified above with ALL directories and files
2. **Install ALL dependencies** exactly as specified in package.json files
3. **Generate initial code files** for:
   - Frontend: Root layout, homepage, global CSS, API client
   - Backend: Server entry, Express app, health route, error middleware
4. **Initialize Prisma** with the schema provided
5. **Create environment files** (`.env.example` in both apps)
6. **Verify the setup** by attempting to run both dev servers

**Expected outcome:** A complete, runnable monorepo with Next.js frontend and Express backend communicating successfully.

---

## 📋 NOTES FOR TRAE

- Use **TypeScript** for ALL files (no JavaScript)
- Follow **exact versions** specified in package.json
- Create **empty files** with proper TypeScript signatures for all routes/controllers/services
- Add **comprehensive JSDoc comments** to all functions
- Include **proper error handling** in all files
- Use **ES modules** syntax consistently
- Follow **naming conventions**: PascalCase for components, camelCase for functions, UPPER_CASE for constants

---

🎯 **This is Session 1 of 12. Let's build this foundation perfectly before moving to Session 2 (Database Schema).**
