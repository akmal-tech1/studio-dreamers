import { Link } from "react-router-dom";
import { Film } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[80vh] flex-col items-center justify-center bg-ink px-4 text-center">
      <div className="grain absolute inset-0" />
      <Film className="relative h-10 w-10 text-blood" />
      <p className="relative mt-6 font-display text-[10rem] leading-none tracking-wide text-white sm:text-[14rem]">
        404
      </p>
      <p className="relative mt-2 text-[12px] font-bold uppercase tracking-[0.5em] text-white/50">
        Reel not found
      </p>
      <Link
        to="/"
        className="relative mt-10 rounded-full bg-blood px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white transition hover:bg-ember"
      >
        Back to the Theater
      </Link>
    </div>
  );
}
