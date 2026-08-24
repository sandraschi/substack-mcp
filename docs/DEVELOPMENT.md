# Developer Guide — `substack-mcp`

Guidelines for developing, testing, and contributing to `substack-mcp`.

## Setup Development Environment

```bash
git clone https://github.com/sandraschi/substack-mcp.git
cd substack-mcp

# Python virtualenv & dependencies
uv sync

# Webapp dependencies
cd webapp
npm install
cd ..
```

## Quality Suite & Tasks

```bash
# Run full suite (Python lint + Pytest + Biome check)
just check

# Run Pytest suite
uv run pytest

# Python Lint & Format
uv run ruff check .
uv run ruff format .

# Webapp Biome Check
cd webapp && npm run lint
cd webapp && npm run format

# Webapp Production Build
cd webapp && npm run build
```
