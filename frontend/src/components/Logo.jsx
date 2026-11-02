import { useState } from "react";

/**
 * Studio Dreamers Pictures logo.
 *
 * Uses the studio logo from `frontend/public/logo.png`.
 */
export default function Logo({ compact = false }) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <span className="group flex items-center gap-3">
      {imgFailed ? (
        <svg viewBox="0 0 48 48" className="h-10 w-10 shrink-0 transition-transform duration-300 group-hover:rotate-6">
          <rect x="3" y="3" width="42" height="42" rx="11" fill="#ff0033" />
          <path d="M19 15.5v17l14.5-8.5L19 15.5z" fill="#0a0a0a" />
        </svg>
      ) : (
        <img
          src="/logo.png"
          alt="Studio Dreamers Pictures logo"
          onError={() => setImgFailed(true)}
          className={`${compact ? "h-10 w-10" : "h-12 w-12"} shrink-0 object-contain`}
        />
      )}
      {!compact && (
        <span className="leading-none">
          <span className="block font-display text-2xl tracking-wide text-white">
            STUDIO DREAMERS
          </span>
          <span className="mt-0.5 block text-[10px] font-semibold tracking-[0.55em] text-blood">
            PICTURES
          </span>
        </span>
      )}
    </span>
  );
}
