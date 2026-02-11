# Immersify v2.0 - Serverless Edition

This is the fully rebuilt Immersify application. It is designed to be **Serverless**, meaning it runs entirely in the browser, with a cinematic, game-like dashboard experience.

## 🚀 Key Features
- **Client-Side AI**: Connects directly to Google Gemini (you need to enter your API Key in Settings).
- **Local Storage**: Saves your brand audit and strategy to your browser (no database required).
- **Instant Deployment**: Can be hosted on GitHub Pages, Netlify, or Vercel.
- **Immersive Map UI**: A 3D glass staircase that visualizes your brand journey as a winding path.
- **Mission Control HUD**: A glassmorphic right-side panel with Brand Score, directive CTA, and asset grid.
- **Active Step Guidance**: The active step auto-highlights and syncs with the audit drawer.
- **Cinematic Atmosphere**: Neon spine glow, depth layering, and animated hero presence.

## 🛠️ How to Run Locally
1. **Install Node.js**: You MUST have Node.js installed. Download it from [nodejs.org](https://nodejs.org/).
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Start the App**:
   ```bash
   npm run dev
   ```
4. **Open Browser**: Go to `http://localhost:5173`

## 🌐 How to Get a Live Link (Share with Friends)
Since this version requires no backend server, you can host it for free easily.

### Option 1: Netlify Drop (Easiest)
1. Run `npm run build` in your terminal. This creates a `dist` folder.
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
3. Drag and drop the `dist` folder onto the page.
4. You will get a live link instantly (e.g., `https://immersify-demo.netlify.app`).

### Option 2: GitHub Pages
1. Push this code to GitHub.
2. Go to Repository Settings > Pages.
3. Select "Source" as `GitHub Actions` or use a deploy workflow.

## 🔑 AI Configuration
To use the IBE Generator:
1. Go to the **Settings** page in the app.
2. Enter your Google Gemini API Key.
   - [Get a free key here](https://aistudio.google.com/app/apikey).
3. The key is saved in your browser securely.
