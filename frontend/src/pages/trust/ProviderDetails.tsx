import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { trustApi, type TrustSnapshot } from "@/lib/trustApi";
import { TrustRouteBar } from "@/components/trust/TrustRouteBar";
import { AuthenticatedRoute } from "@/components/trust/AuthenticatedRoute";

function ProviderDetailsContent() {
  const { id = "" } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [trust, setTrust] = useState<TrustSnapshot | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await trustApi.getUserTrust(id);
        setTrust(res.trust);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load provider trust profile");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      load();
    }
  }, [id]);

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <TrustRouteBar />
        <Link to="/providers/nearby" className="text-sm text-neutral-300 hover:text-white">
          Back to providers
        </Link>

        {loading && <p className="text-neutral-300">Loading provider details...</p>}
        {error && <p className="text-red-400 text-sm">{error}</p>}

        {trust && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <h1 className="text-3xl font-black tracking-tight">Provider Trust Details</h1>
            <p className="text-sm text-neutral-400 break-all">Provider user ID: {id}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-black/30 rounded-xl p-4">
                <p className="text-xs text-neutral-400 uppercase tracking-widest">Trust score</p>
                <p className="text-3xl font-black mt-2">{trust.trustScore}</p>
              </div>
              <div className="bg-black/30 rounded-xl p-4">
                <p className="text-xs text-neutral-400 uppercase tracking-widest">Successful exchanges</p>
                <p className="text-3xl font-black mt-2">{trust.metrics.successfulExchanges}</p>
              </div>
              <div className="bg-black/30 rounded-xl p-4">
                <p className="text-xs text-neutral-400 uppercase tracking-widest">Disputes</p>
                <p className="text-3xl font-black mt-2">{trust.metrics.disputesCount}</p>
              </div>
            </div>

            <div className="bg-black/30 rounded-xl p-4">
              <p className="text-xs text-neutral-400 uppercase tracking-widest mb-2">Badges</p>
              {trust.badges.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {trust.badges.map((badge) => (
                    <span key={badge} className="px-3 py-1 rounded-full bg-white text-black text-xs font-bold">
                      {badge}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-neutral-300">No badges awarded yet.</p>
              )}
            </div>

            <Link to={`/disputes/new/${id}`} className="inline-block bg-white text-black px-4 py-2 rounded-xl text-sm font-bold">
              Raise dispute against this provider
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProviderDetails() {
  return (
    <AuthenticatedRoute>
      <ProviderDetailsContent />
    </AuthenticatedRoute>
  );
}
