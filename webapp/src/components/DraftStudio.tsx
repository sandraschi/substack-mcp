import { Code, Eye, Plus, Save, Trash2 } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";

export const DraftStudio: React.FC = () => {
  const [drafts, setDrafts] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [publication, setPublication] = useState("");
  const [htmlPreview, setHtmlPreview] = useState("");
  const [activeView, setActiveView] = useState<"editor" | "preview">("editor");

  const loadDrafts = async () => {
    try {
      const res = await fetch("/api/drafts");
      if (res.ok) setDrafts(await res.json());
    } catch (err) {
      console.error("Failed to load drafts:", err);
    }
  };

  useEffect(() => {
    loadDrafts();
  }, []);

  const handleSelectDraft = (draft: any) => {
    setSelectedId(draft.id);
    setTitle(draft.title);
    setSubtitle(draft.subtitle || "");
    setContent(draft.content);
    setPublication(draft.publication || "");
  };

  const handleNewDraft = () => {
    setSelectedId(null);
    setTitle("");
    setSubtitle("");
    setContent("");
    setPublication("");
    setHtmlPreview("");
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return;
    try {
      if (selectedId) {
        await fetch(`/api/drafts/${selectedId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, subtitle, content, publication }),
        });
      } else {
        const res = await fetch("/api/drafts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, subtitle, content, publication }),
        });
        const created = await res.json();
        setSelectedId(created.id);
      }
      loadDrafts();
    } catch (err) {
      console.error("Failed to save draft:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this draft?")) return;
    try {
      await fetch(`/api/drafts/${id}`, { method: "DELETE" });
      if (selectedId === id) handleNewDraft();
      loadDrafts();
    } catch (err) {
      console.error("Failed to delete draft:", err);
    }
  };

  const handlePreview = async () => {
    setActiveView("preview");
    try {
      const res = await fetch("/api/convert_markdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      setHtmlPreview(data.html || "");
    } catch (err) {
      console.error("Failed to render markdown:", err);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Draft Studio & Markdown Editor</h2>
          <p className="text-slate-400 text-sm">Write, stage, and preview newsletter posts before publishing</p>
        </div>
        <button
          onClick={handleNewDraft}
          className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Draft</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Draft List */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Staged Drafts</h3>
          {drafts.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center text-slate-500 text-xs">
              No drafts yet. Click 'New Draft' to start writing.
            </div>
          ) : (
            drafts.map((d) => (
              <div
                key={d.id}
                onClick={() => handleSelectDraft(d)}
                className={`p-4 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                  selectedId === d.id
                    ? "bg-slate-800 border-orange-500"
                    : "bg-slate-900 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="truncate">
                  <h4 className="font-bold text-slate-200 text-sm truncate">{d.title || "Untitled Draft"}</h4>
                  <span className="text-[11px] text-slate-400 font-mono">{d.publication || "Default"}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(d.id);
                  }}
                  className="text-slate-500 hover:text-rose-400 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Editor & Preview Area */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveView("editor")}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium ${
                  activeView === "editor" ? "bg-orange-600 text-white" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Markdown Editor</span>
              </button>
              <button
                onClick={handlePreview}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium ${
                  activeView === "preview" ? "bg-orange-600 text-white" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>HTML Preview</span>
              </button>
            </div>

            <button
              onClick={handleSave}
              className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
            >
              <Save className="w-4 h-4" />
              <span>Save Draft</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post Title..."
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
            <input
              type="text"
              value={publication}
              onChange={(e) => setPublication(e.target.value)}
              placeholder="Target Publication (e.g. 'my-newsletter')"
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Subtitle / Subhead..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />

          {activeView === "editor" ? (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your newsletter post in Markdown... Use [paywall] or <!-- paywall --> for paywalls."
              rows={16}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
          ) : (
            <div
              className="w-full min-h-[400px] bg-slate-950 border border-slate-800 rounded-xl p-6 prose prose-invert max-w-none text-slate-300 text-sm overflow-y-auto"
              dangerouslySetInnerHTML={{
                __html: htmlPreview || '<p class="text-slate-500">Click HTML Preview to render Markdown.</p>',
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
