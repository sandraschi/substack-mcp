# `substack_mcp/` — Substack MCP Backend Package

The Python backend package for `substack-mcp` implements the FastMCP 3.1+ server, FastAPI REST endpoints, Substack RSS/HTTP client, and SQLite database interface.

## Package Architecture

```
substack_mcp/
├── __init__.py      # Package metadata
├── server.py        # FastMCP 3.1+ entrypoint & FastAPI application
├── client.py        # Substack RSS parser, HTTP client, and LocalLLMClient
├── db.py            # SQLite database interface (data/substack.sqlite3)
└── tools/           # Portmanteau MCP Tool Handlers
    ├── __init__.py
    ├── feed.py      # substack_feed handler
    ├── drafts.py    # substack_drafts handler
    ├── stats.py     # substack_stats handler
    └── community.py # substack_community handler
```

## Running the Server

```bash
# Run server via uv on port 11163
uv run python -m substack_mcp.server --port 11163
```
