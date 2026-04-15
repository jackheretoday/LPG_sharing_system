import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <div className="w-full relative z-10 px-6 md:px-12 lg:px-16 pt-6">
      <div className="liquid-glass rounded-xl px-4 py-2 flex items-center justify-between">
        
        {/* Left: Logo */}
        <div className="text-2xl font-semibold tracking-tight text-white">
          VEX
        </div>

        {/* Center: Links (md+ only) */}
        <div className="hidden md:flex items-center gap-8 text-sm">
          <a href="#" className="text-white hover:text-gray-300 transition-colors">Emergency</a>
          <a href="#" className="text-white hover:text-gray-300 transition-colors">Tracking</a>
          <a href="#" className="text-white hover:text-gray-300 transition-colors">Mechanics</a>
          <a href="#" className="text-white hover:text-gray-300 transition-colors">Support</a>
        </div>

        {/* Right: Button */}
        <div>
          <Link to="/auth">
            <button className="bg-white text-black px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
              Login
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
