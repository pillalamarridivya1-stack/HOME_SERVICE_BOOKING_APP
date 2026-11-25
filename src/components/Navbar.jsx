import { useState } from 'react';
import { Home, Menu, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Navbar({ currentPage, onNavigate }) {
  const { currentUser, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleNav(page, sectionId) {
    setMobileMenuOpen(false);
    onNavigate(page, sectionId);
  }

  function handleLogout() {
    setMobileMenuOpen(false);
    logout();
    onNavigate('home');
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <button
            type="button"
            onClick={() => handleNav('home')}
            className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-[#1E3A8A] whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span className="w-8 h-8 rounded-lg bg-[#2563EB] text-white flex items-center justify-center">
              <Home className="w-4 h-4" />
            </span>
            <span>HomeServe</span>
          </button>

          {/* Center Navigation Links */}
          <nav className="hidden xl:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              type="button"
              onClick={() => handleNav('home')}
              className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                currentPage === 'home'
                  ? 'text-[#2563EB] font-semibold'
                  : 'hover:text-[#2563EB]'
              }`}
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => handleNav('services')}
              className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                currentPage === 'services'
                  ? 'text-[#2563EB] font-semibold'
                  : 'hover:text-[#2563EB]'
              }`}
            >
              Services
            </button>
            <button
              type="button"
              onClick={() => handleNav('home', 'about-section')}
              className="whitespace-nowrap shrink-0 hover:text-[#2563EB] transition-colors cursor-pointer"
            >
              About Us
            </button>
            <button
              type="button"
              onClick={() => handleNav('home', 'contact-section')}
              className="whitespace-nowrap shrink-0 hover:text-[#2563EB] transition-colors cursor-pointer"
            >
              Contact
            </button>
            {currentUser?.role === 'user' && (
              <button
                type="button"
                onClick={() => handleNav('user-dashboard')}
                className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  currentPage === 'user-dashboard'
                    ? 'text-[#2563EB] font-semibold'
                    : 'hover:text-[#2563EB]'
                }`}
              >
                User Dashboard
              </button>
            )}
            {currentUser?.role === 'admin' && (
              <button
                type="button"
                onClick={() => handleNav('admin-dashboard')}
                className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  currentPage === 'admin-dashboard'
                    ? 'text-[#2563EB] font-semibold'
                    : 'hover:text-[#2563EB]'
                }`}
              >
                Admin Dashboard
              </button>
            )}
          </nav>

          {/* Auth Actions (User Login, User Signup, Admin Login, Admin Signup) */}
          <div className="hidden xl:flex items-center gap-2 shrink-0">
            {currentUser ? (
              <>
                <span className="text-sm text-slate-600 whitespace-nowrap mr-1">
                  {currentUser.name}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-[#2563EB] border border-blue-200 bg-[#F5F8FF] rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleNav('login')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    currentPage === 'login'
                      ? 'bg-[#F5F8FF] text-[#2563EB] border-[#2563EB]'
                      : 'text-[#2563EB] border-blue-200 hover:bg-[#F5F8FF]'
                  }`}
                >
                  User Login
                </button>
                <button
                  type="button"
                  onClick={() => handleNav('signup')}
                  className="px-3 py-1.5 text-sm font-medium text-white bg-[#2563EB] rounded-lg hover:bg-[#1E3A8A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  User Signup
                </button>
                <button
                  type="button"
                  onClick={() => handleNav('admin-login')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    currentPage === 'admin-login'
                      ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                      : 'text-[#1E3A8A] bg-slate-100 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  Admin Login
                </button>
                <button
                  type="button"
                  onClick={() => handleNav('admin-signup')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    currentPage === 'admin-signup'
                      ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                      : 'text-[#1E3A8A] border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  Admin Signup
                </button>
              </>
            )}
          </div>

          {/* Mobile & Tablet Menu Toggle */}
          <button
            type="button"
            aria-label="Toggle Menu"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="xl:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile & Tablet Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden py-4 border-t border-slate-200 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => handleNav('home')}
              className="text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-[#F5F8FF] hover:text-[#2563EB]"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => handleNav('services')}
              className="text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-[#F5F8FF] hover:text-[#2563EB]"
            >
              Services
            </button>
            <button
              type="button"
              onClick={() => handleNav('home', 'about-section')}
              className="text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-[#F5F8FF] hover:text-[#2563EB]"
            >
              About Us
            </button>
            <button
              type="button"
              onClick={() => handleNav('home', 'contact-section')}
              className="text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-[#F5F8FF] hover:text-[#2563EB]"
            >
              Contact
            </button>

            {currentUser?.role === 'user' && (
              <button
                type="button"
                onClick={() => handleNav('user-dashboard')}
                className="text-left px-3 py-2 rounded-lg text-sm font-medium text-[#2563EB] bg-[#F5F8FF]"
              >
                User Dashboard
              </button>
            )}
            {currentUser?.role === 'admin' && (
              <button
                type="button"
                onClick={() => handleNav('admin-dashboard')}
                className="text-left px-3 py-2 rounded-lg text-sm font-medium text-[#1E3A8A] bg-[#F5F8FF]"
              >
                Admin Dashboard
              </button>
            )}

            <div className="pt-2 mt-1 border-t border-slate-200 grid grid-cols-2 gap-2">
              {currentUser ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="col-span-2 px-4 py-2 text-sm font-medium text-[#2563EB] bg-[#F5F8FF] border border-blue-200 rounded-lg"
                >
                  Logout ({currentUser.name})
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => handleNav('login')}
                    className="px-4 py-2 text-sm font-medium text-[#2563EB] border border-blue-200 rounded-lg"
                  >
                    User Login
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNav('signup')}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#2563EB] rounded-lg"
                  >
                    User Signup
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNav('admin-login')}
                    className="px-4 py-2 text-sm font-medium text-[#1E3A8A] bg-slate-100 rounded-lg"
                  >
                    Admin Login
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNav('admin-signup')}
                    className="px-4 py-2 text-sm font-medium text-[#1E3A8A] border border-slate-300 rounded-lg"
                  >
                    Admin Signup
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
