import { Edit3, Newspaper, Plus, RefreshCw, Rss, TrendingUp } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";

export const Dashboard: React.FC = () => {
  const [publications, setPublications] = useState<any[]>([]);
  const [drafts, setDrafts] = useState<any[]>([]);
  const [newPub, setNewPub] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadData = async () => {
    try {
      const pRes = await fetch("/api/publications");
      if (pRes.ok) setPublications(await pRes.json());

      const dRes = await fetch("/api/drafts");
      if (dRes.ok) setDrafts(await dRes.json());
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFetchPub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPub.trim()) return;
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/publications/fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publication: newPub.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`Success: Fetched ${data.articles?.length || 0} articles from ${data.title}`);
        setNewPub("");
        loadData();
      } else {
        setMessage(`Error: ${data.detail || "Failed to fetch publication"}`);
      }
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Substack Hub Dashboard</h2>
          <p className="text-slate-400 text-sm">Manage RSS feeds, draft staging, and server status</p>
        </div>
        <button
          onClick={loadData}
          className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg text-sm transition"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Quick Ingest Banner */}
      <form
        onSubmit={handleFetchPub}
        className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center space-x-4"
      >
        <Rss className="w-6 h-6 text-orange-500 flex-shrink-0" />
        <input
          type="text"
          value={newPub}
          onChange={(e) => setNewPub(e.target.value)}
          placeholder="Enter publication name or domain (e.g., 'thepsf' or 'platform.substack.com')"
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-medium text-sm flex items-center space-x-2 transition"
        >
          <Plus className="w-4 h-4" />
          <span>{loading ? "Fetching..." : "Ingest Feed"}</span>
        </button>
      </form>

      {message && (
        <div
          className={`p-4 rounded-xl text-sm ${message.startsWith("Success") ? "bg-emerald-950/50 border border-emerald-800 text-emerald-300" : "bg-rose-950/50 border border-rose-800 text-rose-300"}`}
        >
          {message}
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-sm font-medium">Tracked Publications</span>
            <Newspaper className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-slate-100">{publications.length}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-sm font-medium">Staged Drafts</span>
            <Edit3 className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-slate-100">{drafts.length}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-sm font-medium">System Health</span>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-3xl font-bold text-emerald-400">Online</p>
        </div>
      </div>

      {/* Publications Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-200">Tracked Publications</h3>
        {publications.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center text-slate-400">
            No publications tracked yet. Enter a Substack publication name above to ingest its RSS feed!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {publications.map((pub) => (
              <div key={pub.domain} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
                <h4 className="font-bold text-slate-100">{pub.name}</h4>
                <p className="text-xs text-slate-400 font-mono">{pub.domain}</p>
                <a
                  href={pub.rss_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block text-xs text-orange-400 hover:underline pt-2"
                >
                  View RSS Feed &rarr;
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
