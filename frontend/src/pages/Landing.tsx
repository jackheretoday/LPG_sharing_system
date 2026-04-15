import { Navbar } from '../components/Navbar';
import { AnimatedHeading } from '../components/AnimatedHeading';
import { FadeIn } from '../components/FadeIn';
import { Siren } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col font-sans">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4" type="video/mp4" />
      </video>

      {/* Content Overlay */}
      <Navbar />

      {/* Hero Section */}
      <div className="relative z-10 px-6 md:px-12 lg:px-16 flex-1 flex flex-col justify-end pb-12 lg:pb-16 lg:grid lg:grid-cols-2 lg:items-end">
        
        {/* Left Content */}
        <div>
          <AnimatedHeading 
            text={"Responding instantly\nwhen safety matters most."} 
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal mb-4"
          />

          <FadeIn delayMs={800} durationMs={1000} className="mb-5 text-base md:text-lg text-gray-300">
            Real-time LPG emergency assistance with verified mechanics, live tracking, and secure response systems.
          </FadeIn>

          <FadeIn delayMs={1200} durationMs={1000} className="flex flex-wrap gap-4 items-center">
            <Link to="/emergency">
              <button className="bg-white text-black px-8 py-3 rounded-lg font-medium animate-pulse-red relative z-10 transition-transform active:scale-95 flex items-center gap-2">
                <Siren className="w-5 h-5 text-black" />
                Raise Emergency
              </button>
            </Link>
            <button className="liquid-glass border border-white/20 text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-black transition-all">
              Explore Platform
            </button>
          </FadeIn>
        </div>

        {/* Right Content (Tag) */}
        <div className="mt-8 lg:mt-0 flex lg:justify-end">
          <FadeIn delayMs={1400} durationMs={1000}>
            <div className="liquid-glass border border-white/20 px-6 py-3 rounded-xl inline-block">
              <span className="text-lg md:text-xl lg:text-2xl font-light">
                Emergency. Safety. Response.
              </span>
            </div>
          </FadeIn>
        </div>

      </div>

    </div>
  );
}
