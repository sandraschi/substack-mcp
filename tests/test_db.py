from substack_mcp import db


def test_db_init_and_settings():
    db.init_db()
    settings = db.get_all_settings()
    assert "llm_provider" in settings

    db.set_setting("test_key", "test_val")
    assert db.get_setting("test_key") == "test_val"


def test_favorites_crud():
    db.init_db()
    article = {
        "guid": "fav-guid-1",
        "publication_domain": "favpub.substack.com",
        "title": "Fav Title",
        "link": "https://favpub.substack.com/p/fav",
        "summary": "Fav Summary",
    }
    db.add_favorite(article)
    assert db.is_favorite("fav-guid-1") is True

    favs = db.list_favorites()
    assert any(f["guid"] == "fav-guid-1" for f in favs)

    removed = db.remove_favorite("fav-guid-1")
    assert removed is True
    assert db.is_favorite("fav-guid-1") is False


def test_draft_crud():
    db.init_db()
    draft = db.create_draft(title="Test Post", subtitle="Subhead", content="Body text", publication="my-pub")
    assert draft["id"] is not None
    assert draft["title"] == "Test Post"

    updated = db.update_draft(draft["id"], title="Updated Title", subtitle="Subhead", content="Body text", status="ready")
    assert updated is not None
    assert updated["title"] == "Updated Title"
    assert updated["status"] == "ready"

    listed = db.list_drafts()
    assert any(d["id"] == draft["id"] for d in listed)

    deleted = db.delete_draft(draft["id"])
    assert deleted is True
    assert db.get_draft(draft["id"]) is None


def test_publications_and_articles():
    db.init_db()
    db.add_publication(domain="testpub.substack.com", name="Test Pub", rss_url="https://testpub.substack.com/feed")
    pubs = db.list_publications()
    assert any(p["domain"] == "testpub.substack.com" for p in pubs)

    articles = [
        {
            "guid": "guid-101",
            "publication_domain": "testpub.substack.com",
            "title": "Article One",
            "link": "https://testpub.substack.com/p/one",
            "summary": "Summary one",
            "content": "<p>Content one</p>",
        }
    ]
    saved = db.save_articles(articles)
    assert saved == 1

    queried = db.query_articles(domain="testpub.substack.com", search="Article")
    assert len(queried) >= 1
    assert queried[0]["title"] == "Article One"
