# Substack MCP (`substack-mcp`)

FastMCP 3.1+ Model Context Protocol (MCP) server and React webapp dashboard for Substack newsletters.

## Features

- **RSS & Article Ingestion**: Parse feeds, extract clean Markdown/HTML, search articles across publications.
- **Draft & Publishing Engine**: Stage, preview, convert Markdown to Substack post format, and publish drafts.
- **Analytics & Subscriber Insights**: Track subscriber counts, open rates, traffic sources, and post performance.
- **Community & Discussions**: Read and respond to article comments and newsletter discussions.
- **Webapp Dashboard**: Real-time management interface built with Vite, React, and Tailwind CSS.

## Architecture

- **Backend Port**: `11163` (FastAPI REST `/api/*` + FastMCP HTTP `/mcp`)
- **Frontend Port**: `11164` (Vite SPA)

## Quick Start

```powershell
.\start.ps1
```

Or using `just`:

```bash
just start
```
