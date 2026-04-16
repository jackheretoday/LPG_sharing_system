import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/trust/ProtectedRoute';
import { TrustRouteBar } from '@/components/trust/TrustRouteBar';
import { trustApi, type IdReviewQueueItem } from '@/lib/trustApi';

function IdReviewQueueContent() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [queue, setQueue] = useState<IdReviewQueueItem[]>([]);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await trustApi.listIdReviewQueue();
      setQueue(res.queue);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load queue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const review = async (userId: string, decision: 'approved' | 'rejected') => {
    try {
      await trustApi.idReview({ userId, decision });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to submit decision');
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <TrustRouteBar />
        <header className="flex items-center justify-between gap-3">
          <h1 className="text-3xl font-black tracking-tight">ID Review Queue</h1>
          <button onClick={load} className="rounded-xl bg-white text-black px-4 py-2 text-sm font-bold">Refresh</button>
        </header>

        {loading && <p className="text-neutral-300">Loading queue...</p>}
        {error && <p className="text-red-400 text-sm">{error}</p>}

        {!loading && queue.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-neutral-300">No pending ID reviews.</div>
        ) : null}

        <div className="space-y-3">
          {queue.map((item) => (
            <div key={item.user.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <p className="text-lg font-bold">{item.user.name}</p>
                  <p className="text-xs text-neutral-400">{item.user.email} • {item.user.role}</p>
                  <p className="text-xs text-neutral-500 mt-1">Trust: {item.trustScore}</p>
                </div>
                <span className="rounded-full border border-amber-300/40 bg-amber-400/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-200">
                  {item.verification.idStatus || 'pending'}
                </span>
              </div>

              <div className="mt-3 text-sm text-neutral-300">
                <p>ID URL: {item.verification.idDocUrl || 'n/a'}</p>
                <p>Address: {item.verification.addressText || 'n/a'}</p>
                <p>PIN: {item.verification.pinCode || 'n/a'}</p>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => review(item.user.id, 'approved')}
                  className="rounded-lg bg-emerald-500 px-3 py-2 text-xs font-bold text-black"
                >
                  Approve
                </button>
                <button
                  onClick={() => review(item.user.id, 'rejected')}
                  className="rounded-lg bg-red-500 px-3 py-2 text-xs font-bold text-white"
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

export default function IdReviewQueue() {
  return (
    <ProtectedRoute requiredRole="admin">
      <IdReviewQueueContent />
    </ProtectedRoute>
  );
}
