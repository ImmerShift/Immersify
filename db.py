import sqlite3
import json
from datetime import datetime
import os

# --- CONFIGURATION ---
# CHANGED: Relative path for Replit compatibility
DB_NAME = "immersify.db"

def init_db():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_name TEXT NOT NULL,
            strategy_data TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Version history table
    c.execute('''
        CREATE TABLE IF NOT EXISTS project_versions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id INTEGER NOT NULL,
            strategy_data TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (project_id) REFERENCES projects (id)
        )
    ''')

    conn.commit()
    conn.close()

def save_project(client_name, data):
    if not client_name or not data:
        return False
    try:
        conn = sqlite3.connect(DB_NAME)
        c = conn.cursor()
        json_data = json.dumps(data)

        # Check if project exists
        c.execute('SELECT id FROM projects WHERE client_name = ?', (client_name,))
        existing = c.fetchone()

        if existing:
            # Update existing project
            project_id = existing[0]
            c.execute(
                'UPDATE projects SET strategy_data = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                (json_data, project_id)
            )
            # Save version history
            c.execute(
                'INSERT INTO project_versions (project_id, strategy_data) VALUES (?, ?)',
                (project_id, json_data)
            )
        else:
            # Create new project
            c.execute(
                'INSERT INTO projects (client_name, strategy_data) VALUES (?, ?)',
                (client_name, json_data)
            )
            project_id = c.lastrowid
            # Save initial version
            c.execute(
                'INSERT INTO project_versions (project_id, strategy_data) VALUES (?, ?)',
                (project_id, json_data)
            )

        conn.commit()
        conn.close()
        return True
    except Exception as e:
        print(f"Database Error: {e}")
        return False

def get_all_projects():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute('SELECT id, client_name, created_at FROM projects ORDER BY updated_at DESC')
    projects = c.fetchall()
    conn.close()
    return projects

def load_project(project_id):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute('SELECT strategy_data, client_name FROM projects WHERE id = ?', (project_id,))
    result = c.fetchone()
    conn.close()
    if result:
        return json.loads(result[0]), result[1]
    return None, None

def delete_project(project_id):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    # Delete versions first
    c.execute('DELETE FROM project_versions WHERE project_id = ?', (project_id,))
    # Delete project
    c.execute('DELETE FROM projects WHERE id = ?', (project_id,))
    conn.commit()
    conn.close()

def get_project_versions(project_id):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute(
        'SELECT id, created_at FROM project_versions WHERE project_id = ? ORDER BY created_at DESC',
        (project_id,)
    )
    versions = c.fetchall()
    conn.close()
    return versions

def load_project_version(version_id):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute('SELECT strategy_data FROM project_versions WHERE id = ?', (version_id,))
    result = c.fetchone()
    conn.close()
    if result:
        return json.loads(result[0])
    return None
