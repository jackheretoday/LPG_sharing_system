import React, { useState, useEffect } from 'react';
import { AlertCircle, Droplet, TrendingDown, Calendar, Plus } from 'lucide-react';
import { getToken } from '@/lib/trustAuth';
import { API_ROOT } from '@/lib/apiBase';

interface Cylinder {
  id: string;
  cylinder_id: string;
  current_weight_kg: number;
  max_capacity_kg: number;
  status: string;
  last_refill_date: string;
  created_at: string;
  updated_at: string;
}

interface Prediction {
  id: string;
  predicted_empty_days: number;
  predicted_empty_date: string;
  daily_avg_usage_kg: number;
  confidence_score: number;
  alert_status: boolean;
}

interface Alert {
  id: string;
  alert_type: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export const LPGTracker: React.FC = () => {
  const [cylinders, setCylinders] = useState<Cylinder[]>([]);
  const [predictions, setPredictions] = useState<Record<string, Prediction>>({});
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCylinder, setSelectedCylinder] = useState<Cylinder | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [usageInput, setUsageInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    cylinder_id: '',
    current_weight_kg: '',
    max_capacity_kg: '20',
  });

  const API_BASE = API_ROOT;
  const token = getToken();

  const fetchCylinders = async () => {
    if (!token) {
      setErrorMessage('Authentication token missing. Please login again.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/lpg/cylinders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setErrorMessage('');
        setCylinders(data.data);
        if (data.data.length > 0) {
          setSelectedCylinder(data.data[0]);
          fetchPredictions(data.data[0].id);
        }
      } else {
        setErrorMessage(data.message || 'Failed to load cylinders.');
      }
    } catch (error) {
      console.error('Error fetching cylinders:', error);
      setErrorMessage('Failed to load cylinders. Please try again.');
    }
  };

  const fetchPredictions = async (cylinderId: string) => {
    try {
      const response = await fetch(`${API_BASE}/lpg/predict/${cylinderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success && data.data) {
        setPredictions((prev) => ({ ...prev, [cylinderId]: data.data }));
      }
    } catch (error) {
      console.error('Error fetching predictions:', error);
    }
  };

  const fetchAlerts = async () => {
    if (!token) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/lpg/alerts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setAlerts(data.data);
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  useEffect(() => {
    fetchCylinders();
    fetchAlerts();
    setLoading(false);
  }, []);

  const handleAddCylinder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setErrorMessage('Authentication token missing. Please login again.');
      return;
    }

    const cylinderId = formData.cylinder_id.trim();
    const currentWeight = parseFloat(formData.current_weight_kg);
    const maxCapacity = parseFloat(formData.max_capacity_kg);

    if (!cylinderId || Number.isNaN(currentWeight) || Number.isNaN(maxCapacity)) {
      setErrorMessage('Please enter a valid cylinder ID and weight values.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/lpg/cylinders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cylinder_id: cylinderId,
          current_weight_kg: currentWeight,
          max_capacity_kg: maxCapacity,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setErrorMessage('');
        setCylinders([...cylinders, data.data]);
        setSelectedCylinder(data.data);
        setFormData({ cylinder_id: '', current_weight_kg: '', max_capacity_kg: '20' });
        setShowAddForm(false);
      } else {
        setErrorMessage(data.message || 'Unable to add cylinder.');
      }
    } catch (error) {
      console.error('Error adding cylinder:', error);
      setErrorMessage('Unable to add cylinder. Please try again.');
    }
  };

  const handleLogUsage = async () => {
    if (!selectedCylinder || !usageInput) return;

    try {
      const response = await fetch(`${API_BASE}/lpg/usage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cylinder_id: selectedCylinder.cylinder_id,
          usage_kg: parseFloat(usageInput),
          usage_reason: 'daily_use',
        }),
      });

      const data = await response.json();
      if (data.success) {
        setUsageInput('');
        // Refresh predictions
        if (selectedCylinder) {
          fetchPredictions(selectedCylinder.id);
        }
      }
    } catch (error) {
      console.error('Error logging usage:', error);
    }
  };

  const handlePredictNow = async () => {
    if (!selectedCylinder) return;

    try {
      const response = await fetch(`${API_BASE}/lpg/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cylinder_id: selectedCylinder.cylinder_id,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setPredictions((prev) => ({
          ...prev,
          [selectedCylinder.id]: data.data,
        }));
        if (data.data.alertTriggered) {
          fetchAlerts();
        }
      }
    } catch (error) {
      console.error('Error making prediction:', error);
    }
  };

  const handleMarkAlertRead = async (alertId: string) => {
    try {
      await fetch(`${API_BASE}/lpg/alerts/${alertId}`, {
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

  const getStatusColor = (days: number | null): string => {
    if (!days) return 'text-gray-500';
    if (days <= 3) return 'text-red-600';
    if (days <= 7) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getStatusBgColor = (days: number | null): string => {
    if (!days) return 'bg-gray-100';
    if (days <= 3) return 'bg-red-100';
    if (days <= 7) return 'bg-yellow-100';
    return 'bg-green-100';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg font-semibold">Loading LPG Tracker...</div>
      </div>
    );
  }

  const currentPrediction = selectedCylinder
    ? predictions[selectedCylinder.id]
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <Droplet className="w-10 h-10 text-blue-600" />
            LPG Prediction Tracker
          </h1>
          <p className="text-gray-600 mt-2">
            Monitor your LPG usage and get alerts before your cylinder runs out
          </p>
        </div>

        {/* Alerts Section */}
        {errorMessage && (
          <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {errorMessage}
          </div>
        )}

        {alerts.length > 0 && (
          <div className="mb-6 space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg flex items-start gap-4 ${
                  alert.is_read
                    ? 'bg-gray-100 border border-gray-300'
                    : 'bg-red-50 border border-red-300'
                }`}
              >
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{alert.alert_type}</p>
                  <p className="text-gray-700 text-sm mt-1">{alert.message}</p>
                  <p className="text-gray-500 text-xs mt-2">
                    {new Date(alert.created_at).toLocaleDateString()}
                  </p>
                </div>
                {!alert.is_read && (
                  <button
                    onClick={() => handleMarkAlertRead(alert.id)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 whitespace-nowrap"
                  >
                    Mark Read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cylinders List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">My Cylinders</h2>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {showAddForm && (
                <form onSubmit={handleAddCylinder} className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <input
                    type="text"
                    placeholder="Cylinder ID"
                    value={formData.cylinder_id}
                    onChange={(e) =>
                      setFormData({ ...formData, cylinder_id: e.target.value })
                    }
                    className="w-full mb-3 px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder:text-gray-500"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Current Weight (kg)"
                    step="0.1"
                    value={formData.current_weight_kg}
                    onChange={(e) =>
                      setFormData({ ...formData, current_weight_kg: e.target.value })
                    }
                    className="w-full mb-3 px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder:text-gray-500"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                  >
                    Add Cylinder
                  </button>
                </form>
              )}

              <div className="space-y-2">
                {cylinders.map((cylinder) => (
                  <button
                    key={cylinder.id}
                    onClick={() => {
                      setSelectedCylinder(cylinder);
                      fetchPredictions(cylinder.id);
                    }}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      selectedCylinder?.id === cylinder.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <p className="font-semibold">{cylinder.cylinder_id}</p>
                    <p className="text-sm opacity-75">
                      {cylinder.current_weight_kg} / {cylinder.max_capacity_kg} kg
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Prediction Panel */}
          <div className="lg:col-span-2 space-y-6">
            {selectedCylinder && (
              <>
                {/* Current Status */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {selectedCylinder.cylinder_id}
                  </h2>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Current Weight</p>
                      <p className="text-3xl font-bold text-blue-600">
                        {selectedCylinder.current_weight_kg} kg
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Capacity</p>
                      <p className="text-3xl font-bold text-gray-600">
                        {selectedCylinder.max_capacity_kg} kg
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all"
                        style={{
                          width: `${(selectedCylinder.current_weight_kg / selectedCylinder.max_capacity_kg) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Log Usage */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Log Daily Usage (kg)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        step="0.1"
                        placeholder="Enter usage amount"
                        value={usageInput}
                        onChange={(e) => setUsageInput(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={handleLogUsage}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        Log
                      </button>
                    </div>
                  </div>

                  {/* Predict Button */}
                  <button
                    onClick={handlePredictNow}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-blue-700 transition flex items-center justify-center gap-2"
                  >
                    <TrendingDown className="w-5 h-5" />
                    Predict Empty Date
                  </button>
                </div>

                {/* Prediction Result */}
                {currentPrediction && (
                  <div
                    className={`${getStatusBgColor(currentPrediction.predicted_empty_days)} rounded-lg shadow-lg p-6 border-l-4 ${
                      currentPrediction.predicted_empty_days <= 3
                        ? 'border-red-600'
                        : currentPrediction.predicted_empty_days <= 7
                          ? 'border-yellow-600'
                          : 'border-green-600'
                    }`}
                  >
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Calendar className="w-6 h-6" />
                      <span className={getStatusColor(currentPrediction.predicted_empty_days)}>
                        Prediction Result
                      </span>
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Days Remaining</p>
                        <p
                          className={`text-3xl font-bold ${getStatusColor(currentPrediction.predicted_empty_days)}`}
                        >
                          {currentPrediction.predicted_empty_days}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Empty Date</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {new Date(currentPrediction.predicted_empty_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Daily Usage</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {currentPrediction.daily_avg_usage_kg.toFixed(2)} kg/day
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Confidence</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {(currentPrediction.confidence_score * 100).toFixed(0)}%
                        </p>
                      </div>
                    </div>

                    {currentPrediction.predicted_empty_days <= 7 && (
                      <div className="mt-4 p-3 bg-white bg-opacity-50 rounded-lg flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm font-semibold text-red-800">
                          ⚠️ Your cylinder is running low. Schedule a refill soon!
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LPGTracker;
