"""Generate prompt manifests for MCP Desktop packaging."""

import json
from pathlib import Path

ROOT = Path(__file__).parent.parent

PROMPTS = [
    {
        "name": "substack_draft_post",
        "description": "Draft a new Substack newsletter post in Markdown with paywall dividers",
        "arguments": [{"name": "topic", "description": "Topic or title of the post", "required": True}],
    },
    {
        "name": "substack_summarize_feed",
        "description": "Fetch and summarize recent articles from a Substack publication",
        "arguments": [{"name": "publication", "description": "Substack publication domain or name", "required": True}],
    },
]


def main():
    assets_dir = ROOT / "assets" / "prompts"
    assets_dir.mkdir(parents=True, exist_ok=True)
    out_file = assets_dir / "prompts.json"
    out_file.write_text(json.dumps(PROMPTS, indent=2))
    print(f"Generated prompts manifest at {out_file}")


if __name__ == "__main__":
    main()
