import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useState, useEffect, useCallback } from 'react';
import { mockMarkers, MarkerData } from '../lib/mockData';
import { Button } from './ui/button';

// Helper to update map center dynamically
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

// Custom icons
const createIcon = (className: string) => new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  className: className,
});

const userIcon = createIcon('hue-rotate-180 grayscale contrast-150');
const cylinderIcon = createIcon('hue-rotate-[120deg] brightness-125'); // Greenish
const mechanicIcon = createIcon('hue-rotate-[240deg] brightness-125'); // Bluish
const emergencyIcon = createIcon('hue-rotate-0 brightness-150 contrast-200'); // Red

export function MapView({ mode = 'discovery' }: { mode?: 'discovery' | 'emergency' }) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [markers, setMarkers] = useState<MarkerData[]>(mockMarkers);

  // Simulation loop for movement
  useEffect(() => {
    const interval = setInterval(() => {
      setMarkers(current => current.map(m => ({
        ...m,
        position: {
          lat: m.position.lat + (Math.random() - 0.5) * 0.0001,
          lng: m.position.lng + (Math.random() - 0.5) * 0.0001,
        }
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        () => setUserLocation([19.107, 72.825])
      );
    } else {
      setUserLocation([19.107, 72.825]);
    }
  }, []);

  if (!userLocation) {
    return (
      <div className="h-full w-full rounded-2xl overflow-hidden border border-white/20 bg-black/50 flex items-center justify-center liquid-glass min-h-[400px]">
         <span className="text-gray-400 animate-pulse font-light text-lg">Calibrating sensors...</span>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative z-0 min-h-[400px]">
      <MapContainer center={userLocation} zoom={14} className="h-full w-full" zoomControl={false}>
        <ChangeView center={userLocation} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {/* User Marker */}
        <Marker position={userLocation} icon={userIcon}>
          <Popup>
            <div className="text-black font-medium">You are here</div>
          </Popup>
        </Marker>

        {/* Dynamic Markers */}
        {markers
          .filter(m => mode === 'emergency' ? (m.type === 'mechanic' || m.type === 'emergency') : m.type === 'cylinder')
          .map((m) => (
          <Marker 
            key={m.id} 
            position={[m.position.lat, m.position.lng]} 
            icon={m.type === 'cylinder' ? cylinderIcon : m.type === 'mechanic' ? mechanicIcon : emergencyIcon}
          >
            <Popup className="custom-popup">
              <div className="p-1 min-w-[150px]">
                <h3 className="font-bold text-black border-b border-gray-100 pb-1 mb-2">
                  {m.type === 'emergency' ? 'Emergency' : m.ownerName}
                </h3>
                <div className="space-y-1 mb-3">
                  <p className="text-[10px] text-gray-500 uppercase tracking-tighter">Status</p>
                  <p className="text-xs text-gray-700">{m.status || m.availability || 'Verified'}</p>
                </div>
                {m.type === 'cylinder' && (
                  <Button size="sm" className="w-full bg-black text-white hover:bg-gray-800 h-7 text-[10px]">
                    Request Cylinder
                  </Button>
                )}
                {m.type === 'mechanic' && (
                   <Button size="sm" className="w-full bg-blue-600 text-white hover:bg-blue-700 h-7 text-[10px]">
                    Call Dispatch
                 </Button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

