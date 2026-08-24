# `webapp/` — Substack MCP Dashboard Frontend

The frontend for `substack-mcp` is a modern, responsive Single Page Application (SPA) built with **Vite**, **React 18**, **Tailwind CSS**, and **Biome**.

## Features

- **Dashboard**: Quick feed ingestion, publication grid, system metrics.
- **Feed Reader**: Article search & reader pane with one-click Star/Favorite toggle.
- **Favorites**: Bookmarked article collection with instant filter and reading view.
- **Draft Studio**: Split-pane Markdown editor with live HTML preview & paywall dividers.
- **Chat AI Assistant**: Interactive chat interface connected to your Local LLM.
- **Analytics & Community**: Subscriber growth charts and post comment manager.
- **Tools & MCP**: FastMCP streamable HTTP `/mcp` inspector & tool definitions.
- **Settings & Help**: Session cookie auth setup, LLM engine tester, live diagnostic cards.
- **Logs**: Real-time server log stream.

## Setup & Development Commands

```bash
# Navigate to webapp directory
cd webapp

# Install dependencies
npm install

# Run Vite dev server (Port 11164)
npm run dev

# Run Biome lint & format
npm run lint
npm run format

# Build for production
npm run build
```
