import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, User, LogOut, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/films", label: "Films" },
  { to: "/store", label: "Store" },
  { to: "/about", label: "About" },
];

export default function Navbar() {
  const { user, logout, openAuth } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-white/5 bg-ink/90 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link to="/" aria-label="Studio Dreamers Pictures home">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-9 md:flex">
          {NAV_LINKS.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `text-[13px] font-medium uppercase tracking-[0.22em] transition-colors duration-300 ${
                    isActive ? "text-blood" : "text-white/70 hover:text-white"
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-4 md:flex">
          {user ? (
            <>
              <span className="flex items-center gap-2 text-sm text-white/80">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blood/15 text-xs font-bold text-blood">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="max-w-[120px] truncate">{user.name}</span>
              </span>
              <button
                onClick={logout}
                className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-white/70 transition hover:border-blood hover:text-blood"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => openAuth("login")}
                className="text-[12px] font-semibold uppercase tracking-[0.2em] text-white/70 transition hover:text-white"
              >
                Sign In
              </button>
              <button
                onClick={() => openAuth("register")}
                className="rounded-full bg-blood px-5 py-2.5 text-[12px] font-bold uppercase tracking-[0.18em] text-white shadow-[0_0_24px_rgba(255,0,51,0.45)] transition hover:bg-ember"
              >
                <span className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5" />
                  Join
                </span>
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="text-white md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden transition-[max-height] duration-500 md:hidden ${
          mobileOpen ? "max-h-96" : "max-h-0"
        } ${scrolled ? "bg-ink/95" : "bg-ink"} border-b border-white/5 backdrop-blur-xl`}
      >
        <ul className="space-y-1 px-5 py-4">
          {NAV_LINKS.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `block rounded-lg px-4 py-3 text-sm uppercase tracking-[0.2em] ${
                    isActive ? "bg-blood/10 text-blood" : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
          <li className="pt-2">
            {user ? (
              <button
                onClick={logout}
                className="w-full rounded-lg border border-white/15 px-4 py-3 text-left text-sm uppercase tracking-[0.2em] text-white/70"
              >
                Sign Out
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => openAuth("login")}
                  className="flex-1 rounded-lg border border-white/15 px-4 py-3 text-sm uppercase tracking-[0.2em] text-white/80"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuth("register")}
                  className="flex-1 rounded-lg bg-blood px-4 py-3 text-sm font-bold uppercase tracking-[0.2em] text-white"
                >
                  Join
                </button>
              </div>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
}
