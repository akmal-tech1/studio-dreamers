import { useEffect, useState } from "react";
import { Eye, Rocket, Heart, Quote, MapPin } from "lucide-react";
import { api } from "../api/client";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";

const VALUES = [
  {
    icon: Eye,
    title: "VISION FIRST",
    text: "We back the strange, the bold, and the unproven. A great logline beats a safe bet every time.",
  },
  {
    icon: Rocket,
    title: "SHIP THE REEL",
    text: "Dreams without deadlines are daydreams. Every project ships — imperfect, honest, and on time.",
  },
  {
    icon: Heart,
    title: "STORY OVER EVERYTHING",
    text: "Cameras age, trends fade. A story that moves one person moves a million.",
  },
];

export default function About() {
  const [team, setTeam] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .team()
      .then(setTeam)
      .catch(() => setError("Could not load the team."));
  }, []);

  return (
    <div className="pb-24 pt-36">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="grain absolute inset-0" />
        <div className="animate-glow absolute right-0 top-0 h-96 w-96 rounded-full bg-blood/10 blur-[120px]" />
        <div className="relative mx-auto max-w-7xl px-5 py-20 text-center sm:px-8">
          <Reveal>
            <span className="mb-4 flex items-center justify-center gap-3 text-[11px] font-bold uppercase tracking-[0.5em] text-blood">
              <span className="inline-block h-px w-10 bg-blood" />
              About the Studio
              <span className="inline-block h-px w-10 bg-blood" />
            </span>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="mx-auto max-w-4xl font-display text-6xl leading-[0.9] tracking-wide text-white sm:text-8xl">
              WE ARE THE <span className="text-blood">DREAMERS</span>
            </h1>
          </Reveal>
          <Reveal delay={240}>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-white/60">
              Studio Dreamers Pictures began in 2016 with a borrowed camera, a garage
              full of friends, and one rule: make the film nobody else dared to greenlight.
              A decade later we are still small on purpose — a tight crew of directors,
              cinematographers, and composers who believe independent cinema is the last
              place honest stories survive.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {VALUES.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 120}>
              <div className="group h-full rounded-2xl border border-white/5 bg-coal p-8 transition-all duration-500 hover:-translate-y-2 hover:border-blood/40">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blood/10 text-blood transition group-hover:bg-blood group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-6 font-display text-2xl tracking-[0.1em] text-white">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/55">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Quote banner */}
      <section className="relative overflow-hidden border-y border-white/5 bg-coal">
        <img
          src="https://picsum.photos/seed/sdp-projector/1600/700"
          alt="Projector light in a dark cinema"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/80 to-ink/60" />
        <div className="relative mx-auto max-w-4xl px-5 py-24 text-center sm:px-8">
          <Reveal>
            <Quote className="mx-auto h-10 w-10 text-blood" />
            <p className="mt-8 font-display text-3xl leading-tight tracking-wide text-white sm:text-5xl">
              "THE LIGHTS GO DOWN, AND FOR NINETY MINUTES EVERY DREAMER IN THE DARK IS THE SAME PERSON."
            </p>
            <p className="mt-6 text-[12px] font-bold uppercase tracking-[0.4em] text-blood">
              thanasurya — Founder
            </p>
          </Reveal>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-20 sm:px-8">
        <SectionHeading
          kicker="The Crew"
          title="MEET THE DREAMERS"
          description="The directors, producers, and craftspeople behind every frame we release."
          align="center"
        />

        {error ? (
          <p className="mt-14 text-center text-white/50">{error}</p>
        ) : (
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, i) => (
              <Reveal key={member.id} delay={(i % 4) * 100}>
                <article className="group overflow-hidden rounded-2xl border border-white/5 bg-coal transition-all duration-500 hover:-translate-y-2 hover:border-blood/40">
                  <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-blood/25 via-smoke to-ink">
                    <img
                      src={member.photo_url}
                      alt={`Portrait of ${member.name}`}
                      loading="lazy"
                      style={
                        member.name === "selvaganapathy"
                          ? { objectPosition: "left center" }
                          : member.name === "jeeva"
                            ? { objectPosition: "left center" }
                            : undefined
                      }
                      className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:grayscale"
                    />
                    <span className="absolute bottom-3 left-3 rounded-full bg-ink/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-blood backdrop-blur-sm">
                      {member.department}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-2xl tracking-wide text-white">{member.name}</h3>
                    <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.25em] text-blood">
                      {member.role}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-white/50">{member.bio}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* Visit */}
      <section className="mx-auto max-w-7xl px-5 pt-10 sm:px-8">
        <Reveal>
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/5 bg-coal px-8 py-12 text-center">
            <MapPin className="h-8 w-8 text-blood" />
            <p className="font-display text-2xl leading-relaxed tracking-wide text-white sm:text-3xl">
              Postmaster, Post Office POONAMALLEE (SUB OFFICE),
              <br />
              TIRUVALLUR, TAMIL NADU (TN), India (IN)
              <br />
              Pin Code:- 600056
            </p>
            <p className="text-sm text-white/45">
              Open for screenings every Friday & Saturday, 7 PM. Come find the dreamers.
            </p>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
