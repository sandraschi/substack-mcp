# Installation & Setup Guide — `substack-mcp`

Follow these instructions to set up `substack-mcp` locally or connect it to your AI client.

---

## Prerequisites

- **Python**: `>=3.11` (with [`uv`](https://github.com/astral-sh/uv))
- **Node.js**: `>=20.0` (with `npm`)
- **Git**

---

## 1. Local Development Setup

```bash
# Clone the repository
git clone https://github.com/sandraschi/substack-mcp.git
cd substack-mcp

# Install Python dependencies via uv
uv sync

# Install Webapp dependencies
cd webapp
npm install
cd ..

# Launch backend and webapp dashboard
.\start.ps1
```

The webapp will launch automatically in your browser at `http://127.0.0.1:11164`.

---

## 2. Connecting to MCP Clients

### Google Antigravity / Claude Desktop (Streamable HTTP)

Add the HTTP streamable server endpoint to your MCP client config:

- **Endpoint URL**: `http://127.0.0.1:11163/mcp`
- **Transport**: FastMCP 3.1+ Streamable HTTP

### Cursor (Stdio Transport)

Add to `.cursor/mcp.json` or global settings:

```json
{
  "mcpServers": {
    "substack": {
      "command": "uv",
      "args": ["run", "--directory", "d:/Dev/repos/substack-mcp", "substack-mcp"]
    }
  }
}
```

---

## 3. Substack Authentication Setup

1. In the webapp dashboard, navigate to the **Settings** tab.
2. Log in to your Substack account in your browser at `https://substack.com`.
3. Open Browser Developer Tools (`F12`), go to **Application / Storage** &rarr; **Cookies** &rarr; `https://substack.com`.
4. Copy the value of `substack.sid` and paste it into the **Session Cookie** input in Settings.
