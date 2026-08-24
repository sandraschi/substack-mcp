# Changelog — `substack-mcp`

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-08-24

### Added
- **FastMCP 3.1+ Server**: Dual-transport server running FastAPI REST endpoints and streamable HTTP on `/mcp` (Port 11163).
- **Portmanteau MCP Tools**:
  - `substack_feed`: Ingest RSS feeds, search cached articles, list tracked publications.
  - `substack_drafts`: Create, edit, list, delete, and convert Markdown drafts into Substack HTML.
  - `substack_stats`: Record snapshot metrics, retrieve analytics history.
  - `substack_community`: Fetch comments and post discussion replies.
- **SOTA React Webapp Dashboard** (Port 11164):
  - 10-tab navigation: Dashboard, Feed Reader, Favorites, Draft Studio, Chat AI, Analytics, Community, Tools & MCP, Settings, Help, Logs.
- **Local LLM Integration**: Support for Ollama (`http://localhost:11434`), LM Studio, and OpenAI-compatible endpoints for AI-assisted newsletter writing.
- **Favorites & Bookmarks System**: One-click star/unstar and dedicated favorites reading view.
- **Help & System Diagnostics Center**: Real-time diagnostic cards (`/health`, DB, Substack Auth, Local LLM), cookie extractor tutorial, searchable FAQ.
- **Code Quality & CI/CD**:
  - Biome linter and formatter setup (`biome.json`).
  - Python linting with `ruff`.
  - Pytest unit test suite (`tests/`).
  - GitHub Actions workflow (`.github/workflows/ci.yml`).
