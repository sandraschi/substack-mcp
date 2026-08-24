"""Substack RSS feed reader, HTTP client, and Local LLM Integration."""

import logging
from typing import Any, Dict, List, Optional

import bs4
import feedparser
import httpx
import markdown

from substack_mcp import db

logger = logging.getLogger(__name__)


class SubstackClient:
    """Client for reading Substack RSS feeds and interacting with Substack endpoints."""

    def __init__(self, session_cookie: Optional[str] = None):
        cookie = session_cookie or db.get_setting("session_cookie", "")
        self.session_cookie = cookie
        self.http_client = httpx.Client(
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) SubstackMCP/1.0",
                "Cookie": f"substack.sid={cookie}" if cookie else "",
            },
            timeout=15.0,
            follow_redirects=True,
        )

    def normalize_rss_url(self, publication_input: str) -> str:
        """Convert a publication domain, name, or URL to a valid RSS feed URL."""
        pub = publication_input.strip().lower()
        if not pub.startswith("http://") and not pub.startswith("https://"):
            if "." in pub:
                pub = f"https://{pub}"
            else:
                pub = f"https://{pub}.substack.com"

        if not pub.endswith("/feed") and not pub.endswith("/feed/"):
            pub = f"{pub.rstrip('/')}/feed"

        return pub

    def fetch_rss_feed(self, publication_input: str) -> Dict[str, Any]:
        """Fetch and parse an RSS feed from a Substack publication."""
        rss_url = self.normalize_rss_url(publication_input)
        response = self.http_client.get(rss_url)
        response.raise_for_status()

        parsed = feedparser.parse(response.text)
        feed_meta = parsed.get("feed", {})
        domain = rss_url.split("/feed")[0].replace("https://", "").replace("http://", "")

        entries = []
        for entry in parsed.get("entries", []):
            content_raw = ""
            if "content" in entry and len(entry["content"]) > 0:
                content_raw = entry["content"][0].get("value", "")
            elif "summary" in entry:
                content_raw = entry.get("summary", "")

            clean_summary = self._strip_html(entry.get("summary", ""))

            entries.append(
                {
                    "guid": entry.get("id") or entry.get("link", ""),
                    "publication_domain": domain,
                    "title": entry.get("title", "Untitled"),
                    "link": entry.get("link", ""),
                    "author": entry.get("author", feed_meta.get("title", "")),
                    "pub_date": entry.get("published", ""),
                    "summary": clean_summary,
                    "content": content_raw,
                }
            )

        return {
            "title": feed_meta.get("title", domain),
            "description": feed_meta.get("description", ""),
            "link": feed_meta.get("link", f"https://{domain}"),
            "domain": domain,
            "rss_url": rss_url,
            "count": len(entries),
            "entries": entries,
        }

    def convert_markdown_to_html(self, md_text: str) -> str:
        """Convert markdown draft content to HTML formatted for Substack."""
        html = markdown.markdown(md_text, extensions=["extra", "codehilite", "tables"])
        html = html.replace("<!-- paywall -->", '<div class="paywall-divider">--- Paywall ---</div>')
        return html

    def _strip_html(self, html_content: str) -> str:
        if not html_content:
            return ""
        soup = bs4.BeautifulSoup(html_content, "html.parser")
        return soup.get_text(separator=" ", strip=True)


class LocalLLMClient:
    """Client for communicating with local LLMs (Ollama, LM Studio, vLLM, OpenAI-compatible)."""

    def __init__(
        self,
        provider: Optional[str] = None,
        base_url: Optional[str] = None,
        model: Optional[str] = None,
        api_key: Optional[str] = None,
    ):
        settings = db.get_all_settings()
        self.provider = provider or settings.get("llm_provider", "ollama")
        self.base_url = (base_url or settings.get("llm_base_url", "http://localhost:11434")).rstrip("/")
        self.model = model or settings.get("llm_model", "llama3")
        self.api_key = api_key or settings.get("llm_api_key", "")
        self.client = httpx.Client(timeout=60.0)

    def test_connection(self) -> Dict[str, Any]:
        """Test connection to local LLM server."""
        try:
            if self.provider == "ollama":
                res = self.client.get(f"{self.base_url}/api/tags")
                if res.status_code == 200:
                    models = [m.get("name") for m in res.json().get("models", [])]
                    return {"status": "ok", "provider": "ollama", "models": models}
            else:
                headers = {}
                if self.api_key:
                    headers["Authorization"] = f"Bearer {self.api_key}"
                res = self.client.get(f"{self.base_url}/v1/models", headers=headers)
                if res.status_code == 200:
                    models = [m.get("id") for m in res.json().get("data", [])]
                    return {"status": "ok", "provider": self.provider, "models": models}
            return {"status": "ok", "provider": self.provider, "message": "Server responded"}
        except Exception as e:
            return {"status": "error", "error": str(e)}

    def generate_chat(self, prompt: str, system_prompt: str = "", history: Optional[List[Dict[str, str]]] = None) -> str:
        """Generate response from local LLM."""
        if self.provider == "ollama":
            url = f"{self.base_url}/api/chat"
            messages = []
            if system_prompt:
                messages.append({"role": "system", "content": system_prompt})
            if history:
                messages.extend(history)
            messages.append({"role": "user", "content": prompt})

            payload = {"model": self.model, "messages": messages, "stream": False}
            res = self.client.post(url, json=payload)
            res.raise_for_status()
            data = res.json()
            return data.get("message", {}).get("content", "")
        else:
            url = f"{self.base_url}/v1/chat/completions"
            headers = {"Content-Type": "application/json"}
            if self.api_key:
                headers["Authorization"] = f"Bearer {self.api_key}"

            messages = []
            if system_prompt:
                messages.append({"role": "system", "content": system_prompt})
            if history:
                messages.extend(history)
            messages.append({"role": "user", "content": prompt})

            payload = {"model": self.model, "messages": messages}
            res = self.client.post(url, json=payload, headers=headers)
            res.raise_for_status()
            data = res.json()
            choices = data.get("choices", [])
            if choices:
                return choices[0].get("message", {}).get("content", "")
            return ""
