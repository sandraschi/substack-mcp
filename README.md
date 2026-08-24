<div align="center">

# 📰 Substack MCP (`substack-mcp`)

[![CI](https://github.com/sandraschi/substack-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/sandraschi/substack-mcp/actions/workflows/ci.yml)
![Python Version](https://img.shields.io/badge/python-3.11%2B-blue.svg)
![FastMCP Version](https://img.shields.io/badge/FastMCP-3.1%2B-orange.svg)
![React](https://img.shields.io/badge/React-18-61DAFB.svg?logo=react)
![Ruff](https://img.shields.io/badge/code%20style-ruff-000000.svg?logo=ruff)
![Biome](https://img.shields.io/badge/linter-biome-60a5fa.svg)
![Pyright](https://img.shields.io/badge/types-pyright-blue.svg)
![Tauri](https://img.shields.io/badge/Tauri-v2-FFC107.svg?logo=tauri)
![Local LLM](https://img.shields.io/badge/Local%20LLM-Ollama%20%7C%20LM%20Studio-emerald.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Backend Port](https://img.shields.io/badge/backend-11163-purple.svg)
![Webapp Port](https://img.shields.io/badge/webapp-11164-emerald.svg)

**FastMCP 3.1+ Model Context Protocol (MCP) server & SOTA React webapp dashboard for Substack newsletters.**

[Quick Start](#-quick-start) • [What is Substack?](#-what-is-substack) • [Dual Capabilities](#-dual-capabilities-searchread--draftpublish) • [Onboarding](#-built-in-onboarding--help) • [Documentation](docs/README.md)

---

</div>

## 🧠 What is Substack?

**[Substack](https://substack.com)** is an independent publishing platform and creator network founded in 2017. It allows writers, journalists, researchers, podcasters, and thinkers to publish long-form newsletters directly to their readers' email inboxes and the web.

```
+-----------------------------------------------------------------------------------+
|                              Substack Publication                                 |
+----------------------------------------+------------------------------------------+
                                         |
     +-------------------+---------------+---------------+--------------------+
     |                   |                               |                    |
     v                   v                               v                    v
+---------+     +------------------+           +-------------------+    +-------------------+
|  Posts  |     | Substack Notes   |           |  Substack Chat    |    | Subscriber Tiers  |
| (Email  |     | (Short-form      |           | (Community        |    | (Free, Monthly,   |
| + Web)  |     |  Social Feed)    |           |  Messaging)       |    |  Annual, Founder) |
+---------+     +------------------+           +-------------------+    +-------------------+
```

> 📖 **Want a deep dive?** Read our complete [Substack Primer Guide](docs/SUBSTACK_PRIMER.md) covering Substack's history, platform architecture, RSS endpoints, and monetization strategies.

---

## ⚡ Dual Capabilities: Search/Read & Draft/Publish

`substack-mcp` is designed for **both** readers/researchers and creators/publishers:

| Workflow Mode | Auth Required? | Capabilities & Features |
|---|---|---|
| 🔍 **Search & Read** *(Public Mode)* | **No Login Needed** | • Ingest RSS feeds from any Substack newsletter domain<br>• Full-text offline article search in local SQLite<br>• Reader pane & audio/podcast details<br>• Star & bookmark favorite articles |
| ✍️ **Draft & Publish** *(Author Mode)* | **Requires `substack.sid` Cookie** | • Stage, edit, and update Substack post drafts<br>• Convert Markdown to Substack HTML with paywalls (`<!-- paywall -->`)<br>• Local AI Writing Assistant (Ollama, LM Studio)<br>• Subscriber growth metrics, view counts, & open rates<br>• Post comment browsing & reply staging |

---

## 🚀 Built-in Onboarding & Help

To get you up and running in minutes, `substack-mcp` includes interactive onboarding directly inside the webapp and in the documentation:

- 📱 **Interactive Webapp Dashboard (`http://127.0.0.1:11164`)**:
  - **Onboarding Tab**: Step-by-step setup wizard.
  - **Help & System Diagnostics Tab**: Live health check cards for API Backend (`:11163`), SQLite DB, Substack Cookie Auth, and Local LLMs.
  - **Cookie Extractor Tutorial**: Visual guide to copy your `substack.sid` session cookie from Browser DevTools (`F12`) into Settings.
  - **MCP Client Integration Snippets**: One-click endpoints for Google Antigravity, Claude Desktop, and Cursor.
- 📚 **Repo Guides**: See [`INSTALL.md`](INSTALL.md) and [`docs/ONBOARDING.md`](docs/ONBOARDING.md).

---

## 🌟 Features

- **RSS & Newsletter Ingestion**: Ingest, parse, and search articles across any Substack newsletter with offline SQLite storage.
- **Draft Studio & Markdown Converter**: Write posts in Markdown with paywall dividers (`<!-- paywall -->`) and preview rendered HTML.
- **Local AI Writing Assistant**: Chat with your local LLM (Ollama, LM Studio, vLLM) to outline issues, polish tone, and brainstorm headlines.
- **Favorites & Bookmarks**: Star articles directly in the reader and manage a saved collection.
- **11-Tab Webapp Dashboard**: Clean SPA interface with real-time logs, tools inspector, analytics charts, and diagnostic cards.
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

- 📖 **[Substack Primer Guide (`docs/SUBSTACK_PRIMER.md`)](docs/SUBSTACK_PRIMER.md)** — What Substack is, platform structure, history, and ecosystem.
- 🎨 **[Webapp Dashboard (`webapp/`)](webapp/README.md)** — Vite, React, Tailwind CSS, and Biome setup.
- ⚙️ **[Backend Package (`substack_mcp/`)](substack_mcp/README.md)** — FastAPI, FastMCP 3.1+, Local LLM engine, and SQLite database.
- 🧪 **[Test Suite (`tests/`)](tests/README.md)** — Pytest unit test specifications and coverage.
- 📜 **[Scripts (`scripts/`)](scripts/README.md)** — Fleet launchers and prompt generation utilities.
- 📚 **[Documentation Hub (`docs/`)](docs/README.md)** — Complete configuration, onboarding, tools, and troubleshooting guides.

---

## 📄 License

Distributed under the [MIT License](LICENSE).
