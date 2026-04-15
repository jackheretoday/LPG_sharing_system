import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function OTPVerify() {
  const navigate = useNavigate();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/onboarding/setup');
  };

  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface font-body selection:bg-primary selection:text-on-primary flex flex-col relative overflow-hidden">
      {/* Background Aesthetic Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-surface-bright/10 rounded-full blur-[150px]"></div>
      </div>

      {/* Top Navigation Bar */}
      <nav className="bg-neutral-950/70 backdrop-blur-xl text-neutral-50 font-headline tracking-tight text-sm font-semibold fixed top-0 w-full z-50 border-b border-neutral-50/10 shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex justify-between items-center px-6 h-16">
        <div className="text-xl font-bold tracking-tighter text-neutral-50">Lumina Noir</div>
        <div className="flex items-center gap-4">
          <button className="hover:bg-neutral-800/50 rounded-lg transition-all p-2 active:scale-95 duration-200">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="h-8 w-8 rounded-full bg-surface-container-high overflow-hidden">
            <img alt="User avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3h39SxW_EWMfVH894FuhSTqTlhkxaTUypRhXIchwCHciuxiMQQIgR62Sh2dnrgiCfjdizhX2HpulQLGeycixJPCcRmLa5aH-MN0CujQPm8MKgiu5wIlPHVqclpI-FKbwIim4-PiPFFCzvA61xRXO4tQCkeieu2y4v9HfEuW5YxLvDL_vb34k3Pbo8qvj-lM5yTXYsyMkG38iiQS9XDw67kVY9pPc0QGlYmat3C_g28KI5H-Pvx1qdphyKW1vFPXK0uB4bscii2Q" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center pt-16 px-4 relative z-10">
        <div className="w-full max-w-lg">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="liquid-glass rounded-xl p-8 md:p-12 shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-outline-variant/10"
          >
            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-container-high mb-6">
                <span className="material-symbols-outlined text-primary text-3xl">shield_person</span>
              </div>
              <h1 className="font-headline text-3xl font-extrabold tracking-tighter text-on-surface mb-3">Verification Required</h1>
              <p className="text-on-surface-variant font-body text-sm max-w-xs mx-auto leading-relaxed">
                We've sent a 6-digit code to your registered device. Enter it below to secure your session.
              </p>
            </div>

            {/* OTP Form */}
            <form onSubmit={handleVerify} className="space-y-10">
              <div className="flex justify-between gap-2 md:gap-4">
                {[4, 8, '', '', '', ''].map((val, idx) => (
                  <input 
                    key={idx}
                    className="w-12 h-16 md:w-16 md:h-20 text-center text-2xl font-bold bg-surface-container-low border-0 rounded-md text-on-surface focus:bg-surface-container-high transition-all outline-none" 
                    maxLength={1} 
                    type="text" 
                    defaultValue={val}
                    placeholder={val === '' ? '·' : ''}
                  />
                ))}
              </div>

              <div className="space-y-4">
                <button 
                  className="w-full h-14 bg-gradient-to-br from-primary to-secondary-fixed-dim text-on-primary font-headline font-bold rounded-md hover:opacity-90 active:scale-[0.98] transition-all shadow-lg" 
                  type="submit"
                >
                  Verify Identity
                </button>
                <div className="flex flex-col items-center gap-2">
                  <p className="text-on-surface-variant text-xs font-medium">Didn't receive a code?</p>
                  <button className="text-primary text-sm font-semibold hover:underline decoration-primary/30 underline-offset-4 transition-all" type="button">
                    Resend OTP
                  </button>
                </div>
              </div>
            </form>

            {/* Footer Metadata */}
            <div className="mt-12 pt-8 border-t border-outline-variant/5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                <span className="material-symbols-outlined text-xs">lock</span>
                End-to-End Encrypted
              </div>
              <div className="text-[10px] text-on-surface-variant font-medium">
                Expires in <span className="text-primary">04:59</span>
              </div>
            </div>
          </motion.div>

          {/* Trust Badges */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="bg-surface-container-low/40 p-4 rounded-lg flex items-center gap-3 border border-white/5">
              <span className="material-symbols-outlined text-on-surface-variant">verified_user</span>
              <div>
                <div className="text-xs font-bold text-on-surface">Verified Provider</div>
                <div className="text-[10px] text-on-surface-variant">Lumina Utility Network</div>
              </div>
            </div>
            <div className="bg-surface-container-low/40 p-4 rounded-lg flex items-center gap-3 border border-white/5">
              <span className="material-symbols-outlined text-on-surface-variant">travel_explore</span>
              <div>
                <div className="text-xs font-bold text-on-surface">Global Trust</div>
                <div className="text-[10px] text-on-surface-variant">ISO 27001 Certified</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
    </div>
  );
}
