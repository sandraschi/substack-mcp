import { BarChart3, Mail, Plus, Users } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";

export const Analytics: React.FC = () => {
  const [stats, setStats] = useState<any | null>(null);
  const [pub, setPub] = useState("");
  const [subscribers, setSubscribers] = useState(0);
  const [views, setViews] = useState(0);

  const loadStats = async () => {
    try {
      const res = await fetch("/api/stats");
      if (res.ok) setStats(await res.json());
    } catch (err) {
      console.error("Failed to load stats:", err);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pub.trim()) return;
    try {
      setPub("");
      loadStats();
    } catch (err) {
      console.error("Failed to record stats:", err);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-100">Publication Analytics</h2>
        <p className="text-slate-400 text-sm">Subscriber metrics, traffic views, and email open rates</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-sm font-medium">Total Publications</span>
            <BarChart3 className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-slate-100">{stats?.total_publications_tracked || 0}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-sm font-medium">Staged Drafts</span>
            <Users className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-3xl font-bold text-slate-100">{stats?.total_drafts_staged || 0}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-sm font-medium">Avg Open Rate</span>
            <Mail className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-slate-100">48.5%</p>
        </div>
      </div>

      {/* Snapshot Entry Form */}
      <form onSubmit={handleRecord} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
        <h3 className="text-md font-bold text-slate-200">Record Metric Snapshot</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            value={pub}
            onChange={(e) => setPub(e.target.value)}
            placeholder="Publication domain"
            className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-100"
          />
          <input
            type="number"
            value={subscribers}
            onChange={(e) => setSubscribers(Number(e.target.value))}
            placeholder="Subscribers"
            className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-100"
          />
          <input
            type="number"
            value={views}
            onChange={(e) => setViews(Number(e.target.value))}
            placeholder="Views"
            className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-100"
          />
          <button
            type="submit"
            className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center justify-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Record Snapshot</span>
          </button>
        </div>
      </form>
    </div>
  );
};
