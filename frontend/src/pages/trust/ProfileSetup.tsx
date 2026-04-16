import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { trustApi } from "@/lib/trustApi";
import { getStoredUser, setStoredUser, type StoredUser } from "@/lib/trustAuth";
import { TrustRouteBar } from "@/components/trust/TrustRouteBar";
import { AuthenticatedRoute } from "@/components/trust/AuthenticatedRoute";

const roleMap: Record<string, string> = {
  consumer: "household",
  mechanic: "verified_reseller",
};

function ProfileSetupContent() {
  const navigate = useNavigate();
  const [role, setRole] = useState<"consumer" | "mechanic">("consumer");
  const [name, setName] = useState("");
  const [addressText, setAddressText] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [idDocUrl, setIdDocUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const updateStoredNameAndRole = () => {
    const existing = getStoredUser();
    if (!existing) return;

    const next: StoredUser = {
      ...existing,
      name: name || existing.name,
      role: roleMap[role] || existing.role,
    };

    setStoredUser(next);
  };

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setBusy(true);

    try {
      if (!pinCode.trim()) {
        throw new Error("PIN code is required");
      }

      await trustApi.pinVerify({
        pinCode: pinCode.trim(),
        addressText: addressText.trim(),
      });

      if (idDocUrl.trim()) {
        await trustApi.idUpload({ idDocUrl: idDocUrl.trim() });
      }

      updateStoredNameAndRole();
      setSuccess("Verification details submitted to backend successfully");
      navigate("/trust/me");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save verification details");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white px-4 py-10">
      <div className="max-w-3xl mx-auto space-y-4">
        <TrustRouteBar />
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
        <h1 className="text-3xl font-black tracking-tight mb-2">Trust Onboarding Setup</h1>
        <p className="text-sm text-neutral-400 mb-8">
          This page is now connected to backend verification APIs and Supabase-backed trust data.
        </p>

        <form onSubmit={handleComplete} className="space-y-5">
          <div>
            <label className="text-xs uppercase tracking-widest text-neutral-400 font-bold">Role</label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <button
                type="button"
                onClick={() => setRole("consumer")}
                className={`rounded-xl py-3 font-bold ${role === "consumer" ? "bg-white text-black" : "bg-black/30 border border-white/10"}`}
              >
                Consumer
              </button>
              <button
                type="button"
                onClick={() => setRole("mechanic")}
                className={`rounded-xl py-3 font-bold ${role === "mechanic" ? "bg-white text-black" : "bg-black/30 border border-white/10"}`}
              >
                Mechanic/Provider
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-neutral-400 font-bold">Display Name</label>
            <input
              className="w-full mt-2 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-neutral-400 font-bold">Address</label>
            <textarea
              className="w-full mt-2 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none resize-none"
              placeholder="Full address"
              rows={3}
              value={addressText}
              onChange={(e) => setAddressText(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-neutral-400 font-bold">PIN code</label>
            <input
              className="w-full mt-2 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none"
              placeholder="PIN code"
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-neutral-400 font-bold">ID document URL (optional)</label>
            <input
              className="w-full mt-2 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none"
              placeholder="https://..."
              value={idDocUrl}
              onChange={(e) => setIdDocUrl(e.target.value)}
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
          {success && <p className="text-green-400 text-sm">{success}</p>}

          <button
            className="w-full bg-white text-black rounded-xl py-3 font-black tracking-wide disabled:opacity-50"
            type="submit"
            disabled={busy}
          >
            {busy ? "Saving..." : "Complete Setup"}
          </button>
        </form>
        </div>
      </div>
    </div>
  );
}

export default function ProfileSetup() {
  return (
    <AuthenticatedRoute>
      <ProfileSetupContent />
    </AuthenticatedRoute>
  );
}
