import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { trustApi } from "@/lib/trustApi";
import { getStoredUser, setStoredUser, type StoredUser } from "@/lib/trustAuth";
import { AuthenticatedRoute } from "@/components/trust/AuthenticatedRoute";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, MapPin, Fingerprint, Upload, Cpu, ArrowRight, ShieldAlert } from "lucide-react";

function ProfileSetupContent() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [addressText, setAddressText] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [docType, setDocType] = useState<"adhar" | "pan">("adhar");
  const [docNumber, setDocNumber] = useState("");
  const [busy, setBusy] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");

  const validateDocNumber = (type: string, value: string) => {
    if (type === "adhar") {
      return /^\d{12}$/.test(value);
    } else {
      return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value.toUpperCase());
    }
  };

  const handleComplete = async () => {
    setBusy(true);
    setError("");

    try {
      if (!pinCode.trim()) throw new Error("PIN code is required for residency verification.");
      
      if (!validateDocNumber(docType, docNumber.trim())) {
        throw new Error(`Invalid ${docType.toUpperCase()} number format.`);
      }

      // Initial validation
      await trustApi.pinVerify({
        pinCode: pinCode.trim(),
        addressText: addressText.trim(),
      });

      // Bio-scanning simulation
      setScanning(true);
      await new Promise(r => setTimeout(r, 2500));
      
      // Store document info
      await trustApi.idUpload({ idDocUrl: `${docType.toUpperCase()}: ${docNumber.trim()}` });

      setScanning(false);
      navigate("/trust/me");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Handshake failed.");
      setScanning(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-4 font-mono overflow-hidden relative selection:bg-emerald-500 selection:text-black">
      {/* Dynamic Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(18,18,18,0.5)_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl relative z-10"
      >
        <div className="hub-glass border border-white/10 rounded-sm p-8 md:p-12 shadow-[0_0_100px_rgba(0,0,0,1)] relative overflow-hidden">
          
          {/* Scanning Line Animation */}
          {scanning && (
            <motion.div 
              initial={{ top: '0%' }}
              animate={{ top: '100%' }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-[2px] bg-emerald-500 shadow-[0_0_15px_#10b981] z-20"
            />
          )}

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Cpu className="w-4 h-4 text-emerald-500 animate-spin-slow" />
                <span className="text-[10px] uppercase font-black tracking-[0.4em] text-emerald-500">Node_Verify_Active</span>
              </div>
              <h1 className="text-3xl font-black uppercase tracking-tighter italic">Gov Authentication</h1>
              <p className="text-neutral-500 text-[10px] uppercase tracking-widest mt-1">LPG Safety Ecosystem Protocol v8.1</p>
            </div>
            <div className="flex items-center gap-4">
                {[1,2,3].map(i => (
                    <div key={i} className={`w-2 h-2 rounded-full ${step >= i ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-white/10'}`} />
                ))}
            </div>
          </div>

          <div className="min-h-[300px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div 
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-neutral-600">
                                <span>Residency Coordinates</span>
                                <MapPin className="w-3 h-3" />
                            </div>
                            <textarea 
                                className="w-full bg-white/[0.02] border border-white/5 rounded-none px-6 py-5 text-xs outline-none focus:border-emerald-500/50 transition-all resize-none h-32"
                                placeholder="ENTER FULL PHYSICAL ADDRESS..."
                                value={addressText}
                                onChange={e => setAddressText(e.target.value)}
                            />
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-neutral-600">
                                <span>Area Verification Code</span>
                                <ShieldCheck className="w-3 h-3" />
                            </div>
                            <input 
                                className="w-full bg-white/[0.02] border border-white/5 rounded-none px-6 py-5 text-xs outline-none focus:border-emerald-500/50 transition-all"
                                placeholder="PIN CODE (6-DIGITS)"
                                maxLength={6}
                                value={pinCode}
                                onChange={e => setPinCode(e.target.value)}
                            />
                        </div>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div 
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-neutral-600">
                                <span>Verification Authority</span>
                                <ShieldCheck className="w-3 h-3" />
                            </div>
                            <select 
                                className="w-full bg-white/[0.02] border border-white/5 rounded-none px-6 py-5 text-xs outline-none focus:border-emerald-500/50 transition-all appearance-none cursor-pointer"
                                value={docType}
                                onChange={e => setDocType(e.target.value as "adhar" | "pan")}
                            >
                                <option value="adhar" className="bg-[#0a0a0a]">AADHAR CARD (UIDAI)</option>
                                <option value="pan" className="bg-[#0a0a0a]">PAN CARD (INCOME TAX)</option>
                            </select>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-neutral-600">
                                <span>{docType.toUpperCase()} Number</span>
                                <Fingerprint className="w-3 h-3" />
                            </div>
                            <input 
                                className="w-full bg-white/[0.02] border border-white/5 rounded-none px-6 py-5 text-xs outline-none focus:border-emerald-500/50 transition-all uppercase tracking-[0.2em]"
                                placeholder={docType === 'adhar' ? "12 DIGIT UID" : "10 CHARACTER ALPHANUMERIC"}
                                maxLength={docType === 'adhar' ? 12 : 10}
                                value={docNumber}
                                onChange={e => setDocNumber(e.target.value)}
                            />
                            <p className="text-[9px] text-neutral-500 italic">
                                {docType === 'adhar' 
                                    ? "Format: 0000 0000 0000 (12 digits)" 
                                    : "Format: ABCDE1234F (10 chars)"}
                            </p>
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div 
                        key="step3"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center space-y-8"
                    >
                        <div className="relative inline-block">
                             <div className="absolute inset-0 bg-emerald-500 blur-3xl opacity-20" />
                             <ShieldCheck className="w-24 h-24 text-emerald-500 relative z-10 mx-auto" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-black uppercase tracking-widest">Protocol Ready</h3>
                            <p className="text-[10px] text-neutral-500 tracking-[0.3em]">ALL DATA PACKETS ENCRYPTED AND READY FOR UPLOAD</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
          </div>

          <div className="mt-12 flex flex-col md:flex-row gap-4">
             {step > 1 && (
                 <button 
                    onClick={() => setStep(prev => prev - 1)}
                    className="flex-1 py-5 border border-white/5 text-[10px] uppercase font-black tracking-widest hover:bg-white/5 transition-all"
                 >
                    Backtrack
                 </button>
             )}
             <button 
                onClick={() => {
                   if (step === 2) {
                       if (!validateDocNumber(docType, docNumber.trim())) {
                           if (docType === 'adhar') {
                               window.alert("INVALID AUTH_ENTITY: Aadhar number must be exactly 12 numeric digits.");
                               setError("Aadhar MUST BE 12 DIGITS");
                           } else {
                               window.alert("INVALID AUTH_ENTITY: PAN card must be exactly 10 alphanumeric characters (e.g., ABCDE1234F).");
                               setError("PAN MUST BE 10 CHARACTERS");
                           }
                           return;
                       }
                   }
                   if (step < 3) setStep(prev => prev + 1);
                   else handleComplete();
                }}
                disabled={busy}
                className="flex-[2] py-5 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
             >
                {step < 3 ? (
                    <>Advance Sequence <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                ) : (
                    busy ? "Executing Integration..." : scanning ? "Bio-Scanning..." : "Finalize Verification"
                )}
             </button>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" /> ERROR_RESPONSE: {error}
            </div>
          )}

        </div>
        <div className="mt-6 flex justify-between items-center text-[8px] text-neutral-700 font-bold uppercase tracking-[0.4em]">
            <span>Secured by Amity Defense Systems</span>
            <span>Handshake Encrypted</span>
        </div>
      </motion.div>
    </div>
  );
}

export default function ProfileSetup() {
  return (
    <AuthenticatedRoute>
      <ProfileSetupContent />
    </AuthenticatedRoute>
  );
}
