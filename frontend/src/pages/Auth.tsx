import { Link } from 'react-router-dom';
import { FadeIn } from '../components/FadeIn';

export default function Auth() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 text-white font-sans">
      <FadeIn delayMs={200} durationMs={800} className="w-full max-w-sm">
        <div className="liquid-glass rounded-2xl p-8 border border-white/10 text-center">
          
          <div className="text-3xl font-semibold tracking-tight mb-2">VEX</div>
          <p className="text-gray-400 text-sm mb-8">Access the priority emergency system.</p>

          <div className="flex flex-col gap-4">
            <Link to="/dashboard">
              <button className="w-full bg-white text-black py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                Demo Customer
              </button>
            </Link>

            <Link to="/mechanic">
              <button className="w-full liquid-glass border border-white/20 py-3 rounded-lg font-medium text-white hover:bg-white hover:text-black transition-colors">
                Demo Mechanic
              </button>
            </Link>

            <Link to="/admin">
              <button className="w-full bg-gray-900 border border-gray-700 py-3 rounded-lg font-medium text-gray-300 hover:text-white transition-colors">
                Demo Admin
              </button>
            </Link>
          </div>

          <div className="mt-8 text-xs text-gray-500">
            For demonstration purposes only.
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
