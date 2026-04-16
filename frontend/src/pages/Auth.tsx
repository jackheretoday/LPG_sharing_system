import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authApi } from '@/lib/authApi';
import { setPendingAuth } from '@/lib/authSession';
import { setStoredUser, setToken } from '@/lib/trustAuth';

const roleOptions = [
  { value: 'user', label: 'User', description: 'General access and participation' },
  { value: 'consumer', label: 'Consumer', description: 'Find cylinders and request help' },
  { value: 'provider', label: 'Provider', description: 'Offer delivery and support' },
  { value: 'admin', label: 'Admin', description: 'Manage disputes and moderation' },
] as const;

type Mode = 'login' | 'signup';

export default function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('login');
  const [role, setRole] = useState<(typeof roleOptions)[number]['value']>('consumer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    setStatus('');

    try {
      const response =
        mode === 'signup'
          ? await authApi.signup({ name, email, password, role })
          : await authApi.login({ email, password });

      if (mode === 'signup' || response.verificationRequired) {
        setPendingAuth({
          email,
          purpose: 'signup',
          role: response.user.role,
          name: response.user.name,
        });

        setStatus(response.message || 'Verification code sent to your email.');
        navigate('/auth/otp-verify');
      } else {
        setToken(response.token || '');
        setStoredUser(response.user);
        navigate(response.nextRoute || '/consumer');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to authenticate');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 font-body selection:bg-white selection:text-black overflow-hidden relative">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-2xl relative z-10"
      >
        <div className="hub-glass glass-edge rounded-3xl p-8 md:p-10 border border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.6)] text-white">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-[42%] space-y-6">
              <div>
                <img src="/Gasसहायक-2.png" alt="GasSahayak Logo" className="w-12 h-12 mb-4 object-contain" />
                <p className="text-[10px] uppercase tracking-[0.35em] text-white/40 font-black">LPG Emergency Gateway</p>
                <h1 className="text-4xl font-headline font-black tracking-tighter mt-3">Secure Access</h1>
                <p className="text-white/60 mt-3 text-sm leading-6">
                  Create a verified account with email OTP, then login directly using your credentials.
                </p>
              </div>

              <div className="space-y-3">
                {roleOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setRole(option.value)}
                    className={`w-full text-left rounded-2xl border px-4 py-3 transition-all ${
                      role === option.value
                        ? 'border-white bg-white text-black'
                        : 'border-white/10 bg-white/5 text-white hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="font-black tracking-tight">{option.label}</div>
                        <div className={`text-xs mt-1 ${role === option.value ? 'text-black/70' : 'text-white/55'}`}>
                          {option.description}
                        </div>
                      </div>
                      <span className={`material-symbols-outlined ${role === option.value ? 'text-black' : 'text-white/50'}`}>
                        verified_user
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:flex-1">
              <div className="flex items-center gap-2 bg-white/5 rounded-2xl p-1 mb-6 border border-white/10">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className={`flex-1 rounded-xl px-4 py-3 text-sm font-black tracking-wide transition-all ${
                    mode === 'login' ? 'bg-white text-black' : 'text-white/60 hover:text-white'
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className={`flex-1 rounded-xl px-4 py-3 text-sm font-black tracking-wide transition-all ${
                    mode === 'signup' ? 'bg-white text-black' : 'text-white/60 hover:text-white'
                  }`}
                >
                  Signup
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <input
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none"
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                )}

                <input
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none"
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <input
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none"
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />

                {mode === 'signup' && (
                  <div className="rounded-xl bg-black/30 border border-white/10 px-4 py-3 text-xs text-white/60">
                    A verification code will be emailed before the account is activated.
                  </div>
                )}

                {error && <p className="text-red-400 text-sm">{error}</p>}
                {status && <p className="text-emerald-400 text-sm">{status}</p>}

                <button
                  className="w-full bg-white text-black rounded-xl py-3 font-black tracking-wide disabled:opacity-50"
                  type="submit"
                  disabled={busy}
                >
                  {busy ? 'Please wait...' : mode === 'signup' ? 'Create account and send OTP' : 'Login'}
                </button>
              </form>

              <div className="mt-6 flex flex-wrap gap-3 text-xs text-white/50">
                <span className="px-3 py-1 rounded-full border border-white/10">Email verification</span>
                <span className="px-3 py-1 rounded-full border border-white/10">Password login</span>
                <span className="px-3 py-1 rounded-full border border-white/10">Role aware access</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
