import React, { useState, useEffect } from 'react';
import { AlertCircle, X, Bell } from 'lucide-react';

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
  pollInterval?: number; // in milliseconds
}

export const LPGAlertNotification: React.FC<LPGAlertNotificationProps> = ({
  token,
  apiBase,
  pollInterval = 60000, // Poll every 60 seconds
}) => {
  const [alerts, setAlerts] = useState<LPGAlert[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchAlerts = async () => {
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
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* Notification Bell */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition"
      >
        <Bell className="w-6 h-6 text-blue-600" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-96 max-h-96 overflow-y-auto bg-white rounded-lg shadow-xl border border-gray-200">
          <div className="sticky top-0 bg-gray-50 p-4 border-b border-gray-200">
            <h3 className="font-bold text-gray-900">LPG Alerts</h3>
            <p className="text-sm text-gray-600">
              {unreadCount > 0 ? `${unreadCount} new alert${unreadCount !== 1 ? 's' : ''}` : 'No new alerts'}
            </p>
          </div>

          {alerts.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p>No alerts at the moment</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 transition ${
                    alert.is_read ? 'bg-white' : 'bg-blue-50'
                  } hover:bg-gray-50`}
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle
                      className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        alert.is_read ? 'text-gray-400' : 'text-red-600'
                      }`}
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">
                        {alert.alert_type}
                      </p>
                      <p className="text-gray-700 text-sm mt-1">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(alert.created_at).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDismiss(alert.id)}
                      className="flex-shrink-0 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LPGAlertNotification;
