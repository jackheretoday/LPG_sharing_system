import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/lib/authApi";
import { setPendingAuth } from "@/lib/authSession";
import { setStoredUser, setToken } from "@/lib/trustAuth";
import { TrustRouteBar } from "@/components/trust/TrustRouteBar";

type Mode = "login" | "signup";

const roleOptions = [
  { value: "user", label: "User" },
  { value: "consumer", label: "Consumer" },
  { value: "provider", label: "Provider" },
  { value: "admin", label: "Admin" },
] as const;

export default function TrustLogin() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<(typeof roleOptions)[number]["value"]>("consumer");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setBusy(true);

    try {
      const response =
        mode === "signup"
          ? await authApi.signup({ name, email, password, role })
          : await authApi.login({ email, password });

      if (mode === "signup" || response.verificationRequired) {
        setPendingAuth({
          email,
          purpose: "signup",
          role: response.user.role,
          name: response.user.name,
        });

        navigate("/auth/otp-verify");
      } else {
        setToken(response.token || "");
        setStoredUser(response.user);
        navigate(response.nextRoute || "/consumer");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to authenticate");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-4">
        <TrustRouteBar />
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-3xl font-black tracking-tight mb-2">Trust Access</h1>
          <p className="text-sm text-neutral-400 mb-6">Signup requires email OTP verification. Verified users can login directly.</p>

          <div className="grid grid-cols-2 bg-black/40 p-1 rounded-xl mb-6">
            <button
              className={`py-2 rounded-lg text-sm font-bold ${mode === "login" ? "bg-white text-black" : "text-neutral-400"}`}
              onClick={() => setMode("login")}
              type="button"
            >
              Login
            </button>
            <button
              className={`py-2 rounded-lg text-sm font-bold ${mode === "signup" ? "bg-white text-black" : "text-neutral-400"}`}
              onClick={() => setMode("signup")}
              type="button"
            >
              Signup
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <input
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}

            <input
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />

            {mode === "signup" && (
              <select
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none"
                value={role}
                onChange={(e) => setRole(e.target.value as (typeof roleOptions)[number]["value"])}
              >
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              className="w-full bg-white text-black rounded-xl py-3 font-black tracking-wide disabled:opacity-50"
              type="submit"
              disabled={busy}
            >
              {busy ? "Please wait..." : mode === "signup" ? "Create account" : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
