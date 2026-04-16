import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ShieldCheck, Truck, ArrowLeft, CreditCard } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { orderApi } from '@/lib/orderApi';
import { getStoredUser } from '@/lib/trustAuth';

interface CylinderDetails {
  owner: string;
  price: string;
  fill: string;
}

export default function RefillBooking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState<'details' | 'confirm' | 'success'>('details');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [trackingId, setTrackingId] = useState('');

  const user = getStoredUser();

  const data = (location.state as CylinderDetails) || {
    owner: "Vikas Malhotra",
    price: "₹1,150",
    fill: "95%"
  };

  const handleConfirm = async () => {
    if (!user) {
      setError('Please login to place an order');
      return;
    }

    setIsProcessing(true);
    setError('');
    
    try {
      const result = await orderApi.createOrder({
        seller_name: data.owner,
        fill_level: data.fill,
        price: data.price,
        buyer_id: user.id
      });
      
      setTrackingId(result.order.tracking_id);
      setStep('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transaction failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary font-sans overflow-x-hidden">
      <Navbar />
      
      <div className="max-w-xl mx-auto px-6 py-12 md:py-20 h-full relative z-10">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Discovery
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="hub-glass rounded-3xl p-8 border border-glass-border shadow-2xl overflow-hidden relative"
        >
          {step === 'details' && (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-black tracking-tight mb-2">Booking Details</h1>
                  <p className="text-text-secondary text-sm">Refill Reference: #GS-{id?.slice(-4).toUpperCase() || 'TX-902'}</p>
                </div>
                <div className="w-12 h-12 bg-accent-blue/10 rounded-2xl flex items-center justify-center border border-accent-blue/20">
                  <Truck className="w-6 h-6 text-accent-blue" />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-glass-border">
                <div className="flex justify-between py-2">
                  <span className="text-text-secondary">Provider</span>
                  <span className="font-bold flex items-center gap-1.5">
                    {data.owner}
                    <ShieldCheck className="w-3.5 h-3.5 text-accent-blue" />
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-text-secondary">Current Fill Level</span>
                  <span className="font-bold text-emerald-400">{data.fill}</span>
                </div>
                <div className="flex justify-between py-4 border-t border-glass-border mt-4">
                  <span className="text-lg font-medium">Total Amount</span>
                  <span className="text-2xl font-black text-white">{data.price}</span>
                </div>
              </div>

              <div className="bg-white/5 p-4 rounded-xl text-xs text-text-secondary leading-relaxed border border-white/5">
                Note: Standard delivery takes 30-45 minutes. Payment will be handled securely via the GasSahayak Trust Layer.
              </div>

              <button 
                onClick={() => setStep('confirm')}
                className="w-full bg-white text-black py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-gray-100 transition-all active:scale-95 shadow-xl shadow-white/5"
              >
                Proceed to Checkout
              </button>
            </div>
          )}

          {step === 'confirm' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-black">Secure Checkout</h2>
                <p className="text-text-secondary text-sm">Review your refill order</p>
              </div>

              <div className="bg-black/20 rounded-2xl p-6 border border-white/5">
                <div className="flex justify-between mb-2">
                  <span className="text-text-secondary">Payable Amount</span>
                  <span className="text-xl font-bold">{data.price}</span>
                </div>
                {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
                <div className="text-xs text-text-secondary italic mt-2">
                  * No hidden convenience fees applied.
                </div>
              </div>

              <button 
                onClick={handleConfirm}
                disabled={isProcessing}
                className="w-full bg-accent-blue text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 shadow-xl shadow-accent-blue/20 disabled:opacity-50"
              >
                {isProcessing ? 'Processing Transaction...' : 'Confirm Refill Order'}
              </button>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-10 space-y-6">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/30"
              >
                <CheckCircle className="w-10 h-10 text-white" />
              </motion.div>
              
              <div>
                <h2 className="text-3xl font-black mb-2">Order Confirmed!</h2>
                <p className="text-text-secondary">Your refill is being prepared for dispatch.</p>
              </div>

              <div className="bg-white/5 p-5 rounded-2xl border border-white/10 inline-block">
                <p className="text-[10px] uppercase tracking-widest text-text-secondary mb-1">Live Tracking ID</p>
                <p className="text-xl font-black tracking-tighter">{trackingId || '#GS-REF-000'}</p>
              </div>

              <button 
                onClick={() => navigate('/tracking')}
                className="w-full bg-white text-black py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-gray-100 transition-all active:scale-95"
              >
                Track My Delivery
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-blue/10 rounded-full blur-[120px] pointer-events-none"></div>
    </div>
  );
}
