# CLAUDE.md — `substack-mcp` Development Directives

**Purpose**: Agent instructions and quick reference commands for `substack-mcp`.

## Port Allocation

- **Backend (FastAPI + FastMCP HTTP `/mcp`)**: `11163`
- **Frontend Webapp (Vite React SPA)**: `11164`

## Commands

```bash
# Backend Dev Server
uv run python -m substack_mcp.server --port 11163

# Frontend Webapp Dev Server
cd webapp && npm run dev

# Unified Start Script (Clears port zombies, launches uvicorn & vite, opens browser)
powershell -ExecutionPolicy Bypass -File .\start.ps1

# Run Tests
uv run pytest

# Python Lint & Format
uv run ruff check .
uv run ruff format .

# Webapp Biome Lint & Format
cd webapp && npm run lint
cd webapp && npm run format

# Webapp Build
cd webapp && npm run build

# Run Full Quality Suite
just check
```

## Conventions & Rules

- **FastMCP 3.1+**: All tools must use the Portmanteau pattern (consolidated tools with an `operation` parameter).
- **SQLite Storage**: All data persists in `data/substack.sqlite3`.
- **Ruff & Biome**: Maintain 0 lint errors in both Python (`ruff check`) and TypeScript (`biome check .`).
- **No Bare Ports**: Always clear ports `11163` and `11164` before binding.
