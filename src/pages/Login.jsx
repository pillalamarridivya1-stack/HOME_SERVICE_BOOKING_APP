import { useState } from 'react';
import { LogIn } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Login({ onNavigate, redirectAfterLogin }) {
  const { loginUser } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    const result = loginUser(email, password);
    if (!result.success) {
      setError(result.message);
      return;
    }

    onNavigate(redirectAfterLogin || 'user-dashboard');
  }

  function fillDemoCustomer() {
    setEmail('rahul@example.com');
    setPassword('User123');
    setError('');
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
            <LogIn className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">User Login</h1>
            <p className="text-sm text-slate-500">Sign in to book services and track orders</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Login to User Dashboard
          </button>
        </form>

        {/* Demo Account Box for Review */}
        <div className="mt-5 p-3.5 bg-blue-50 border border-blue-200 rounded-lg text-xs text-slate-700 flex items-center justify-between gap-3">
          <div>
            <p className="font-semibold text-blue-900">Demo Customer Account</p>
            <p>rahul@example.com / User123</p>
          </div>
          <button
            type="button"
            onClick={fillDemoCustomer}
            className="px-2.5 py-1.5 bg-white text-blue-700 border border-blue-200 rounded font-medium hover:bg-blue-100 cursor-pointer shrink-0"
          >
            Auto Fill
          </button>
        </div>

        <div className="mt-6 pt-5 border-t border-slate-200 text-sm text-center space-y-2">
          <p className="text-slate-600">
            New to HomeServe?{' '}
            <button
              type="button"
              onClick={() => onNavigate('signup')}
              className="text-blue-700 font-semibold hover:underline cursor-pointer"
            >
              Create a User Account
            </button>
          </p>
          <p className="text-slate-500">
            Are you an administrator?{' '}
            <button
              type="button"
              onClick={() => onNavigate('admin-login')}
              className="text-slate-700 font-medium hover:underline cursor-pointer"
            >
              Go to Admin Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
