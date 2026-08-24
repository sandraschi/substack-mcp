# Substack Primer — Understanding the Platform & Ecosystem

**Substack** is an independent publishing platform and creator network founded in 2017 by Chris Best, Jairaj Sethi, and Hamish McKenzie. It allows writers, journalists, analysts, podcasters, and subject matter experts to publish directly to their audience via email newsletters and web posts, monetize through paid subscriptions, and build engaged communities.

---

## 1. How Substack is Organized

Every Substack creator manages a **Publication** hosted on either a Substack subdomain (e.g., `https://thepsf.substack.com`) or a custom domain.

### Core Architecture Components

```
+-----------------------------------------------------------------------------------+
|                              Substack Publication                                 |
+----------------------------------------+------------------------------------------+
                                         |
     +-------------------+---------------+---------------+--------------------+
     |                   |                               |                    |
     v                   v                               v                    v
+---------+     +------------------+           +-------------------+    +-------------------+
|  Posts  |     | Substack Notes   |           |  Substack Chat    |    | Subscriber Tiers  |
| (Email  |     | (Short-form      |           | (Community        |    | (Free, Monthly,   |
| + Web)  |     |  Social Feed)    |           |  Messaging)       |    |  Annual, Founder) |
+---------+     +------------------+           +-------------------+    +-------------------+
```

1. **Posts (Long-form Articles)**:
   - Published simultaneously as an email sent to subscribers' inboxes and as a web page on the publication site.
   - Support Rich Text, Markdown, Embeds, Audio/Podcasts, and **Paywall Dividers** (`<!-- paywall -->`).

2. **Subscriber Tiers**:
   - **Free Subscribers**: Access public posts and standard newsletters.
   - **Paid Subscribers**: Access exclusive paid posts, subscriber-only discussion threads, and podcast archives.
   - **Founding Members**: Tier for super-fans who pay a higher custom annual rate.

3. **Substack Notes & Recommendations**:
   - Short-form social media feed embedded into Substack where writers share quick thoughts, quote-post articles, and discover new publications.
   - Recommendation network allows publications to endorse each other, driving organic subscriber growth.

4. **Comments & Discussion Threads**:
   - Direct reader comments on posts fostering community conversations and feedback loops.

---

## 2. Technical Endpoints & RSS Feeds

Substack publications expose standard web feeds and public endpoints:

- **Public RSS Feed**: `https://<publication>.substack.com/feed`
  - Delivers XML feed of recent public articles, RSS metadata, author details, and enclosure audio.
- **Publication Archive**: `https://<publication>.substack.com/archive`
- **Session Auth Cookie (`substack.sid`)**:
  - Secure HTTP cookie required for authenticated endpoints e.g. draft staging, scheduled publishing, subscriber subscriber analytics, and comment posting.

---

## 3. Why Use AI & MCP with Substack?

Integrating Substack with Model Context Protocol (`substack-mcp`) unlocks powerful AI-assisted workflows:

- **Feed Research & Digesting**: Ask AI to summarize 10 recent issues across your favorite Substack newsletters.
- **Paywall-Aware Drafting**: Write long-form articles in Markdown, place paywalls with `<!-- paywall -->`, and convert to Substack HTML in 1 click.
- **Local AI Newsletter Editing**: Use local Ollama or LM Studio models to polish draft tone, outline issue sections, and generate catchy titles without sending drafts to third-party clouds.
- **Subscriber Analytics**: Monitor open rates, subscriber growth, and post performance directly from a unified dashboard.
