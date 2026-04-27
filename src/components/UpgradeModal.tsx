import { X, Crown, CheckCircle, CreditCard } from 'lucide-react';
import { useApp } from '../store';
import { Button } from './ui/Button';

export function UpgradeModal() {
  const { showUpgradeModal, setShowUpgradeModal, upgradeToPro } = useApp();

  if (!showUpgradeModal) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowUpgradeModal(false)} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white relative">
          <button onClick={() => setShowUpgradeModal(false)} className="absolute top-4 right-4 p-1 text-white/60 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Upgrade to Pro</h2>
              <p className="text-blue-200 text-sm">Unlimited CVs and all premium features</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="text-center mb-6">
            <span className="text-4xl font-extrabold text-gray-900">$9</span>
            <span className="text-gray-500">/mo</span>
          </div>

          <div className="space-y-3 mb-6">
            {[
              'Unlimited CV creation',
              'Unlimited cover letters',
              '5 Premium templates',
              'Watermark-free PDF',
              'Save & edit CVs',
              'Job-specific optimization',
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" /> {f}
              </div>
            ))}
          </div>

          <Button className="w-full" size="lg" onClick={upgradeToPro}>
            <CreditCard className="w-5 h-5" /> Upgrade to Pro Now
          </Button>
          <p className="text-xs text-gray-400 text-center mt-3">
            Demo: clicking the button activates Pro (no real payment)
          </p>
        </div>
      </div>
    </div>
  );
}
