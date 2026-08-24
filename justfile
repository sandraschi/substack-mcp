# Substack MCP Justfile

default:
    @just --list

dev:
    uv run python -m substack_mcp.server --port 11163

web:
    cd webapp && npm run dev

start:
    powershell -ExecutionPolicy Bypass -File .\start.ps1

test:
    uv run pytest

lint:
    uv run ruff check .
    cd webapp && npm run lint

format:
    uv run ruff format .
    cd webapp && npm run format

check: lint test
