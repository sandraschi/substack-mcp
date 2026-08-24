from fastapi.testclient import TestClient

from substack_mcp.server import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "substack-mcp"


def test_settings_endpoints():
    get_res = client.get("/api/settings")
    assert get_res.status_code == 200
    settings = get_res.json()
    assert "llm_provider" in settings

    post_res = client.post("/api/settings", json={"llm_provider": "ollama", "llm_model": "test-model"})
    assert post_res.status_code == 200
    assert post_res.json()["llm_model"] == "test-model"


def test_favorites_api():
    article = {
        "guid": "api-fav-1",
        "publication_domain": "apifav.substack.com",
        "title": "API Fav Title",
        "link": "https://apifav.substack.com/p/fav",
    }
    add_res = client.post("/api/favorites", json=article)
    assert add_res.status_code == 200

    list_res = client.get("/api/favorites")
    assert list_res.status_code == 200
    assert any(f["guid"] == "api-fav-1" for f in list_res.json())

    del_res = client.delete("/api/favorites/api-fav-1")
    assert del_res.status_code == 200


def test_drafts_api():
    create_res = client.post("/api/drafts", json={"title": "API Test Draft", "content": "API Body"})
    assert create_res.status_code == 200
    draft = create_res.json()
    assert draft["title"] == "API Test Draft"

    get_res = client.get("/api/drafts")
    assert get_res.status_code == 200

    del_res = client.delete(f"/api/drafts/{draft['id']}")
    assert del_res.status_code == 200
