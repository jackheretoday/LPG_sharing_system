import { useState } from 'react';
import { MapView } from '@/components/MapView';
import { CylinderCard } from '@/components/CylinderCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, ArrowLeft, LayoutGrid, Map as MapIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockMarkers } from '@/lib/mockData';
import { motion } from 'framer-motion';

export default function FindCylinder() {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const navigate = useNavigate();

  // Filter only cylinder markers
  const cylinderMarkers = mockMarkers.filter(m => m.type === 'cylinder');

  return (
    <div className="h-screen w-full bg-black text-white flex flex-col font-sans overflow-hidden">
      {/* Search Bar Header */}
      <div className="p-4 md:p-6 border-b border-white/10 liquid-glass flex items-center justify-between gap-4 z-10">
        <div className="flex items-center gap-4 flex-1">
          <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input 
              placeholder="Search by area or agency..." 
              className="pl-10 h-10 bg-white/5 border-white/10 rounded-xl focus:border-white/30"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-white/5 p-1 rounded-xl border border-white/10 flex">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`rounded-lg h-8 px-3 gap-2 text-xs ${viewMode === 'list' ? 'bg-white text-black hover:bg-white' : 'text-gray-400'}`}
              onClick={() => setViewMode('list')}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> List
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`rounded-lg h-8 px-3 gap-2 text-xs ${viewMode === 'map' ? 'bg-white text-black hover:bg-white' : 'text-gray-400'}`}
              onClick={() => setViewMode('map')}
            >
              <MapIcon className="w-3.5 h-3.5" /> Map
            </Button>
          </div>
          <Button variant="outline" size="icon" className="h-10 w-10 border-white/10 rounded-xl">
            <Filter className="w-4 h-4 text-gray-400" />
          </Button>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden">
        {/* VIEW: MAP */}
        <div className={`absolute inset-0 transition-opacity duration-500 ${viewMode === 'map' ? 'opacity-100 z-0' : 'opacity-0 -z-10 pointer-events-none'}`}>
          <MapView mode="discovery" />
        </div>

        {/* VIEW: LIST (Glass Overlay) */}
        <div className={`absolute inset-0 z-10 overflow-hidden bg-black/40 backdrop-blur-sm transition-transform duration-500 ${viewMode === 'list' ? 'translate-y-0' : 'translate-y-full'}`}>
           <div className="h-full overflow-y-auto p-6 md:p-10 max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {cylinderMarkers.map((c, i) => (
                   <motion.div 
                    key={c.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                   >
                     <CylinderCard 
                      ownerName={c.ownerName || 'Unknown'} 
                      distance={c.distance || 'Unknown'} 
                      availability={c.availability || 'Out of stock'} 
                     />
                   </motion.div>
                 ))}
              </div>
              
              {cylinderMarkers.length === 0 && (
                <div className="h-64 flex flex-col items-center justify-center text-center opacity-40">
                  <Search className="w-12 h-12 mb-4" />
                  <p>No cylinders found in your immediate area.</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
