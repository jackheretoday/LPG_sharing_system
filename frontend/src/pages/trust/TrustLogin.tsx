import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function TrustLogin() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/auth/otp-verify');
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col obsidian-void overflow-hidden relative font-body selection:bg-primary selection:text-on-primary">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-neutral-950/70 backdrop-blur-xl text-neutral-50 font-headline tracking-tight text-sm font-semibold border-b border-neutral-50/10 shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex justify-between items-center px-6 h-16">
        <div className="text-xl font-bold tracking-tighter text-neutral-50">
          Lumina Noir
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-6 items-center">
            <a className="text-neutral-400 hover:text-neutral-200 transition-colors" href="#">Directory</a>
            <a className="text-neutral-400 hover:text-neutral-200 transition-colors" href="#">Community</a>
            <a className="text-neutral-400 hover:text-neutral-200 transition-colors" href="#">Trust</a>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-neutral-800/50 rounded-lg transition-all active:scale-95 duration-200 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">dark_mode</span>
            </button>
            <div className="h-8 w-8 rounded-full bg-surface-container-highest flex items-center justify-center overflow-hidden border border-outline-variant/20">
              <img alt="User avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMU29HKk8PMc2Kd8E-5IquSjQqxiHzMyY-s1e38xYSlW7zIPeQm7Q-oq2Y5HbDN3aDvS345TtEtCTxswFZz60jNA-lB79nPI9LyyKFni54rzfVeAzCWMkviJgCtA4Q5gp5o8JFmJL5Lt2uqYeuMZo6Wb5f15ai7qQJT9bPe7q4uCVHUgMsPdMJ6Qck7izM68gOzDFniK9xo2sXz9CMcLsTXETviT_v_j8B06lDIVePK6uEFiSLMCpWKPy0gL9wS0IXhQq8ZMZigA" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4 relative pt-16">
        {/* Background Decorative Element */}
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-secondary-container/10 rounded-full blur-[100px]"></div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md liquid-glass p-8 md:p-12 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-outline-variant/10 relative z-10"
        >
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-lg">
                <span className="material-symbols-outlined text-on-primary">emergency_heat</span>
              </div>
              <h2 className="font-headline text-2xl font-extrabold tracking-tighter text-on-surface">Lumina Utility</h2>
            </div>
            <h1 className="font-headline text-3xl font-bold tracking-tight text-on-surface mb-2">Welcome Back</h1>
            <p className="text-on-surface-variant font-body text-sm leading-relaxed">Enter your registered phone number to receive a secure access code for emergency services.</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="font-label text-xs font-semibold uppercase tracking-widest text-on-surface-variant" htmlFor="phone">Phone Number</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant">
                  <span className="text-sm font-medium">+91</span>
                </div>
                <input 
                  className="w-full bg-surface-container-low border-none rounded-lg py-4 pl-12 pr-4 text-on-surface placeholder:text-neutral-600 focus:ring-0 focus:bg-surface-container-high transition-all duration-300 outline-none" 
                  id="phone" 
                  name="phone" 
                  placeholder="00000 00000" 
                  type="tel"
                />
                <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-primary group-focus-within:w-full transition-all duration-500"></div>
              </div>
            </div>

            <div className="pt-4">
              <button 
                className="w-full brushed-metal py-4 rounded-lg font-headline font-extrabold text-on-primary tracking-wide shadow-xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2" 
                type="submit"
              >
                Send OTP
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </form>

          <footer className="mt-12 pt-8 border-t border-outline-variant/10">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-xs text-on-surface-variant font-label">
                <span className="material-symbols-outlined text-[14px]">verified_user</span>
                <span>Secure Verification Service</span>
              </div>
              <p className="text-xs text-neutral-500 font-body leading-relaxed">
                By continuing, you agree to Lumina Noir's <a className="text-secondary hover:text-primary transition-colors underline decoration-secondary/30" href="#">Terms of Trust</a> and <a className="text-secondary hover:text-primary transition-colors underline decoration-secondary/30" href="#">Privacy Protocol</a>.
              </p>
            </div>
          </footer>
        </motion.div>

        {/* Utility Decorative Text */}
        <div className="hidden lg:block absolute left-12 bottom-12 opacity-20 pointer-events-none">
          <h3 className="font-headline text-6xl font-black tracking-tighter text-on-surface leading-none">NOIR<br/>SYSTEM</h3>
        </div>
      </main>
    </div>
  );
}
