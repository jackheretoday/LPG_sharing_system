import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { emergencyApi } from '@/lib/emergencyApi';
import { getToken } from '@/lib/trustAuth';

export function SeverityForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    intensity: '',
    sound: '',
    duration: '',
    location: '',
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!getToken()) {
      setError('Please login before submitting an emergency request.');
      return;
    }

    setBusy(true);
    setError('');
    try {
      const res = await emergencyApi.createRequest(formData);
      navigate(`/tracking?requestId=${res.request.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create emergency request');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 professional-form">
      <div>
        <label className="block text-sm text-slate-300 mb-2">Smell Intensity</label>
        <select
          value={formData.intensity}
          onChange={(e) => setFormData((prev) => ({ ...prev, intensity: e.target.value }))}
          className="professional-field w-full rounded-xl px-4 py-3"
          required
        >
          <option value="">Select intensity</option>
          <option value="Faint">Faint</option>
          <option value="Noticeable">Noticeable</option>
          <option value="Very Strong">Very Strong</option>
        </select>
      </div>

      <div>
        <label className="block text-sm text-slate-300 mb-2">Leakage Sound</label>
        <select
          value={formData.sound}
          onChange={(e) => setFormData((prev) => ({ ...prev, sound: e.target.value }))}
          className="professional-field w-full rounded-xl px-4 py-3"
          required
        >
          <option value="">Select option</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      <div>
        <label className="block text-sm text-slate-300 mb-2">Duration</label>
        <select
          value={formData.duration}
          onChange={(e) => setFormData((prev) => ({ ...prev, duration: e.target.value }))}
          className="professional-field w-full rounded-xl px-4 py-3"
          required
        >
          <option value="">Select duration</option>
          <option value="Just now">Just now</option>
          <option value="Less than 10 mins">Less than 10 mins</option>
          <option value="More than 10 mins">More than 10 mins</option>
        </select>
      </div>

      <div>
        <label className="block text-sm text-slate-300 mb-2">Location (address or lat,lng)</label>
        <input
          value={formData.location}
          onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
          className="professional-field w-full rounded-xl px-4 py-3"
          placeholder="e.g. 19.0760,72.8777 or full address"
          required
        />
      </div>

      {error ? <p className="text-rose-300 text-sm">{error}</p> : null}

      <Button type="submit" disabled={busy} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold">
        {busy ? 'Submitting...' : 'Request Assistance'}
      </Button>
    </form>
  );
}
