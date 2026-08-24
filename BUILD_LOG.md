# Build Log — `substack-mcp`

**Repository**: `substack-mcp`  
**Creation Date**: 2026-08-24  
**Primary Ports**: `11163` (Backend) | `11164` (Webapp)  

---

## Architecture Milestones

- **2026-08-24**: Scaffolded repository `d:\Dev\repos\substack-mcp`.
- **2026-08-24**: Registered ports `11163` & `11164` in `mcp-central-docs/operations/WEBAPP_PORTS.md`.
- **2026-08-24**: Implemented FastMCP 3.1+ server (`server.py`) and SQLite database manager (`db.py`).
- **2026-08-24**: Built 4 portmanteau MCP tools: `substack_feed`, `substack_drafts`, `substack_stats`, `substack_community`.
- **2026-08-24**: Built SOTA React webapp dashboard (`webapp/`) with Vite + React + Tailwind CSS.
- **2026-08-24**: Integrated Local LLM Engine (`LocalLLMClient`) supporting Ollama, LM Studio, and OpenAI-compatible endpoints.
- **2026-08-24**: Added Favorites & Bookmarks system and one-click Star toggle in Feed Reader.
- **2026-08-24**: Integrated Biome JS/TS linter and formatter (`biome.json`).
- **2026-08-24**: Added Pytest test suite (`tests/`) with 14 passing unit tests.
- **2026-08-24**: Added GitHub Actions CI workflow (`.github/workflows/ci.yml`).
- **2026-08-24**: Published public repository to GitHub: `https://github.com/sandraschi/substack-mcp`.
