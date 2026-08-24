import { Bot, RefreshCw, Send, Sparkles, User } from "lucide-react";
import type React from "react";
import { useState } from "react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export const Chat: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hello! I am your Local LLM Newsletter Assistant. Ask me to outline newsletter issues, polish draft titles, summarize feeds, or format paywalls.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || prompt;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = { role: "user", content: textToSend.trim() };
    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setPrompt("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: textToSend,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      if (data.status === "success" && data.reply) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Error: ${data.error || "Failed to generate response. Check Local LLM connection in Settings."}`,
          },
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const promptChips = [
    "Outline a 3-part newsletter issue on AI trends",
    "Brainstorm 5 high-converting headlines for Substack",
    "Explain how to structure a paywall divider for paid subscribers",
    "Generate an engaging reader question for the post comments",
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6 flex flex-col h-[calc(100vh-6rem)]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Bot className="w-6 h-6 text-emerald-500" />
            Newsletter AI Assistant
          </h2>
          <p className="text-slate-400 text-sm">Powered by your Local LLM engine (Ollama / LM Studio)</p>
        </div>
      </div>

      {/* Quick Prompt Chips */}
      <div className="flex flex-wrap gap-2">
        {promptChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip)}
            className="text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-full flex items-center gap-1.5 transition"
          >
            <Sparkles className="w-3 h-3 text-orange-400" />
            <span>{chip}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 overflow-y-auto space-y-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex items-start space-x-3 ${m.role === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
          >
            <div
              className={`p-2 rounded-xl flex-shrink-0 ${
                m.role === "user"
                  ? "bg-orange-600 text-white"
                  : "bg-emerald-950 border border-emerald-800 text-emerald-400"
              }`}
            >
              {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-3xl p-4 rounded-2xl text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-orange-600/10 border border-orange-800/60 text-slate-100"
                  : "bg-slate-950 border border-slate-800/80 text-slate-200"
              }`}
            >
              <p className="whitespace-pre-wrap">{m.content}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-3 text-slate-400 text-sm">
            <RefreshCw className="w-4 h-4 animate-spin text-emerald-500" />
            <span>Generating response with Local LLM...</span>
          </div>
        )}
      </div>

      {/* Prompt Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex gap-3"
      >
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask local AI assistant to write, edit, outline, or format..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500"
        />
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-medium text-sm flex items-center space-x-2 transition"
        >
          <Send className="w-4 h-4" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};
