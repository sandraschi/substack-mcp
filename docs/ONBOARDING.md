# Onboarding Guide — `substack-mcp`

Step-by-step setup instructions for authentication, MCP integration, and features.

## 1. Extracting Your Substack Cookie (`substack.sid`)

1. Log in to your Substack account at [substack.com](https://substack.com).
2. Open Browser Developer Tools (`F12` or `Ctrl+Shift+I`).
3. Navigate to **Application** (Chrome/Edge) or **Storage** (Firefox) &rarr; **Cookies** &rarr; `https://substack.com`.
4. Copy the value of `substack.sid`.
5. Open the webapp dashboard at `http://127.0.0.1:11164` &rarr; go to **Settings** &rarr; paste into **Session Cookie**.

## 2. Connecting to AI Clients

- **FastMCP Streamable HTTP Endpoint**: `http://127.0.0.1:11163/mcp`
- **Supported Clients**: Google Antigravity, Claude Desktop, Cursor, Continue.dev.
