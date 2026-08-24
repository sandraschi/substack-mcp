import {
  AlertCircle,
  CheckCircle,
  Cpu,
  Database,
  HelpCircle,
  Key,
  RefreshCw,
  Server,
  Shield,
  Terminal,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";

export const Help: React.FC = () => {
  const [health, setHealth] = useState<any | null>(null);
  const [settings, setSettings] = useState<any | null>(null);
  const [llmStatus, setLlmStatus] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const runDiagnostics = async () => {
    setLoading(true);
    try {
      const hRes = await fetch("/health");
      if (hRes.ok) setHealth(await hRes.json());

      const sRes = await fetch("/api/settings");
      if (sRes.ok) {
        const sData = await sRes.json();
        setSettings(sData);

        const lRes = await fetch("/api/llm/test", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            provider: sData.llm_provider || "ollama",
            base_url: sData.llm_base_url || "http://localhost:11434",
            model: sData.llm_model || "llama3",
            api_key: sData.llm_api_key || "",
          }),
        });
        if (lRes.ok) setLlmStatus(await lRes.json());
      }
    } catch (err) {
      console.error("Diagnostics failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const faqs = [
    {
      q: "Why do I get a 403 Forbidden or Auth Error when creating drafts?",
      a: "Substack requires session authentication for draft creation and publishing endpoints. Go to Settings and paste your `substack.sid` session cookie extracted from your browser DevTools cookies.",
    },
    {
      q: "How do I connect `substack-mcp` to Antigravity or Claude Desktop?",
      a: "Use the FastMCP 3.1+ streamable HTTP transport endpoint: `http://127.0.0.1:11163/mcp`. No command line wrapper is needed for HTTP streamable servers.",
    },
    {
      q: "Which Local LLM providers are supported?",
      a: "Ollama (`http://localhost:11434`), LM Studio, vLLM, and any OpenAI-compatible API proxy. You can configure provider, base URL, and model in Settings.",
    },
    {
      q: "How do paywall dividers work in the Draft Studio?",
      a: "Use `<!-- paywall -->` or `[paywall]` in your Markdown post content. The Draft Studio converter automatically transforms this into Substack paywall divider formatting.",
    },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-orange-500" />
            Help & System Diagnostics Center
          </h2>
          <p className="text-slate-400 text-sm">
            System status, authentication guides, and interactive troubleshooting
          </p>
        </div>

        <button
          onClick={runDiagnostics}
          disabled={loading}
          className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 px-4 py-2 rounded-xl text-xs font-medium flex items-center space-x-2 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Run Diagnostics</span>
        </button>
      </div>

      {/* Live System Diagnostics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>API Health</span>
            <Server className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-lg font-bold text-emerald-400 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4" /> {health?.status === "ok" ? "Healthy (:11163)" : "Offline"}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Database</span>
            <Database className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-lg font-bold text-slate-100 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-blue-400" /> SQLite Active
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Substack Auth</span>
            <Shield className="w-4 h-4 text-orange-400" />
          </div>
          <p
            className={`text-lg font-bold flex items-center gap-1.5 ${settings?.session_cookie ? "text-emerald-400" : "text-amber-400"}`}
          >
            {settings?.session_cookie ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {settings?.session_cookie ? "Configured" : "Public Feed Only"}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Local LLM</span>
            <Cpu className="w-4 h-4 text-purple-400" />
          </div>
          <p
            className={`text-lg font-bold flex items-center gap-1.5 ${llmStatus?.status === "ok" ? "text-emerald-400" : "text-rose-400"}`}
          >
            {llmStatus?.status === "ok" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {llmStatus?.status === "ok" ? "Connected" : "Disconnected"}
          </p>
        </div>
      </div>

      {/* Step 1: Substack Auth Tutorial */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
        <h3 className="font-bold text-slate-100 text-lg flex items-center gap-2">
          <Key className="w-5 h-5 text-orange-500" />
          Extracting Your Substack Cookie (`substack.sid`)
        </h3>
        <p className="text-xs text-slate-300">
          To publish posts or stage drafts, extract your session cookie from your browser:
        </p>

        <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300 font-mono bg-slate-950 p-4 rounded-xl border border-slate-800">
          <li>
            Log in to{" "}
            <a href="https://substack.com" target="_blank" rel="noreferrer" className="text-orange-400 underline">
              substack.com
            </a>
          </li>
          <li>
            Press <code className="text-orange-300">F12</code> to open DevTools &rarr; select{" "}
            <strong>Application</strong> / <strong>Storage</strong>
          </li>
          <li>
            Click <strong>Cookies</strong> &rarr; <code className="text-orange-300">https://substack.com</code>
          </li>
          <li>
            Copy the value of <code className="text-orange-400 font-bold">substack.sid</code>
          </li>
          <li>
            Paste the cookie in the <strong>Settings</strong> tab!
          </li>
        </ol>
      </div>

      {/* Step 2: FAQ Accordion */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
        <h3 className="font-bold text-slate-100 text-lg flex items-center gap-2">
          <Terminal className="w-5 h-5 text-emerald-500" />
          Frequently Asked Questions & Troubleshooting
        </h3>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-slate-800 rounded-xl bg-slate-950 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-5 py-3.5 text-left text-sm font-bold text-slate-200 flex items-center justify-between hover:bg-slate-900/60 transition"
              >
                <span>{faq.q}</span>
                <span className="text-orange-500 text-lg font-mono">{openFaq === idx ? "−" : "+"}</span>
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-4 text-xs text-slate-300 leading-relaxed border-t border-slate-900 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
