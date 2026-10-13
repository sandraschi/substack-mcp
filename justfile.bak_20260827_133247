# Substack MCP Justfile
set shell := ["powershell.exe", "-c"]

default:
    @just --list

dev:
    uv run python -m substack_mcp.server --port 11163

web:
    cd webapp; npm run dev

start:
    powershell -ExecutionPolicy Bypass -File .\start.ps1

test:
    uv run pytest

lint:
    uv run ruff check .
    cd webapp; npm run lint

format:
    uv run ruff format .
    cd webapp; npm run format

typecheck:
    uv run pyright
    cd webapp; npm run build

mcpb-pack:
    powershell -ExecutionPolicy Bypass -File .\scripts\mcpb-pack.ps1

tauri-build:
    powershell -ExecutionPolicy Bypass -File .\src-tauri\build.ps1

cua-smoke:
    uv run python scripts/cua-smoke.py

check: lint typecheck test
