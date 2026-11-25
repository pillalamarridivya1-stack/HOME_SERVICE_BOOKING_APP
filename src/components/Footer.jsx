import { Home, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Summary */}
          <div>
            <div className="flex items-center gap-2.5 text-white font-bold text-lg mb-3">
              <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                <Home className="w-4 h-4" />
              </span>
              <span>HomeServe</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Reliable doorstep home maintenance, repair, and cleaning services with transparent
              fixed pricing and flexible time slots.
            </p>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('services')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Browse Services
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('login')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  User Login
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('signup')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  User Signup
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('admin-login')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Admin Login
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('admin-signup')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Admin Signup
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Contact Support</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>+91 98765 43210 (9:00 AM - 7:00 PM)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>support@homeserve.local</span>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Indiranagar, Bengaluru 560038</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} HomeServe Home Services Booking App. All rights reserved.</p>
          <p>Built with React &amp; Vite · Local Storage Persistence</p>
        </div>
      </div>
    </footer>
  );
}
