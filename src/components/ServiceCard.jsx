import { useState } from 'react';
import { Star, Wrench } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ServiceCard({ service, onViewDetails, onBookNow }) {
  const { getServiceAverageRating } = useApp();
  const [imgFailed, setImgFailed] = useState(false);
  const { average, count } = getServiceAverageRating(service.id);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col transition-shadow hover:shadow-md">
      {/* 4:3 Service Image with Fallback */}
      <div className="aspect-[4/3] w-full bg-slate-100 overflow-hidden relative">
        {!imgFailed ? (
          <img
            src={service.image}
            alt={service.name}
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-blue-50 flex flex-col items-center justify-center text-blue-700 p-4">
            <Wrench className="w-8 h-8 mb-2" />
            <span className="text-sm font-medium">{service.name}</span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-1.5">
          <span>
            {service.category} · {service.duration}
          </span>
          {average && (
            <span className="inline-flex items-center gap-1 text-slate-700 font-medium tabular-nums">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              {average} ({count})
            </span>
          )}
        </div>

        <h3 className="text-lg font-semibold text-slate-900 mb-2">{service.name}</h3>
        <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-2 flex-1">
          {service.shortDescription}
        </p>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-xs text-slate-500 block">Starting Price</span>
            <span className="text-xl font-bold text-blue-700 font-mono-num">
              ₹{service.price}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onViewDetails(service)}
              className="px-3 py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer"
            >
              Details
            </button>
            <button
              type="button"
              onClick={() => onBookNow(service)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
