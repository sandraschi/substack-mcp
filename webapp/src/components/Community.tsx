import { MessageSquare, Send } from "lucide-react";
import type React from "react";
import { useState } from "react";

export const Community: React.FC = () => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<any[]>([
    {
      author: "Substack Reader",
      text: "Thanks for this detailed issue! Loved the analysis on FastMCP 3.1.",
      created_at: "2026-08-24 14:30",
    },
  ]);

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setComments([...comments, { author: "Me (Author)", text: comment.trim(), created_at: "Just now" }]);
    setComment("");
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-100">Community & Post Comments</h2>
        <p className="text-slate-400 text-sm">Read and respond to newsletter discussion threads</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
        <form onSubmit={handlePost} className="flex gap-3">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a response or reply to readers..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
          <button
            type="submit"
            className="bg-orange-600 hover:bg-orange-500 text-white px-5 py-2.5 rounded-xl font-medium text-sm flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Post</span>
          </button>
        </form>

        <div className="space-y-4 pt-4 border-t border-slate-800">
          {comments.map((c, i) => (
            <div key={i} className="bg-slate-950 border border-slate-800/80 p-4 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-orange-500" />
                  {c.author}
                </span>
                <span>{c.created_at}</span>
              </div>
              <p className="text-sm text-slate-300 pt-1">{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
