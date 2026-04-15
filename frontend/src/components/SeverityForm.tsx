import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

export function SeverityForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ intensity: '', sound: '', duration: '' });
  const navigate = useNavigate();

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const handleSubmit = () => {
    // Navigate to tracking
    navigate('/tracking');
  };

  const wrapVariations = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" variants={wrapVariations} initial="initial" animate="animate" exit="exit" className="flex flex-col gap-4">
            <h3 className="text-xl font-medium mb-2">1. Smell Intensity</h3>
            <p className="text-sm text-gray-400 mb-4">How strong is the LPG smell?</p>
            <div className="flex flex-col gap-3">
              {['Faint', 'Noticeable', 'Very Strong'].map(level => (
                <button
                  key={level}
                  onClick={() => { setFormData({ ...formData, intensity: level }); handleNext(); }}
                  className="p-4 border border-white/20 rounded-xl hover:bg-white/10 text-left transition-colors font-light"
                >
                  {level}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" variants={wrapVariations} initial="initial" animate="animate" exit="exit" className="flex flex-col gap-4">
            <h3 className="text-xl font-medium mb-2">2. Leakage Sound</h3>
            <p className="text-sm text-gray-400 mb-4">Can you hear a hissing sound?</p>
            <div className="flex gap-4">
              <button
                onClick={() => { setFormData({ ...formData, sound: 'Yes' }); handleNext(); }}
                className="flex-1 p-4 border border-red-500/50 bg-red-950/30 rounded-xl hover:bg-red-900/50 transition-colors font-light text-center"
              >
                Yes
              </button>
              <button
                onClick={() => { setFormData({ ...formData, sound: 'No' }); handleNext(); }}
                className="flex-1 p-4 border border-white/20 rounded-xl hover:bg-white/10 transition-colors font-light text-center"
              >
                No
              </button>
            </div>
            <Button variant="ghost" onClick={handlePrev} className="mt-4 w-fit">Back</Button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" variants={wrapVariations} initial="initial" animate="animate" exit="exit" className="flex flex-col gap-4">
            <h3 className="text-xl font-medium mb-2">3. Duration</h3>
            <p className="text-sm text-gray-400 mb-4">How long have you noticed this?</p>
            <div className="flex flex-col gap-3">
              {['Just now', 'Less than 10 mins', 'More than 10 mins'].map(dur => (
                <button
                  key={dur}
                  onClick={() => { setFormData({ ...formData, duration: dur }); }}
                  className={`p-4 border rounded-xl hover:bg-white/10 text-left transition-colors font-light ${formData.duration === dur ? 'border-white bg-white/10' : 'border-white/20'}`}
                >
                  {dur}
                </button>
              ))}
            </div>
            
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-white/10">
               <Button variant="ghost" onClick={handlePrev}>Back</Button>
               <Button variant="destructive" size="lg" className="animate-pulse-red" onClick={handleSubmit} disabled={!formData.duration}>
                 Request Assistance
               </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
