import { Link } from "react-router-dom";
import { Instagram, Twitter, Youtube, Facebook, Clapperboard } from "lucide-react";
import Logo from "./Logo";

const SOCIALS = [
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Twitter, label: "Twitter / X", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
  { icon: Facebook, label: "Facebook", href: "#" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-ink">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-6 max-w-md text-sm leading-relaxed text-white/50">
              An independent film house crafting dramatic shorts since 2016. Every frame
              begins as a dream — every dream ends on a screen.
            </p>
            <div className="mt-6 flex gap-3">
              {SOCIALS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/60 transition hover:border-blood hover:text-blood"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-lg tracking-widest text-white">EXPLORE</h4>
            <ul className="mt-5 space-y-3 text-sm text-white/50">
              <li><Link className="transition hover:text-blood" to="/films">Short Films</Link></li>
              <li><Link className="transition hover:text-blood" to="/store">Tickets & Merch</Link></li>
              <li><Link className="transition hover:text-blood" to="/about">About the Studio</Link></li>
              <li><Link className="transition hover:text-blood" to="/about#team">The Team</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg tracking-widest text-white">STUDIO</h4>
            <ul className="mt-5 space-y-3 text-sm text-white/50">
              <li className="flex items-center gap-2">
                <Clapperboard className="h-4 w-4 text-blood" />
                44 Reels Lane, Arts District
              </li>
              <li>hello@studiodreamers.example</li>
              <li>+1 (555) 019-2837</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/5 pt-8 text-xs text-white/35 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Studio Dreamers Pictures. All rights reserved.</p>
          <p>Demonstration website — films, people, and products are fictional.</p>
        </div>
      </div>
    </footer>
  );
}
