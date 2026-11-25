import { useState } from 'react';
import {
  CheckCircle2,
  ClipboardList,
  Clock,
  CreditCard,
  LayoutDashboard,
  MessageSquare,
  Search,
  Star,
  XCircle
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useApp } from '../context/AppContext';

const ADMIN_TABS = [
  { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
  { id: 'all', label: 'All Bookings', icon: ClipboardList },
  { id: 'pending', label: 'Pending Bookings', icon: Clock },
  { id: 'completed', label: 'Completed Bookings', icon: CheckCircle2 },
  { id: 'cancelled', label: 'Cancelled Bookings', icon: XCircle },
  { id: 'payments', label: 'Payment Records', icon: CreditCard },
  { id: 'feedback', label: 'Customer Feedback', icon: MessageSquare }
];

export default function AdminDashboard({ onNavigate }) {
  const {
    currentUser,
    users,
    services,
    bookings,
    payments,
    reviews,
    updateBookingStatus,
    markPaymentAsPaid,
    logout
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((b) => b.status === 'Pending');
  const completedBookings = bookings.filter((b) => b.status === 'Completed');
  const cancelledBookings = bookings.filter((b) => b.status === 'Cancelled');
  const totalPaymentsAmount = payments
    .filter((p) => p.status === 'Paid')
    .reduce((sum, p) => sum + p.amount, 0);

  // Service-wise booking summary
  const serviceStats = services.map((srv) => {
    const srvBookings = bookings.filter((b) => b.serviceId === srv.id);
    return {
      id: srv.id,
      name: srv.name,
      price: srv.price,
      total: srvBookings.length,
      pending: srvBookings.filter((b) => b.status === 'Pending').length,
      completed: srvBookings.filter((b) => b.status === 'Completed').length,
      cancelled: srvBookings.filter((b) => b.status === 'Cancelled').length
    };
  });

  function filterBookingsList(list) {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (b) =>
        b.id.toLowerCase().includes(q) ||
        b.customerName.toLowerCase().includes(q) ||
        b.serviceName.toLowerCase().includes(q) ||
        b.phone.toLowerCase().includes(q)
    );
  }

  function handleLogout() {
    logout();
    onNavigate('admin-login');
  }

  function renderStatusBadge(status) {
    if (status === 'Completed') {
      return (
        <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
          Completed
        </span>
      );
    }
    if (status === 'Cancelled') {
      return (
        <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded bg-red-50 text-red-700 border border-red-200">
          Cancelled
        </span>
      );
    }
    return (
      <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded bg-amber-50 text-amber-700 border border-amber-200">
        Pending
      </span>
    );
  }

  function renderBookingsTable(list, title, subtitle) {
    const rows = filterBookingsList(list);
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h1 className="text-xl font-bold text-[#1F2937]">{title}</h1>
            <p className="text-sm text-slate-600">{subtitle}</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ID, customer, service..."
              className="w-full pl-9 pr-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#2563EB]"
            />
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="py-10 text-center text-sm text-slate-500">
            No bookings found in this view.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#F5F8FF] text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3 font-semibold">Booking ID</th>
                  <th className="py-3 px-3 font-semibold">Customer &amp; Phone</th>
                  <th className="py-3 px-3 font-semibold">Service &amp; Price</th>
                  <th className="py-3 px-3 font-semibold">Date &amp; Time Slot</th>
                  <th className="py-3 px-3 font-semibold">Address</th>
                  <th className="py-3 px-3 font-semibold">Payment</th>
                  <th className="py-3 px-3 font-semibold">Booking Status</th>
                  <th className="py-3 px-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50 align-top">
                    <td className="py-3 px-3 font-mono-num font-semibold text-[#2563EB] whitespace-nowrap">
                      {b.id}
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-medium text-[#1F2937]">{b.customerName}</p>
                      <p className="text-xs text-slate-500 font-mono-num">{b.phone}</p>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <p className="font-medium text-[#1F2937]">{b.serviceName}</p>
                      <p className="text-xs text-slate-500 font-mono-num">₹{b.price}</p>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <p className="font-mono-num text-slate-800">{b.date}</p>
                      <p className="text-xs text-slate-500 font-mono-num">{b.timeSlot}</p>
                    </td>
                    <td className="py-3 px-3 text-xs text-slate-600 max-w-[200px]">
                      {b.address}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <p className="text-slate-800">{b.paymentMethod}</p>
                      <p
                        className={`text-xs font-semibold ${
                          b.paymentStatus === 'Paid' ? 'text-emerald-700' : 'text-amber-700'
                        }`}
                      >
                        {b.paymentStatus}
                      </p>
                    </td>
                    <td className="py-3 px-3">{renderStatusBadge(b.status)}</td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex flex-col gap-1.5">
                        {b.status === 'Pending' && (
                          <>
                            <button
                              type="button"
                              onClick={() => updateBookingStatus(b.id, 'Completed')}
                              className="px-2.5 py-1 text-xs font-semibold text-white bg-emerald-600 rounded hover:bg-emerald-700 cursor-pointer"
                            >
                              Mark as Completed
                            </button>
                            <button
                              type="button"
                              onClick={() => updateBookingStatus(b.id, 'Cancelled')}
                              className="px-2.5 py-1 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded hover:bg-red-100 cursor-pointer"
                            >
                              Cancel Booking
                            </button>
                          </>
                        )}
                        {b.paymentMethod === 'Cash' && b.paymentStatus === 'Pending' && (
                          <button
                            type="button"
                            onClick={() => markPaymentAsPaid(b.id)}
                            className="px-2.5 py-1 text-xs font-semibold text-[#2563EB] bg-[#F5F8FF] border border-blue-200 rounded hover:bg-blue-100 cursor-pointer"
                          >
                            Mark Cash Paid
                          </button>
                        )}
                        {b.status !== 'Pending' &&
                          !(b.paymentMethod === 'Cash' && b.paymentStatus === 'Pending') && (
                            <span className="text-xs text-slate-400">No actions</span>
                          )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <Sidebar
          roleLabel="Admin Panel"
          userName={currentUser.name}
          userEmail={currentUser.email}
          tabs={ADMIN_TABS}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onLogout={handleLogout}
          darkTheme
        />

        <main className="flex-1 w-full min-w-0">
          {/* 1. Dashboard Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h1 className="text-2xl font-bold text-[#1F2937] mb-1">Admin Dashboard</h1>
                <p className="text-sm text-slate-600">
                  Overview of registered users, bookings, payment collections, and customer
                  feedback.
                </p>
              </div>

              {/* 6 Overview Statistic Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <p className="text-xs text-slate-500 mb-1">Total Users</p>
                  <p className="text-2xl font-bold text-[#2563EB] font-mono-num">
                    {users.length}
                  </p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <p className="text-xs text-slate-500 mb-1">Total Bookings</p>
                  <p className="text-2xl font-bold text-[#1F2937] font-mono-num">
                    {totalBookings}
                  </p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <p className="text-xs text-slate-500 mb-1">Pending Bookings</p>
                  <p className="text-2xl font-bold text-amber-600 font-mono-num">
                    {pendingBookings.length}
                  </p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <p className="text-xs text-slate-500 mb-1">Completed Bookings</p>
                  <p className="text-2xl font-bold text-emerald-600 font-mono-num">
                    {completedBookings.length}
                  </p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <p className="text-xs text-slate-500 mb-1">Cancelled Bookings</p>
                  <p className="text-2xl font-bold text-red-600 font-mono-num">
                    {cancelledBookings.length}
                  </p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <p className="text-xs text-slate-500 mb-1">Total Payments</p>
                  <p className="text-2xl font-bold text-[#1E3A8A] font-mono-num">
                    ₹{totalPaymentsAmount} ({payments.length})
                  </p>
                </div>
              </div>

              {/* Service-Wise Booking Information */}
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-[#1F2937] mb-4">
                  Service-Wise Booking Information
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-[#F5F8FF] text-slate-700 border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3 font-semibold">Service Name</th>
                        <th className="py-2.5 px-3 font-semibold">Price</th>
                        <th className="py-2.5 px-3 font-semibold">Total Bookings</th>
                        <th className="py-2.5 px-3 font-semibold">Pending</th>
                        <th className="py-2.5 px-3 font-semibold">Completed</th>
                        <th className="py-2.5 px-3 font-semibold">Cancelled</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {serviceStats.map((srv) => (
                        <tr key={srv.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-medium text-[#1F2937]">{srv.name}</td>
                          <td className="py-2.5 px-3 font-mono-num text-slate-700">₹{srv.price}</td>
                          <td className="py-2.5 px-3 font-mono-num font-semibold text-[#1F2937]">
                            {srv.total}
                          </td>
                          <td className="py-2.5 px-3 font-mono-num text-amber-600">
                            {srv.pending}
                          </td>
                          <td className="py-2.5 px-3 font-mono-num text-emerald-600">
                            {srv.completed}
                          </td>
                          <td className="py-2.5 px-3 font-mono-num text-red-600">
                            {srv.cancelled}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 2. All Bookings */}
          {activeTab === 'all' &&
            renderBookingsTable(
              bookings,
              'All Bookings',
              'Manage pending bookings and update cash payment status.'
            )}

          {/* 3. Pending Bookings */}
          {activeTab === 'pending' &&
            renderBookingsTable(
              pendingBookings,
              'Pending Bookings',
              'Orders awaiting service completion or cancellation.'
            )}

          {/* 4. Completed Bookings */}
          {activeTab === 'completed' &&
            renderBookingsTable(
              completedBookings,
              'Completed Bookings',
              'All home services marked as completed.'
            )}

          {/* 5. Cancelled Bookings */}
          {activeTab === 'cancelled' &&
            renderBookingsTable(
              cancelledBookings,
              'Cancelled Bookings',
              'Bookings cancelled by customers or admin.'
            )}

          {/* 6. Payment Records */}
          {activeTab === 'payments' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h1 className="text-xl font-bold text-[#1F2937] mb-1">Payment Records</h1>
              <p className="text-sm text-slate-600 mb-5">
                Track Cash and Scan to Pay transactions. Mark pending Cash payments as Paid once
                collected.
              </p>

              {payments.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-500">
                  No payment records found.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-[#F5F8FF] text-slate-700 border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-3 font-semibold">Payment ID</th>
                        <th className="py-3 px-3 font-semibold">Booking ID</th>
                        <th className="py-3 px-3 font-semibold">Customer Name</th>
                        <th className="py-3 px-3 font-semibold">Service Name</th>
                        <th className="py-3 px-3 font-semibold">Amount</th>
                        <th className="py-3 px-3 font-semibold">Payment Method</th>
                        <th className="py-3 px-3 font-semibold">Payment Status</th>
                        <th className="py-3 px-3 font-semibold">Payment Date</th>
                        <th className="py-3 px-3 font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {payments.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="py-3 px-3 font-mono-num text-slate-700">{p.id}</td>
                          <td className="py-3 px-3 font-mono-num font-semibold text-[#2563EB]">
                            {p.bookingId}
                          </td>
                          <td className="py-3 px-3 text-[#1F2937]">{p.customerName}</td>
                          <td className="py-3 px-3 text-slate-700">{p.serviceName}</td>
                          <td className="py-3 px-3 font-mono-num font-semibold text-[#1F2937]">
                            ₹{p.amount}
                          </td>
                          <td className="py-3 px-3 text-slate-700">{p.method}</td>
                          <td className="py-3 px-3">
                            <span
                              className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded border ${
                                p.status === 'Paid'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-amber-50 text-amber-700 border-amber-200'
                              }`}
                            >
                              {p.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-500 font-mono-num">
                            {p.paidAt ? new Date(p.paidAt).toLocaleDateString() : '—'}
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            {p.status === 'Pending' ? (
                              <button
                                type="button"
                                onClick={() => markPaymentAsPaid(p.bookingId)}
                                className="px-3 py-1.5 text-xs font-semibold text-white bg-[#2563EB] rounded hover:bg-[#1E3A8A] cursor-pointer"
                              >
                                Mark as Paid
                              </button>
                            ) : (
                              <span className="text-xs text-emerald-700 font-medium">
                                Paid
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* 7. Customer Feedback */}
          {activeTab === 'feedback' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h1 className="text-xl font-bold text-[#1F2937] mb-1">Customer Feedback</h1>
              <p className="text-sm text-slate-600 mb-5">
                All ratings and comments submitted by customers for completed services.
              </p>

              {reviews.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-500">
                  No customer reviews submitted yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="border border-slate-200 rounded-lg p-4 bg-[#F5F8FF]"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <h3 className="text-sm font-bold text-[#1F2937]">
                            {rev.customerName}
                          </h3>
                          <p className="text-xs text-[#2563EB] font-medium">
                            {rev.serviceName} ·{' '}
                            <span className="font-mono-num">{rev.bookingId}</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-0.5 shrink-0">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < rev.rating
                                  ? 'fill-amber-500 text-amber-500'
                                  : 'text-slate-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-slate-700 mb-2">&ldquo;{rev.comment}&rdquo;</p>
                      <p className="text-xs text-slate-500">
                        Review Date: {new Date(rev.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
