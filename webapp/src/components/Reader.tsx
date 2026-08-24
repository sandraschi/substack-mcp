import { Calendar, ExternalLink, Search, Star, User } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";

export const Reader: React.FC = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);
  const [favoritesMap, setFavoritesMap] = useState<Record<string, boolean>>({});

  const fetchArticles = async () => {
    try {
      const url = search ? `/api/articles?search=${encodeURIComponent(search)}` : "/api/articles";
      const res = await fetch(url);
      if (res.ok) setArticles(await res.json());

      const favRes = await fetch("/api/favorites");
      if (favRes.ok) {
        const favs = await favRes.json();
        const map: Record<string, boolean> = {};
        for (const f of favs) {
          map[f.guid] = true;
          if (f.link) map[f.link] = true;
        }
        setFavoritesMap(map);
      }
    } catch (err) {
      console.error("Failed to fetch articles:", err);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [search]);

  const toggleFavorite = async (e: React.MouseEvent, art: any) => {
    e.stopPropagation();
    const guid = art.guid || art.link;
    const isFav = favoritesMap[guid];

    try {
      if (isFav) {
        await fetch(`/api/favorites/${encodeURIComponent(guid)}`, { method: "DELETE" });
        setFavoritesMap((prev) => ({ ...prev, [guid]: false }));
      } else {
        await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(art),
        });
        setFavoritesMap((prev) => ({ ...prev, [guid]: true }));
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Feed Reader & Article Search</h2>
          <p className="text-slate-400 text-sm">Browse cached articles across ingested Substack newsletters</p>
        </div>
        <div className="relative w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Article List */}
        <div className="lg:col-span-1 space-y-3 max-h-[75vh] overflow-y-auto pr-2">
          {articles.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center text-slate-400 text-sm">
              No articles found. Ingest feeds on the Dashboard!
            </div>
          ) : (
            articles.map((art) => {
              const guid = art.guid || art.link;
              const isFav = favoritesMap[guid];
              return (
                <div
                  key={art.id}
                  onClick={() => setSelectedArticle(art)}
                  className={`p-4 rounded-xl border transition cursor-pointer ${
                    selectedArticle?.id === art.id
                      ? "bg-slate-800 border-orange-500"
                      : "bg-slate-900 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono text-orange-400">{art.publication_domain}</span>
                    <button
                      onClick={(e) => toggleFavorite(e, art)}
                      className="p-1 text-slate-500 hover:text-amber-400 transition"
                      title={isFav ? "Remove Favorite" : "Save to Favorites"}
                    >
                      <Star className={`w-4 h-4 ${isFav ? "fill-amber-400 text-amber-400" : ""}`} />
                    </button>
                  </div>
                  <h4 className="font-bold text-slate-200 text-sm line-clamp-2">{art.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">{art.summary}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-800/60">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" /> {art.author || "Unknown"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {art.pub_date ? art.pub_date.slice(0, 16) : ""}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Article Viewer Pane */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-8 rounded-2xl min-h-[75vh]">
          {selectedArticle ? (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-orange-400">{selectedArticle.publication_domain}</span>
                  <button
                    onClick={(e) => toggleFavorite(e, selectedArticle)}
                    className="flex items-center gap-1.5 text-xs text-amber-400 hover:underline"
                  >
                    <Star
                      className={`w-4 h-4 ${favoritesMap[selectedArticle.guid || selectedArticle.link] ? "fill-amber-400" : ""}`}
                    />
                    <span>
                      {favoritesMap[selectedArticle.guid || selectedArticle.link] ? "Bookmarked" : "Add to Favorites"}
                    </span>
                  </button>
                </div>
                <h3 className="text-2xl font-bold text-slate-100 mt-1">{selectedArticle.title}</h3>
                <div className="flex items-center justify-between text-xs text-slate-400 mt-3">
                  <span>Author: {selectedArticle.author}</span>
                  <a
                    href={selectedArticle.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-orange-400 hover:underline flex items-center gap-1"
                  >
                    Open original post <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div
                className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: selectedArticle.content || selectedArticle.summary }}
              />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-sm">
              Select an article from the left pane to read
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
