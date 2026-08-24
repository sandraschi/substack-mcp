import { CheckCircle, HelpCircle, Key, Server, Terminal } from "lucide-react";
import type React from "react";

export const Onboarding: React.FC = () => {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-orange-500" />
          Onboarding & Setup Guide
        </h2>
        <p className="text-slate-400 text-sm">
          Step-by-step instructions for authentication, MCP client connection, and features
        </p>
      </div>

      {/* Step 1: Substack Auth */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
        <h3 className="font-bold text-slate-100 text-lg flex items-center gap-2">
          <Key className="w-5 h-5 text-orange-500" />
          Step 1: Extracting Your Substack Session Cookie (`substack.sid`)
        </h3>
        <p className="text-sm text-slate-300">
          Public RSS feed ingestion works out-of-the-box without credentials. To enable staging, drafting, subscriber
          stats, and post publishing:
        </p>

        <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300 font-mono bg-slate-950 p-4 rounded-xl border border-slate-800">
          <li>
            Log in to your Substack account at{" "}
            <a href="https://substack.com" target="_blank" rel="noreferrer" className="text-orange-400 underline">
              substack.com
            </a>
          </li>
          <li>
            Open Browser Developer Tools (<code className="text-orange-300">F12</code> or{" "}
            <code className="text-orange-300">Ctrl+Shift+I</code>)
          </li>
          <li>
            Navigate to the <strong>Application</strong> tab (Chrome/Edge) or <strong>Storage</strong> tab (Firefox)
          </li>
          <li>
            Expand <strong>Cookies</strong> &rarr; select <code className="text-orange-300">https://substack.com</code>
          </li>
          <li>
            Copy the value of the cookie named <code className="text-orange-400 font-bold">substack.sid</code>
          </li>
          <li>
            Paste the cookie string into the <strong>Settings</strong> page of this dashboard!
          </li>
        </ol>
      </div>

      {/* Step 2: MCP Connection */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
        <h3 className="font-bold text-slate-100 text-lg flex items-center gap-2">
          <Server className="w-5 h-5 text-emerald-500" />
          Step 2: Connecting `substack-mcp` to AI Clients
        </h3>

        <div className="space-y-4">
          <div>
            <h4 className="font-bold text-slate-200 text-sm mb-1">
              Google Antigravity / Claude Desktop (Streamable HTTP)
            </h4>
            <p className="text-xs text-slate-400 mb-2">Connect via FastMCP HTTP transport URL:</p>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono text-emerald-400 flex items-center justify-between">
              <span>http://127.0.0.1:11163/mcp</span>
              <span className="text-[10px] text-slate-500">FastMCP 3.1+ HTTP Endpoint</span>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-200 text-sm mb-1">Cursor / Stdio Config</h4>
            <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto">
              {`{
  "mcpServers": {
    "substack": {
      "command": "uv",
      "args": ["run", "--directory", "d:/Dev/repos/substack-mcp", "substack-mcp"]
    }
  }
}`}
            </pre>
          </div>
        </div>
      </div>

      {/* Step 3: Features */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
        <h3 className="font-bold text-slate-100 text-lg flex items-center gap-2">
          <Terminal className="w-5 h-5 text-blue-500" />
          Step 3: Core Workflow Features
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <h5 className="font-bold text-slate-100 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-orange-500" /> RSS Feed Ingestion
            </h5>
            <p className="text-slate-400">
              Ingest articles from any Substack publication and cache them locally in SQLite for fast search.
            </p>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <h5 className="font-bold text-slate-100 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-orange-500" /> Draft Studio
            </h5>
            <p className="text-slate-400">
              Write Markdown posts with paywall callouts <code className="text-orange-400">&lt;!-- paywall --&gt;</code>{" "}
              and preview rendered HTML.
            </p>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <h5 className="font-bold text-slate-100 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-orange-500" /> Local LLM Assistant
            </h5>
            <p className="text-slate-400">
              Use local Ollama or LM Studio models to outline newsletter issues and refine article tone.
            </p>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <h5 className="font-bold text-slate-100 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-orange-500" /> Portmanteau MCP Tools
            </h5>
            <p className="text-slate-400">
              Use consolidated tools (<code className="text-orange-400">substack_feed</code>,{" "}
              <code className="text-orange-400">substack_drafts</code>,{" "}
              <code className="text-orange-400">substack_stats</code>) in AI conversations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
