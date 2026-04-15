import { FadeIn } from '../components/FadeIn';
import { Link } from 'react-router-dom';

export default function AdminPanel() {
  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Admin Center</h1>
          <Link to="/auth">
            <button className="text-sm text-gray-400 hover:text-white transition-colors">Log Out</button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <FadeIn delayMs={100} durationMs={800}>
            <div className="liquid-glass border border-white/10 p-6 rounded-xl">
              <div className="text-gray-400 text-sm mb-2">Active Emergencies</div>
              <div className="text-4xl text-red-500 mb-2">3</div>
              <div className="text-xs text-red-500/70">Requires immediate dispatch</div>
            </div>
          </FadeIn>
          
          <FadeIn delayMs={200} durationMs={800}>
            <div className="liquid-glass border border-white/10 p-6 rounded-xl">
              <div className="text-gray-400 text-sm mb-2">Mechanics Online</div>
              <div className="text-4xl text-white mb-2">12</div>
              <div className="text-xs text-gray-500">Across 4 zones</div>
            </div>
          </FadeIn>

          <FadeIn delayMs={300} durationMs={800}>
            <div className="liquid-glass border border-white/10 p-6 rounded-xl">
              <div className="text-gray-400 text-sm mb-2">Safely Resolved</div>
              <div className="text-4xl text-white mb-2">1,248</div>
              <div className="text-xs text-gray-500">This month</div>
            </div>
          </FadeIn>
        </div>

        <FadeIn delayMs={400} durationMs={800}>
          <div className="liquid-glass border border-white/10 p-6 rounded-xl">
            <h2 className="text-lg font-medium mb-6">Recent Alerts</h2>
            <div className="divide-y divide-white/5">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="py-4 flex justify-between items-center">
                  <div>
                    <div className="text-red-400 font-medium mb-1">High Severity Leak Reported</div>
                    <div className="text-xs text-gray-500">Location: Mumbai Central • 2 mins ago</div>
                  </div>
                  <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors">
                    Assign Mechanic
                  </button>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
