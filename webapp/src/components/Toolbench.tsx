import { CheckCircle, Copy, Server, Terminal } from "lucide-react";
import type React from "react";
import { useState } from "react";

export const Toolbench: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const toolsList = [
    {
      name: "substack_feed",
      description: "Fetch RSS feeds, query cached articles, and search publications.",
      operations: ["fetch", "list_publications", "query", "get_article"],
    },
    {
      name: "substack_drafts",
      description: "Create, update, list, and delete newsletter drafts; convert Markdown to HTML.",
      operations: ["create", "list", "get", "update", "delete", "convert_markdown"],
    },
    {
      name: "substack_stats",
      description: "Record snapshot metrics, retrieve historical analytics, and performance summaries.",
      operations: ["record", "get", "summary"],
    },
    {
      name: "substack_community",
      description: "Fetch post comments and stage community responses.",
      operations: ["get_comments", "post_comment"],
    },
  ];

  const handleCopyEndpoint = () => {
    navigator.clipboard.writeText("http://127.0.0.1:11163/mcp");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-100">MCP Toolbench & Server Status</h2>
        <p className="text-slate-400 text-sm">FastMCP 3.1+ streamable HTTP endpoints and tool definitions</p>
      </div>

      {/* Server Status Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-emerald-950/80 border border-emerald-800 text-emerald-400 p-3 rounded-xl">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100">Substack MCP Server Endpoint</h3>
            <p className="font-mono text-xs text-slate-400">http://127.0.0.1:11163/mcp</p>
          </div>
        </div>

        <button
          onClick={handleCopyEndpoint}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-mono flex items-center space-x-2 transition"
        >
          {copied ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? "Copied URL!" : "Copy /mcp URL"}</span>
        </button>
      </div>

      {/* Tools List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
          <Terminal className="w-5 h-5 text-orange-500" />
          Registered Portmanteau MCP Tools
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {toolsList.map((t) => (
            <div key={t.name} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-orange-400 text-sm">{t.name}</span>
                <span className="text-[10px] uppercase tracking-wider bg-orange-950/50 border border-orange-800 text-orange-300 px-2 py-0.5 rounded">
                  Portmanteau
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{t.description}</p>
              <div className="pt-2">
                <span className="text-[11px] text-slate-500 block mb-1">Supported Operations:</span>
                <div className="flex flex-wrap gap-1">
                  {t.operations.map((op) => (
                    <span
                      key={op}
                      className="text-xs font-mono bg-slate-950 border border-slate-800 text-slate-300 px-2 py-0.5 rounded-lg"
                    >
                      {op}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
