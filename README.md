<div align="center">

# 📰 Substack MCP (`substack-mcp`)

[![CI](https://github.com/sandraschi/substack-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/sandraschi/substack-mcp/actions/workflows/ci.yml)
![Python Version](https://img.shields.io/badge/python-3.11%2B-blue.svg)
![FastMCP Version](https://img.shields.io/badge/FastMCP-3.1%2B-orange.svg)
![React](https://img.shields.io/badge/React-18-61DAFB.svg?logo=react)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Backend Port](https://img.shields.io/badge/backend-11163-purple.svg)
![Webapp Port](https://img.shields.io/badge/webapp-11164-emerald.svg)

**FastMCP 3.1+ Model Context Protocol (MCP) server & SOTA React webapp dashboard for Substack newsletters.**

[Quick Start](#-quick-start) • [Features](#-features) • [Sub-Packages](#-sub-package-documentation) • [Documentation](docs/README.md) • [Contributing](docs/DEVELOPMENT.md)

---

</div>

## 🌟 Highlights

- **RSS & Newsletter Ingestion**: Ingest, parse, and search articles across any Substack newsletter with offline SQLite storage.
- **Draft Studio & Markdown Converter**: Write posts in Markdown with paywall dividers (`<!-- paywall -->`) and preview rendered HTML.
- **Local AI Writing Assistant**: Chat with your local LLM (Ollama, LM Studio, vLLM) to outline issues, polish tone, and brainstorm headlines.
- **Favorites & Bookmarks**: Star articles directly in the reader and manage a saved collection.
- **10-Tab Webapp Dashboard**: Clean SPA interface with real-time logs, tools inspector, analytics charts, and diagnostic cards.
- **Dual-Transport MCP Server**: Connect AI agents (Antigravity, Claude, Cursor) via FastMCP Streamable HTTP (`/mcp`) or Stdio.

---

## ⚡ Quick Start

### 1. Launch Server & Webapp Dashboard

```powershell
# Clone the repository
git clone https://github.com/sandraschi/substack-mcp.git
cd substack-mcp

# Launch backend (11163) and dashboard (11164)
.\start.ps1
```

The webapp dashboard will automatically open in your default browser at `http://127.0.0.1:11164`.

### 2. Connect AI Assistants (Google Antigravity / Claude Desktop)

Point your MCP client configuration to the FastMCP Streamable HTTP endpoint:

```
http://127.0.0.1:11163/mcp
```

---

## 🛠️ Portmanteau MCP Tools

| Tool | Operations | Description |
|---|---|---|
| [`substack_feed`](docs/TOOLS.md#1-substack_feed) | `fetch`, `list_publications`, `query`, `get_article` | Ingest RSS feeds, list tracked newsletters, search articles |
| [`substack_drafts`](docs/TOOLS.md#2-substack_drafts) | `create`, `list`, `get`, `update`, `delete`, `convert_markdown` | Stage drafts, edit content, render Markdown HTML |
| [`substack_stats`](docs/TOOLS.md#3-substack_stats) | `record`, `get`, `summary` | Track subscriber metrics, post views, open rates |
| [`substack_community`](docs/TOOLS.md#4-substack_community) | `get_comments`, `post_comment` | Read article comments and stage discussion responses |

---

## 📁 Sub-Package Documentation

To explore specific modules within `substack-mcp`, see our targeted sub-readmes:

- 🎨 **[Webapp Dashboard (`webapp/`)](webapp/README.md)** — Vite, React, Tailwind CSS, and Biome setup.
- ⚙️ **[Backend Package (`substack_mcp/`)](substack_mcp/README.md)** — FastAPI, FastMCP 3.1+, Local LLM engine, and SQLite database.
- 🧪 **[Test Suite (`tests/`)](tests/README.md)** — Pytest unit test specifications and coverage.
- 📜 **[Scripts (`scripts/`)](scripts/README.md)** — Fleet launchers and prompt generation utilities.
- 📚 **[Documentation Hub (`docs/`)](docs/README.md)** — Complete configuration, onboarding, tools, and troubleshooting guides.

---

## 📄 License

Distributed under the [MIT License](LICENSE).
