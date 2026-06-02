import { useState } from 'react';
import { CheckCircle, X as XIcon, Crown, Sparkles, Zap, Shield, Users, ChevronDown, ChevronUp, ArrowRight, Star } from 'lucide-react';
import { useApp } from '../store';

export function PricingPage() {
  const { user, setShowAuthModal, setShowUpgradeModal, setCurrentPage, t } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');

  const handleFree = () => {
    if (user.isLoggedIn) setCurrentPage('app');
    else setShowAuthModal(true);
  };

  const handlePro = () => {
    if (!user.isLoggedIn) { setShowAuthModal(true); return; }
    setShowUpgradeModal(true);
  };

  const yearlyPrice = 7;
  const monthlyPrice = 9;

  const faqs = [
    { q: t('pp.faq.q1'), a: t('pp.faq.a1') },
    { q: t('pp.faq.q2'), a: t('pp.faq.a2') },
    { q: t('pp.faq.q3'), a: t('pp.faq.a3') },
    { q: t('pp.faq.q4'), a: t('pp.faq.a4') },
    { q: t('pp.faq.q5'), a: t('pp.faq.a5') },
    { q: t('pp.faq.q6'), a: t('pp.faq.a6') },
  ];

  const testimonials = [
    { name: 'Sarah M.', role: 'Software Engineer', company: 'Stripe', text: 'I had my CV ready in 10 minutes and got an interview in 3 days. What an amazing tool!', stars: 5, avatar: 'SM', color: 'bg-blue-600' },
    { name: 'James K.', role: 'Marketing Specialist', company: 'HubSpot', text: 'The job-specific cover letter feature is incredible. Personalized content for every application.', stars: 5, avatar: 'JK', color: 'bg-emerald-600' },
    { name: 'Emily R.', role: 'Financial Analyst', company: 'Goldman Sachs', text: 'After upgrading to Pro I can save all my CVs. Super convenient!', stars: 5, avatar: 'ER', color: 'bg-violet-600' },
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <div className="bg-slate-950 pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '40px 40px' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            {t('pp.badge')}
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-4">
            {t('pp.title').split('Your Career').length > 1 ? (
              <>{t('pp.title').split('Your Career')[0]}<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Your Career</span></>
            ) : t('pp.title')}
          </h1>
          <p className="text-lg text-slate-400 max-w-xl mx-auto mb-10">{t('pp.desc')}</p>
          <div className="inline-flex items-center gap-4 bg-slate-800 rounded-xl p-1.5">
            <button onClick={() => setBilling('monthly')} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${billing === 'monthly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'}`}>
              {t('pp.monthly')}
            </button>
            <button onClick={() => setBilling('yearly')} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${billing === 'yearly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'}`}>
              {t('pp.yearly')}
              <span className="bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">20% Off</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-5xl mx-auto px-4 -mt-8 pb-20">
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">

          {/* Free Card */}
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 hover:border-slate-300 hover:shadow-lg transition-all duration-300 relative">
            <div className="mb-6">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-5 h-5 text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">{t('pp.freeTitle')}</h3>
              <p className="text-slate-500 text-sm mt-1">{t('pp.freeSubtitle')}</p>
            </div>
            <div className="flex items-end gap-1 mb-6">
              <span className="text-5xl font-extrabold text-slate-900">$0</span>
              <span className="text-slate-400 mb-2">/mo</span>
            </div>
            <button onClick={handleFree} className="w-full py-3 px-6 rounded-xl border-2 border-slate-200 text-slate-700 font-semibold hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 flex items-center justify-center gap-2 mb-8">
              {t('pp.getStartedFree')} <ArrowRight className="w-4 h-4" />
            </button>
            <div className="space-y-3.5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('pp.whatsIncluded')}</p>
              {[
                { text: t('pp.free.1'), ok: true },
                { text: t('pp.free.2'), ok: true },
                { text: t('pp.free.3'), ok: true },
                { text: t('pp.free.4'), ok: true },
                { text: t('pp.free.5'), ok: true },
                { text: t('pp.free.6'), ok: false },
                { text: t('pp.free.7'), ok: false },
                { text: t('pp.free.8'), ok: false },
                { text: t('pp.free.9'), ok: false },
                { text: t('pp.free.10'), ok: false },
              ].map((item, i) => (
                <div key={i} className={`flex items-center gap-3 text-sm ${item.ok ? 'text-slate-700' : 'text-slate-300'}`}>
                  {item.ok ? <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" /> : <XIcon className="w-4 h-4 text-slate-200 flex-shrink-0" />}
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          {/* Pro Card */}
          <div className="bg-slate-950 rounded-2xl p-8 relative overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-slate-800">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-violet-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl pointer-events-none" />
            <div className="absolute top-5 right-5 bg-gradient-to-r from-amber-400 to-orange-400 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
              <Crown className="w-3 h-3" /> {t('pp.recommended')}
            </div>
            <div className="relative mb-6">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                <Crown className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white">{t('pp.proTitle')}</h3>
              <p className="text-slate-400 text-sm mt-1">{t('pp.proSubtitle')}</p>
            </div>
            <div className="flex items-end gap-1 mb-1 relative">
              <span className="text-5xl font-extrabold text-white">${billing === 'yearly' ? yearlyPrice : monthlyPrice}</span>
              <span className="text-slate-400 mb-2">/mo</span>
            </div>
            {billing === 'yearly' && <p className="text-emerald-400 text-sm mb-5">Billed yearly $84 — save $24!</p>}
            {billing === 'monthly' && <div className="mb-5" />}
            <button onClick={handlePro} className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:from-blue-400 hover:to-blue-500 transition-all duration-200 flex items-center justify-center gap-2 mb-8 shadow-lg shadow-blue-500/25">
              {t('price.upgrade')} <ArrowRight className="w-4 h-4" />
            </button>
            <div className="space-y-3.5 relative">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('pp.whatsIncluded')}</p>
              {[t('pp.pro.1'), t('pp.pro.2'), t('pp.pro.3'), t('pp.pro.4'), t('pp.pro.5'), t('pp.pro.6'), t('pp.pro.7'), t('pp.pro.8'), t('pp.pro.9'), t('pp.pro.10')].map((text, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0" /> {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-10">
          {[
            { icon: Shield, text: t('pp.secure') },
            { icon: Zap, text: t('pp.instant') },
            { icon: Users, text: t('pp.users') },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-slate-500 text-sm">
              <item.icon className="w-4 h-4 text-slate-400" /> {item.text}
            </div>
          ))}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-slate-50 py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900">{t('pp.comparison')}</h2>
            <p className="text-slate-500 mt-2">{t('pp.comparisonDesc')}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-200">
              <div className="p-4 text-sm font-semibold text-slate-500">{t('pp.feature')}</div>
              <div className="p-4 text-center"><span className="text-sm font-bold text-slate-700">{t('pp.freeTitle')}</span></div>
              <div className="p-4 text-center bg-slate-950 rounded-tr-2xl"><span className="text-sm font-bold text-white">{t('pp.proTitle')}</span></div>
            </div>
            {[
              { feature: t('pp.free.1'), free: '1', pro: t('pp.pro.1') },
              { feature: t('pp.free.2'), free: '1', pro: t('pp.pro.2') },
              { feature: t('pp.free.3').replace('2 ', ''), free: '2', pro: '5' },
              { feature: t('pp.free.5'), free: '✓', pro: '✗', freeNeg: false, proNeg: true },
              { feature: t('pp.free.8'), free: '✗', pro: '✓', freeNeg: true },
              { feature: t('pp.pro.6'), free: '✗', pro: '✓', freeNeg: true },
              { feature: t('pp.free.4'), free: '✓', pro: '✓' },
              { feature: 'ATS', free: '✓', pro: '✓' },
              { feature: t('pp.free.10'), free: '✗', pro: '✓', freeNeg: true },
            ].map((row, i) => (
              <div key={i} className={`grid grid-cols-3 border-b border-slate-100 last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                <div className="p-4 text-sm text-slate-600">{row.feature}</div>
                <div className={`p-4 text-center text-sm font-medium ${row.freeNeg ? 'text-slate-300' : 'text-slate-700'}`}>{row.free}</div>
                <div className="p-4 text-center bg-slate-950/[0.02]">
                  <span className={`text-sm font-semibold ${row.pro === '✓' || row.pro.includes('Unlimited') || row.pro.includes('Sınırsız') ? 'text-blue-600' : row.proNeg ? 'text-slate-300' : 'text-slate-700'}`}>{row.pro}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900">{t('pp.testimonials')}</h2>
            <p className="text-slate-500 mt-2">{t('pp.testimonialsDesc')}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((tmpl, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: tmpl.stars }).map((_, j) => <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed mb-5">"{tmpl.text}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 ${tmpl.color} rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>{tmpl.avatar}</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{tmpl.name}</p>
                    <p className="text-xs text-slate-500">{tmpl.role} · {tmpl.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-slate-50 py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900">{t('pp.faq')}</h2>
            <p className="text-slate-500 mt-2">{t('pp.faqDesc')}</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 transition-colors">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left gap-4">
                  <span className="font-semibold text-slate-900 text-sm">{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
                </button>
                {openFaq === i && <div className="px-5 pb-5"><p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p></div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-slate-950 py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '40px 40px' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-2xl mx-auto text-center relative">
          <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Crown className="w-7 h-7 text-blue-400" />
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-4">{t('pp.ctaTitle')}</h2>
          <p className="text-slate-400 mb-8 text-lg">{t('pp.ctaDesc')}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={handleFree} className="px-8 py-3.5 rounded-xl border border-slate-600 text-slate-300 font-semibold hover:border-slate-400 hover:text-white transition-all duration-200">
              {t('pp.getStartedFree')}
            </button>
            <button onClick={handlePro} className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:from-blue-400 hover:to-blue-500 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25">
              <Crown className="w-4 h-4" /> {t('price.upgrade')}
            </button>
          </div>
          <p className="text-slate-600 text-xs mt-4">{t('pp.cancel')}</p>
        </div>
      </div>
    </div>
  );
}
