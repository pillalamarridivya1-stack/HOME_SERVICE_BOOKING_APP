import { useEffect, useState } from 'react';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import ServiceDetailModal from './components/ServiceDetailModal';
import { AppProvider, useApp } from './context/AppContext';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import AdminSignup from './pages/AdminSignup';
import Booking from './pages/Booking';
import Home from './pages/Home';
import Login from './pages/Login';
import Services from './pages/Services';
import Signup from './pages/Signup';
import UserDashboard from './pages/UserDashboard';
import './App.css';

const VALID_PAGES = [
  'home',
  'services',
  'booking',
  'login',
  'signup',
  'admin-login',
  'admin-signup',
  'user-dashboard',
  'admin-dashboard'
];

function getPageFromHash() {
  const raw = window.location.hash.replace(/^#\/?/, '').trim();
  return VALID_PAGES.includes(raw) ? raw : 'home';
}

function AppContent() {
  const { currentUser } = useApp();
  const [currentPage, setCurrentPage] = useState(getPageFromHash);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [detailService, setDetailService] = useState(null);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState('');

  useEffect(() => {
    function handleHashChange() {
      setCurrentPage(getPageFromHash());
    }
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  function navigateTo(page, sectionId) {
    setCurrentPage(page);
    window.location.hash = page === 'home' ? '' : `#/${page}`;

    if (sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 60);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function handleBookNow(service) {
    setSelectedServiceId(service.id);
    if (!currentUser) {
      setRedirectAfterLogin('booking');
      navigateTo('login');
      return;
    }
    navigateTo('booking');
  }

  function renderPage() {
    switch (currentPage) {
      case 'services':
        return (
          <Services
            onViewDetails={(srv) => setDetailService(srv)}
            onBookNow={handleBookNow}
          />
        );
      case 'booking':
        return (
          <ProtectedRoute allowedRole="user" onNavigate={navigateTo}>
            <Booking selectedServiceId={selectedServiceId} onNavigate={navigateTo} />
          </ProtectedRoute>
        );
      case 'login':
        if (currentUser?.role === 'user') {
          return (
            <UserDashboard
              onNavigate={navigateTo}
              onViewDetails={(srv) => setDetailService(srv)}
              selectedServiceId={selectedServiceId}
            />
          );
        }
        if (currentUser?.role === 'admin') {
          return <AdminDashboard onNavigate={navigateTo} />;
        }
        return (
          <Login
            onNavigate={(target) => {
              setRedirectAfterLogin('');
              navigateTo(target);
            }}
            redirectAfterLogin={redirectAfterLogin}
          />
        );
      case 'signup':
        if (currentUser?.role === 'user') {
          return (
            <UserDashboard
              onNavigate={navigateTo}
              onViewDetails={(srv) => setDetailService(srv)}
              selectedServiceId={selectedServiceId}
            />
          );
        }
        if (currentUser?.role === 'admin') {
          return <AdminDashboard onNavigate={navigateTo} />;
        }
        return <Signup onNavigate={navigateTo} />;
      case 'admin-login':
        if (currentUser?.role === 'admin') {
          return <AdminDashboard onNavigate={navigateTo} />;
        }
        if (currentUser?.role === 'user') {
          return (
            <ProtectedRoute allowedRole="admin" onNavigate={navigateTo}>
              <AdminDashboard onNavigate={navigateTo} />
            </ProtectedRoute>
          );
        }
        return <AdminLogin onNavigate={navigateTo} />;
      case 'admin-signup':
        if (currentUser?.role === 'admin') {
          return <AdminDashboard onNavigate={navigateTo} />;
        }
        if (currentUser?.role === 'user') {
          return (
            <ProtectedRoute allowedRole="admin" onNavigate={navigateTo}>
              <AdminDashboard onNavigate={navigateTo} />
            </ProtectedRoute>
          );
        }
        return <AdminSignup onNavigate={navigateTo} />;
      case 'user-dashboard':
        return (
          <ProtectedRoute allowedRole="user" onNavigate={navigateTo}>
            <UserDashboard
              onNavigate={navigateTo}
              onViewDetails={(srv) => setDetailService(srv)}
              selectedServiceId={selectedServiceId}
            />
          </ProtectedRoute>
        );
      case 'admin-dashboard':
        return (
          <ProtectedRoute allowedRole="admin" onNavigate={navigateTo}>
            <AdminDashboard onNavigate={navigateTo} />
          </ProtectedRoute>
        );
      case 'home':
      default:
        return (
          <Home
            onNavigate={navigateTo}
            onViewDetails={(srv) => setDetailService(srv)}
            onBookNow={handleBookNow}
          />
        );
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8FF] text-[#1F2937]">
      <Navbar currentPage={currentPage} onNavigate={navigateTo} />
      <main className="flex-1">{renderPage()}</main>
      <Footer onNavigate={navigateTo} />

      <ServiceDetailModal
        service={detailService}
        onClose={() => setDetailService(null)}
        onBookNow={handleBookNow}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
