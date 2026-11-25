import { CheckCircle2, CreditCard, QrCode, Wallet } from 'lucide-react';

export default function Payment({
  amount,
  paymentMethod,
  isDemoPaid,
  onSelectMethod,
  onConfirmDemoPayment
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        Payment Method
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onSelectMethod('Cash')}
          className={`p-3.5 rounded-lg border text-left flex items-start gap-3 transition-colors cursor-pointer ${
            paymentMethod === 'Cash'
              ? 'border-[#2563EB] bg-[#F5F8FF]'
              : 'border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Wallet
            className={`w-5 h-5 mt-0.5 shrink-0 ${
              paymentMethod === 'Cash' ? 'text-[#2563EB]' : 'text-slate-500'
            }`}
          />
          <div>
            <p className="text-sm font-semibold text-[#1F2937]">Cash</p>
            <p className="text-xs text-slate-500">
              Pay in cash after service. Initial payment status: Pending.
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onSelectMethod('Scan to Pay')}
          className={`p-3.5 rounded-lg border text-left flex items-start gap-3 transition-colors cursor-pointer ${
            paymentMethod === 'Scan to Pay'
              ? 'border-[#2563EB] bg-[#F5F8FF]'
              : 'border-slate-200 hover:bg-slate-50'
          }`}
        >
          <CreditCard
            className={`w-5 h-5 mt-0.5 shrink-0 ${
              paymentMethod === 'Scan to Pay' ? 'text-[#2563EB]' : 'text-slate-500'
            }`}
          />
          <div>
            <p className="text-sm font-semibold text-[#1F2937]">Scan to Pay</p>
            <p className="text-xs text-slate-500">
              Simulated QR code demo payment. Status updates to Paid.
            </p>
          </div>
        </button>
      </div>

      {paymentMethod === 'Scan to Pay' && (
        <div className="mt-3 p-4 bg-[#F5F8FF] border border-blue-200 rounded-xl">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            {/* Sample Demo QR Code */}
            <div className="bg-white p-3 rounded-lg border border-slate-200 shrink-0">
              <svg
                width="132"
                height="132"
                viewBox="0 0 132 132"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Demo Scan to Pay QR Code"
              >
                <rect width="132" height="132" fill="#FFFFFF" />
                <rect x="8" y="8" width="36" height="36" stroke="#1E3A8A" strokeWidth="6" />
                <rect x="18" y="18" width="16" height="16" fill="#1E3A8A" />
                <rect x="88" y="8" width="36" height="36" stroke="#1E3A8A" strokeWidth="6" />
                <rect x="98" y="18" width="16" height="16" fill="#1E3A8A" />
                <rect x="8" y="88" width="36" height="36" stroke="#1E3A8A" strokeWidth="6" />
                <rect x="18" y="98" width="16" height="16" fill="#1E3A8A" />
                <rect x="52" y="10" width="8" height="8" fill="#1F2937" />
                <rect x="66" y="10" width="10" height="8" fill="#1F2937" />
                <rect x="54" y="24" width="12" height="8" fill="#2563EB" />
                <rect x="70" y="26" width="8" height="12" fill="#1F2937" />
                <rect x="10" y="52" width="10" height="8" fill="#1F2937" />
                <rect x="26" y="52" width="12" height="10" fill="#1F2937" />
                <rect x="44" y="50" width="14" height="14" fill="#2563EB" />
                <rect x="64" y="50" width="10" height="10" fill="#1F2937" />
                <rect x="80" y="52" width="12" height="8" fill="#1F2937" />
                <rect x="100" y="52" width="18" height="8" fill="#1F2937" />
                <rect x="12" y="68" width="14" height="10" fill="#1F2937" />
                <rect x="34" y="68" width="8" height="12" fill="#2563EB" />
                <rect x="52" y="70" width="16" height="8" fill="#1F2937" />
                <rect x="74" y="66" width="10" height="14" fill="#1F2937" />
                <rect x="92" y="68" width="10" height="10" fill="#2563EB" />
                <rect x="108" y="66" width="12" height="12" fill="#1F2937" />
                <rect x="52" y="88" width="10" height="10" fill="#1F2937" />
                <rect x="68" y="88" width="12" height="8" fill="#2563EB" />
                <rect x="86" y="88" width="12" height="12" fill="#1F2937" />
                <rect x="106" y="88" width="14" height="8" fill="#1F2937" />
                <rect x="54" y="106" width="14" height="12" fill="#1F2937" />
                <rect x="76" y="104" width="10" height="14" fill="#1F2937" />
                <rect x="94" y="108" width="12" height="10" fill="#2563EB" />
                <rect x="112" y="104" width="8" height="14" fill="#1F2937" />
              </svg>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-sm font-semibold text-[#1F2937] mb-1">
                <QrCode className="w-4 h-4 text-[#2563EB]" />
                <span>Scan to Pay (Demo Payment Simulation)</span>
              </div>
              <p className="text-xs text-slate-600 mb-2">
                Note: This is a simulated demo payment for project demonstration only. No real UPI
                transaction takes place.
              </p>
              <p className="text-sm text-slate-700 mb-3">
                Service Amount:{' '}
                <span className="text-lg font-bold text-[#2563EB] font-mono-num">₹{amount}</span>
              </p>

              {isDemoPaid ? (
                <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Payment Successful</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onConfirmDemoPayment}
                  className="px-4 py-2 text-sm font-semibold text-white bg-[#2563EB] rounded-lg hover:bg-[#1E3A8A] transition-colors cursor-pointer"
                >
                  Simulate Payment Confirmation
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
