# Configuration Reference — `substack-mcp`

`substack-mcp` settings are persisted in `data/substack.sqlite3` in the `settings` key-value table.

## Settings Options

| Setting Key | Default | Description |
|---|---|---|
| `session_cookie` | `""` | Substack `substack.sid` authentication cookie extracted from browser |
| `default_publication` | `""` | Default publication domain (e.g., `mynewsletter.substack.com`) |
| `llm_provider` | `"ollama"` | Local LLM engine provider (`ollama`, `lmstudio`, `custom`) |
| `llm_base_url` | `"http://localhost:11434"` | Base URL for Local LLM API endpoint |
| `llm_model` | `"llama3"` | Model name (e.g. `llama3`, `qwen2.5`, `mistral`) |
| `llm_api_key` | `""` | Optional API key for remote OpenAI-compatible proxies |

## Updating Settings

Settings can be managed directly via:
1. Webapp **Settings** tab (`http://127.0.0.1:11164`)
2. REST API: `POST /api/settings` with JSON body
