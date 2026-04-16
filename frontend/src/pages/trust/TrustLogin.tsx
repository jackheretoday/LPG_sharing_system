import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authApi } from "@/lib/authApi";
import { setPendingAuth } from "@/lib/authSession";
import { setStoredUser, setToken } from "@/lib/trustAuth";
import { ShieldCheck, Fingerprint, Mail, Lock, User, UserPlus, ArrowRight, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { signupSchema, loginSchema } from "@/lib/validators";

type Mode = "login" | "signup";

const roleOptions = [
  { value: "consumer", label: "Consumer", desc: "For households & immediate help" },
  { value: "provider", label: "Provider", desc: "For verified mechanics & agents" },
  { value: "user", label: "General User", desc: "Community member" },
] as const;

export default function TrustLogin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryMode = searchParams.get("mode") as Mode || "login";
  const queryRole = searchParams.get("role") as (typeof roleOptions)[number]["value"];

  const [mode, setMode] = useState<Mode>(queryMode);
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<(typeof roleOptions)[number]["value"]>(
    roleOptions.some(opt => opt.value === queryRole) ? queryRole : "consumer"
  );
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Synchronize mode if it changes in URL (optional but good for UX)
  useEffect(() => {
    if (queryMode && (queryMode === "login" || queryMode === "signup")) {
      setMode(queryMode);
    }
    if (queryRole && roleOptions.some(opt => opt.value === queryRole)) {
      setRole(queryRole);
    }
  }, [queryMode, queryRole]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    // Local Validation
    if (mode === 'signup') {
        const validated = signupSchema.safeParse({ name, email, password, role });
        if (!validated.success) {
            setError(validated.error.errors[0].message);
            return;
        }
        
        if (step === 1) {
            setStep(2);
            return;
        }
    } else {
        const validated = loginSchema.safeParse({ email, password });
        if (!validated.success) {
            setError(validated.error.errors[0].message);
            return;
        }
    }

    setBusy(true);

    try {
      const response =
        mode === "signup"
          ? await authApi.signup({ name, email, password, role })
          : await authApi.login({ email, password });

      if (mode === "signup" || response.verificationRequired) {
        setPendingAuth({
          email,
          purpose: "signup",
          role: response.user.role,
          name: response.user.name,
        });

        navigate("/auth/otp-verify");
      } else {
        setToken(response.token || "");
        setStoredUser(response.user);
        navigate(response.nextRoute || "/consumer/home");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Security verification failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-4 font-sans selection:bg-white selection:text-black overflow-hidden relative">
      {/* Cinematic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,20,20,1)_0%,rgba(0,0,0,1)_100%)]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl relative z-10"
      >
        <div className="hub-glass glass-edge border border-white/5 rounded-[2.5rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)]">
          
          <div className="flex">
            {/* Sidebar Branding */}
            <div className="hidden md:flex w-40 bg-white/5 border-r border-white/5 flex-col items-center justify-center p-8 text-center space-y-6">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <ShieldCheck className="w-8 h-8 text-white" />
                </div>
                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Protocol</p>
                    <p className="text-xs font-bold text-white/60">GASS_SAH_88</p>
                </div>
            </div>

            <div className="flex-1 p-8 md:p-12">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500/80">Secure Connection Established</p>
                </div>
                <h1 className="text-3xl font-black tracking-tighter mb-2">
                    {mode === 'login' ? 'Welcome Back' : 'Secure Onboarding'}
                </h1>
                <p className="text-neutral-500 text-sm italic font-medium">
                    {mode === 'login' 
                        ? 'Authorization required to access the safety protocols.' 
                        : 'Begin the government-grade verification sequence.'}
                </p>
              </div>

              {/* Mode Toggle */}
              <div className="flex p-1 bg-white/5 rounded-2xl mb-8 border border-white/5">
                <button 
                    onClick={() => {setMode('login'); setStep(1)}}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${mode === 'login' ? 'bg-white text-black' : 'text-neutral-500 hover:text-white'}`}
                >
                    <Fingerprint className="w-4 h-4" /> Entry
                </button>
                <button 
                    onClick={() => {setMode('signup'); setStep(1)}}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${mode === 'signup' ? 'bg-white text-black' : 'text-neutral-500 hover:text-white'}`}
                >
                    <UserPlus className="w-4 h-4" /> Setup
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <AnimatePresence mode="wait">
                    {mode === 'login' ? (
                        <motion.div 
                            key="login"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1">Identity</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                                    <input
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm outline-none focus:ring-1 focus:ring-white transition-all placeholder:text-neutral-700"
                                        placeholder="user@gassahayak.com"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1">Secret Key</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                                    <input
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm outline-none focus:ring-1 focus:ring-white transition-all placeholder:text-neutral-700"
                                        placeholder="••••••••"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            {step === 1 ? (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1">Official Name</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                                            <input
                                                required
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm outline-none focus:ring-1 focus:ring-white transition-all"
                                                placeholder="Suresh Kumar"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1">Secure Email</label>
                                        <input
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none"
                                            placeholder="suresh@gmail.com"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1">Password</label>
                                        <input
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none"
                                            placeholder="••••••••"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5 mb-6">
                                        <ShieldAlert className="w-5 h-5 text-emerald-500" />
                                        <p className="text-[10px] font-bold uppercase text-neutral-400 leading-relaxed">
                                            Gov verification follows signup. Choose your ecosystem role below.
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-1 gap-3">
                                        {roleOptions.map((opt) => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => setRole(opt.value)}
                                                className={`w-full text-left p-4 rounded-2xl border transition-all ${role === opt.value ? 'bg-white border-white' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className={`text-xs font-black uppercase tracking-widest ${role === opt.value ? 'text-black' : 'text-white'}`}>{opt.label}</p>
                                                        <p className={`text-[10px] font-medium ${role === opt.value ? 'text-black/60' : 'text-neutral-500'}`}>{opt.desc}</p>
                                                    </div>
                                                    {role === opt.value && <ShieldCheck className="w-5 h-5 text-black" />}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold uppercase tracking-tighter italic">
                        <ShieldAlert className="w-4 h-4" /> {error}
                    </motion.div>
                )}

                <button
                    className="w-full bg-white text-black rounded-2xl py-5 font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-2 hover:bg-emerald-400 hover:shadow-[0_0_30px_rgba(52,211,153,0.3)] transition-all disabled:opacity-50 group"
                    type="submit"
                    disabled={busy}
                >
                    {busy ? "Authorizing Path..." : mode === 'signup' && step === 1 ? (
                        <>Continue to Roles <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                    ) : (
                        mode === 'login' ? "Access Platform" : "Execute Signup"
                    )}
                </button>
              </form>

              {/* Footer */}
              <div className="mt-12 pt-8 border-t border-white/5 text-center">
                <p className="text-[10px] text-neutral-600 font-bold uppercase tracking-[0.3em]">
                    Encrypted Biometric Handshake v4.2
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
