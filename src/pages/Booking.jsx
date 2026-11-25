import { useEffect, useState } from 'react';
import { Calendar, CheckCircle2, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TIME_SLOTS } from '../data/services';
import Payment from './Payment';

export default function Booking({
  selectedServiceId,
  onNavigate,
  onBookingComplete,
  embedded = false
}) {
  const { services, currentUser, createBooking } = useApp();

  const today = new Date().toISOString().split('T')[0];

  const [serviceId, setServiceId] = useState(
    selectedServiceId || (services[0] ? services[0].id : '')
  );
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [date, setDate] = useState(today);
  const [timeSlot, setTimeSlot] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [isDemoPaid, setIsDemoPaid] = useState(false);
  const [error, setError] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  useEffect(() => {
    if (selectedServiceId) {
      setServiceId(selectedServiceId);
    }
  }, [selectedServiceId]);

  useEffect(() => {
    if (currentUser?.role === 'user') {
      setCustomerName((prev) => prev || currentUser.name);
      setPhone((prev) => prev || currentUser.phone || '');
    }
  }, [currentUser]);

  const selectedService = services.find((s) => s.id === serviceId) || services[0];

  function handlePaymentMethodChange(method) {
    setPaymentMethod(method);
    setIsDemoPaid(false);
    setError('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!customerName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!/^\d{10}$/.test(phone.trim())) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!date) {
      setError('Please select a booking date.');
      return;
    }
    if (!timeSlot) {
      setError('Please choose a preferred time slot.');
      return;
    }
    if (address.trim().length < 8) {
      setError('Please enter your complete service address.');
      return;
    }
    if (paymentMethod === 'Scan to Pay' && !isDemoPaid) {
      setError('Please click "Simulate Payment Confirmation" before submitting your booking.');
      return;
    }

    const result = createBooking({
      serviceId: selectedService.id,
      customerName,
      phone,
      date,
      timeSlot,
      address,
      paymentMethod,
      isQrPaid: isDemoPaid
    });

    if (!result.success) {
      setError(result.message);
      return;
    }

    setConfirmedBooking(result.booking);
  }

  function resetFormForNewBooking() {
    setConfirmedBooking(null);
    setTimeSlot('');
    setAddress('');
    setPaymentMethod('Cash');
    setIsDemoPaid(false);
    setError('');
  }

  if (confirmedBooking) {
    return (
      <div className={embedded ? '' : 'max-w-2xl mx-auto px-4 py-12'}>
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
          <div className="text-center mb-6">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-[#1F2937] mb-1">Booking Confirmed!</h2>
            <p className="text-sm text-slate-600">
              Your service booking is saved in Local Storage and appears immediately in both User
              and Admin dashboards.
            </p>
          </div>

          <div className="bg-[#F5F8FF] border border-blue-200 rounded-lg p-5 space-y-3 text-sm mb-6">
            <div className="flex justify-between gap-4">
              <span className="text-slate-600">Booking ID</span>
              <span className="font-bold text-[#2563EB] font-mono-num">
                {confirmedBooking.id}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-600">Service</span>
              <span className="font-semibold text-[#1F2937]">{confirmedBooking.serviceName}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-600">Customer Name</span>
              <span className="text-[#1F2937]">{confirmedBooking.customerName}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-600">Date &amp; Time Slot</span>
              <span className="text-[#1F2937] font-mono-num">
                {confirmedBooking.date} · {confirmedBooking.timeSlot}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-600">Service Address</span>
              <span className="text-[#1F2937] text-right max-w-xs">
                {confirmedBooking.address}
              </span>
            </div>
            <div className="flex justify-between gap-4 pt-2 border-t border-blue-200">
              <span className="text-slate-600">Amount</span>
              <span className="font-bold text-[#1F2937] font-mono-num">
                ₹{confirmedBooking.price}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-600">Payment Method</span>
              <span className="text-[#1F2937]">{confirmedBooking.paymentMethod}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-600">Payment Status</span>
              <span
                className={`font-semibold ${
                  confirmedBooking.paymentStatus === 'Paid'
                    ? 'text-emerald-700'
                    : 'text-amber-700'
                }`}
              >
                {confirmedBooking.paymentStatus}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-600">Booking Status</span>
              <span className="font-semibold text-[#2563EB]">{confirmedBooking.status}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => {
                if (onBookingComplete) {
                  onBookingComplete();
                } else {
                  onNavigate('user-dashboard');
                }
              }}
              className="flex-1 py-2.5 px-4 text-sm font-semibold text-white bg-[#2563EB] rounded-lg hover:bg-[#1E3A8A] cursor-pointer"
            >
              View My Bookings
            </button>
            <button
              type="button"
              onClick={resetFormForNewBooking}
              className="flex-1 py-2.5 px-4 text-sm font-semibold text-[#2563EB] bg-[#F5F8FF] border border-blue-200 rounded-lg hover:bg-blue-100 cursor-pointer"
            >
              Book Another Service
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={embedded ? '' : 'max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10'}>
      {!embedded && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1F2937] mb-2">Book a Home Service</h1>
          <p className="text-sm sm:text-base text-slate-600">
            Select your service, pick a date and 2-hour time slot, and choose your payment method.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 sm:p-7 space-y-5"
        >
          <h2 className="text-lg font-semibold text-[#1F2937] pb-3 border-b border-slate-100">
            Booking Form
          </h2>

          {/* Service & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Selected Service
              </label>
              <select
                value={selectedService.id}
                onChange={(e) => {
                  setServiceId(e.target.value);
                  setIsDemoPaid(false);
                }}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#2563EB]"
              >
                {services.map((srv) => (
                  <option key={srv.id} value={srv.id}>
                    {srv.name} (₹{srv.price})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Service Price
              </label>
              <div className="px-3.5 py-2.5 text-sm font-bold text-[#2563EB] bg-[#F5F8FF] border border-blue-200 rounded-lg font-mono-num">
                ₹{selectedService.price}
              </div>
            </div>
          </div>

          {/* Customer Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Customer Name
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter full name"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* Date & Time Slot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Booking Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="date"
                  min={today}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Preferred Time Slot
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#2563EB]"
                >
                  <option value="">-- Select a time slot --</option>
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Complete Address */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Complete Address
            </label>
            <textarea
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="House/Flat No., Street, Landmark, Area, City"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          {/* Payment Method via Payment Component */}
          <Payment
            amount={selectedService.price}
            paymentMethod={paymentMethod}
            isDemoPaid={isDemoPaid}
            onSelectMethod={handlePaymentMethodChange}
            onConfirmDemoPayment={() => {
              setIsDemoPaid(true);
              setError('');
            }}
          />

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-6 text-sm font-semibold text-white bg-[#2563EB] rounded-lg hover:bg-[#1E3A8A] transition-colors cursor-pointer"
          >
            Confirm Booking (₹{selectedService.price})
          </button>
        </form>

        {/* Service Preview */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="aspect-[4/3] bg-slate-100">
            <img
              src={selectedService.image}
              alt={selectedService.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-5">
            <p className="text-xs font-medium text-[#2563EB] mb-1">
              {selectedService.category} · {selectedService.duration}
            </p>
            <h3 className="text-lg font-bold text-[#1F2937] mb-2">{selectedService.name}</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              {selectedService.shortDescription}
            </p>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-sm text-slate-600">Total Charge</span>
              <span className="text-xl font-bold text-[#2563EB] font-mono-num">
                ₹{selectedService.price}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
