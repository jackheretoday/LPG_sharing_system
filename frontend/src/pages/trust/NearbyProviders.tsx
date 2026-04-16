import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { trustApi, type ProviderDatasetItem } from "@/lib/trustApi";
import { TrustRouteBar } from "@/components/trust/TrustRouteBar";
import { AuthenticatedRoute } from "@/components/trust/AuthenticatedRoute";

function NearbyProvidersContent() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [providers, setProviders] = useState<ProviderDatasetItem[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await trustApi.listProviders();
        setProviders(res.providers);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load providers");
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
        <header>
          <h1 className="text-3xl font-black tracking-tight">Nearby Trusted Providers</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Providers are sorted by trust score using backend trust snapshots.
          </p>
        </header>

        {loading && <p className="text-neutral-300">Loading providers...</p>}
        {error && <p className="text-red-400 text-sm">{error}</p>}

        {!loading && providers.length === 0 && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <p className="text-neutral-300">No provider trust data found yet.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {providers.map((p) => (
            <Link
              key={p.user.id}
              to={`/provider/${p.user.id}`}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-neutral-400">Provider</p>
                  <p className="font-bold">{p.user.name}</p>
                  <p className="text-xs text-neutral-500 break-all">{p.user.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-neutral-400">Trust score</p>
                  <p className="text-2xl font-black">{p.trust.trustScore}</p>
                </div>
              </div>
              <div className="mt-4 text-xs text-neutral-300">
                Badges: {p.trust.badges.length > 0 ? p.trust.badges.join(", ") : "none"}
              </div>
              {p.user.isSuspended && (
                <div className="mt-2 inline-block rounded-full bg-red-500/20 border border-red-400/40 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-red-300">
                  Suspended
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function NearbyProviders() {
  return (
    <AuthenticatedRoute>
      <NearbyProvidersContent />
    </AuthenticatedRoute>
  );
}
