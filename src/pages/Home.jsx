import { useState } from 'react';
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  CreditCard,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
  Wallet
} from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import { useApp } from '../context/AppContext';
import { HERO_IMAGE } from '../data/services';

export default function Home({ onNavigate, onViewDetails, onBookNow }) {
  const { services, reviews } = useApp();
  const [heroImgFailed, setHeroImgFailed] = useState(false);

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [contactError, setContactError] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  function handleContactSubmit(e) {
    e.preventDefault();
    setContactError('');

    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      setContactError('Please fill in your name, email, and message.');
      return;
    }
    if (!contactForm.email.includes('@')) {
      setContactError('Please enter a valid email address.');
      return;
    }

    setContactSubmitted(true);
    setContactForm({ name: '', email: '', message: '' });
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-center">
              <p className="text-sm font-semibold text-[#2563EB] mb-3">
                Trusted Residential Maintenance
              </p>
              <h1
                className="font-bold text-[#1F2937] tracking-tight leading-tight mb-5"
                style={{ fontSize: 'clamp(2.25rem, 4vw, 3.35rem)', textWrap: 'balance' }}
              >
                Your Home, Our Responsibility
              </h1>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-xl">
                Book trusted home services quickly and easily. From plumbing to electrical repairs,
                we make home maintenance simple.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('services')}
                  className="px-6 py-3 text-sm font-semibold text-white bg-[#2563EB] rounded-lg hover:bg-[#1E3A8A] transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore Services</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('booking')}
                  className="px-6 py-3 text-sm font-semibold text-[#2563EB] bg-[#F5F8FF] border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  Book a Service
                </button>
              </div>

              <div className="mt-10 pt-6 border-t border-slate-200 grid grid-cols-3 gap-4 max-w-lg">
                <div>
                  <p className="text-xl font-bold text-[#1E3A8A] font-mono-num">6</p>
                  <p className="text-xs text-slate-500">Home Services</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-[#1E3A8A] font-mono-num">4 Slots</p>
                  <p className="text-xs text-slate-500">Daily Windows</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-[#1E3A8A] font-mono-num">100%</p>
                  <p className="text-xs text-slate-500">Upfront Prices</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="h-full min-h-[280px] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                {!heroImgFailed ? (
                  <img
                    src={HERO_IMAGE}
                    alt="Clean modern home living room with technician service bag"
                    referrerPolicy="no-referrer"
                    onError={() => setHeroImgFailed(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#F5F8FF] flex items-center justify-center p-8 text-[#1E3A8A] font-semibold">
                    HomeServe — Your Home, Our Responsibility
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Services Section (All 6 Services) */}
      <section className="py-14 lg:py-16 bg-[#F5F8FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2937] mb-2">
                Popular Services
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                Choose from our six core household services with transparent fixed rates.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('services')}
              className="text-sm font-semibold text-[#2563EB] hover:text-[#1E3A8A] inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <span>Search &amp; Filter Services</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onViewDetails={onViewDetails}
                onBookNow={onBookNow}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-14 lg:py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-sm font-semibold text-[#2563EB] mb-2">How It Works</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2937]">
              Book a technician in four simple steps
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 bg-[#F5F8FF] border border-blue-100 rounded-xl">
              <p className="text-xs font-bold text-[#2563EB] font-mono-num mb-2">STEP 01</p>
              <h3 className="text-base font-bold text-[#1F2937] mb-1.5">Select Service</h3>
              <p className="text-sm text-slate-600">
                Browse plumbing, electrical, cleaning, AC, carpentry, or appliance repair with
                clear prices.
              </p>
            </div>

            <div className="p-5 bg-[#F5F8FF] border border-blue-100 rounded-xl">
              <p className="text-xs font-bold text-[#2563EB] font-mono-num mb-2">STEP 02</p>
              <h3 className="text-base font-bold text-[#1F2937] mb-1.5">Pick Date &amp; Slot</h3>
              <p className="text-sm text-slate-600">
                Choose a convenient date and one of our four daily 2-hour arrival time slots.
              </p>
            </div>

            <div className="p-5 bg-[#F5F8FF] border border-blue-100 rounded-xl">
              <p className="text-xs font-bold text-[#2563EB] font-mono-num mb-2">STEP 03</p>
              <h3 className="text-base font-bold text-[#1F2937] mb-1.5">Choose Payment</h3>
              <p className="text-sm text-slate-600">
                Select Cash on completion or confirm via our simulated Scan to Pay QR demo.
              </p>
            </div>

            <div className="p-5 bg-[#F5F8FF] border border-blue-100 rounded-xl">
              <p className="text-xs font-bold text-[#2563EB] font-mono-num mb-2">STEP 04</p>
              <h3 className="text-base font-bold text-[#1F2937] mb-1.5">Track &amp; Review</h3>
              <p className="text-sm text-slate-600">
                Track booking status in your dashboard and submit a 1–5 star rating after
                completion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us & Why Choose Us Section */}
      <section id="about-section" className="py-14 lg:py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5">
              <p className="text-sm font-semibold text-[#2563EB] mb-2">About Us</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2937] mb-4">
                Built to make household repairs simple and predictable.
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-4">
                HomeServe connects homeowners and tenants with experienced repair and cleaning
                professionals. Instead of calling multiple local numbers or negotiating unclear rates,
                you can pick a service, choose a convenient 2-hour window, and track everything from
                your dashboard.
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Whether you need urgent pipe leak repair or seasonal AC maintenance, our team keeps
                booking, payment, and feedback transparent from start to finish.
              </p>
            </div>

            <div className="lg:col-span-7">
              <h3 className="text-lg font-semibold text-[#1F2937] mb-4">Why Choose Us</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 bg-[#F5F8FF] border border-slate-200 rounded-xl">
                  <Wallet className="w-5 h-5 text-[#2563EB] mb-3" />
                  <h4 className="text-base font-semibold text-[#1F2937] mb-1.5">
                    Transparent Fixed Rates
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Every service lists a clear standard price before you book, with no hidden
                    surprise charges.
                  </p>
                </div>

                <div className="p-5 bg-[#F5F8FF] border border-slate-200 rounded-xl">
                  <CalendarClock className="w-5 h-5 text-[#2563EB] mb-3" />
                  <h4 className="text-base font-semibold text-[#1F2937] mb-1.5">
                    Convenient Time Slots
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Choose from four daily 2-hour arrival slots between 9:00 AM and 6:00 PM that fit
                    your schedule.
                  </p>
                </div>

                <div className="p-5 bg-[#F5F8FF] border border-slate-200 rounded-xl">
                  <ShieldCheck className="w-5 h-5 text-[#2563EB] mb-3" />
                  <h4 className="text-base font-semibold text-[#1F2937] mb-1.5">
                    Trackable Order Status
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Monitor pending, completed, or cancelled bookings anytime and leave verified
                    ratings after completion.
                  </p>
                </div>

                <div className="p-5 bg-[#F5F8FF] border border-slate-200 rounded-xl">
                  <CreditCard className="w-5 h-5 text-[#2563EB] mb-3" />
                  <h4 className="text-base font-semibold text-[#1F2937] mb-1.5">
                    Cash or Scan to Pay
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Pay via Cash after service completion or complete an instant Scan to Pay demo
                    confirmation during booking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-14 lg:py-16 bg-[#F5F8FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2937] mb-2">
              Customer Reviews
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Verified feedback submitted by customers after service completion.
            </p>
          </div>

          {reviews.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 text-sm">
              No customer reviews submitted yet. Complete a booking to leave the first review!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.slice(0, 6).map((review) => (
                <div
                  key={review.id}
                  className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-medium text-[#2563EB]">
                        {review.serviceName}
                      </span>
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star
                            key={idx}
                            className={`w-4 h-4 ${
                              idx < review.rating
                                ? 'fill-amber-500 text-amber-500'
                                : 'text-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed mb-4">
                      &ldquo;{review.comment}&rdquo;
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-[#1F2937]">{review.customerName}</span>
                    <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact-section" className="py-14 lg:py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5">
              <p className="text-sm font-semibold text-[#2563EB] mb-2">Contact Information</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2937] mb-3">
                Have a question before booking?
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
                Reach out to our support desk for help with custom service queries, rescheduling,
                or billing assistance.
              </p>

              <div className="space-y-4 text-sm text-slate-700">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-lg bg-[#F5F8FF] text-[#2563EB] flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </span>
                  <div>
                    <p className="font-semibold text-[#1F2937]">Phone Support</p>
                    <p className="text-slate-600">+91 98765 43210</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-lg bg-[#F5F8FF] text-[#2563EB] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </span>
                  <div>
                    <p className="font-semibold text-[#1F2937]">Email Address</p>
                    <p className="text-slate-600">support@homeserve.local</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-lg bg-[#F5F8FF] text-[#2563EB] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </span>
                  <div>
                    <p className="font-semibold text-[#1F2937]">Service Office</p>
                    <p className="text-slate-600">100 Feet Road, Indiranagar, Bengaluru</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="bg-[#F5F8FF] border border-slate-200 rounded-xl p-6 sm:p-8">
                {contactSubmitted ? (
                  <div className="py-6 text-center">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-[#1F2937] mb-1">
                      Message Received
                    </h3>
                    <p className="text-sm text-slate-600 mb-4">
                      Thank you for contacting HomeServe. Our support team will get back to you
                      shortly.
                    </p>
                    <button
                      type="button"
                      onClick={() => setContactSubmitted(false)}
                      className="px-4 py-2 text-sm font-medium text-[#2563EB] bg-white border border-blue-200 rounded-lg hover:bg-blue-50 cursor-pointer"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Your Name
                        </label>
                        <input
                          type="text"
                          value={contactForm.name}
                          onChange={(e) =>
                            setContactForm({ ...contactForm, name: e.target.value })
                          }
                          placeholder="Enter your full name"
                          className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#2563EB]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={contactForm.email}
                          onChange={(e) =>
                            setContactForm({ ...contactForm, email: e.target.value })
                          }
                          placeholder="you@example.com"
                          className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#2563EB]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Message
                      </label>
                      <textarea
                        rows={4}
                        value={contactForm.message}
                        onChange={(e) =>
                          setContactForm({ ...contactForm, message: e.target.value })
                        }
                        placeholder="How can we help you?"
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#2563EB]"
                      />
                    </div>

                    {contactError && <p className="text-sm text-red-600">{contactError}</p>}

                    <button
                      type="submit"
                      className="px-6 py-2.5 text-sm font-semibold text-white bg-[#2563EB] rounded-lg hover:bg-[#1E3A8A] transition-colors cursor-pointer"
                    >
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
