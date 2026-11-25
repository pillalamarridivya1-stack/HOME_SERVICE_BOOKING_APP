import { CheckCircle2, Clock, Star, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ServiceDetailModal({ service, onClose, onBookNow }) {
  const { reviews } = useApp();

  if (!service) return null;

  const serviceReviews = reviews.filter((r) => r.serviceId === service.id);

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-[16/9] w-full bg-slate-100">
          <img
            src={service.image}
            alt={service.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            aria-label="Close service details"
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 rounded-lg bg-white/95 text-slate-700 hover:text-slate-900 flex items-center justify-center border border-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div>
              <p className="text-xs font-medium text-blue-700 mb-1">
                {service.category}
              </p>
              <h2 className="text-2xl font-bold text-slate-900">{service.name}</h2>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 block">Service Charge</span>
              <span className="text-2xl font-bold text-blue-700 font-mono-num">
                ₹{service.price}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>Estimated Duration: {service.duration}</span>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed mb-6">
            {service.description}
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              What Is Included
            </h3>
            <ul className="space-y-2">
              {service.included.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Reviews */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              Customer Reviews ({serviceReviews.length})
            </h3>
            {serviceReviews.length === 0 ? (
              <p className="text-sm text-slate-500">
                No reviews yet for this service. Book and share your experience!
              </p>
            ) : (
              <div className="space-y-3">
                {serviceReviews.map((review) => (
                  <div
                    key={review.id}
                    className="border border-slate-200 rounded-lg p-3.5 bg-white"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-sm font-semibold text-slate-900">
                        {review.customerName}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 tabular-nums">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        {review.rating}/5
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onBookNow(service);
              }}
              className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer"
            >
              Book Now — ₹{service.price}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
