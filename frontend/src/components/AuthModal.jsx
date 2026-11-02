import { X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AuthForm from "./AuthForm";
import Logo from "./Logo";

export default function AuthModal() {
  const { authModal, closeAuth } = useAuth();

  if (!authModal.open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-ink/85 backdrop-blur-md"
        onClick={closeAuth}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-coal shadow-[0_0_80px_rgba(255,0,51,0.15)]">
        {/* red top bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blood via-ember to-blood" />
        <button
          onClick={closeAuth}
          aria-label="Close"
          className="absolute right-4 top-4 text-white/40 transition hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-8">
          <div className="mb-6 flex justify-center">
            <Logo compact />
          </div>
          <h2 className="mb-1 text-center font-display text-4xl tracking-wide text-white">
            {authModal.mode === "login" ? "WELCOME BACK" : "JOIN THE STUDIO"}
          </h2>
          <p className="mb-8 text-center text-sm text-white/45">
            {authModal.mode === "login"
              ? "Sign in to book screenings and unlock early access."
              : "Create an account for tickets, premieres, and more."}
          </p>
          <AuthForm mode={authModal.mode} onSuccess={(_mode, done) => done && closeAuth()} />
        </div>
      </div>
    </div>
  );
}
