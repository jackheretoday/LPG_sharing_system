import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/trust/ProtectedRoute';
import { TrustRouteBar } from '@/components/trust/TrustRouteBar';
import { trustApi } from '@/lib/trustApi';

function SuspensionsContent() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [providers, setProviders] = useState<Array<{ id: string; name: string; isSuspended: boolean }>>([]);
  const [reason, setReason] = useState('Safety policy violation');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await trustApi.listProviders();
      setProviders(res.providers.map((item) => ({
        id: item.user.id,
        name: item.user.name,
        isSuspended: item.user.isSuspended,
      })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load suspension list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleSuspension = async (userId: string, suspended: boolean) => {
    setError('');
    setStatus('');
    try {
      await trustApi.updateSuspension(userId, { suspended, reason });
      setStatus(suspended ? 'User suspended successfully' : 'User unsuspended successfully');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update suspension');
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <TrustRouteBar />
        <h1 className="text-3xl font-black tracking-tight">Suspension Actions</h1>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">Default suspension reason</label>
          <input
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm"
          />
        </div>

        {loading ? <p className="text-neutral-300">Loading providers...</p> : null}
        {error ? <p className="text-red-400 text-sm">{error}</p> : null}
        {status ? <p className="text-emerald-400 text-sm">{status}</p> : null}

        <div className="space-y-3">
          {providers.map((provider) => (
            <div key={provider.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <p className="font-semibold">{provider.name}</p>
                <p className="text-xs text-neutral-400">{provider.id}</p>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${
                    provider.isSuspended
                      ? 'border-red-300/40 bg-red-400/15 text-red-200'
                      : 'border-emerald-300/40 bg-emerald-400/15 text-emerald-200'
                  }`}
                >
                  {provider.isSuspended ? 'Suspended' : 'Active'}
                </span>

                {provider.isSuspended ? (
                  <button
                    onClick={() => toggleSuspension(provider.id, false)}
                    className="rounded-lg bg-emerald-500 px-3 py-2 text-xs font-bold text-black"
                  >
                    Unsuspend
                  </button>
                ) : (
                  <button
                    onClick={() => toggleSuspension(provider.id, true)}
                    className="rounded-lg bg-red-500 px-3 py-2 text-xs font-bold text-white"
                  >
                    Suspend
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Suspensions() {
  return (
    <ProtectedRoute requiredRole="admin">
      <SuspensionsContent />
    </ProtectedRoute>
  );
}
