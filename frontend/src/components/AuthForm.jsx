import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AuthForm({ mode: initialMode, onSuccess }) {
  const { login, register, openAuth } = useAuth();
  const [mode, setMode] = useState(initialMode || "login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const switchMode = (m) => {
    setMode(m);
    setError("");
    if (onSuccess) onSuccess(m);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (mode === "register" && name.trim().length < 2) {
      setError("Please enter your name.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email.trim(), password);
      } else {
        await register(name.trim(), email.trim(), password);
      }
      onSuccess?.(null, true);
    } catch (err) {
      setError(err.detail || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      {mode === "register" && (
        <div>
          <label htmlFor="auth-name" className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.25em] text-white/65">
            Full Name
          </label>
          <input
            id="auth-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ava Sterling"
            autoComplete="name"
            className="w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3.5 text-sm text-white placeholder-white/35 shadow-inner shadow-black/10 outline-none backdrop-blur-md transition duration-300 focus:border-blood/70 focus:bg-white/[0.08] focus:ring-2 focus:ring-blood/20"
          />
        </div>
      )}

      <div>
        <label htmlFor="auth-email" className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.25em] text-white/65">
          Email
        </label>
        <input
          id="auth-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@dreamer.example"
          autoComplete="email"
          className="w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3.5 text-sm text-white placeholder-white/35 shadow-inner shadow-black/10 outline-none backdrop-blur-md transition duration-300 focus:border-blood/70 focus:bg-white/[0.08] focus:ring-2 focus:ring-blood/20"
        />
      </div>

      <div>
        <label htmlFor="auth-password" className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.25em] text-white/65">
          Password
        </label>
        <input
          id="auth-password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          className="w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3.5 text-sm text-white placeholder-white/35 shadow-inner shadow-black/10 outline-none backdrop-blur-md transition duration-300 focus:border-blood/70 focus:bg-white/[0.08] focus:ring-2 focus:ring-blood/20"
        />
      </div>

      {error && (
        <p className="rounded-lg border border-blood/30 bg-blood/10 px-4 py-3 text-sm text-ember">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-blood px-6 py-3.5 text-sm font-bold uppercase tracking-[0.25em] text-white shadow-[0_0_30px_rgba(255,0,51,0.4)] transition hover:bg-ember disabled:opacity-60"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {mode === "login" ? "Sign In" : "Create Account"}
      </button>

      <p className="text-center text-sm text-white/45">
        {mode === "login" ? "New to the studio?" : "Already a dreamer?"}{" "}
        <button
          type="button"
          onClick={() => switchMode(mode === "login" ? "register" : "login")}
          className="font-semibold text-blood transition hover:text-ember"
        >
          {mode === "login" ? "Sign up" : "Sign in"}
        </button>
      </p>
    </form>
  );
}
