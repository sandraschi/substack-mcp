"""FastMCP 3.1+ Server & FastAPI REST API for Substack MCP."""

import argparse
import logging
from typing import Any, Dict, Optional

import uvicorn
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastmcp import FastMCP

from substack_mcp import db
from substack_mcp.client import LocalLLMClient
from substack_mcp.tools import community, drafts, feed, stats

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("substack_mcp")

# Initialize DB
db.init_db()

# Initialize FastMCP Server
mcp = FastMCP(
    name="Substack MCP Server",
    instructions="SOTA FastMCP 3.1+ server for Substack feed ingestion, draft staging/publishing, subscriber stats, community interactions, and local LLM writing assistant.",
)


# --- Register MCP Tools ---


@mcp.tool()
def substack_feed(
    operation: str,
    publication: Optional[str] = None,
    search: Optional[str] = None,
    article_guid: Optional[str] = None,
    limit: int = 20,
    session_cookie: Optional[str] = None,
) -> Dict[str, Any]:
    """Portmanteau tool for reading and searching Substack feeds and articles."""
    return feed.handle_substack_feed(
        operation=operation,
        publication=publication,
        search=search,
        article_guid=article_guid,
        limit=limit,
        session_cookie=session_cookie,
    )


@mcp.tool()
def substack_drafts(
    operation: str,
    draft_id: Optional[int] = None,
    title: Optional[str] = None,
    subtitle: Optional[str] = None,
    content: Optional[str] = None,
    publication: Optional[str] = None,
    status: str = "draft",
) -> Dict[str, Any]:
    """Portmanteau tool for managing Substack drafts and converting Markdown content."""
    return drafts.handle_substack_drafts(
        operation=operation,
        draft_id=draft_id,
        title=title,
        subtitle=subtitle,
        content=content,
        publication=publication,
        status=status,
    )


@mcp.tool()
def substack_stats(
    operation: str,
    publication: Optional[str] = None,
    subscribers: int = 0,
    views: int = 0,
    open_rate: float = 0.0,
) -> Dict[str, Any]:
    """Portmanteau tool for tracking Substack publication analytics."""
    return stats.handle_substack_stats(
        operation=operation,
        publication=publication,
        subscribers=subscribers,
        views=views,
        open_rate=open_rate,
    )


@mcp.tool()
def substack_community(
    operation: str,
    publication: Optional[str] = None,
    article_link: Optional[str] = None,
    comment_text: Optional[str] = None,
) -> Dict[str, Any]:
    """Portmanteau tool for community interactions e.g. post comments and discussion threads."""
    return community.handle_substack_community(
        operation=operation,
        publication=publication,
        article_link=article_link,
        comment_text=comment_text,
    )


# --- Create FastAPI Web & REST App ---

app = FastAPI(title="Substack MCP API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    path = request.url.path
    if not path.startswith("/mcp"):
        db.add_log(f"{request.method} {path}")
    response = await call_next(request)
    return response


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "substack-mcp", "port": 11163}


@app.get("/api/publications")
def get_publications():
    return db.list_publications()


@app.post("/api/publications/fetch")
def fetch_publication_feed(data: Dict[str, Any]):
    pub = data.get("publication")
    if not pub:
        raise HTTPException(status_code=400, detail="publication is required")
    res = feed.handle_substack_feed(operation="fetch", publication=pub)
    if res.get("status") == "error":
        raise HTTPException(status_code=400, detail=res.get("error", "Failed to fetch feed"))
    db.add_log(f"Fetched feed for {pub}")
    return res


@app.get("/api/articles")
def get_articles(publication: Optional[str] = None, search: Optional[str] = None, limit: int = 50):
    return db.query_articles(domain=publication, search=search, limit=limit)


# --- Favorites Endpoints ---


@app.get("/api/favorites")
def get_favorites():
    return db.list_favorites()


@app.post("/api/favorites")
def add_favorite_article(article: Dict[str, Any]):
    fav = db.add_favorite(article)
    db.add_log(f"Added favorite '{article.get('title')}'")
    return fav


@app.delete("/api/favorites/{guid:path}")
def remove_favorite_article(guid: str):
    success = db.remove_favorite(guid)
    if not success:
        raise HTTPException(status_code=404, detail="Favorite not found")
    db.add_log(f"Removed favorite '{guid}'")
    return {"status": "success", "message": "Favorite removed"}


# --- Drafts Endpoints ---


@app.get("/api/drafts")
def get_drafts(status: Optional[str] = None):
    return db.list_drafts(status=status)


@app.post("/api/drafts")
def create_draft(data: Dict[str, Any]):
    title = data.get("title")
    content = data.get("content")
    if not title or not content:
        raise HTTPException(status_code=400, detail="title and content are required")
    subtitle = data.get("subtitle", "")
    publication = data.get("publication", "")
    d = db.create_draft(title=title, subtitle=subtitle, content=content, publication=publication)
    db.add_log(f"Created draft '{title}'")
    return d


@app.put("/api/drafts/{draft_id}")
def update_draft(draft_id: int, data: Dict[str, Any]):
    existing = db.get_draft(draft_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Draft not found")
    title = data.get("title", existing["title"])
    subtitle = data.get("subtitle", existing["subtitle"])
    content = data.get("content", existing["content"])
    status = data.get("status", existing["status"])
    d = db.update_draft(draft_id, title, subtitle, content, status)
    db.add_log(f"Updated draft {draft_id}")
    return d


@app.delete("/api/drafts/{draft_id}")
def delete_draft(draft_id: int):
    success = db.delete_draft(draft_id)
    if not success:
        raise HTTPException(status_code=404, detail="Draft not found")
    db.add_log(f"Deleted draft {draft_id}")
    return {"status": "success", "message": f"Draft {draft_id} deleted"}


@app.get("/api/stats")
def get_stats(publication: Optional[str] = None):
    return stats.handle_substack_stats(operation="summary", publication=publication)


@app.post("/api/convert_markdown")
def convert_markdown(data: Dict[str, Any]):
    md_content = data.get("content", "")
    res = drafts.handle_substack_drafts(operation="convert_markdown", content=md_content)
    return res


# --- Settings & Local LLM API ---


@app.get("/api/settings")
def get_settings():
    return db.get_all_settings()


@app.post("/api/settings")
def save_settings(data: Dict[str, str]):
    updated = db.save_settings(data)
    db.add_log("Updated system settings")
    return updated


@app.post("/api/llm/test")
def test_llm_connection(data: Dict[str, Any]):
    llm = LocalLLMClient(
        provider=data.get("provider"),
        base_url=data.get("base_url"),
        model=data.get("model"),
        api_key=data.get("api_key"),
    )
    return llm.test_connection()


@app.post("/api/chat")
def chat_assistant(data: Dict[str, Any]):
    prompt = data.get("prompt", "")
    if not prompt:
        raise HTTPException(status_code=400, detail="prompt is required")

    system_prompt = (
        "You are an expert Substack newsletter assistant and editor. Help the user brainstorm, outline, edit, format, "
        "and polish newsletter issues, post titles, paywall strategies, and reader engagements."
    )
    context = data.get("context", "")
    if context:
        prompt = f"Context:\n{context}\n\nUser Request: {prompt}"

    history = data.get("history", [])

    llm = LocalLLMClient()
    try:
        reply = llm.generate_chat(prompt=prompt, system_prompt=system_prompt, history=history)
        db.add_log("Generated response via Local LLM")
        return {"status": "success", "reply": reply}
    except Exception as e:
        logger.error(f"Chat generation failed: {e}")
        return {"status": "error", "error": f"LLM error: {str(e)}"}


@app.get("/api/logs")
def get_system_logs(limit: int = 100):
    return db.get_logs(limit=limit)


@app.delete("/api/logs")
def clear_system_logs():
    db.clear_logs()
    return {"status": "success", "message": "Logs cleared"}


# Mount FastMCP Streamable HTTP App onto FastAPI on `/mcp`
app.mount("/mcp", mcp.http_app())


def main():
    parser = argparse.ArgumentParser(description="Substack MCP Server")
    parser.add_argument("--port", type=int, default=11163, help="Port to run server on")
    parser.add_argument("--host", type=str, default="127.0.0.1", help="Host to bind server to")
    args = parser.parse_args()

    logger.info(f"Starting Substack MCP server on http://{args.host}:{args.port}")
    uvicorn.run(app, host=args.host, port=args.port)


if __name__ == "__main__":
    main()
