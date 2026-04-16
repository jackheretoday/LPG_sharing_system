import { useEffect, useState } from "react";
import { trustApi, type Dispute } from "@/lib/trustApi";
import { TrustRouteBar } from "@/components/trust/TrustRouteBar";
import { ProtectedRoute } from "@/components/trust/ProtectedRoute";

function AdminDisputesContent() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [disputes, setDisputes] = useState<Dispute[]>([]);

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

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await trustApi.updateDispute(id, { status });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update dispute");
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <TrustRouteBar />
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-black tracking-tight">Admin Dispute Panel</h1>
          <button onClick={load} className="bg-white text-black px-4 py-2 rounded-xl text-sm font-bold">Refresh</button>
        </header>

        {loading && <p className="text-neutral-300">Loading disputes...</p>}
        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="space-y-3">
          {disputes.map((d) => (
            <div key={d.id} className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <p className="text-sm text-neutral-400">Dispute {d.id}</p>
                  <p className="text-lg font-bold mt-1">{d.reason}</p>
                </div>
                <span className="text-xs font-bold uppercase tracking-widest bg-white text-black px-3 py-1 rounded-full w-fit">
                  {d.status}
                </span>
              </div>

              <div className="mt-3 text-xs text-neutral-400">Exchange: {d.exchangeId} • Against: {d.againstUserId}</div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => updateStatus(d.id, "under_review")}
                  className="bg-black/40 border border-white/20 px-3 py-2 rounded-lg text-xs font-bold"
                >
                  Mark Under Review
                </button>
                <button
                  onClick={() => updateStatus(d.id, "resolved")}
                  className="bg-white text-black px-3 py-2 rounded-lg text-xs font-bold"
                >
                  Resolve
                </button>
                <button
                  onClick={() => updateStatus(d.id, "rejected")}
                  className="bg-red-500 text-white px-3 py-2 rounded-lg text-xs font-bold"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminDisputes() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminDisputesContent />
    </ProtectedRoute>
  );
}
