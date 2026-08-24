# `scripts/` — Helper & Supervisor Scripts

Helper scripts for running `substack-mcp` within the agent fleet infrastructure and packaging desktop manifests.

## Scripts Overview

- `FleetStartMode.ps1`: Fleet supervisor launcher script for background job execution.
- `generate-mcpb-prompts.py`: Utility script generating prompt manifests for MCP Desktop packaging (`assets/prompts/prompts.json`).

## Usage

```powershell
# Run supervisor launch script
powershell -ExecutionPolicy Bypass -File .\scripts\FleetStartMode.ps1

# Generate prompt manifest
uv run python scripts/generate-mcpb-prompts.py
```
