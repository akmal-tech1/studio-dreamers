import { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import FilmCard from "../components/FilmCard";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";

export default function Films() {
  const [films, setFilms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [active, setActive] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.films(), api.filmCategories()])
      .then(([filmsData, catsData]) => {
        setFilms(filmsData);
        setCategories(["All", ...catsData.categories]);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.detail || "Failed to load films.");
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(
    () => (active === "All" ? films : films.filter((f) => f.category === active)),
    [films, active]
  );

  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-36 sm:px-8">
      <SectionHeading
        kicker="The Catalog"
        title="SHORT FILMS"
        description="Every genre, every dream — explore the complete Studio Dreamers Pictures catalog."
      />

      {/* Filters */}
      <Reveal delay={150}>
        <div className="no-scrollbar mt-10 flex gap-3 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`shrink-0 rounded-full px-6 py-2.5 text-[12px] font-bold uppercase tracking-[0.2em] transition ${
                active === cat
                  ? "bg-blood text-white shadow-[0_0_24px_rgba(255,0,51,0.4)]"
                  : "border border-white/10 text-white/55 hover:border-blood/50 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </Reveal>

      {/* Grid */}
      {loading ? (
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-white/5 bg-coal">
              <div className="aspect-[2/3] bg-smoke" />
              <div className="space-y-3 p-5">
                <div className="h-6 w-2/3 rounded bg-smoke" />
                <div className="h-3 w-1/2 rounded bg-smoke" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="mt-16 text-center text-white/50">{error}</p>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((film, i) => (
            <Reveal key={film.id} delay={(i % 4) * 80}>
              <FilmCard film={film} />
            </Reveal>
          ))}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <p className="mt-16 text-center text-white/50">No films in this category yet.</p>
      )}
    </div>
  );
}
