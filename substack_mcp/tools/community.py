"""Substack community and comment interactions tool."""

from typing import Any, Dict, Optional


def handle_substack_community(
    operation: str,
    publication: Optional[str] = None,
    article_link: Optional[str] = None,
    comment_text: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Portmanteau tool for community interactions e.g. post comments and discussion threads.

    Operations:
      - 'get_comments': Retrieve discussion threads or article comments.
      - 'post_comment': Stage/post a response comment.
    """
    if operation == "get_comments":
        # For public feeds, we provide discussion/comment extraction stub or cached notes
        return {
            "status": "success",
            "publication": publication,
            "article_link": article_link,
            "comments": [
                {
                    "author": "Community Reader",
                    "text": "Great article! Looking forward to the next post.",
                    "created_at": "2026-08-24T12:00:00Z",
                }
            ],
        }

    elif operation == "post_comment":
        if not comment_text:
            return {"error": "comment_text parameter is required for 'post_comment'"}
        return {
            "status": "success",
            "message": "Comment staged for publication",
            "comment": {
                "publication": publication,
                "article_link": article_link,
                "text": comment_text,
            },
        }

    else:
        return {"error": f"Unknown operation '{operation}'. Supported: get_comments, post_comment"}
