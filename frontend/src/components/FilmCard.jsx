import { Link } from "react-router-dom";
import { Clock, Calendar, Star, Play } from "lucide-react";
import { useState } from "react";
import { formatDuration } from "../utils/formatDuration";

export default function FilmCard({ film, wide = false }) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <Link
      to={`/films/${film.id}`}
      className={`group relative block overflow-hidden rounded-2xl border border-white/5 bg-coal transition-all duration-500 hover:-translate-y-2 hover:border-blood/40 hover:shadow-[0_20px_60px_-15px_rgba(255,0,51,0.35)] ${
        wide ? "w-[280px] shrink-0 snap-start sm:w-[320px]" : ""
      }`}
    >
      {/* Poster */}
      <div
        className="relative aspect-[2/3] overflow-hidden"
        style={{
          background: `linear-gradient(160deg, ${film.accent}33, #0a0a0a 70%)`,
        }}
      >
        {!imgFailed ? (
          <img
            src={film.poster_url}
            alt={`${film.title} poster`}
            loading="lazy"
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{
              background: `radial-gradient(circle at 50% 30%, ${film.accent}55, #0a0a0a 75%)`,
            }}
          >
            <span className="font-display text-4xl tracking-wider" style={{ color: film.accent }}>
              {film.title.charAt(0)}
            </span>
          </div>
        )}

        {/* hover veil + play */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-ink via-ink/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <span
            className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/90 text-white transition-transform duration-500 group-hover:scale-110"
            style={{ backgroundColor: film.accent }}
          >
            <Play className="ml-0.5 h-5 w-5 fill-white" />
          </span>
        </div>

        <span
          className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em]"
          style={{ backgroundColor: `${film.accent}e6`, color: "#0a0a0a" }}
        >
          {film.category}
        </span>
      </div>

      {/* Meta */}
      <div className="p-5">
        <h3 className="font-display text-2xl tracking-wide text-white transition-colors group-hover:text-blood">
          {film.title}
        </h3>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] uppercase tracking-[0.14em] text-white/45">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3" /> {film.year}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3 w-3" /> {formatDuration(film.duration_minutes)}
          </span>
          <span className="flex items-center gap-1.5 text-gold">
            <Star className="h-3 w-3 fill-gold" /> {film.rating.toFixed(1)}
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
            Dir. {film.director}
          </span>
          <span
            className="text-[11px] font-bold uppercase tracking-[0.2em] transition-all group-hover:translate-x-1"
            style={{ color: film.accent }}
          >
            Watch Now
          </span>
        </div>
      </div>
    </Link>
  );
}
