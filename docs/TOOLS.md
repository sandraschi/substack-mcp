# FastMCP Tools Reference — `substack-mcp`

Exhaustive tool schemas and parameters for all portmanteau MCP tools in `substack-mcp`.

## 1. `substack_feed`
Consolidated RSS feed and article reading tool.

```typescript
substack_feed({
  operation: "fetch" | "list_publications" | "query" | "get_article",
  publication?: string,
  search?: string,
  article_guid?: string,
  limit?: number
})
```

## 2. `substack_drafts`
Markdown post draft staging, editing, and publishing converter.

```typescript
substack_drafts({
  operation: "create" | "list" | "get" | "update" | "delete" | "convert_markdown",
  draft_id?: number,
  title?: string,
  subtitle?: string,
  content?: string,
  publication?: string,
  status?: "draft" | "ready" | "published"
})
```

## 3. `substack_stats`
Publication metrics, views, and subscriber analytics tracker.

```typescript
substack_stats({
  operation: "record" | "get" | "summary",
  publication?: string,
  subscribers?: number,
  views?: number,
  open_rate?: number
})
```

## 4. `substack_community`
Post comments and community discussion thread manager.

```typescript
substack_community({
  operation: "get_comments" | "post_comment",
  publication?: string,
  article_link?: string,
  comment_text?: string
})
```
