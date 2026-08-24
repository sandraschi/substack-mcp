from substack_mcp import db
from substack_mcp.tools import community, drafts, feed, stats


def test_tool_drafts():
    db.init_db()
    res = drafts.handle_substack_drafts(operation="create", title="Tool Draft", content="Tool content")
    assert res["status"] == "success"
    draft_id = res["draft"]["id"]

    list_res = drafts.handle_substack_drafts(operation="list")
    assert list_res["status"] == "success"

    del_res = drafts.handle_substack_drafts(operation="delete", draft_id=draft_id)
    assert del_res["status"] == "success"


def test_tool_stats():
    db.init_db()
    rec = stats.handle_substack_stats(operation="record", publication="test.substack.com", subscribers=150, views=2000, open_rate=55.0)
    assert rec["status"] == "success"

    summary = stats.handle_substack_stats(operation="summary")
    assert summary["status"] == "success"


def test_tool_community():
    res = community.handle_substack_community(operation="get_comments", publication="test")
    assert res["status"] == "success"

    post_res = community.handle_substack_community(operation="post_comment", comment_text="Hello world")
    assert post_res["status"] == "success"


def test_tool_feed_list():
    db.init_db()
    res = feed.handle_substack_feed(operation="list_publications")
    assert res["status"] == "success"
