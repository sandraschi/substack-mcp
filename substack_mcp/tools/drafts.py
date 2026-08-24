"""Substack draft management and Markdown converter tool."""

from typing import Any, Dict, Optional

from substack_mcp import db
from substack_mcp.client import SubstackClient


def handle_substack_drafts(
    operation: str,
    draft_id: Optional[int] = None,
    title: Optional[str] = None,
    subtitle: Optional[str] = None,
    content: Optional[str] = None,
    publication: Optional[str] = None,
    status: str = "draft",
) -> Dict[str, Any]:
    """
    Portmanteau tool for managing Substack drafts and converting Markdown content.

    Operations:
      - 'create': Create a new staged draft.
      - 'list': List all drafts.
      - 'get': Retrieve a draft by ID.
      - 'update': Update draft content, title, or status ('draft', 'ready', 'published').
      - 'delete': Delete a draft.
      - 'convert_markdown': Convert Markdown text to Substack-formatted HTML.
    """
    client = SubstackClient()

    if operation == "create":
        if not title or not content:
            return {"error": "title and content parameters are required for 'create'"}
        draft = db.create_draft(title, subtitle or "", content, publication or "")
        return {"status": "success", "message": "Draft created", "draft": draft}

    elif operation == "list":
        drafts = db.list_drafts(status=status if status != "all" else None)
        return {"status": "success", "count": len(drafts), "drafts": drafts}

    elif operation == "get":
        if not draft_id:
            return {"error": "draft_id parameter is required for 'get'"}
        draft = db.get_draft(draft_id)
        if draft:
            return {"status": "success", "draft": draft}
        return {"status": "error", "error": "Draft not found"}

    elif operation == "update":
        if not draft_id:
            return {"error": "draft_id parameter is required for 'update'"}
        existing = db.get_draft(draft_id)
        if not existing:
            return {"status": "error", "error": "Draft not found"}

        updated = db.update_draft(
            draft_id=draft_id,
            title=title or existing["title"],
            subtitle=subtitle if subtitle is not None else existing["subtitle"],
            content=content or existing["content"],
            status=status or existing["status"],
        )
        return {"status": "success", "message": "Draft updated", "draft": updated}

    elif operation == "delete":
        if not draft_id:
            return {"error": "draft_id parameter is required for 'delete'"}
        success = db.delete_draft(draft_id)
        if success:
            return {"status": "success", "message": f"Draft {draft_id} deleted"}
        return {"status": "error", "error": "Draft not found or already deleted"}

    elif operation == "convert_markdown":
        if not content:
            return {"error": "content parameter is required for 'convert_markdown'"}
        html = client.convert_markdown_to_html(content)
        return {"status": "success", "html": html}

    else:
        return {"error": f"Unknown operation '{operation}'. Supported: create, list, get, update, delete, convert_markdown"}
