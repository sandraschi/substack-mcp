import {
  BarChart3,
  BookOpen,
  Bot,
  Edit3,
  HelpCircle,
  MessageSquare,
  Newspaper,
  Settings,
  Star,
  Terminal,
  Wrench,
} from "lucide-react";
import type React from "react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: Newspaper },
    { id: "reader", label: "Feed Reader", icon: BookOpen },
    { id: "favorites", label: "Favorites", icon: Star },
    { id: "drafts", label: "Draft Studio", icon: Edit3 },
    { id: "chat", label: "Chat AI", icon: Bot },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "community", label: "Community", icon: MessageSquare },
    { id: "toolbench", label: "Tools & MCP", icon: Wrench },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "help", label: "Help", icon: HelpCircle },
    { id: "logs", label: "Logs", icon: Terminal },
  ];

  return (
    <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center space-x-3">
        <div className="bg-orange-600 text-white p-2 rounded-lg font-bold flex items-center justify-center shadow-lg shadow-orange-600/20">
          <Newspaper className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-xl text-slate-100 flex items-center gap-2">
            Substack{" "}
            <span className="text-orange-500 font-mono text-sm px-2 py-0.5 bg-orange-950/50 border border-orange-800 rounded">
              MCP v0.1
            </span>
          </h1>
          <p className="text-xs text-slate-400">FastMCP 3.1+ Ingestion & Publishing Hub</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
