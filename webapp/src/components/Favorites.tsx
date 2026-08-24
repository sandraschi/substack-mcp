import { Calendar, ExternalLink, Search, Star, Trash2, User } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";

export const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);

  const fetchFavorites = async () => {
    try {
      const res = await fetch("/api/favorites");
      if (res.ok) {
        const data = await res.json();
        setFavorites(data);
      }
    } catch (err) {
      console.error("Failed to fetch favorites:", err);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (guid: string) => {
    try {
      await fetch(`/api/favorites/${encodeURIComponent(guid)}`, { method: "DELETE" });
      if (selectedArticle?.guid === guid) setSelectedArticle(null);
      fetchFavorites();
    } catch (err) {
      console.error("Failed to remove favorite:", err);
    }
  };

  const filteredFavorites = favorites.filter(
    (f) =>
      f.title?.toLowerCase().includes(search.toLowerCase()) ||
      f.publication_domain?.toLowerCase().includes(search.toLowerCase()) ||
      f.summary?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
            Bookmarked & Favorite Articles
          </h2>
          <p className="text-slate-400 text-sm">Your saved collection of Substack articles and newsletter issues</p>
        </div>
        <div className="relative w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search saved favorites..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar List */}
        <div className="lg:col-span-1 space-y-3 max-h-[75vh] overflow-y-auto pr-2">
          {filteredFavorites.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center text-slate-400 text-sm">
              No saved favorites yet. Click the <Star className="w-3.5 h-3.5 inline text-amber-400" /> Star icon on any
              article in the Feed Reader to save it here!
            </div>
          ) : (
            filteredFavorites.map((art) => (
              <div
                key={art.id}
                onClick={() => setSelectedArticle(art)}
                className={`p-4 rounded-xl border transition cursor-pointer flex justify-between items-start ${
                  selectedArticle?.id === art.id
                    ? "bg-slate-800 border-amber-500/80"
                    : "bg-slate-900 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="space-y-1 truncate pr-2">
                  <span className="text-xs font-mono text-orange-400 block">{art.publication_domain}</span>
                  <h4 className="font-bold text-slate-200 text-sm line-clamp-2">{art.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2">{art.summary}</p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFavorite(art.guid);
                  }}
                  className="text-slate-500 hover:text-rose-400 p-1"
                  title="Remove from favorites"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Reader Pane */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-8 rounded-2xl min-h-[75vh]">
          {selectedArticle ? (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-orange-400">{selectedArticle.publication_domain}</span>
                  <button
                    onClick={() => handleRemoveFavorite(selectedArticle.guid)}
                    className="text-xs text-rose-400 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove Favorite
                  </button>
                </div>
                <h3 className="text-2xl font-bold text-slate-100 mt-1">{selectedArticle.title}</h3>
                <div className="flex items-center justify-between text-xs text-slate-400 mt-3">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" /> {selectedArticle.author || "Author"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />{" "}
                    {selectedArticle.pub_date ? selectedArticle.pub_date.slice(0, 16) : ""}
                  </span>
                  <a
                    href={selectedArticle.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-orange-400 hover:underline flex items-center gap-1"
                  >
                    Original Post <ExternalLink className="w-3 h-3" />
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
              Select a bookmarked article to read
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
