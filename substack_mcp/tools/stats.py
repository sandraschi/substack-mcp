"""Substack publication stats and analytics tool."""

from typing import Any, Dict, Optional

from substack_mcp import db


def handle_substack_stats(
    operation: str,
    publication: Optional[str] = None,
    subscribers: int = 0,
    views: int = 0,
    open_rate: float = 0.0,
) -> Dict[str, Any]:
    """
    Portmanteau tool for tracking Substack publication analytics.

    Operations:
      - 'record': Store a stat snapshot (subscribers, views, open_rate).
      - 'get': Retrieve historical stat snapshots.
      - 'summary': Get analytics summary across all publications.
    """
    if operation == "record":
        if not publication:
            return {"error": "publication parameter is required for 'record'"}
        rec = db.record_stats(publication, subscribers, views, open_rate)
        return {"status": "success", "recorded": rec}

    elif operation == "get":
        stats = db.get_latest_stats(publication=publication)
        return {"status": "success", "count": len(stats), "stats": stats}

    elif operation == "summary":
        all_stats = db.get_latest_stats()
        pubs = db.list_publications()
        drafts = db.list_drafts()
        return {
            "status": "success",
            "total_publications_tracked": len(pubs),
            "total_drafts_staged": len(drafts),
            "recent_snapshots": all_stats[:5],
        }

    else:
        return {"error": f"Unknown operation '{operation}'. Supported: record, get, summary"}
