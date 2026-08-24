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

[Quick Start](#-quick-start) • [What is Substack?](#-what-is-substack) • [Features](#-features) • [Sub-Packages](#-sub-package-documentation) • [Documentation](docs/README.md)

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

### Key Concepts

- **Publications**: Hosted on subdomains (e.g. `https://thepsf.substack.com`) or custom domains, providing public RSS feeds (`/feed`).
- **Free & Paid Subscriptions**: Creators offer free articles alongside paid subscriber-only posts protected by paywalls (`<!-- paywall -->`).
- **Community & Notes**: Direct post comments and short-form Notes foster an active reader ecosystem.

> 📖 **Want a deep dive?** Read our complete [Substack Primer Guide](docs/SUBSTACK_PRIMER.md) covering Substack's history, platform architecture, RSS endpoints, and monetization strategies.

---

## 🌟 Features

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

- 📖 **[Substack Primer Guide (`docs/SUBSTACK_PRIMER.md`)](docs/SUBSTACK_PRIMER.md)** — What Substack is, platform structure, history, and ecosystem.
- 🎨 **[Webapp Dashboard (`webapp/`)](webapp/README.md)** — Vite, React, Tailwind CSS, and Biome setup.
- ⚙️ **[Backend Package (`substack_mcp/`)](substack_mcp/README.md)** — FastAPI, FastMCP 3.1+, Local LLM engine, and SQLite database.
- 🧪 **[Test Suite (`tests/`)](tests/README.md)** — Pytest unit test specifications and coverage.
- 📜 **[Scripts (`scripts/`)](scripts/README.md)** — Fleet launchers and prompt generation utilities.
- 📚 **[Documentation Hub (`docs/`)](docs/README.md)** — Complete configuration, onboarding, tools, and troubleshooting guides.

---

## 📄 License

Distributed under the [MIT License](LICENSE).
