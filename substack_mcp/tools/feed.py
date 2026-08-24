"""Substack feed management and article reading tool."""

from typing import Any, Dict, Optional

from substack_mcp import db
from substack_mcp.client import SubstackClient


def handle_substack_feed(
    operation: str,
    publication: Optional[str] = None,
    search: Optional[str] = None,
    article_guid: Optional[str] = None,
    limit: int = 20,
    session_cookie: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Portmanteau tool for reading and searching Substack feeds and articles.

    Operations:
      - 'fetch': Fetch and parse RSS feed for a publication (e.g., 'thepsf', 'platform.substack.com').
      - 'list_publications': List all stored/tracked publications.
      - 'query': Search and filter cached articles.
      - 'get_article': Fetch single article content.
    """
    client = SubstackClient(session_cookie=session_cookie)

    if operation == "fetch":
        if not publication:
            return {"error": "publication parameter is required for operation 'fetch'"}
        try:
            feed_data = client.fetch_rss_feed(publication)
            db.add_publication(feed_data["domain"], feed_data["title"], feed_data["rss_url"])
            saved_count = db.save_articles(feed_data["entries"])
            return {
                "status": "success",
                "message": f"Fetched {saved_count} articles from {feed_data['title']}",
                "publication": feed_data["domain"],
                "title": feed_data["title"],
                "rss_url": feed_data["rss_url"],
                "articles": feed_data["entries"][:limit],
            }
        except Exception as e:
            return {"status": "error", "error": str(e)}

    elif operation == "list_publications":
        pubs = db.list_publications()
        return {"status": "success", "count": len(pubs), "publications": pubs}

    elif operation == "query":
        articles = db.query_articles(domain=publication, search=search, limit=limit)
        return {"status": "success", "count": len(articles), "articles": articles}

    elif operation == "get_article":
        if not article_guid:
            return {"error": "article_guid parameter is required for operation 'get_article'"}
        articles = db.query_articles(search=article_guid, limit=1)
        if articles:
            return {"status": "success", "article": articles[0]}
        return {"status": "error", "error": "Article not found in cache"}

    else:
        return {"error": f"Unknown operation '{operation}'. Supported: fetch, list_publications, query, get_article"}
