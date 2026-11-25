import { useState } from 'react';
import { CheckCircle2, ShieldPlus } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AdminSignup({ onNavigate }) {
  const { registerAdmin } = useApp();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError('All fields are required.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!/^\d{10}$/.test(form.phone.trim())) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Password and Confirm Password do not match.');
      return;
    }

    const result = registerAdmin({
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password
    });

    if (!result.success) {
      setError(result.message);
      return;
    }

    setSuccessMsg('Admin account created successfully! Redirecting to Admin Login...');
    setForm({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    });

    setTimeout(() => {
      onNavigate('admin-login');
    }, 1200);
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-10 h-10 rounded-lg bg-[#1E3A8A] text-white flex items-center justify-center">
            <ShieldPlus className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-[#1F2937]">Admin Signup</h1>
            <p className="text-sm text-slate-500">Create a new administrator account</p>
          </div>
        </div>

        {successMsg ? (
          <div className="py-6 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-[#1F2937] mb-1">Admin Registered</h2>
            <p className="text-sm text-slate-600 mb-5">{successMsg}</p>
            <button
              type="button"
              onClick={() => onNavigate('admin-login')}
              className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-[#1E3A8A] rounded-lg hover:bg-[#2563EB] cursor-pointer"
            >
              Go to Admin Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Enter full name"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="admin@example.com"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="10-digit phone number"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Minimum 6 characters"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="Re-enter password"
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
              Create Admin Account
            </button>
          </form>
        )}

        <div className="mt-6 pt-5 border-t border-slate-200 text-sm text-center space-y-2">
          <p className="text-slate-600">
            Already have an admin account?{' '}
            <button
              type="button"
              onClick={() => onNavigate('admin-login')}
              className="text-[#2563EB] font-semibold hover:underline cursor-pointer"
            >
              Admin Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
