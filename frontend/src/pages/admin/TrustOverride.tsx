import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/trust/ProtectedRoute';
import { TrustRouteBar } from '@/components/trust/TrustRouteBar';
import { trustApi } from '@/lib/trustApi';

function TrustOverrideContent() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [providers, setProviders] = useState<Array<{ id: string; name: string; trustScore: number }>>([]);
  const [userId, setUserId] = useState('');
  const [trustScore, setTrustScore] = useState('50');
  const [reason, setReason] = useState('Manual moderation override');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await trustApi.listProviders();
      setProviders(res.providers.map((item) => ({ id: item.user.id, name: item.user.name, trustScore: item.trust.trustScore })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setStatus('');
    try {
      const score = Number(trustScore);
      if (!userId) throw new Error('Select a user first');
      await trustApi.overrideTrust(userId, { trustScore: score, reason });
      setStatus('Trust override applied successfully');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to apply override');
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <TrustRouteBar />
        <h1 className="text-3xl font-black tracking-tight">Trust Override</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <form onSubmit={submit} className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4">
            <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400">Target User</label>
            <select
              value={userId}
              onChange={(event) => setUserId(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm"
            >
              <option value="">Select provider</option>
              {providers.map((provider) => (
                <option key={provider.id} value={provider.id}>
                  {provider.name} ({provider.id.slice(0, 8)}...) score:{provider.trustScore}
                </option>
              ))}
            </select>

            <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400">Trust Score (0-100)</label>
            <input
              value={trustScore}
              onChange={(event) => setTrustScore(event.target.value)}
              type="number"
              min={0}
              max={100}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm"
            />

            <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400">Reason</label>
            <textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              rows={3}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm resize-none"
            />

            {error ? <p className="text-red-400 text-sm">{error}</p> : null}
            {status ? <p className="text-emerald-400 text-sm">{status}</p> : null}

            <button type="submit" className="rounded-xl bg-white text-black px-4 py-2 text-sm font-bold">Apply Override</button>
          </form>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-bold">Provider Trust Snapshot</h2>
            {loading ? <p className="text-neutral-300 mt-3">Loading providers...</p> : null}
            <div className="mt-3 space-y-2 max-h-[420px] overflow-auto pr-1">
              {providers.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => {
                    setUserId(provider.id);
                    setTrustScore(String(provider.trustScore));
                  }}
                  className="w-full rounded-xl border border-white/10 bg-black/30 p-3 text-left hover:bg-black/50"
                >
                  <p className="font-semibold">{provider.name}</p>
                  <p className="text-xs text-neutral-400">{provider.id}</p>
                  <p className="text-xs text-neutral-300 mt-1">Current trust: {provider.trustScore}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TrustOverride() {
  return (
    <ProtectedRoute requiredRole="admin">
      <TrustOverrideContent />
    </ProtectedRoute>
  );
}
