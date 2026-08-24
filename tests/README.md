# `tests/` — Pytest Test Suite

The test suite for `substack-mcp` provides unit and integration tests using `pytest` and `fastapi.testclient.TestClient`.

## Test Modules

- `test_client.py`: Verifies RSS URL normalization and Markdown-to-HTML paywall formatting.
- `test_db.py`: Verifies SQLite CRUD operations for settings, publications, articles, drafts, and favorites.
- `test_tools.py`: Verifies portmanteau tool functions (`substack_feed`, `substack_drafts`, `substack_stats`, `substack_community`).
- `test_server.py`: Verifies FastAPI REST endpoints (`/health`, `/api/settings`, `/api/favorites`, `/api/drafts`).

## Running Tests

```bash
# Run pytest suite via uv
uv run pytest
```
