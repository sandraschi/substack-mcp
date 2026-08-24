# Substack MCP — AGENTS.md

**Purpose**: SOTA FastMCP server and React webapp for Substack newsletter feed reading, draft/publishing workflows, subscriber stats, and community interactions.

## Quick Reference

- **Backend Port**: `11163` (FastAPI REST `/api/*` + FastMCP 3.1+ HTTP `/mcp`)
- **Frontend Port**: `11164` (Vite + React + Tailwind CSS webapp dashboard)
- **Start Script**: `start.ps1` or `start.bat`

## Key Modules

- `substack_mcp/server.py`: FastMCP 3.1+ server entrypoint and ASGI uvicorn application.
- `substack_mcp/client.py`: Substack RSS feed reader and HTTP REST client.
- `substack_mcp/db.py`: SQLite database for articles, cached feeds, drafts, and analytics history (`data/substack.sqlite3`).
- `substack_mcp/tools/`:
  - `feed.py`: `substack_feed` tool portmanteau (fetching, listing, reading RSS & Substack posts).
  - `drafts.py`: `substack_drafts` tool portmanteau (staging, editing, converting Markdown, publishing).
  - `stats.py`: `substack_stats` tool portmanteau (subscriber stats, views, post metrics).
  - `community.py`: `substack_community` tool portmanteau (fetching/posting comments, discussions).
- `webapp/`: Vite React dashboard (Dashboard, Reader, Draft Studio, Analytics, Community, Tools & Logs).

## Development Commands

```bash
just dev      # Run backend dev server on 11163
just web      # Run webapp dev server on 11164
just start    # Run both via start.ps1
just lint     # Ruff check & format
```
