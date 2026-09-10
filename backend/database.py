import json
import sqlite3
import os
from typing import List, Dict, Any, Optional

DB_PATH = os.path.join(os.path.dirname(__file__), "career_copilot.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_db() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS runs (
                id TEXT PRIMARY KEY,
                created_at TEXT NOT NULL,
                role_title TEXT,
                match_score REAL DEFAULT 0,
                jd_text TEXT NOT NULL,
                resume_text TEXT NOT NULL,
                jd_analysis TEXT,
                match_result TEXT,
                tailored_resume TEXT,
                interview_prep TEXT,
                status TEXT NOT NULL,
                error TEXT
            )
        """)
        conn.commit()

def save_run(run_data: Dict[str, Any]) -> str:
    init_db()
    with get_db() as conn:
        conn.execute("""
            INSERT OR REPLACE INTO runs (
                id, created_at, role_title, match_score, jd_text, resume_text,
                jd_analysis, match_result, tailored_resume, interview_prep, status, error
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            run_data["id"],
            run_data["created_at"],
            run_data.get("role_title", "Unknown Role"),
            run_data.get("match_score", 0.0),
            run_data.get("jd_text", ""),
            run_data.get("resume_text", ""),
            json.dumps(run_data.get("jd_analysis", {})),
            json.dumps(run_data.get("match_result", {})),
            json.dumps(run_data.get("tailored_resume", {})),
            json.dumps(run_data.get("interview_prep", {})),
            run_data.get("status", "completed"),
            run_data.get("error", None)
        ))
        conn.commit()
    return run_data["id"]

def get_all_runs() -> List[Dict[str, Any]]:
    init_db()
    with get_db() as conn:
        cursor = conn.execute("""
            SELECT id, created_at, role_title, match_score, status, error
            FROM runs
            ORDER BY datetime(created_at) DESC
        """)
        rows = cursor.fetchall()
        return [dict(row) for row in rows]

def get_run_by_id(run_id: str) -> Optional[Dict[str, Any]]:
    init_db()
    with get_db() as conn:
        cursor = conn.execute("SELECT * FROM runs WHERE id = ?", (run_id,))
        row = cursor.fetchone()
        if not row:
            return None
        data = dict(row)
        for field in ["jd_analysis", "match_result", "tailored_resume", "interview_prep"]:
            if data.get(field):
                try:
                    data[field] = json.loads(data[field])
                except Exception:
                    pass
        return data
