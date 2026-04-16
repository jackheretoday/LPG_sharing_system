import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { emergencyApi } from '@/lib/emergencyApi';
import { getToken } from '@/lib/trustAuth';

type EmergencyRequest = {
  id: string;
  status: string;
  intensity?: string;
  leakage_sound?: string;
  duration?: string;
  location?: string;
  created_at: string;
  assigned_provider?: {
    name?: string;
    role?: string;
  } | null;
};

export default function Emergency() {
  const [requests, setRequests] = useState<EmergencyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isLoggedIn = Boolean(getToken());

  useEffect(() => {
    const load = async () => {
      if (!isLoggedIn) {
        setLoading(false);
        return;
      }

      try {
        const res = await emergencyApi.listRequests();
        setRequests(res.requests || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load emergency feed');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white">
      <Navbar />
      <main className="px-4 md:px-10 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-black tracking-tight">Emergency Feed</h1>
              <p className="text-white/65 mt-2">Live emergency request stream and responder assignments.</p>
            </div>
            <Link to="/emergency/assessment" className="bg-white text-black px-4 py-3 rounded-xl text-sm font-black">
              Raise Emergency
            </Link>
          </div>

          {!isLoggedIn ? (
            <div className="rounded-2xl border border-amber-300/30 bg-amber-200/10 p-6">
              <p className="text-amber-100 mb-4">Login required to view emergency feed data.</p>
              <Link to="/auth" className="inline-block bg-white text-black px-4 py-2 rounded-lg text-sm font-semibold">
                Login / Signup
              </Link>
            </div>
          ) : null}

          {loading && isLoggedIn ? <p className="text-white/70">Loading emergency feed...</p> : null}
          {error ? <p className="text-red-300 mb-4">{error}</p> : null}

          <div className="grid md:grid-cols-2 gap-4">
            {requests.map((request) => (
              <article key={request.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between gap-4 mb-3">
                  <h2 className="text-lg font-bold">Request #{request.id.slice(0, 8)}</h2>
                  <span className="text-xs uppercase tracking-widest text-red-300">{request.status}</span>
                </div>
                <p className="text-sm text-white/75 mb-2">Intensity: {request.intensity || '-'}</p>
                <p className="text-sm text-white/75 mb-2">Leakage Sound: {request.leakage_sound || '-'}</p>
                <p className="text-sm text-white/75 mb-2">Duration: {request.duration || '-'}</p>
                <p className="text-sm text-white/75 mb-2">Location: {request.location || '-'}</p>
                <p className="text-sm text-white/75 mb-2">
                  Assigned: {request.assigned_provider?.name || 'Awaiting assignment'}
                </p>
                <p className="text-xs text-white/50 mt-3">{new Date(request.created_at).toLocaleString()}</p>
              </article>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
