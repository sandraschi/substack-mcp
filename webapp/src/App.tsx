import type React from "react";
import { useState } from "react";
import { Analytics } from "./components/Analytics";
import { Chat } from "./components/Chat";
import { Community } from "./components/Community";
import { Dashboard } from "./components/Dashboard";
import { DraftStudio } from "./components/DraftStudio";
import { Favorites } from "./components/Favorites";
import { Help } from "./components/Help";
import { Logs } from "./components/Logs";
import { Navbar } from "./components/Navbar";
import { Reader } from "./components/Reader";
import { Settings } from "./components/Settings";
import { Toolbench } from "./components/Toolbench";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1">
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "reader" && <Reader />}
        {activeTab === "favorites" && <Favorites />}
        {activeTab === "drafts" && <DraftStudio />}
        {activeTab === "chat" && <Chat />}
        {activeTab === "analytics" && <Analytics />}
        {activeTab === "community" && <Community />}
        {activeTab === "toolbench" && <Toolbench />}
        {activeTab === "settings" && <Settings />}
        {activeTab === "help" && <Help />}
        {activeTab === "logs" && <Logs />}
      </main>
    </div>
  );
};

export default App;
