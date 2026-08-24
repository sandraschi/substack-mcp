# Product Requirements Document (PRD) — `substack-mcp`

**Version**: 0.1.0  
**Status**: Active / Production  
**Fleet Allocation**: Backend Port `11163` | Webapp Port `11164`  

---

## 1. Overview & Vision

`substack-mcp` is a Model Context Protocol (MCP) server and React webapp dashboard for Substack publications. Built using FastMCP 3.1+ (Python) and Vite + React + Tailwind CSS, it enables AI assistants (Google Antigravity, Claude Desktop, Cursor) and human creators to read RSS feeds, search archived newsletters, stage/preview Markdown post drafts, track subscriber analytics, interact with community discussions, and utilize local LLMs for newsletter drafting.

---

## 2. Target Users & Use Cases

- **Newsletter Writers & Content Creators**: Draft posts in Markdown with paywall dividers (`<!-- paywall -->`), preview HTML, and manage staged drafts.
- **Researchers & Readers**: Ingest feeds from multiple Substack publications, search articles offline in SQLite, and bookmark favorite posts.
- **AI Coding Assistants & Agents**: Interact with Substack using FastMCP streamable HTTP (`/mcp`) portmanteau tools (`substack_feed`, `substack_drafts`, `substack_stats`, `substack_community`).

---

## 3. System Architecture

```
+-----------------------------------------------------------------------------------+
|                                 User / AI Client                                  |
|   (Antigravity / Claude Desktop / Cursor / Browser at http://127.0.0.1:11164)    |
+----------------------------------------+------------------------------------------+
                                         |
               +-------------------------+-------------------------+
               |                                                   |
               v (Port 11164)                                      v (Port 11163)
+-------------------------------+                 +---------------------------------+
|   React Webapp Dashboard      | -- /api proxy ->|    FastAPI + FastMCP Server      |
|   (Vite + Tailwind + Biome)   |                 |    (Python 3.11+ / uvicorn)      |
+-------------------------------+                 +----------------+----------------+
                                                                   |
                                          +------------------------+------------------------+
                                          |                        |                        |
                                          v                        v                        v
                                   +--------------+       +------------------+     +-------------------+
                                   | SQLite DB    |       | Substack RSS     |     | Local LLM Engine  |
                                   | (substack.   |       | & HTTP API       |     | (Ollama / LM      |
                                   |  sqlite3)    |       | Client           |     |  Studio / OpenAI) |
                                   +--------------+       +------------------+     +-------------------+
```

---

## 4. Key Components & Portmanteau Tools

### 4.1 MCP Tools

1. `substack_feed`: Ingest RSS feeds, list publications, query cached articles, fetch article details.
2. `substack_drafts`: Create, update, list, delete, and convert Markdown drafts into Substack HTML.
3. `substack_stats`: Record, retrieve, and summarize subscriber metrics and post views.
4. `substack_community`: Retrieve comments and post community responses.

### 4.2 Webapp Dashboard Tabs

- **Dashboard**: Quick feed ingestion bar, tracked publications grid, status metrics.
- **Feed Reader**: Article search and reader pane across cached Substack posts.
- **Favorites**: Bookmarked articles collection with Star toggle.
- **Draft Studio**: Split-pane Markdown editor with live HTML preview and paywall dividers.
- **Chat AI**: Interactive assistant using your Local LLM (Ollama/LM Studio).
- **Analytics**: Subscriber growth metrics and snapshot recorder.
- **Community**: Comment reader and response staging.
- **Tools & MCP**: Live `/mcp` streamable HTTP endpoint inspector.
- **Settings**: Substack `substack.sid` auth cookie, Local LLM configuration, provider selector, connection test.
- **Help**: System Diagnostics card (`/health`, DB, Auth, LLM status), cookie extraction tutorial, FAQ.
- **Logs**: Real-time event log stream and ring-buffer.

---

## 5. Non-Functional Requirements

- **Performance**: RSS parsing and SQLite queries execute in under 100ms.
- **Code Quality**: Python code passes `ruff` with 0 errors; TypeScript/React code passes `biome check .` and `tsc` build with 0 errors.
- **Test Coverage**: 100% pass rate on `pytest` test suite.
