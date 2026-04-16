import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X, Bell, ShieldCheck, Zap, Activity } from 'lucide-react';

interface LPGAlert {
  id: string;
  alert_type: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface LPGAlertNotificationProps {
  token: string;
  apiBase: string;
  pollInterval?: number;
}

export const LPGAlertNotification: React.FC<LPGAlertNotificationProps> = ({
  token,
  apiBase,
  pollInterval = 60000,
}) => {
  const [alerts, setAlerts] = useState<LPGAlert[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchAlerts = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${apiBase}/lpg/alerts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setAlerts(data.data);
        setUnreadCount(data.data.filter((a: LPGAlert) => !a.is_read).length);
      }
    } catch (error) {
      console.error('Error fetching LPG alerts:', error);
    }
  };

  const handleMarkAsRead = async (alertId: string) => {
    try {
      await fetch(`${apiBase}/lpg/alerts/${alertId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchAlerts();
    } catch (error) {
      console.error('Error marking alert as read:', error);
    }
  };

  const handleDismiss = async (alertId: string) => {
    await handleMarkAsRead(alertId);
    setAlerts(alerts.filter((a) => a.id !== alertId));
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, pollInterval);
    return () => clearInterval(interval);
  }, [token]);

  return (
    <div className="fixed top-6 right-8 z-[100]">
      {/* Notification Bell */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-4 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:bg-white/20 transition-all group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <Bell className="w-6 h-6 text-emerald-500 relative z-10" />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute top-2 right-2 inline-flex items-center justify-center w-5 h-5 text-[10px] font-black text-black bg-emerald-500 rounded-full z-20 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {showNotifications && (
          <>
            {/* Backdrop for closing */}
            <div 
              className="fixed inset-0 z-[-1]" 
              onClick={() => setShowNotifications(false)} 
            />
            
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-4 w-[400px] overflow-hidden bg-black/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.6)]"
            >
              <div className="p-8 border-b border-white/5 bg-white/5 relative overflow-hidden">
                <div className="absolute top-[-50%] left-[-50%] w-full h-full bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">Neural_Alerts</h3>
                        <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mt-1">
                          {unreadCount > 0 ? `${unreadCount} System_Breaches_Detected` : 'Clear_Horizon'}
                        </p>
                    </div>
                    <Activity className="w-5 h-5 text-emerald-500 animate-pulse" />
                </div>
              </div>

              <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                {alerts.length === 0 ? (
                  <div className="p-16 text-center space-y-4">
                    <ShieldCheck className="w-12 h-12 text-neutral-800 mx-auto" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-700">All_Systems_Nominal</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`p-6 transition-all duration-300 relative group hover:bg-white/[0.03] ${
                          alert.is_read ? 'opacity-60' : 'bg-white/[0.01]'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`mt-1 p-2 rounded-xl scale-90 ${alert.is_read ? 'bg-neutral-800' : 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]'}`}>
                             <Zap className={`w-3 h-3 ${alert.is_read ? 'text-neutral-500' : 'text-white'}`} />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                                <span className="text-[8px] font-black uppercase tracking-widest text-neutral-500">Critical_Warning</span>
                                <span className="text-[8px] font-bold text-neutral-600 uppercase">{new Date(alert.created_at).toLocaleTimeString()}</span>
                            </div>
                            <p className="text-sm font-black italic uppercase tracking-tighter text-white leading-tight">
                              {alert.message}
                            </p>
                            <div className="pt-3 flex gap-2">
                                <button
                                    onClick={() => handleDismiss(alert.id)}
                                    className="text-[8px] font-black uppercase tracking-widest text-emerald-500 hover:text-white transition-colors"
                                >
                                    Acknowledge
                                </button>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDismiss(alert.id)}
                            className="p-1 text-neutral-700 hover:text-white transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default LPGAlertNotification;
