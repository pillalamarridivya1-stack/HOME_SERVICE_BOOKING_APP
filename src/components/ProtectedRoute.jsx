import { ShieldAlert } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ProtectedRoute({ allowedRole, onNavigate, children }) {
  const { currentUser } = useApp();

  // Guest user attempting to access a protected page
  if (!currentUser) {
    return (
      <div className="max-w-lg mx-auto px-4 py-14 text-center">
        <div className="bg-white border border-slate-200 rounded-xl p-8">
          <ShieldAlert className="w-10 h-10 text-[#2563EB] mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-[#1F2937] mb-2">
            {allowedRole === 'admin' ? 'Admin Login Required' : 'Login Required'}
          </h1>
          <p className="text-sm text-slate-600 mb-6">
            {allowedRole === 'admin'
              ? 'Please sign in using your Admin credentials to access the Admin Dashboard.'
              : 'Please log in or register a customer account to continue.'}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() =>
                onNavigate(allowedRole === 'admin' ? 'admin-login' : 'login')
              }
              className="px-5 py-2.5 text-sm font-semibold text-white bg-[#2563EB] rounded-lg hover:bg-[#1E3A8A] cursor-pointer"
            >
              {allowedRole === 'admin' ? 'Go to Admin Login' : 'Go to User Login'}
            </button>
            {allowedRole === 'user' && (
              <button
                type="button"
                onClick={() => onNavigate('signup')}
                className="px-5 py-2.5 text-sm font-semibold text-[#2563EB] bg-[#F5F8FF] border border-blue-200 rounded-lg hover:bg-blue-100 cursor-pointer"
              >
                Create Account
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Wrong role attempting to access another role's dashboard/page
  if (currentUser.role !== allowedRole) {
    return (
      <div className="max-w-lg mx-auto px-4 py-14 text-center">
        <div className="bg-white border border-slate-200 rounded-xl p-8">
          <ShieldAlert className="w-10 h-10 text-red-600 mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-[#1F2937] mb-2">Access Restricted</h1>
          <p className="text-sm text-slate-600 mb-6">
            {allowedRole === 'admin'
              ? 'Customer accounts are not permitted to access Admin pages.'
              : 'Administrator accounts cannot access customer-only booking or user dashboard pages.'}
          </p>
          <button
            type="button"
            onClick={() =>
              onNavigate(
                currentUser.role === 'admin' ? 'admin-dashboard' : 'user-dashboard'
              )
            }
            className="px-5 py-2.5 text-sm font-semibold text-white bg-[#1E3A8A] rounded-lg hover:bg-[#2563EB] cursor-pointer"
          >
            {currentUser.role === 'admin'
              ? 'Go to Admin Dashboard'
              : 'Go to User Dashboard'}
          </button>
        </div>
      </div>
    );
  }

  return children;
}
