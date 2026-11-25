import { createContext, useContext, useEffect, useState } from 'react';
import { SERVICES } from '../data/services';

// Separate Local Storage keys for users, admins, session, bookings, payments, and reviews
const STORAGE_KEYS = {
  USERS: 'hs_users',
  ADMINS: 'hs_admins',
  SESSION: 'hs_session',
  BOOKINGS: 'hs_bookings',
  PAYMENTS: 'hs_payments',
  REVIEWS: 'hs_reviews'
};

export const ADMIN_ACCESS_CODE = 'ADMIN2026';

const DEFAULT_ADMIN = {
  id: 'admin-1',
  name: 'Admin Manager',
  email: 'admin@homeservices.com',
  phone: '9876543210',
  password: 'Admin123',
  role: 'admin',
  createdAt: '2026-01-10T09:00:00.000Z'
};

const DEMO_USERS = [
  {
    id: 'user-101',
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    phone: '9876501234',
    password: 'User123',
    role: 'user',
    createdAt: '2026-02-14T10:30:00.000Z'
  },
  {
    id: 'user-102',
    name: 'Ananya Verma',
    email: 'ananya@example.com',
    phone: '9845011223',
    password: 'User123',
    role: 'user',
    createdAt: '2026-03-02T14:15:00.000Z'
  }
];

const DEMO_BOOKINGS = [
  {
    id: 'BK-1001',
    userId: 'user-101',
    customerName: 'Rahul Sharma',
    phone: '9876501234',
    serviceId: 'srv-ac-repair',
    serviceName: 'AC Repair',
    price: 999,
    date: '2026-11-18',
    timeSlot: '11:00 AM - 1:00 PM',
    address: 'Flat 304, Green Park Residency, Indiranagar, Bengaluru',
    paymentMethod: 'Scan to Pay',
    paymentStatus: 'Paid',
    status: 'Completed',
    createdAt: '2026-11-16T08:40:00.000Z'
  },
  {
    id: 'BK-1002',
    userId: 'user-102',
    customerName: 'Ananya Verma',
    phone: '9845011223',
    serviceId: 'srv-plumbing',
    serviceName: 'Plumbing',
    price: 499,
    date: '2026-11-28',
    timeSlot: '9:00 AM - 11:00 AM',
    address: '14, Rose Garden Lane, Koramangala 4th Block, Bengaluru',
    paymentMethod: 'Cash',
    paymentStatus: 'Pending',
    status: 'Pending',
    createdAt: '2026-11-23T11:20:00.000Z'
  }
];

const DEMO_PAYMENTS = [
  {
    id: 'PAY-1001',
    bookingId: 'BK-1001',
    userId: 'user-101',
    customerName: 'Rahul Sharma',
    serviceName: 'AC Repair',
    amount: 999,
    method: 'Scan to Pay',
    status: 'Paid',
    paidAt: '2026-11-16T08:40:00.000Z',
    createdAt: '2026-11-16T08:40:00.000Z'
  },
  {
    id: 'PAY-1002',
    bookingId: 'BK-1002',
    userId: 'user-102',
    customerName: 'Ananya Verma',
    serviceName: 'Plumbing',
    amount: 499,
    method: 'Cash',
    status: 'Pending',
    paidAt: null,
    createdAt: '2026-11-23T11:20:00.000Z'
  }
];

const DEMO_REVIEWS = [
  {
    id: 'REV-1001',
    bookingId: 'BK-1001',
    userId: 'user-101',
    customerName: 'Rahul Sharma',
    serviceId: 'srv-ac-repair',
    serviceName: 'AC Repair',
    rating: 5,
    comment:
      'Technician arrived right on time at 11 AM, cleaned both indoor and outdoor coils properly, and cooling improved immediately.',
    createdAt: '2026-11-18T16:10:00.000Z'
  }
];

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

// Initialize Local Storage with default admin and demo records if empty
function initializeLocalStorage() {
  const existingUsers = readStorage(STORAGE_KEYS.USERS, null);
  if (!existingUsers || !Array.isArray(existingUsers)) {
    writeStorage(STORAGE_KEYS.USERS, DEMO_USERS);
  } else {
    // Keep only regular user accounts in hs_users
    const cleanedUsers = existingUsers.filter((u) => u.role !== 'admin');
    if (cleanedUsers.length !== existingUsers.length) {
      writeStorage(STORAGE_KEYS.USERS, cleanedUsers);
    }
  }

  const existingAdmins = readStorage(STORAGE_KEYS.ADMINS, null);
  if (!existingAdmins || !Array.isArray(existingAdmins) || existingAdmins.length === 0) {
    writeStorage(STORAGE_KEYS.ADMINS, [DEFAULT_ADMIN]);
  } else {
    const hasDefaultAdmin = existingAdmins.some(
      (a) => a.email.toLowerCase() === DEFAULT_ADMIN.email.toLowerCase()
    );
    if (!hasDefaultAdmin) {
      writeStorage(STORAGE_KEYS.ADMINS, [DEFAULT_ADMIN, ...existingAdmins]);
    }
  }

  if (localStorage.getItem(STORAGE_KEYS.BOOKINGS) === null) {
    writeStorage(STORAGE_KEYS.BOOKINGS, DEMO_BOOKINGS);
  }
  if (localStorage.getItem(STORAGE_KEYS.PAYMENTS) === null) {
    writeStorage(STORAGE_KEYS.PAYMENTS, DEMO_PAYMENTS);
  }
  if (localStorage.getItem(STORAGE_KEYS.REVIEWS) === null) {
    writeStorage(STORAGE_KEYS.REVIEWS, DEMO_REVIEWS);
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  initializeLocalStorage();

  const [users, setUsers] = useState(() => readStorage(STORAGE_KEYS.USERS, DEMO_USERS));
  const [admins, setAdmins] = useState(() => readStorage(STORAGE_KEYS.ADMINS, [DEFAULT_ADMIN]));
  const [currentUser, setCurrentUser] = useState(() => readStorage(STORAGE_KEYS.SESSION, null));
  const [bookings, setBookings] = useState(() => readStorage(STORAGE_KEYS.BOOKINGS, []));
  const [payments, setPayments] = useState(() => readStorage(STORAGE_KEYS.PAYMENTS, []));
  const [reviews, setReviews] = useState(() => readStorage(STORAGE_KEYS.REVIEWS, []));

  useEffect(() => {
    writeStorage(STORAGE_KEYS.USERS, users);
  }, [users]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.ADMINS, admins);
  }, [admins]);

  useEffect(() => {
    if (currentUser) {
      writeStorage(STORAGE_KEYS.SESSION, currentUser);
    } else {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    }
  }, [currentUser]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.BOOKINGS, bookings);
  }, [bookings]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.PAYMENTS, payments);
  }, [payments]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.REVIEWS, reviews);
  }, [reviews]);

  // Register a new customer account in hs_users
  function registerUser({ name, email, phone, password }) {
    const cleanEmail = email.trim().toLowerCase();
    const existsInUsers = users.some((u) => u.email.toLowerCase() === cleanEmail);
    const existsInAdmins = admins.some((a) => a.email.toLowerCase() === cleanEmail);

    if (existsInUsers || existsInAdmins) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser = {
      id: 'user-' + Date.now(),
      name: name.trim(),
      email: cleanEmail,
      phone: phone.trim(),
      password,
      role: 'user',
      createdAt: new Date().toISOString()
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    writeStorage(STORAGE_KEYS.USERS, updatedUsers);

    return { success: true, user: newUser };
  }

  // Register a new admin account in hs_admins
  function registerAdmin({ name, email, phone, password }) {
    const cleanEmail = email.trim().toLowerCase();
    const existsInAdmins = admins.some((a) => a.email.toLowerCase() === cleanEmail);
    const existsInUsers = users.some((u) => u.email.toLowerCase() === cleanEmail);

    if (existsInAdmins) {
      return { success: false, message: 'An admin account with this email already exists.' };
    }
    if (existsInUsers) {
      return { success: false, message: 'This email is already registered as a user account.' };
    }

    const newAdmin = {
      id: 'admin-' + Date.now(),
      name: name.trim(),
      email: cleanEmail,
      phone: phone.trim(),
      password,
      role: 'admin',
      createdAt: new Date().toISOString()
    };

    const updatedAdmins = [...admins, newAdmin];
    setAdmins(updatedAdmins);
    writeStorage(STORAGE_KEYS.ADMINS, updatedAdmins);

    return { success: true, admin: newAdmin };
  }

  // Login for regular customers only
  function loginUser(email, password) {
    const cleanEmail = email.trim().toLowerCase();
    const isAdminEmail = admins.some((a) => a.email.toLowerCase() === cleanEmail);

    if (isAdminEmail) {
      return {
        success: false,
        message: 'This is an Admin account. Please use the Admin Login page.'
      };
    }

    const matched = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!matched) {
      return { success: false, message: 'No user account found with this email.' };
    }
    if (matched.password !== password) {
      return { success: false, message: 'Incorrect password. Please try again.' };
    }

    const sessionData = {
      id: matched.id,
      name: matched.name,
      email: matched.email,
      phone: matched.phone,
      role: 'user'
    };
    setCurrentUser(sessionData);
    writeStorage(STORAGE_KEYS.SESSION, sessionData);
    return { success: true, user: sessionData };
  }

  // Login for admins only
  function loginAdmin(email, password) {
    const cleanEmail = email.trim().toLowerCase();
    const matched = admins.find((a) => a.email.toLowerCase() === cleanEmail);

    if (!matched) {
      return { success: false, message: 'No admin account found with this email.' };
    }
    if (matched.password !== password) {
      return { success: false, message: 'Incorrect admin password.' };
    }

    const sessionData = {
      id: matched.id,
      name: matched.name,
      email: matched.email,
      phone: matched.phone,
      role: 'admin'
    };
    setCurrentUser(sessionData);
    writeStorage(STORAGE_KEYS.SESSION, sessionData);
    return { success: true, user: sessionData };
  }

  // Logout clears only hs_session and keeps all stored records
  function logout() {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  }

  // Create a new booking and its linked payment record
  function createBooking({
    serviceId,
    customerName,
    phone,
    date,
    timeSlot,
    address,
    paymentMethod,
    isQrPaid
  }) {
    if (!currentUser || currentUser.role !== 'user') {
      return { success: false, message: 'Please log in as a user to book a service.' };
    }

    const service = SERVICES.find((s) => s.id === serviceId);
    if (!service) {
      return { success: false, message: 'Selected service was not found.' };
    }

    const bookingId = 'BK-' + (1001 + bookings.length);
    const paymentId = 'PAY-' + (1001 + payments.length);
    const nowIso = new Date().toISOString();

    const paymentStatus = paymentMethod === 'Scan to Pay' && isQrPaid ? 'Paid' : 'Pending';

    const newBooking = {
      id: bookingId,
      userId: currentUser.id,
      customerName: customerName.trim(),
      phone: phone.trim(),
      serviceId: service.id,
      serviceName: service.name,
      price: service.price,
      date,
      timeSlot,
      address: address.trim(),
      paymentMethod,
      paymentStatus,
      status: 'Pending',
      createdAt: nowIso
    };

    const newPayment = {
      id: paymentId,
      bookingId,
      userId: currentUser.id,
      customerName: customerName.trim(),
      serviceName: service.name,
      amount: service.price,
      method: paymentMethod,
      status: paymentStatus,
      paidAt: paymentStatus === 'Paid' ? nowIso : null,
      createdAt: nowIso
    };

    const updatedBookings = [newBooking, ...bookings];
    const updatedPayments = [newPayment, ...payments];

    setBookings(updatedBookings);
    setPayments(updatedPayments);
    writeStorage(STORAGE_KEYS.BOOKINGS, updatedBookings);
    writeStorage(STORAGE_KEYS.PAYMENTS, updatedPayments);

    return { success: true, booking: newBooking, payment: newPayment };
  }

  // Customer cancels own pending booking
  function cancelUserBooking(bookingId) {
    if (!currentUser || currentUser.role !== 'user') return;
    const updatedBookings = bookings.map((b) => {
      if (b.id === bookingId && b.userId === currentUser.id && b.status === 'Pending') {
        return { ...b, status: 'Cancelled' };
      }
      return b;
    });
    setBookings(updatedBookings);
    writeStorage(STORAGE_KEYS.BOOKINGS, updatedBookings);
  }

  // Admin updates booking status (only Pending -> Completed or Cancelled)
  function updateBookingStatus(bookingId, newStatus) {
    if (!currentUser || currentUser.role !== 'admin') return;
    const updatedBookings = bookings.map((b) => {
      if (b.id === bookingId && b.status === 'Pending') {
        return { ...b, status: newStatus };
      }
      return b;
    });
    setBookings(updatedBookings);
    writeStorage(STORAGE_KEYS.BOOKINGS, updatedBookings);
  }

  // Admin updates Cash payment status to Paid
  function markPaymentAsPaid(bookingId) {
    if (!currentUser || currentUser.role !== 'admin') return;
    const nowIso = new Date().toISOString();

    const updatedPayments = payments.map((p) => {
      if (p.bookingId === bookingId && p.status === 'Pending') {
        return { ...p, status: 'Paid', paidAt: nowIso };
      }
      return p;
    });

    const updatedBookings = bookings.map((b) => {
      if (b.id === bookingId && b.paymentStatus === 'Pending') {
        return { ...b, paymentStatus: 'Paid' };
      }
      return b;
    });

    setPayments(updatedPayments);
    setBookings(updatedBookings);
    writeStorage(STORAGE_KEYS.PAYMENTS, updatedPayments);
    writeStorage(STORAGE_KEYS.BOOKINGS, updatedBookings);
  }

  // Customer submits rating and feedback for a completed booking (prevents duplicates)
  function submitReview({ bookingId, rating, comment }) {
    if (!currentUser || currentUser.role !== 'user') {
      return { success: false, message: 'Only logged-in customers can submit reviews.' };
    }

    const booking = bookings.find(
      (b) => b.id === bookingId && b.userId === currentUser.id
    );
    if (!booking) {
      return { success: false, message: 'Booking not found.' };
    }
    if (booking.status !== 'Completed') {
      return { success: false, message: 'You can review a service only after it is Completed.' };
    }

    const alreadyReviewed = reviews.some((r) => r.bookingId === bookingId);
    if (alreadyReviewed) {
      return { success: false, message: 'You have already submitted a review for this booking.' };
    }

    const newReview = {
      id: 'REV-' + (1001 + reviews.length),
      bookingId: booking.id,
      userId: currentUser.id,
      customerName: booking.customerName,
      serviceId: booking.serviceId,
      serviceName: booking.serviceName,
      rating: Number(rating),
      comment: comment.trim(),
      createdAt: new Date().toISOString()
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    writeStorage(STORAGE_KEYS.REVIEWS, updatedReviews);
    return { success: true, review: newReview };
  }

  function getServiceAverageRating(serviceId) {
    const serviceReviews = reviews.filter((r) => r.serviceId === serviceId);
    if (serviceReviews.length === 0) return { average: null, count: 0 };
    const total = serviceReviews.reduce((sum, r) => sum + r.rating, 0);
    return {
      average: (total / serviceReviews.length).toFixed(1),
      count: serviceReviews.length
    };
  }

  const value = {
    services: SERVICES,
    users,
    admins,
    currentUser,
    bookings,
    payments,
    reviews,
    registerUser,
    registerAdmin,
    loginUser,
    loginAdmin,
    logout,
    createBooking,
    cancelUserBooking,
    updateBookingStatus,
    markPaymentAsPaid,
    submitReview,
    getServiceAverageRating
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used inside AppProvider');
  }
  return ctx;
}
