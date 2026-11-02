import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Play,
  Clapperboard,
  Award,
  Users,
  Film,
  Timer,
} from "lucide-react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import FilmCard from "../components/FilmCard";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";

function Counter({ value, suffix = "" }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const start = performance.now();
        const duration = 1600;
        const tick = (now) => {
          const p = Math.min((now - start) / duration, 1);
          setDisplay(Math.round(value * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        obs.disconnect();
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

export default function Home() {
  const { openAuth } = useAuth();
  const [featured, setFeatured] = useState([]);
  const [stats, setStats] = useState(null);
  const artworkRef = useRef(null);
  const carouselRef = useRef(null);

  useEffect(() => {
    api.films({ featured: true }).then(setFeatured).catch(() => {});
    api
      .stats()
      .then(setStats)
      .catch(() => { });
  }, []);

  const latest = featured[0] || null;

  const moveArtwork = (event) => {
    if (event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    if (artworkRef.current) {
      artworkRef.current.style.setProperty("--tilt-x", `${-y * 7}deg`);
      artworkRef.current.style.setProperty("--tilt-y", `${x * 7}deg`);
    }
  };

  const resetArtwork = () => {
    if (artworkRef.current) {
      artworkRef.current.style.setProperty("--tilt-x", "0deg");
      artworkRef.current.style.setProperty("--tilt-y", "0deg");
    }
  };

  const scrollCarousel = (dir) => {
    carouselRef.current?.scrollBy({ left: dir * 360, behavior: "smooth" });
  };

  return (
    <div>
      {/* ================= HERO ================= */}
      <section
        className="hero-cinema relative h-[100svh] min-h-[560px] overflow-hidden bg-ink"
        onPointerMove={moveArtwork}
        onPointerLeave={resetArtwork}
      >
        <div className="cinema-backdrop absolute inset-0" />
        <div
          ref={artworkRef}
          className="hero-artwork-motion absolute left-[5%] top-[34%] aspect-square w-[min(32vw,450px)] -translate-y-1/2 max-sm:left-1/2 max-sm:top-[31%] max-sm:-translate-x-1/2 max-sm:w-[min(78vw,450px)]"
        >
          <img
            src="/production-image.png"
            alt="Studio Dreamers Pictures production logo with its umbrella design"
            className="h-full w-full select-none object-contain"
            draggable="false"
          />
        </div>

        <h1 className="sr-only">Studio Dreamers Pictures</h1>
        <div className="cinema-vignette absolute inset-0" />
        <div className="grain absolute inset-0" />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-8 sm:px-8 sm:pb-8 lg:-translate-y-12">
          <Reveal>
            <span className="mb-4 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.35em] text-blood sm:text-[11px] sm:tracking-[0.5em]">
              <span className="inline-block h-px w-10 bg-blood" />
              Stories · People · Emotions · Beyond Frames
            </span>
          </Reveal>
          <Reveal delay={240}>
            <p className="max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">
              A creative film studio bringing ideas to life through powerful visuals and meaningful stories.
            </p>
          </Reveal>
          <Reveal delay={360}>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                to={latest ? `/films/${latest.id}` : "/films"}
                className="group flex items-center gap-3 rounded-full bg-blood px-7 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[0_0_40px_rgba(255,0,51,0.5)] transition hover:bg-ember"
              >
                <Play className="h-4 w-4 fill-white" />
                Watch Our Films
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/films"
                className="rounded-full border border-white/40 bg-black/25 px-7 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm transition hover:border-blood hover:text-blood"
              >
                Explore More
                <ArrowRight className="ml-2 inline h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>

        {/* scroll cue */}
        <div className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 md:block">
          <div className="flex h-12 w-7 items-start justify-center rounded-full border border-white/25 p-1.5">
            <div className="h-2 w-1 animate-bounce rounded-full bg-blood" />
          </div>
        </div>
      </section>

      {/* ================= MARQUEE ================= */}
      <section className="overflow-hidden border-y border-white/5 bg-coal py-4">
        <div className="animate-marquee flex w-max items-center gap-8 whitespace-nowrap">
          {[...Array(2)].map((_, dup) => (
            <span key={dup} className="flex items-center gap-8">
              {["Drama", "Thriller", "Sci-Fi", "Romance", "Mystery", "Documentary", "Award Winners", "Premieres"].map(
                (word) => (
                  <span key={word} className="flex items-center gap-8">
                    <span className="font-display text-xl tracking-[0.25em] text-white/35">{word}</span>
                    <span className="h-1.5 w-1.5 bg-blood" />
                  </span>
                )
              )}
            </span>
          ))}
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/5 lg:grid-cols-4">
          {[
            { icon: Film, value: stats?.total_films ?? 4, label: "Short Films", to: "/films" },
            { icon: Timer, value: stats?.total_minutes ?? 142, label: "Minutes of Film", to: "#featured-projects" },
            { icon: Award, value: stats?.total_awards ?? 39, label: "Festival Awards", to: "/films" },
            { icon: Users, value: stats?.team_count ?? 8, label: "Dreamers on Crew", to: "/about#team" },
          ].map(({ icon: Icon, value, label, to }, i) => (
            <Reveal key={label} delay={i * 100} className="bg-coal">
              <Link
                to={to}
                className="group flex h-full flex-col items-center px-6 py-12 text-center transition-colors hover:bg-white/[0.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-blood"
              >
                <Icon className="h-6 w-6 text-blood transition-transform duration-300 group-hover:scale-110" />
                <span className="mt-4 font-display text-5xl tracking-wide text-white sm:text-6xl">
                  <Counter value={value} />
                </span>
                <span className="mt-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/45 transition-colors group-hover:text-white/75">
                  {label}
                </span>
                <ArrowRight className="mt-4 h-4 w-4 text-blood opacity-60 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= FEATURED PROJECTS ================= */}
      <section id="featured-projects" className="mx-auto max-w-7xl scroll-mt-24 px-5 pb-24 sm:px-8">
        <div className="mb-10 flex items-end justify-between">
          <SectionHeading
            kicker="Featured Projects"
            title="NOW SHOWING"
            description="Hand-picked highlights from the studio — the films our dreamers are proudest of."
          />
          <div className="hidden gap-3 md:flex">
            <button
              onClick={() => scrollCarousel(-1)}
              aria-label="Scroll left"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-blood hover:text-blood"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scrollCarousel(1)}
              aria-label="Scroll right"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-blood hover:text-blood"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          ref={carouselRef}
          className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-4 sm:-mx-8 sm:px-8"
        >
          {(featured.length ? featured : Array.from({ length: 4 })).map((film, i) =>
            film ? (
              <Reveal key={film.id} delay={i * 100}>
                <FilmCard film={film} wide />
              </Reveal>
            ) : (
              <div key={i} className="w-[280px] shrink-0 animate-pulse rounded-2xl border border-white/5 bg-coal sm:w-[320px]">
                <div className="aspect-[2/3] bg-smoke" />
                <div className="space-y-3 p-5">
                  <div className="h-6 w-2/3 rounded bg-smoke" />
                  <div className="h-3 w-1/2 rounded bg-smoke" />
                </div>
              </div>
            )
          )}
        </div>

        <Reveal className="mt-10 text-center">
          <Link
            to="/films"
            className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.3em] text-blood transition hover:text-ember"
          >
            View the full catalog <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </section>

      {/* ================= ABOUT TEASER ================= */}
      <section className="relative overflow-hidden border-y border-white/5 bg-coal">
        <div className="grain absolute inset-0" />
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-24 sm:px-8 lg:grid-cols-2">
          <Reveal>
            <div className="relative">
              <div className="absolute -left-4 -top-4 h-full w-full rounded-2xl border border-blood/40" />
              <img
                src="/director-chair-clapperboard.svg"
                alt="Director chair beside a film clapboard"
                loading="lazy"
                className="relative aspect-[4/3] w-full rounded-2xl object-cover"
              />
              <div className="absolute bottom-6 left-6 flex items-center gap-4 rounded-xl bg-ink/85 px-6 py-4 backdrop-blur-md">
                <Clapperboard className="h-8 w-8 text-blood" />
                <div>
                  <p className="font-display text-2xl tracking-wide text-white">5+ YEARS</p>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">of independent filmmaking</p>
                </div>
              </div>
            </div>
          </Reveal>
          <div>
            <SectionHeading
              kicker="The Studio"
              title="DREAM BIG. SHOOT BOLD."
              description="Studio Dreamers Pictures was founded in a garage with a borrowed camera and a stubborn belief: that the next great film won't come from a boardroom — it will come from a dreamer with a story that refuses to stay quiet."
            />
            <Reveal delay={200}>
              <ul className="mt-8 space-y-4">
                {[
                  "Festival-first releases in narrative shorts",
                  "Every crew member is a creative owner",
                  "Stories that champion the underdog",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-white/65">
                    <span className="mt-2 h-2 w-2 shrink-0 rotate-45 bg-blood" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={300}>
              <Link
                to="/about"
                className="mt-10 inline-flex items-center gap-3 rounded-full border border-blood px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-blood transition hover:bg-blood hover:text-white"
              >
                Our Story <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ================= CTA BANNER ================= */}
      <section className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-blood/25 bg-gradient-to-br from-blood/15 via-coal to-coal px-8 py-16 text-center sm:px-16">
            <div className="animate-glow absolute -top-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-blood/20 blur-[100px]" />
            <h2 className="relative font-display text-5xl tracking-wide text-white sm:text-7xl">
              YOUR STORY DESERVES A <span className="text-blood">STAGE</span>
            </h2>
            <p className="relative mx-auto mt-5 max-w-xl text-white/55">
              Join the studio for early access to premieres, exclusive screenings,
              and behind-the-scenes content from the cutting-room floor.
            </p>
            <div className="relative mt-9 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => openAuth("register")}
                className="rounded-full bg-blood px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white shadow-[0_0_40px_rgba(255,0,51,0.5)] transition hover:bg-ember"
              >
                Become a Member
              </button>
              <Link
                to="/store"
                className="rounded-full border border-white/25 px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white/85 transition hover:border-blood hover:text-blood"
              >
                Tickets & Merch
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="relative mx-auto max-w-7xl px-5 pb-24 sm:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-r from-[#1d0b13] via-coal to-[#120b16] p-8 sm:p-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,0,51,0.3),_transparent_45%)]" />
            <div className="relative grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-blood">Now showing</p>
                <h3 className="mt-4 font-display text-4xl tracking-wide text-white sm:text-5xl">
                  Discover the next wave of cinematic stories.
                </h3>
                <p className="mt-4 max-w-xl text-white/60">
                  From intimate drama to haunting thrillers, these three premieres set the tone for the next Studio Dreamers season.
                </p>
              </div>
              <div className="flex justify-center lg:justify-end">
                <Link
                  to="/films"
                  className="inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-ink transition hover:bg-blood hover:text-white"
                >
                  Explore the films <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
