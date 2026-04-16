import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MapView } from '../components/MapView';
import { emergencyApi } from '@/lib/emergencyApi';
import { resourceApi } from '@/lib/resourceApi';
import { getToken } from '@/lib/trustAuth';

const EARTH_RADIUS_KM = 6371;
const RANGE_KM = 10;

const parseLatLng = (value: string | null | undefined) => {
  if (!value) return null;
  const match = String(value).match(/(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/);
  if (!match) return null;

  const lat = Number(match[1]);
  const lng = Number(match[2]);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng };
};

const distanceKm = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);

  return 2 * EARTH_RADIUS_KM * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
};

export default function Tracking() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [request, setRequest] = useState<any>(null);
  const [provider, setProvider] = useState<any>(null);
  const [allRequests, setAllRequests] = useState<any[]>([]);
  const [myLpgRequests, setMyLpgRequests] = useState<any[]>([]);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const requestId = searchParams.get('requestId');

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setUserCoords({ lat: coords.latitude, lng: coords.longitude });
      },
      () => {
        setUserCoords(null);
      },
      { enableHighAccuracy: true, timeout: 7000 }
    );
  }, []);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate('/auth/login', { replace: true });
      return;
    }

    const run = async () => {
      try {
        setLoading(true);
        const requestsPromise = emergencyApi.listRequests();
        const myRequestsPromise = resourceApi.myRequests(token);
        const currentPromise = requestId ? emergencyApi.getRequest(requestId) : Promise.resolve(null);

        const [requestsRes, myRequestsRes, currentRes] = await Promise.all([requestsPromise, myRequestsPromise, currentPromise]);

        setAllRequests(requestsRes.requests || []);
        setMyLpgRequests(myRequestsRes.requests || []);

        if (currentRes) {
          setRequest(currentRes.request);
          setProvider(currentRes.provider);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tracking');
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [navigate, requestId]);

  const summary = useMemo(() => {
    const hasGeo = Boolean(userCoords);

    if (!hasGeo) {
      return {
        lpgRequestsInRange: myLpgRequests.length,
        mechanicRequestsInRange: allRequests.filter((item) => item.assigned_provider_id).length,
        rangeLabel: '10km fallback (location unavailable)',
      };
    }

    const lpgRequestsInRange = myLpgRequests.filter((item) => {
      const lat = Number(item?.resource?.latitude);
      const lng = Number(item?.resource?.longitude);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return false;
      return distanceKm(userCoords!, { lat, lng }) <= RANGE_KM;
    }).length;

    const mechanicRequestsInRange = allRequests.filter((item) => {
      if (!item.assigned_provider_id) return false;
      const point = parseLatLng(item.location);
      if (!point) return false;
      return distanceKm(userCoords!, point) <= RANGE_KM;
    }).length;

    return {
      lpgRequestsInRange,
      mechanicRequestsInRange,
      rangeLabel: `${RANGE_KM}km range`,
    };
  }, [allRequests, myLpgRequests, userCoords]);

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body flex flex-col">
      <nav className="fixed top-0 w-full z-50 bg-[#131313]/80 backdrop-blur-xl border-b border-white/5 flex justify-between items-center px-8 h-16">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-white/10 rounded-md">
            <span className="material-symbols-outlined !text-xl">arrow_back</span>
          </button>
          <div className="text-xl font-bold text-white">Live Response Tracking</div>
        </div>
      </nav>

      <div className="flex-1 pt-16 grid md:grid-cols-4 lg:grid-cols-5 h-[calc(100vh-4rem)]">
        <div className="md:col-span-3 lg:col-span-3 relative bg-[#0e0e0e] border-r border-white/5">
          <div className="w-full h-full">
            <MapView mode="emergency" />
          </div>
        </div>

        <div className="md:col-span-1 lg:col-span-2 overflow-y-auto bg-surface-container-lowest p-8 space-y-8">
          {loading ? <div className="text-neutral-300">Loading tracking data...</div> : null}
          {error ? <div className="text-red-400">{error}</div> : null}

          <div className="hub-glass glass-edge p-8 rounded-3xl border border-white/5 shadow-2xl">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-on-surface-variant/40 mb-6">10km Summary</h2>
            <div className="space-y-3 text-sm">
              <div>
                LPG Requests: <span className="font-bold text-white">{summary.lpgRequestsInRange}</span>
              </div>
              <div>
                Mechanic Requests: <span className="font-bold text-white">{summary.mechanicRequestsInRange}</span>
              </div>
              <div className="text-xs text-white/60">{summary.rangeLabel}</div>
            </div>
          </div>

          <div className="hub-glass glass-edge p-8 rounded-3xl border border-white/5 shadow-2xl">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-on-surface-variant/40 mb-6">Emergency Request</h2>
            <div className="space-y-3 text-sm">
              <div>Status: <span className="font-bold text-white">{request?.status || 'Pending'}</span></div>
              <div>Intensity: <span className="font-bold text-white">{request?.intensity || '-'}</span></div>
              <div>Leakage Sound: <span className="font-bold text-white">{request?.leakage_sound || '-'}</span></div>
              <div>Duration: <span className="font-bold text-white">{request?.duration || '-'}</span></div>
              <div>Location: <span className="font-bold text-white">{request?.location || '-'}</span></div>
            </div>
          </div>

          <div className="hub-glass glass-edge p-8 rounded-3xl border border-white/5 shadow-2xl">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-on-surface-variant/40 mb-6">Assigned Provider</h2>
            <div className="space-y-3 text-sm">
              <div>Name: <span className="font-bold text-white">{provider?.name || 'Awaiting assignment'}</span></div>
              <div>Role: <span className="font-bold text-white">{provider?.role || '-'}</span></div>
              <div>Verified: <span className="font-bold text-white">{provider?.is_verified ? 'Yes' : 'No'}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
