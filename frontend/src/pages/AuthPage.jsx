import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import Logo from "../components/Logo";
import Reveal from "../components/Reveal";

export default function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const isRegistering = mode === "register";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-4 pb-12 pt-28">
      <div className="cinema-backdrop absolute inset-0 opacity-45" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/45 to-ink/90" />
      <div className="animate-glow absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-blood/20 blur-[120px]" />
      <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-ember/10 blur-[130px]" />
      <div className="grain absolute inset-0" />

      <div className="relative z-10 w-full max-w-md">
        <Reveal className="mb-7 flex justify-center">
          <Logo />
        </Reveal>
        <Reveal delay={100}>
          <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/[0.08] shadow-[0_24px_100px_rgba(0,0,0,0.55),0_0_80px_rgba(255,0,51,0.12)] backdrop-blur-2xl">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            <div className="h-1 w-full bg-gradient-to-r from-blood via-ember to-blood shadow-[0_0_20px_rgba(255,0,51,0.65)]" />
            <div className="p-7 sm:p-9">
              <span className="mb-4 flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-[0.38em] text-blood">
                <span className="h-px w-7 bg-blood/70" />
                Members Lounge
                <span className="h-px w-7 bg-blood/70" />
              </span>
              <h1 className="mb-2 text-center font-display text-4xl tracking-wide text-white sm:text-5xl">
                {isRegistering ? "JOIN THE DREAMERS" : "ENTER THE THEATER"}
              </h1>
              <p className="mb-8 text-center text-sm leading-relaxed text-white/60">
                {isRegistering
                  ? "Create your account for premieres, screenings, and stories worth staying up for."
                  : "Sign in to book screenings and unlock early access."}
              </p>
              <AuthForm
                mode={mode}
                onSuccess={(nextMode, done) => {
                  if (done) {
                    navigate("/");
                    return;
                  }
                  if (nextMode) setMode(nextMode);
                }}
              />
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
