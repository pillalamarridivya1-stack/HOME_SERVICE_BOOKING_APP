import { useState } from 'react';
import {
  CalendarCheck,
  CreditCard,
  LayoutDashboard,
  PlusCircle,
  Search,
  Star,
  Wrench
} from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import Sidebar from '../components/Sidebar';
import { useApp } from '../context/AppContext';
import Booking from './Booking';

const USER_TABS = [
  { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
  { id: 'browse', label: 'Browse Services', icon: Wrench },
  { id: 'book', label: 'Book a Service', icon: PlusCircle },
  { id: 'bookings', label: 'My Bookings', icon: CalendarCheck },
  { id: 'payments', label: 'Payment Details', icon: CreditCard },
  { id: 'reviews', label: 'My Reviews', icon: Star }
];

export default function UserDashboard({
  onNavigate,
  onViewDetails,
  initialTab = 'overview',
  selectedServiceId
}) {
  const {
    currentUser,
    services,
    bookings,
    payments,
    reviews,
    cancelUserBooking,
    submitReview,
    logout
  } = useApp();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [bookingServiceId, setBookingServiceId] = useState(
    selectedServiceId || services[0]?.id
  );
  const [serviceSearch, setServiceSearch] = useState('');

  // Review modal state
  const [reviewBooking, setReviewBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');

  const myBookings = bookings.filter((b) => b.userId === currentUser.id);
  const myPayments = payments.filter((p) => p.userId === currentUser.id);
  const myReviews = reviews.filter((r) => r.userId === currentUser.id);

  const pendingCount = myBookings.filter((b) => b.status === 'Pending').length;
  const completedCount = myBookings.filter((b) => b.status === 'Completed').length;
  const cancelledCount = myBookings.filter((b) => b.status === 'Cancelled').length;

  const filteredServices = services.filter((s) => {
    const q = serviceSearch.trim().toLowerCase();
    return (
      q === '' ||
      s.name.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.shortDescription.toLowerCase().includes(q)
    );
  });

  function hasReviewed(bookingId) {
    return myReviews.some((r) => r.bookingId === bookingId);
  }

  function openReviewForm(booking) {
    setReviewBooking(booking);
    setRating(5);
    setComment('');
    setReviewError('');
  }

  function handleReviewSubmit(e) {
    e.preventDefault();
    setReviewError('');
    if (!comment.trim()) {
      setReviewError('Please write a short review comment.');
      return;
    }

    const res = submitReview({
      bookingId: reviewBooking.id,
      rating,
      comment
    });

    if (!res.success) {
      setReviewError(res.message);
      return;
    }

    setReviewBooking(null);
    setActiveTab('reviews');
  }

  function handleBookFromDashboard(service) {
    setBookingServiceId(service.id);
    setActiveTab('book');
  }

  function handleLogout() {
    logout();
    onNavigate('home');
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <Sidebar
          roleLabel="Customer Account"
          userName={currentUser.name}
          userEmail={currentUser.email}
          tabs={USER_TABS}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onLogout={handleLogout}
        />

        <main className="flex-1 w-full min-w-0">
          {/* 1. Dashboard Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h1 className="text-2xl font-bold text-[#1F2937] mb-1">
                  Welcome, {currentUser.name}
                </h1>
                <p className="text-sm text-slate-600">
                  Manage your home service bookings, view payment details, and submit reviews.
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <p className="text-xs text-slate-500 mb-1">Total Bookings</p>
                  <p className="text-2xl font-bold text-[#1F2937] font-mono-num">
                    {myBookings.length}
                  </p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <p className="text-xs text-slate-500 mb-1">Pending Bookings</p>
                  <p className="text-2xl font-bold text-amber-600 font-mono-num">
                    {pendingCount}
                  </p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <p className="text-xs text-slate-500 mb-1">Completed Bookings</p>
                  <p className="text-2xl font-bold text-emerald-600 font-mono-num">
                    {completedCount}
                  </p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <p className="text-xs text-slate-500 mb-1">Cancelled Bookings</p>
                  <p className="text-2xl font-bold text-red-600 font-mono-num">
                    {cancelledCount}
                  </p>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <h2 className="text-lg font-semibold text-[#1F2937]">Recent Bookings</h2>
                  <button
                    type="button"
                    onClick={() => setActiveTab('book')}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#2563EB] rounded-lg hover:bg-[#1E3A8A] cursor-pointer"
                  >
                    + Book a Service
                  </button>
                </div>

                {myBookings.length === 0 ? (
                  <p className="text-sm text-slate-500 py-4">
                    You have no bookings yet. Click &ldquo;+ Book a Service&rdquo; to schedule your
                    first service.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-[#F5F8FF] text-slate-700 border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-3 font-semibold">Booking ID</th>
                          <th className="py-2.5 px-3 font-semibold">Service</th>
                          <th className="py-2.5 px-3 font-semibold">Date &amp; Slot</th>
                          <th className="py-2.5 px-3 font-semibold">Price</th>
                          <th className="py-2.5 px-3 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {myBookings.slice(0, 5).map((b) => (
                          <tr key={b.id} className="hover:bg-slate-50">
                            <td className="py-3 px-3 font-mono-num font-medium text-[#2563EB]">
                              {b.id}
                            </td>
                            <td className="py-3 px-3 font-medium text-[#1F2937]">
                              {b.serviceName}
                            </td>
                            <td className="py-3 px-3 text-slate-600 font-mono-num">
                              {b.date} · {b.timeSlot}
                            </td>
                            <td className="py-3 px-3 font-mono-num text-[#1F2937]">₹{b.price}</td>
                            <td className="py-3 px-3">{renderStatusBadge(b.status)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2. Browse Services */}
          {activeTab === 'browse' && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold text-[#1F2937]">Browse Home Services</h1>
                  <p className="text-sm text-slate-600">
                    Pick a service to view details or book directly.
                  </p>
                </div>
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={serviceSearch}
                    onChange={(e) => setServiceSearch(e.target.value)}
                    placeholder="Search services..."
                    className="w-full pl-9 pr-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredServices.map((srv) => (
                  <ServiceCard
                    key={srv.id}
                    service={srv}
                    onViewDetails={onViewDetails}
                    onBookNow={handleBookFromDashboard}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 3. Book a Service */}
          {activeTab === 'book' && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <h1 className="text-xl font-bold text-[#1F2937]">Book a Service</h1>
                <p className="text-sm text-slate-600">
                  Fill out the schedule and payment details below.
                </p>
              </div>
              <Booking
                embedded
                selectedServiceId={bookingServiceId}
                onNavigate={onNavigate}
                onBookingComplete={() => setActiveTab('bookings')}
              />
            </div>
          )}

          {/* 4. My Bookings */}
          {activeTab === 'bookings' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                <div>
                  <h1 className="text-xl font-bold text-[#1F2937]">My Bookings</h1>
                  <p className="text-sm text-slate-600">
                    Cancel pending bookings or submit ratings after service completion.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('book')}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#2563EB] rounded-lg hover:bg-[#1E3A8A] cursor-pointer"
                >
                  + Book Service
                </button>
              </div>

              {myBookings.length === 0 ? (
                <div className="py-10 text-center text-slate-500 text-sm">
                  No bookings found yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-[#F5F8FF] text-slate-700 border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-3 font-semibold">Booking ID</th>
                        <th className="py-3 px-3 font-semibold">Service Name</th>
                        <th className="py-3 px-3 font-semibold">Booking Date</th>
                        <th className="py-3 px-3 font-semibold">Time Slot</th>
                        <th className="py-3 px-3 font-semibold">Price</th>
                        <th className="py-3 px-3 font-semibold">Payment Method</th>
                        <th className="py-3 px-3 font-semibold">Payment Status</th>
                        <th className="py-3 px-3 font-semibold">Booking Status</th>
                        <th className="py-3 px-3 font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {myBookings.map((b) => {
                        const reviewed = hasReviewed(b.id);
                        return (
                          <tr key={b.id} className="hover:bg-slate-50">
                            <td className="py-3 px-3 font-mono-num font-semibold text-[#2563EB]">
                              {b.id}
                            </td>
                            <td className="py-3 px-3 font-medium text-[#1F2937]">
                              {b.serviceName}
                            </td>
                            <td className="py-3 px-3 font-mono-num text-slate-600">{b.date}</td>
                            <td className="py-3 px-3 font-mono-num text-slate-600 whitespace-nowrap">
                              {b.timeSlot}
                            </td>
                            <td className="py-3 px-3 font-mono-num text-[#1F2937]">₹{b.price}</td>
                            <td className="py-3 px-3 text-slate-800">{b.paymentMethod}</td>
                            <td className="py-3 px-3">
                              <span
                                className={`text-xs font-semibold ${
                                  b.paymentStatus === 'Paid'
                                    ? 'text-emerald-700'
                                    : 'text-amber-700'
                                }`}
                              >
                                {b.paymentStatus}
                              </span>
                            </td>
                            <td className="py-3 px-3">{renderStatusBadge(b.status)}</td>
                            <td className="py-3 px-3 whitespace-nowrap">
                              {b.status === 'Pending' && (
                                <button
                                  type="button"
                                  onClick={() => cancelUserBooking(b.id)}
                                  className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 cursor-pointer"
                                >
                                  Cancel Booking
                                </button>
                              )}
                              {b.status === 'Completed' && !reviewed && (
                                <button
                                  type="button"
                                  onClick={() => openReviewForm(b)}
                                  className="px-3 py-1.5 text-xs font-medium text-[#2563EB] bg-[#F5F8FF] border border-blue-200 rounded-lg hover:bg-blue-100 cursor-pointer"
                                >
                                  Give Feedback
                                </button>
                              )}
                              {b.status === 'Completed' && reviewed && (
                                <span className="text-xs text-emerald-700 font-medium">
                                  Reviewed
                                </span>
                              )}
                              {b.status === 'Cancelled' && (
                                <span className="text-xs text-slate-400">No actions</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* 5. Payment Details */}
          {activeTab === 'payments' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h1 className="text-xl font-bold text-[#1F2937] mb-1">Payment Details</h1>
              <p className="text-sm text-slate-600 mb-5">
                Payment records linked to your service bookings.
              </p>

              {myPayments.length === 0 ? (
                <p className="text-sm text-slate-500 py-8 text-center">
                  No payment records available yet.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-[#F5F8FF] text-slate-700 border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-3 font-semibold">Booking ID</th>
                        <th className="py-3 px-3 font-semibold">Service</th>
                        <th className="py-3 px-3 font-semibold">Amount</th>
                        <th className="py-3 px-3 font-semibold">Payment Method</th>
                        <th className="py-3 px-3 font-semibold">Payment Status</th>
                        <th className="py-3 px-3 font-semibold">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {myPayments.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="py-3 px-3 font-mono-num font-semibold text-[#2563EB]">
                            {p.bookingId}
                          </td>
                          <td className="py-3 px-3 text-[#1F2937]">{p.serviceName}</td>
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
                            {new Date(p.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* 6. My Reviews */}
          {activeTab === 'reviews' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h1 className="text-xl font-bold text-[#1F2937] mb-1">My Reviews</h1>
              <p className="text-sm text-slate-600 mb-5">
                Ratings and feedback you submitted after service completion.
              </p>

              {myReviews.length === 0 ? (
                <div className="py-8 text-center text-sm text-slate-500">
                  You have not submitted any reviews yet. Once a booking is marked Completed by the
                  admin, you can rate it from &ldquo;My Bookings&rdquo;.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="border border-slate-200 rounded-lg p-4 bg-[#F5F8FF]"
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div>
                          <h3 className="text-sm font-bold text-[#1F2937]">{rev.serviceName}</h3>
                          <p className="text-xs text-slate-500 font-mono-num">
                            Booking: {rev.bookingId}
                          </p>
                        </div>
                        <div className="flex items-center gap-0.5">
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
                        Submitted on {new Date(rev.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Review Submission Modal */}
      {reviewBooking && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4"
          onClick={() => setReviewBooking(null)}
        >
          <div
            className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-[#1F2937] mb-1">Rate Your Service</h2>
            <p className="text-sm text-slate-600 mb-4">
              {reviewBooking.serviceName} · Booking{' '}
              <span className="font-mono-num">{reviewBooking.id}</span>
            </p>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select Rating (1 to 5 Stars)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setRating(num)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          num <= rating
                            ? 'fill-amber-500 text-amber-500'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm font-semibold text-slate-700 font-mono-num">
                    {rating}/5
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Feedback Comment
                </label>
                <textarea
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share how the service went..."
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              {reviewError && <p className="text-sm text-red-600">{reviewError}</p>}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewBooking(null)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold text-white bg-[#2563EB] rounded-lg hover:bg-[#1E3A8A] cursor-pointer"
                >
                  Submit Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
