import Reveal from "./Reveal";

export default function SectionHeading({ kicker, title, description, align = "left" }) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <Reveal className={`max-w-2xl ${alignClass}`}>
      {kicker && (
        <span className="mb-3 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.4em] text-blood">
          <span className="inline-block h-px w-8 bg-blood" />
          {kicker}
        </span>
      )}
      <h2 className="font-display text-5xl leading-[0.95] tracking-wide text-white sm:text-6xl">
        {title}
      </h2>
      {description && <p className="mt-5 text-base leading-relaxed text-white/55">{description}</p>}
    </Reveal>
  );
}
