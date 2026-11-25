import { useState } from 'react';
import { Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AdminLogin({ onNavigate }) {
  const { loginAdmin } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter admin email and password.');
      return;
    }

    const result = loginAdmin(email, password);
    if (!result.success) {
      setError(result.message);
      return;
    }

    onNavigate('admin-dashboard');
  }

  function fillAdminCredentials() {
    setEmail('admin@homeservices.com');
    setPassword('Admin123');
    setError('');
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-10 h-10 rounded-lg bg-[#1E3A8A] text-white flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-[#1F2937]">Admin Login</h1>
            <p className="text-sm text-slate-500">Access bookings, payments, and feedback</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Admin Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@homeservices.com"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Admin Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-[#1E3A8A] rounded-lg hover:bg-[#2563EB] transition-colors cursor-pointer"
          >
            Login to Admin Dashboard
          </button>
        </form>

        <div className="mt-5 p-3.5 bg-[#F5F8FF] border border-blue-200 rounded-lg text-xs text-slate-700 flex items-center justify-between gap-3">
          <div>
            <p className="font-semibold text-[#1E3A8A]">Default Admin Credentials</p>
            <p>admin@homeservices.com / Admin123</p>
          </div>
          <button
            type="button"
            onClick={fillAdminCredentials}
            className="px-2.5 py-1.5 bg-white text-[#2563EB] border border-blue-200 rounded font-medium hover:bg-blue-50 cursor-pointer shrink-0"
          >
            Auto Fill
          </button>
        </div>

        <div className="mt-6 pt-5 border-t border-slate-200 text-sm text-center space-y-2">
          <p className="text-slate-600">
            Need to register a new admin?{' '}
            <button
              type="button"
              onClick={() => onNavigate('admin-signup')}
              className="text-[#2563EB] font-semibold hover:underline cursor-pointer"
            >
              Admin Signup
            </button>
          </p>
          <p className="text-slate-500">
            Customer account?{' '}
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="text-[#1F2937] font-medium hover:underline cursor-pointer"
            >
              Go to User Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
