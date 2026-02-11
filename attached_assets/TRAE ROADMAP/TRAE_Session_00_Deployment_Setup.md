# TRAE SESSION 0: AUTOMATIC DEPLOYMENT SETUP (Live Preview URLs)

## 🎯 OBJECTIVE
Set up automatic deployments so every code change creates a live preview URL that your friend can access from anywhere in the world. No localhost needed for testing.

**What You'll Get:**
- ✅ Frontend live URL (updates on every push)
- ✅ Preview URLs for every branch/PR
- ✅ Automatic HTTPS certificates
- ✅ Global CDN for fast loading worldwide

---

## 📋 SETUP FLOW
```
GitHub Repo → Push Code → Auto Deploy → Live URL
     ↓
  Vercel (Frontend - Vite)
```

---

## 🚀 PART 1: GITHUB REPOSITORY SETUP

### Step 1: Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `immersify`
3. Description: "🌱 AI-Powered Brand Building Platform - From Soil to Stars"
4. Visibility: Private
5. Do not initialize with README
6. Click "Create repository"

### Step 2: Initialize Git in Your Project
```bash
cd immersify
git init
git add .
git commit -m "🎉 Initial commit: Immersify Vite app"
git remote add origin https://github.com/your-username/immersify.git
git branch -M main
git push -u origin main
```

---

## ☁️ PART 2: VERCEL DEPLOYMENT (Frontend)

### Step 1: Create Vercel Account
1. Go to https://vercel.com/signup
2. Continue with GitHub
3. Authorize Vercel

### Step 2: Import Project
1. Add New → Project
2. Select `immersify` repo
3. Click Import

### Step 3: Configure Build Settings
**Framework Preset:** Vite  
**Root Directory:** `/`  
**Build Command:** `npm run build`  
**Output Directory:** `dist`  

### Step 4: Environment Variables
```env
VITE_GEMINI_API_KEY=your-gemini-api-key
VITE_API_URL=
```

### Step 5: Deploy
Wait 2–3 minutes for the URL:
```
https://immersify-xyz123.vercel.app
```

---

## 🔄 PART 3: OPTIONAL BACKEND (Future)
If/when a backend is introduced, add Railway and set:
- `VITE_API_URL=https://your-api-domain`
- CORS allow the Vercel domain

---

## 🎨 PART 4: AUTOMATIC DEPLOYMENTS WORKFLOW
Every push to GitHub triggers a new Vercel deployment.

### Preview Deployments
```bash
git checkout -b feature/tier-quiz
git add .
git commit -m "✨ Add tier placement quiz"
git push origin feature/tier-quiz
```
Vercel preview URL:
```
https://immersify-git-feature-tier-quiz-yourname.vercel.app
```

---

## 📱 PART 5: SHARING WITH YOUR FRIEND
Send:
- Frontend: `https://immersify-xyz123.vercel.app`

---

## 🎯 PART 6: DEVELOPMENT WORKFLOW
```bash
npm run dev
# Visit http://localhost:5173
git add .
git commit -m "✨ Add new feature"
git push
```

---

## 💰 COST BREAKDOWN
**Vercel (Frontend):**
- Free tier is enough for development
- Automatic HTTPS + global CDN

---

## ✅ SUCCESS CHECKLIST
- Code pushed to GitHub
- Vercel auto-deploys on push
- Live URL accessible globally
- Preview URLs created per branch

