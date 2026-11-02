import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Calendar,
  Clock,
  Star,
  Award,
  Play,
  ArrowLeft,
  Quote,
  Clapperboard,
} from "lucide-react";
import { api } from "../api/client";
import FilmCard from "../components/FilmCard";
import Reveal from "../components/Reveal";
import { formatDuration } from "../utils/formatDuration";

export default function FilmDetail() {
  const { id } = useParams();
  const [film, setFilm] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setLoading(true);
    setImgFailed(false);
    api
      .film(id)
      .then((data) => {
        setFilm(data);
        return api.films({ category: data.category });
      })
      .then((list) => {
        setRelated(list.filter((f) => f.id !== Number(id)).slice(0, 4));
        setLoading(false);
      })
      .catch((e) => {
        setError(e.detail || "Film not found.");
        setLoading(false);
      });
  }, [id]);

  const meta = useMemo(
    () =>
      film
        ? [
            { icon: Calendar, label: "Release", value: film.release_date || film.year },
            { icon: Clock, label: "Runtime", value: formatDuration(film.duration_minutes) },
            { icon: Clapperboard, label: "Genre", value: film.category },
            { icon: Award, label: "Awards", value: film.awards },
            { icon: Star, label: "Rating", value: `${film.rating.toFixed(1)} / 5` },
          ]
        : [],
    [film]
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-5 pb-24 pt-36 sm:px-8">
        <div className="animate-pulse space-y-8">
          <div className="letterbox rounded-2xl bg-smoke" />
          <div className="h-10 w-2/3 rounded bg-smoke" />
          <div className="h-5 w-1/2 rounded bg-smoke" />
        </div>
      </div>
    );
  }

  if (error || !film) {
    return (
      <div className="mx-auto max-w-3xl px-5 pb-24 pt-40 text-center sm:px-8">
        <p className="font-display text-6xl tracking-wide text-blood">REEL LOST</p>
        <p className="mt-4 text-white/55">{error}</p>
        <Link
          to="/films"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-blood px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white transition hover:bg-ember"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Films
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-32 sm:px-8">
      <Link
        to="/films"
        className="mb-8 inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.25em] text-white/50 transition hover:text-blood"
      >
        <ArrowLeft className="h-4 w-4" /> All Films
      </Link>

      {/* Title block */}
      <Reveal>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
          <div>
            <span
              className="mb-3 inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em]"
              style={{ backgroundColor: `${film.accent}e6`, color: "#0a0a0a" }}
            >
              {film.category}
            </span>
            <h1 className="font-display text-6xl leading-[0.9] tracking-wide text-white sm:text-8xl">
              {film.title}
            </h1>
            <p className="mt-3 text-[12px] uppercase tracking-[0.3em] text-white/45">
              Dir. {film.director} · {film.year} · {formatDuration(film.duration_minutes)}
            </p>
          </div>
          {film.featured && (
            <span className="flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-gold">
              <Award className="h-4 w-4" /> Festival Favorite
            </span>
          )}
        </div>
      </Reveal>

      {/* Player */}
      <Reveal delay={100}>
        <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black">
          <video
            key={film.video_url}
            src={film.video_url}
            poster={imgFailed ? undefined : film.poster_url}
            controls
            playsInline
            preload="metadata"
            className="letterbox w-full object-cover"
          />
          {!imgFailed && (
            <span className="pointer-events-none absolute bottom-4 right-4 rounded bg-ink/70 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-white/60 opacity-0 transition group-hover:opacity-100">
              Demo reel footage
            </span>
          )}
        </div>
      </Reveal>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        {/* Synopsis */}
        <div>
          <Reveal>
            <h2 className="font-display text-3xl tracking-wide text-white">SYNOPSIS</h2>
            <p className="mt-4 text-lg leading-relaxed text-white/65">{film.synopsis}</p>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-10 rounded-2xl border border-white/5 bg-coal p-7">
              <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em] text-blood">
                <Quote className="h-4 w-4" /> Director's Note
              </span>
              <p className="mt-4 text-[15px] italic leading-relaxed text-white/60">
                "{film.director_note}"
              </p>
              <p className="mt-4 text-[12px] font-semibold uppercase tracking-[0.25em] text-white/45">
                — {film.director}
              </p>
            </div>
          </Reveal>
        </div>

        {/* Meta panel */}
        <div>
          <Reveal delay={150}>
            <div className="overflow-hidden rounded-2xl border border-white/5 bg-coal">
              <div className="border-b border-white/5 px-6 py-4 text-[11px] font-bold uppercase tracking-[0.3em] text-white/45">
                Film Details
              </div>
              <ul className="divide-y divide-white/5">
                {meta.map(({ icon: Icon, label, value }) => (
                  <li key={label} className="flex items-center justify-between px-6 py-4">
                    <span className="flex items-center gap-3 text-sm text-white/55">
                      <Icon className="h-4 w-4 text-blood" /> {label}
                    </span>
                    <span className="text-sm font-semibold text-white">{value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-blood px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white shadow-[0_0_30px_rgba(255,0,51,0.4)] transition hover:bg-ember"
            >
              <Play className="h-4 w-4 fill-white" /> Watch Trailer
            </button>
          </Reveal>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-20">
          <Reveal>
            <h2 className="font-display text-4xl tracking-wide text-white">
              MORE IN <span style={{ color: film.accent }}>{film.category.toUpperCase()}</span>
            </h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((f, i) => (
              <Reveal key={f.id} delay={i * 80}>
                <FilmCard film={f} />
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
