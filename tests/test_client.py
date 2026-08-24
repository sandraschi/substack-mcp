from substack_mcp.client import SubstackClient


def test_normalize_rss_url():
    client = SubstackClient()
    assert client.normalize_rss_url("thepsf") == "https://thepsf.substack.com/feed"
    assert client.normalize_rss_url("platform.substack.com") == "https://platform.substack.com/feed"
    assert client.normalize_rss_url("https://platform.substack.com/feed") == "https://platform.substack.com/feed"


def test_markdown_conversion():
    client = SubstackClient()
    md = "# Hello World\n\nThis is a post.\n\n<!-- paywall -->\n\nPaid content here."
    html = client.convert_markdown_to_html(md)
    assert "<h1>Hello World</h1>" in html
    assert '<div class="paywall-divider">--- Paywall ---</div>' in html
