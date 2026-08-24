"""SQLite database interface for substack-mcp."""

import sqlite3
from pathlib import Path
from typing import Any, Dict, List, Optional

DB_PATH = Path(__file__).parent.parent / "data" / "substack.sqlite3"


def get_db_connection() -> sqlite3.Connection:
    """Get sqlite connection with dict-like row access."""
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    """Initialize database tables."""
    with get_db_connection() as conn:
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS publications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                domain TEXT UNIQUE NOT NULL,
                name TEXT NOT NULL,
                rss_url TEXT NOT NULL,
                added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS articles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                guid TEXT UNIQUE NOT NULL,
                publication_domain TEXT NOT NULL,
                title TEXT NOT NULL,
                link TEXT NOT NULL,
                author TEXT,
                pub_date TEXT,
                summary TEXT,
                content TEXT,
                cached_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS drafts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                subtitle TEXT DEFAULT '',
                content TEXT NOT NULL,
                publication TEXT DEFAULT '',
                status TEXT DEFAULT 'draft',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS stats (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                publication TEXT NOT NULL,
                subscribers INTEGER DEFAULT 0,
                views INTEGER DEFAULT 0,
                open_rate REAL DEFAULT 0.0,
                recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                level TEXT DEFAULT 'INFO',
                message TEXT NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS favorites (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                guid TEXT UNIQUE NOT NULL,
                publication_domain TEXT NOT NULL,
                title TEXT NOT NULL,
                link TEXT NOT NULL,
                author TEXT,
                summary TEXT,
                pub_date TEXT,
                saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        conn.commit()
        seed_default_settings()


def seed_default_settings() -> None:
    defaults = {
        "session_cookie": "",
        "default_publication": "",
        "llm_provider": "ollama",
        "llm_base_url": "http://localhost:11434",
        "llm_model": "llama3",
        "llm_api_key": "",
    }
    with get_db_connection() as conn:
        cursor = conn.cursor()
        for k, v in defaults.items():
            cursor.execute("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)", (k, v))
        conn.commit()


# --- Settings ---


def get_setting(key: str, default: str = "") -> str:
    with get_db_connection() as conn:
        cursor = conn.cursor()
        row = cursor.execute("SELECT value FROM settings WHERE key = ?", (key,)).fetchone()
        return row["value"] if row else default


def get_all_settings() -> Dict[str, str]:
    with get_db_connection() as conn:
        cursor = conn.cursor()
        rows = cursor.execute("SELECT key, value FROM settings").fetchall()
        return {r["key"]: r["value"] for r in rows}


def set_setting(key: str, value: str) -> None:
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", (key, value))
        conn.commit()


def save_settings(settings_dict: Dict[str, str]) -> Dict[str, str]:
    with get_db_connection() as conn:
        cursor = conn.cursor()
        for k, v in settings_dict.items():
            cursor.execute("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", (k, str(v)))
        conn.commit()
    return get_all_settings()


# --- Logs ---


def add_log(message: str, level: str = "INFO") -> None:
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("INSERT INTO logs (level, message) VALUES (?, ?)", (level, message))
            conn.commit()
    except Exception:
        pass


def get_logs(limit: int = 100) -> List[Dict[str, Any]]:
    with get_db_connection() as conn:
        cursor = conn.cursor()
        rows = cursor.execute("SELECT * FROM logs ORDER BY id DESC LIMIT ?", (limit,)).fetchall()
        return [dict(r) for r in rows]


def clear_logs() -> None:
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM logs")
        conn.commit()


# --- Favorites ---


def add_favorite(article: Dict[str, Any]) -> Dict[str, Any]:
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT OR REPLACE INTO favorites 
            (guid, publication_domain, title, link, author, summary, pub_date)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                article.get("guid") or article.get("link"),
                article.get("publication_domain", ""),
                article.get("title", "Untitled"),
                article.get("link", ""),
                article.get("author", ""),
                article.get("summary", ""),
                article.get("pub_date", ""),
            ),
        )
        conn.commit()
        return article


def list_favorites() -> List[Dict[str, Any]]:
    with get_db_connection() as conn:
        cursor = conn.cursor()
        rows = cursor.execute("SELECT * FROM favorites ORDER BY id DESC").fetchall()
        return [dict(r) for r in rows]


def remove_favorite(guid: str) -> bool:
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM favorites WHERE guid = ? OR link = ?", (guid, guid))
        conn.commit()
        return cursor.rowcount > 0


def is_favorite(guid: str) -> bool:
    with get_db_connection() as conn:
        cursor = conn.cursor()
        row = cursor.execute("SELECT id FROM favorites WHERE guid = ? OR link = ?", (guid, guid)).fetchone()
        return row is not None


# --- Publications ---


def add_publication(domain: str, name: str, rss_url: str) -> Dict[str, Any]:
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("INSERT OR REPLACE INTO publications (domain, name, rss_url) VALUES (?, ?, ?)", (domain.lower().strip(), name, rss_url))
        conn.commit()
        return {"domain": domain, "name": name, "rss_url": rss_url}


def list_publications() -> List[Dict[str, Any]]:
    with get_db_connection() as conn:
        cursor = conn.cursor()
        rows = cursor.execute("SELECT * FROM publications ORDER BY name ASC").fetchall()
        return [dict(r) for r in rows]


# --- Articles ---


def save_articles(articles: List[Dict[str, Any]]) -> int:
    saved = 0
    with get_db_connection() as conn:
        cursor = conn.cursor()
        for item in articles:
            cursor.execute(
                """
                INSERT OR REPLACE INTO articles 
                (guid, publication_domain, title, link, author, pub_date, summary, content)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    item.get("guid") or item.get("link"),
                    item.get("publication_domain", ""),
                    item.get("title", "Untitled"),
                    item.get("link", ""),
                    item.get("author", ""),
                    item.get("pub_date", ""),
                    item.get("summary", ""),
                    item.get("content", ""),
                ),
            )
            saved += 1
        conn.commit()
    return saved


def query_articles(domain: Optional[str] = None, search: Optional[str] = None, limit: int = 50) -> List[Dict[str, Any]]:
    with get_db_connection() as conn:
        cursor = conn.cursor()
        sql = "SELECT * FROM articles WHERE 1=1"
        params: List[Any] = []
        if domain:
            sql += " AND publication_domain = ?"
            params.append(domain.lower().strip())
        if search:
            sql += " AND (title LIKE ? OR summary LIKE ? OR content LIKE ?)"
            term = f"%{search}%"
            params.extend([term, term, term])
        sql += " ORDER BY id DESC LIMIT ?"
        params.append(limit)
        rows = cursor.execute(sql, params).fetchall()
        return [dict(r) for r in rows]


# --- Drafts ---


def create_draft(title: str, subtitle: str, content: str, publication: str = "") -> Dict[str, Any]:
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("INSERT INTO drafts (title, subtitle, content, publication) VALUES (?, ?, ?, ?)", (title, subtitle, content, publication))
        conn.commit()
        draft_id = cursor.lastrowid
        return get_draft(draft_id)  # type: ignore


def get_draft(draft_id: int) -> Optional[Dict[str, Any]]:
    with get_db_connection() as conn:
        cursor = conn.cursor()
        row = cursor.execute("SELECT * FROM drafts WHERE id = ?", (draft_id,)).fetchone()
        return dict(row) if row else None


def list_drafts(status: Optional[str] = None) -> List[Dict[str, Any]]:
    with get_db_connection() as conn:
        cursor = conn.cursor()
        if status:
            rows = cursor.execute("SELECT * FROM drafts WHERE status = ? ORDER BY updated_at DESC", (status,)).fetchall()
        else:
            rows = cursor.execute("SELECT * FROM drafts ORDER BY updated_at DESC").fetchall()
        return [dict(r) for r in rows]


def update_draft(draft_id: int, title: str, subtitle: str, content: str, status: str = "draft") -> Optional[Dict[str, Any]]:
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            UPDATE drafts 
            SET title = ?, subtitle = ?, content = ?, status = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            """,
            (title, subtitle, content, status, draft_id),
        )
        conn.commit()
        return get_draft(draft_id)


def delete_draft(draft_id: int) -> bool:
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM drafts WHERE id = ?", (draft_id,))
        conn.commit()
        return cursor.rowcount > 0


# --- Stats ---


def record_stats(publication: str, subscribers: int, views: int, open_rate: float) -> Dict[str, Any]:
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO stats (publication, subscribers, views, open_rate) VALUES (?, ?, ?, ?)", (publication, subscribers, views, open_rate)
        )
        conn.commit()
        return {"publication": publication, "subscribers": subscribers, "views": views, "open_rate": open_rate}


def get_latest_stats(publication: Optional[str] = None) -> List[Dict[str, Any]]:
    with get_db_connection() as conn:
        cursor = conn.cursor()
        if publication:
            rows = cursor.execute("SELECT * FROM stats WHERE publication = ? ORDER BY id DESC LIMIT 10", (publication,)).fetchall()
        else:
            rows = cursor.execute("SELECT * FROM stats ORDER BY id DESC LIMIT 20").fetchall()
        return [dict(r) for r in rows]
