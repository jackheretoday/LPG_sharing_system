import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { trustApi, type Dispute } from "@/lib/trustApi";
import { TrustRouteBar } from "@/components/trust/TrustRouteBar";
import { AuthenticatedRoute } from "@/components/trust/AuthenticatedRoute";

function DisputesContent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [disputes, setDisputes] = useState<Dispute[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await trustApi.listDisputes();
        setDisputes(res.disputes);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load disputes");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <TrustRouteBar />
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight">My Disputes</h1>
            <p className="text-sm text-neutral-400 mt-1">Connected to backend dispute APIs.</p>
          </div>
          <button
            onClick={() => navigate("/disputes/new/demo-exchange")}
            className="bg-white text-black px-4 py-2 rounded-xl text-sm font-bold"
          >
            Raise dispute
          </button>
        </header>

        {loading && <p className="text-neutral-300">Loading disputes...</p>}
        {error && <p className="text-red-400 text-sm">{error}</p>}

        {!loading && disputes.length === 0 && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <p className="text-neutral-300">No disputes found. Create one to test the workflow.</p>
          </div>
        )}

        <div className="space-y-3">
          {disputes.map((d) => (
            <Link
              key={d.id}
              to={`/disputes/${d.id}`}
              className="block bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <p className="text-xs text-neutral-400">Dispute ID: {d.id}</p>
                  <p className="text-lg font-bold mt-1">{d.reason}</p>
                </div>
                <span className="text-xs font-bold uppercase tracking-widest bg-white text-black px-3 py-1 rounded-full w-fit">
                  {d.status}
                </span>
              </div>
              <div className="mt-3 text-xs text-neutral-400">
                Exchange: {d.exchangeId} • Against user: {d.againstUserId}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Disputes() {
  return (
    <AuthenticatedRoute>
      <DisputesContent />
    </AuthenticatedRoute>
  );
}
