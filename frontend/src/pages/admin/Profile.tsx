import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getStoredUser, clearToken, clearStoredUser } from '@/lib/trustAuth';

export default function AdminProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getStoredUser());
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  useEffect(() => {
    const storedUser = getStoredUser();
    if (!storedUser || storedUser.role !== 'admin') {
      navigate('/');
      return;
    }
    setUser(storedUser);
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (user) {
      const updatedUser = { ...user, ...formData };
      setUser(updatedUser);
      setIsEditing(false);
      // In a real app, you'd save this to the backend
    }
  };

  const handleLogout = () => {
    clearToken();
    clearStoredUser();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-2xl font-bold mb-4">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black">
      {/* Header */}
      <div className="bg-slate-900/50 border-b border-slate-700 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link to="/admin/disputes" className="text-2xl font-bold text-white">
            Admin Panel
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/admin/disputes" className="text-slate-400 hover:text-white transition-colors">
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 backdrop-blur-xl">
          <h1 className="text-3xl font-bold text-white mb-8">Admin Profile</h1>

          {/* Profile Card */}
          <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                ) : (
                  <p className="text-lg text-white">{user.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                ) : (
                  <p className="text-lg text-white">{user.email}</p>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Role
                </label>
                <p className="text-lg text-blue-400 font-medium capitalize">{user.role}</p>
              </div>

              {/* Verification Status */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Email Verification
                </label>
                <div className="flex items-center gap-2">
                  {user.isEmailVerified ? (
                    <>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-green-400 font-medium">Verified</span>
                    </>
                  ) : (
                    <>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span className="text-yellow-400 font-medium">Pending</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-8 border-t border-slate-700">
            <h2 className="text-lg font-semibold text-white mb-4">Admin Permissions</h2>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>View and manage disputes</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Verify users and transactions</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Review emergency responses</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Generate system reports</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
