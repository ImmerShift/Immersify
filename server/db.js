// server/db.js
import Database from 'better-sqlite3';
import fs from 'fs';

// Ensure database file exists
const db = new Database('immersify.db');

// Initialize Schema
const initDb = () => {
  // 1. Users Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      name TEXT,
      role TEXT DEFAULT 'user'
    )
  `);

  // 2. Questionnaires Table (Stores the Brand Audit)
  db.exec(`
    CREATE TABLE IF NOT EXISTS questionnaires (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      maturity_tier TEXT, -- Seed, Sprout, Star, Superbrand
      assessment_data TEXT, -- JSON of the initial quiz
      responses TEXT, -- JSON of the big form answers
      completion_percentage INTEGER DEFAULT 0,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);

  // 3. Analyses Table (Stores the Brand Health Report)
  db.exec(`
    CREATE TABLE IF NOT EXISTS analyses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      questionnaire_id INTEGER,
      overall_score INTEGER,
      summary TEXT,
      full_report TEXT, -- JSON of strengths/weaknesses/pillars
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Seed a demo user if empty
  const userCount = db.prepare('SELECT count(*) as count FROM users').get();
  if (userCount.count === 0) {
    console.log("Seeding demo user...");
    db.prepare('INSERT INTO users (email, name) VALUES (?, ?)').run('demo@immersify.app', 'Demo Founder');
  }
};

initDb();

export default db;