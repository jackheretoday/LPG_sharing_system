import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/lib/authApi";
import { clearPendingAuth, getPendingAuth } from "@/lib/authSession";
import { setStoredUser, setToken } from "@/lib/trustAuth";

export default function OTPVerify() {
  const navigate = useNavigate();
  const pending = getPendingAuth();
  const [email, setEmail] = useState(pending?.email || "");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setStatus("");

    try {
      const response = await authApi.verifyOtp({ email, otp, purpose: "signup" });
      setToken(response.token || "");
      setStoredUser(response.user);
      clearPendingAuth();
      navigate(response.nextRoute || "/consumer", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setBusy(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError("Enter an email address first");
      return;
    }

    setResending(true);
    setError("");
    setStatus("");

    try {
      const response = await authApi.requestOtp({ email, purpose: "signup" });
      setStatus(response.message || "Verification code resent");
      setStoredUser(response.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-3xl font-black tracking-tight mb-2">Email OTP Verification</h1>
          <p className="text-sm text-neutral-400 mb-6">
            Enter the 6-digit code sent to your email to complete signup verification.
          </p>

          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-neutral-400 font-bold">Email</label>
              <input
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none"
                placeholder="name@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <input
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm tracking-[0.4em] text-center outline-none"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value.slice(0, 6))}
              required
            />

            {error && <p className="text-red-400 text-sm">{error}</p>}
            {status && <p className="text-emerald-400 text-sm">{status}</p>}

            <button
              className="w-full bg-white text-black rounded-xl py-3 font-black tracking-wide disabled:opacity-50"
              type="submit"
              disabled={busy}
            >
              {busy ? "Verifying..." : "Verify and continue"}
            </button>
          </form>

          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="w-full mt-3 border border-white/10 text-white rounded-xl py-3 font-bold text-sm hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            {resending ? "Resending..." : "Resend code"}
          </button>
        </div>
      </div>
    </div>
  );
}
