// server/index.js
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai'; // We use Google now
import db from './db.js';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Create uploads folder if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}
app.use('/uploads', express.static('uploads'));

// --- AI CONFIGURATION (GEMINI) ---
// Make sure GEMINI_API_KEY is in Secrets
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Helper to clean JSON from Markdown
const cleanJSON = (text) => {
  return text.replace(/```json/g, '').replace(/```/g, '').trim();
};

// File Upload Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// --- ROUTES ---

// 1. Mock Auth
app.get('/api/auth/me', (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get('demo@immersify.app');
  res.json(user);
});

// 2. File Upload
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const fileUrl = `/uploads/${req.file.filename}`; 
  res.json({ file_url: fileUrl });
});

// 3. Get Questionnaire
app.get('/api/questionnaire', (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get('demo@immersify.app');
  const quest = db.prepare('SELECT * FROM questionnaires WHERE user_id = ? ORDER BY updated_at DESC LIMIT 1').get(user.id);

  if (quest) {
    try {
        quest.responses = JSON.parse(quest.responses || '{}');
        quest.assessment_data = JSON.parse(quest.assessment_data || '{}');
    } catch (e) {
        console.error("Error parsing JSON", e);
    }
  }
  res.json(quest || null);
});

// 4. Save/Update Questionnaire
app.post('/api/questionnaire', (req, res) => {
  const { maturity_tier, assessment_data, responses } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get('demo@immersify.app');

  const existing = db.prepare('SELECT id FROM questionnaires WHERE user_id = ?').get(user.id);

  if (existing) {
    const current = db.prepare('SELECT responses FROM questionnaires WHERE id = ?').get(existing.id);
    const currentResponses = JSON.parse(current.responses || '{}');
    const newResponses = { ...currentResponses, ...(responses || {}) };

    db.prepare(`
      UPDATE questionnaires 
      SET responses = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(JSON.stringify(newResponses), existing.id);
    res.json({ id: existing.id, status: 'updated' });
  } else {
    const result = db.prepare(`
      INSERT INTO questionnaires (user_id, maturity_tier, assessment_data, responses)
      VALUES (?, ?, ?, ?)
    `).run(user.id, maturity_tier, JSON.stringify(assessment_data), JSON.stringify(responses));
    res.json({ id: result.lastInsertRowid, status: 'created' });
  }
});

// 5. AI Feedback (Gemini)
app.post('/api/ai/feedback', async (req, res) => {
  const { value, context } = req.body;

  try {
    const prompt = `
      ROLE: Brand Strategist Mentor.
      TASK: Analyze this input for: "${context}".
      INPUT: "${value}"

      Respond ONLY with valid JSON (no markdown) in this format:
      {
        "quality": "poor" | "fair" | "good" | "excellent",
        "issues": ["short issue 1", "short issue 2"],
        "suggestions": ["prompt 1", "prompt 2"],
        "praise": "short praise if good"
      }
    `;

    const result = await model.generateContent(prompt);
    const text = cleanJSON(result.response.text());

    res.json(JSON.parse(text));
  } catch (err) {
    console.error("Gemini Error:", err);
    res.status(500).json({ error: "AI Error" });
  }
});

// 6. Brand Health Analysis (Gemini)
app.post('/api/ai/analyze', async (req, res) => {
  const { questionnaire } = req.body;

  try {
    const prompt = `
      You are a Senior Brand Strategist. Analyze this brand audit.
      Tier: ${questionnaire.maturity_tier}
      Data: ${JSON.stringify(questionnaire.responses)}

      Respond ONLY with valid JSON (no markdown) matching this structure:
      {
        "overall_score": 0-100,
        "overall_summary": "string",
        "pillar_scores": { 
           "brand_core_identity": {"score": 0, "status": "string", "key_insight": "string"},
           "visual_identity": {"score": 0, "status": "string", "key_insight": "string"},
           "product_experience": {"score": 0, "status": "string", "key_insight": "string"},
           "verbal_identity": {"score": 0, "status": "string", "key_insight": "string"},
           "market_plan": {"score": 0, "status": "string", "key_insight": "string"},
           "technology": {"score": 0, "status": "string", "key_insight": "string"}
        },
        "strengths": ["str1", "str2", "str3"],
        "weaknesses": ["wk1", "wk2", "wk3"],
        "quick_wins": ["win1", "win2", "win3"],
        "strategic_priorities": ["prio1", "prio2", "prio3"],
        "brand_personality": {"archetype": "", "description": ""}
      }
    `;

    const result = await model.generateContent(prompt);
    const text = cleanJSON(result.response.text());
    const analysis = JSON.parse(text);

    res.json(analysis);
  } catch (err) {
    console.error("Gemini Analysis Error:", err);
    res.status(500).json({ error: "Analysis Failed" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Immersify Server (Gemini) running on http://0.0.0.0:${PORT}`);
});