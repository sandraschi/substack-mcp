import { RefreshCw, Terminal, Trash2 } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";

export const Logs: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);

  const loadLogs = async () => {
    try {
      const res = await fetch("/api/logs");
      if (res.ok) setLogs(await res.json());
    } catch (err) {
      console.error("Failed to load logs:", err);
    }
  };

  useEffect(() => {
    loadLogs();
    const interval = setInterval(loadLogs, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleClear = async () => {
    try {
      await fetch("/api/logs", { method: "DELETE" });
      loadLogs();
    } catch (err) {
      console.error("Failed to clear logs:", err);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Terminal className="w-6 h-6 text-orange-500" />
            Server Event Logs
          </h2>
          <p className="text-slate-400 text-sm">Real-time event stream and request ring buffer</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={loadLogs}
            className="bg-slate-900 hover:bg-slate-800 text-slate-300 px-3.5 py-2 rounded-xl text-xs font-medium flex items-center space-x-1.5 border border-slate-800 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleClear}
            className="bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 px-3.5 py-2 rounded-xl text-xs font-medium flex items-center space-x-1.5 border border-rose-800 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Logs</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 font-mono text-xs max-h-[70vh] overflow-y-auto space-y-2">
        {logs.length === 0 ? (
          <p className="text-slate-500 text-center py-8">No log events recorded yet.</p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex items-start space-x-3 py-1 border-b border-slate-900/80">
              <span className="text-slate-500 text-[11px] select-none">{log.timestamp}</span>
              <span className="bg-slate-900 border border-slate-800 text-orange-400 px-1.5 py-0.5 rounded text-[10px]">
                {log.level}
              </span>
              <span className="text-slate-300 flex-1">{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
