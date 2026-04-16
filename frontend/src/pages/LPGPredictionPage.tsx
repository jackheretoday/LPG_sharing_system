import React, { useState, useEffect } from 'react';
import { LPGTracker } from '../components/LPGTracker';
import { LPGAlertNotification } from '../components/LPGAlertNotification';
import { TrendingUp, CheckCircle, AlertTriangle } from 'lucide-react';
import { getToken } from '@/lib/trustAuth';
import { API_ROOT } from '@/lib/apiBase';

interface ModelMetric {
  metric_date: string;
  total_predictions: number;
  accurate_predictions: number;
  average_accuracy_percentage: number;
  average_error_days: number;
}

interface OverallMetrics {
  totalPredictions: number;
  accuratePredictions: number;
  accuracy_percentage: string;
  average_error_days: string;
}

export const LPGPredictionPage: React.FC = () => {
  const [metrics, setMetrics] = useState<OverallMetrics | null>(null);
  const [historicalMetrics, setHistoricalMetrics] = useState<ModelMetric[]>([]);
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  const API_BASE = API_ROOT;
  const token = getToken();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch(`${API_BASE}/lpg/metrics/model`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setMetrics(data.metrics.overall);
          setHistoricalMetrics(data.metrics.historical);
        }
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setLoadingMetrics(false);
      }
    };

    fetchMetrics();
  }, [API_BASE, token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Alert Notification Bell */}
      <LPGAlertNotification token={token || ''} apiBase={API_BASE} pollInterval={60000} />

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">LPG Prediction System</h1>
          <p className="text-blue-100">Monitor your LPG usage and predict when your cylinder will be empty</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Model Performance Metrics */}
        {!loadingMetrics && metrics && (
          <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Total Predictions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Predictions</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {metrics.totalPredictions}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Accurate Predictions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Accurate Predictions</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    {metrics.accuratePredictions}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            {/* Accuracy Percentage */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Accuracy Rate</p>
                  <p className="text-3xl font-bold text-indigo-600 mt-2">
                    {metrics.accuracy_percentage}%
                  </p>
                </div>
                <div className="bg-indigo-100 p-3 rounded-full">
                  <CheckCircle className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </div>

            {/* Average Error */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Avg Error (Days)</p>
                  <p className="text-3xl font-bold text-orange-600 mt-2">
                    ±{metrics.average_error_days}
                  </p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">How It Works</h2>
          <ul className="text-blue-800 space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="font-bold">1.</span>
              <span>Add your LPG cylinders with current weight and capacity</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">2.</span>
              <span>Log your daily usage to track consumption patterns</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">3.</span>
              <span>Get predictions on when your cylinder will be empty</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">4.</span>
              <span>Receive alerts when LPG is running low (configurable threshold)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">5.</span>
              <span>Submit feedback on prediction accuracy to help improve the ML model</span>
            </li>
          </ul>
        </div>

        {/* LPG Tracker Component */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <LPGTracker />
        </div>

        {/* Model Training Info */}
        <div className="bg-amber-50 border-l-4 border-amber-600 rounded-lg p-6 mt-8">
          <h2 className="text-lg font-semibold text-amber-900 mb-2">🤖 Help Improve Our ML Model</h2>
          <p className="text-amber-800 mb-3">
            After each prediction reaches its predicted date, you can submit feedback on whether the prediction was accurate. This data helps train our machine learning model to make better predictions over time.
          </p>
          <div className="bg-white p-4 rounded border border-amber-300">
            <p className="text-sm text-gray-700">
              <strong>How to submit feedback:</strong> Go to the "Pending Feedback" section in the LPG Tracker. For each expired prediction, enter the actual empty date and any additional notes. This will automatically calculate the accuracy and help us improve the model.
            </p>
          </div>
        </div>

        {/* Historical Metrics Chart */}
        {historicalMetrics.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Model Performance History</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700">Total</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700">Accurate</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700">Accuracy</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700">Avg Error</th>
                  </tr>
                </thead>
                <tbody>
                  {historicalMetrics.slice(0, 10).map((metric, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900">
                        {new Date(metric.metric_date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-700">
                        {metric.total_predictions}
                      </td>
                      <td className="px-4 py-3 text-center text-green-600 font-semibold">
                        {metric.accurate_predictions}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                          {metric.average_accuracy_percentage}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-700">
                        ±{parseFloat(String(metric.average_error_days)).toFixed(2)} days
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LPGPredictionPage;
