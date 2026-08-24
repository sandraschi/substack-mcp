import { Cpu, Key, RefreshCw, Save, Settings as SettingsIcon } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";

export const Settings: React.FC = () => {
  const [cookie, setCookie] = useState("");
  const [defaultPub, setDefaultPub] = useState("");
  const [llmProvider, setLlmProvider] = useState("ollama");
  const [llmBaseUrl, setLlmBaseUrl] = useState("http://localhost:11434");
  const [llmModel, setLlmModel] = useState("llama3");
  const [llmApiKey, setLlmApiKey] = useState("");
  const [message, setMessage] = useState("");
  const [testResult, setTestResult] = useState<any | null>(null);
  const [testing, setTesting] = useState(false);

  const loadSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        setCookie(data.session_cookie || "");
        setDefaultPub(data.default_publication || "");
        setLlmProvider(data.llm_provider || "ollama");
        setLlmBaseUrl(data.llm_base_url || "http://localhost:11434");
        setLlmModel(data.llm_model || "llama3");
        setLlmApiKey(data.llm_api_key || "");
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_cookie: cookie,
          default_publication: defaultPub,
          llm_provider: llmProvider,
          llm_base_url: llmBaseUrl,
          llm_model: llmModel,
          llm_api_key: llmApiKey,
        }),
      });
      if (res.ok) {
        setMessage("Settings saved successfully!");
      } else {
        setMessage("Failed to save settings");
      }
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    }
  };

  const handleTestLlm = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/llm/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: llmProvider,
          base_url: llmBaseUrl,
          model: llmModel,
          api_key: llmApiKey,
        }),
      });
      const data = await res.json();
      setTestResult(data);
    } catch (err: any) {
      setTestResult({ status: "error", error: err.message });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-orange-500" />
          Substack MCP Settings
        </h2>
        <p className="text-slate-400 text-sm">
          Configure authentication, Local LLM assistant, and publication defaults
        </p>
      </div>

      {message && (
        <div className="p-4 rounded-xl text-sm bg-emerald-950/60 border border-emerald-800 text-emerald-300">
          {message}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Substack Session Credentials */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="font-bold text-slate-200 text-md flex items-center gap-2">
            <Key className="w-5 h-5 text-orange-500" />
            Substack Session Authentication
          </h3>
          <p className="text-xs text-slate-400">
            Paste your <code className="text-orange-400 bg-slate-950 px-1 py-0.5 rounded">substack.sid</code> cookie to
            enable private draft management and publishing endpoints.
          </p>

          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300">Session Cookie (substack.sid)</label>
            <input
              type="password"
              value={cookie}
              onChange={(e) => setCookie(e.target.value)}
              placeholder="e.g. s%3Asession_token_here..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300">Default Publication Domain</label>
            <input
              type="text"
              value={defaultPub}
              onChange={(e) => setDefaultPub(e.target.value)}
              placeholder="e.g. mynewsletter.substack.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        {/* Local LLM Engine Settings */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-200 text-md flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-500" />
              Local LLM Engine Settings
            </h3>
            <button
              type="button"
              onClick={handleTestLlm}
              disabled={testing}
              className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testing ? "animate-spin" : ""}`} />
              <span>{testing ? "Testing..." : "Test Connection"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Provider</label>
              <select
                value={llmProvider}
                onChange={(e) => setLlmProvider(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-orange-500"
              >
                <option value="ollama">Ollama (Native)</option>
                <option value="lmstudio">LM Studio / vLLM (OpenAI Compatible)</option>
                <option value="custom">Custom API Endpoint</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Base URL</label>
              <input
                type="text"
                value={llmBaseUrl}
                onChange={(e) => setLlmBaseUrl(e.target.value)}
                placeholder="http://localhost:11434"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Model Name</label>
              <input
                type="text"
                value={llmModel}
                onChange={(e) => setLlmModel(e.target.value)}
                placeholder="e.g. llama3, qwen2.5, mistral"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">API Key (Optional)</label>
              <input
                type="password"
                value={llmApiKey}
                onChange={(e) => setLlmApiKey(e.target.value)}
                placeholder="Optional for remote OpenAI-compatible proxies"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {testResult && (
            <div
              className={`p-4 rounded-xl text-xs font-mono ${testResult.status === "ok" ? "bg-emerald-950/50 border border-emerald-800 text-emerald-300" : "bg-rose-950/50 border border-rose-800 text-rose-300"}`}
            >
              <p className="font-bold">Test Connection Result:</p>
              <pre className="mt-1 whitespace-pre-wrap">{JSON.stringify(testResult, null, 2)}</pre>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-3 rounded-xl font-medium text-sm flex items-center space-x-2 shadow-lg shadow-orange-600/20 transition"
        >
          <Save className="w-4 h-4" />
          <span>Save Settings</span>
        </button>
      </form>
    </div>
  );
};
