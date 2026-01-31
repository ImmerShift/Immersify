// server/index.js
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { OpenAI } from 'openai';
import db from './db.js';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded files

// AI Configuration (You own the key now)
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY // Set this in Replit Secrets
});

// File Upload Configuration (Multer)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// --- ROUTES ---

// 1. Mock Auth (Get current user)
app.get('/api/auth/me', (req, res) => {
  // In a real app, you'd decode a JWT here. 
  // For now, we return the seeded demo user.
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get('demo@immersify.app');
  res.json(user);
});

// 2. File Upload (Replaces Base44 UploadFile)
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ file_url: fileUrl });
});

// 3. Get Questionnaire
app.get('/api/questionnaire', (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get('demo@immersify.app');
  const quest = db.prepare('SELECT * FROM questionnaires WHERE user_id = ? ORDER BY updated_at DESC LIMIT 1').get(user.id);
  
  if (quest) {
    // Parse JSON strings back to objects
    quest.responses = JSON.parse(quest.responses || '{}');
    quest.assessment_data = JSON.parse(quest.assessment_data || '{}');
  }
  res.json(quest || null);
});

// 4. Save/Update Questionnaire
app.post('/api/questionnaire', (req, res) => {
  const { maturity_tier, assessment_data, responses } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get('demo@immersify.app');

  // Check if exists
  const existing = db.prepare('SELECT id FROM questionnaires WHERE user_id = ?').get(user.id);

  if (existing) {
    db.prepare(`
      UPDATE questionnaires 
      SET responses = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(JSON.stringify(responses), existing.id);
    res.json({ id: existing.id, status: 'updated' });
  } else {
    const result = db.prepare(`
      INSERT INTO questionnaires (user_id, maturity_tier, assessment_data, responses)
      VALUES (?, ?, ?, ?)
    `).run(user.id, maturity_tier, JSON.stringify(assessment_data), JSON.stringify(responses));
    res.json({ id: result.lastInsertRowid, status: 'created' });
  }
});

// 5. AI Field Feedback (The "AIFeedback.jsx" Mentor)
app.post('/api/ai/feedback', async (req, res) => {
  const { value, context } = req.body;
  
  try {
    const prompt = `
      ROLE: Brand Strategist Mentor.
      TASK: Analyze this input for: "${context}".
      INPUT: "${value}"
      
      Provide a JSON response:
      {
        "quality": "poor" | "fair" | "good" | "excellent",
        "issues": ["short issue 1", "short issue 2"],
        "suggestions": ["prompt 1", "prompt 2"],
        "praise": "short praise if good"
      }
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: "You are a helpful JSON AI." }, { role: "user", content: prompt }],
      model: "gpt-3.5-turbo", // Fast & Cheap for realtime
      response_format: { type: "json_object" },
    });

    res.json(JSON.parse(completion.choices[0].message.content));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI Error" });
  }
});

// 6. Full Brand Health Analysis (The "BrandHealth.jsx" Engine)
app.post('/api/ai/analyze', async (req, res) => {
  const { questionnaire } = req.body;
  
  try {
    // We send the FULL questionnaire context to GPT-4
    const prompt = `
      Analyze this brand audit.
      Tier: ${questionnaire.maturity_tier}
      Data: ${JSON.stringify(questionnaire.responses)}
      
      Output strict JSON matching the Immersify Health Report structure:
      {
        "overall_score": 0-100,
        "overall_summary": "string",
        "pillar_scores": { 
           "brand_core_identity": {"score": 0, "status": "string", "key_insight": "string"},
           // ... (AI will fill the rest based on your schema)
        },
        "strengths": [], "weaknesses": [], "quick_wins": [], "strategic_priorities": [],
        "brand_personality": {"archetype": "", "description": ""}
      }
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: "You are a Senior Brand Strategist." }, { role: "user", content: prompt }],
      model: "gpt-4-turbo-preview", // Smartest model for the big report
      response_format: { type: "json_object" },
    });

    const analysis = JSON.parse(completion.choices[0].message.content);
    
    // Save analysis to DB
    // (Implementation of saving to 'analyses' table skipped for brevity, but data is ready)
    
    res.json(analysis);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Analysis Failed" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Immersify Server running on http://0.0.0.0:${PORT}`);
});