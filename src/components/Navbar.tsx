import { LogOut, Menu, X, ChevronRight, User } from 'lucide-react';
import { useApp } from '../store';
import { useState, useEffect, useRef } from 'react';
import logoSvg from '../assets/logo.svg';

export function Navbar() {
  const { user, currentPage, setCurrentPage, setShowAuthModal, logout, uiLang, setUiLang, t } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) setAvatarOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const scrollToSection = (id: string) => {
    if (currentPage !== 'landing') {
      setCurrentPage('landing');
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isLanding = currentPage === 'landing';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled || !isLanding
        ? 'bg-white shadow-md border-b border-slate-200'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-4">
          {/* Logo */}
          <button
            onClick={() => setCurrentPage('landing')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <img src={logoSvg} alt="CVio" className="w-9 h-9 flex-shrink-0" />
            <span className={`text-xl font-bold tracking-tight transition-colors ${
              !scrolled && isLanding ? 'text-white' : 'text-slate-900'
            }`}>
              CV<span className="text-cyan-400">io</span>
            </span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { label: t('nav.howItWorks'), action: () => scrollToSection('how-it-works') },
              { label: t('nav.features'), action: () => scrollToSection('features') },
              { label: t('nav.blog'), action: () => setCurrentPage('blog' as any) },
              { label: t('nav.coverLetter'), action: () => setCurrentPage('cover-letter') },
              { label: t('nav.pricing'), action: () => setCurrentPage('pricing') },
            ].map(({ label, action }) => (
              <button
                key={label}
                onClick={action}
                className={`text-sm font-medium transition-colors cursor-pointer ${
                  !scrolled && isLanding
                    ? 'text-slate-300 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user.isLoggedIn ? (
              <>
                {user.plan === 'pro' && (
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full border border-amber-200">
                    PRO ✓
                  </span>
                )}
                {/* Avatar dropdown */}
                <div className="relative" ref={avatarRef}>
                  <button
                    onClick={() => setAvatarOpen(v => !v)}
                    className="flex items-center gap-2 cursor-pointer rounded-full focus:outline-none"
                  >
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.fullName} className="w-8 h-8 rounded-full object-cover border-2 border-slate-200" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                        {user.fullName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm text-slate-500 font-medium">{user.fullName.split(' ')[0]}</span>
                  </button>
                  {avatarOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50">
                      <button
                        onClick={() => { setCurrentPage('dashboard'); setAvatarOpen(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer"
                      >
                        <User className="w-4 h-4 text-slate-400" /> {t('nav.profile')}
                      </button>
                      <div className="my-1 border-t border-slate-100" />
                      {/* Language Switcher */}
                      <div className="px-4 py-2">
                        <p className="text-xs text-slate-400 font-medium mb-2">{t('nav.language')}</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setUiLang('en')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${uiLang === 'en' ? 'bg-blue-600 text-white border-blue-600' : 'text-slate-600 border-slate-200 hover:border-blue-300'}`}
                          >
                            🇬🇧 EN
                          </button>
                          <button
                            onClick={() => setUiLang('tr')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${uiLang === 'tr' ? 'bg-blue-600 text-white border-blue-600' : 'text-slate-600 border-slate-200 hover:border-blue-300'}`}
                          >
                            🇹🇷 TR
                          </button>
                        </div>
                      </div>
                      <div className="my-1 border-t border-slate-100" />
                      <button
                        onClick={() => { logout(); setAvatarOpen(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" /> {t('nav.signOut')}
                      </button>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setCurrentPage('app')}
                  className="flex items-center gap-1.5 bg-slate-900 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  {t('nav.createCV')} <ChevronRight className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className={`text-sm font-medium transition-colors cursor-pointer px-3 py-2 ${
                    !scrolled && isLanding ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t('nav.signIn')}
                </button>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center gap-1.5 bg-slate-900 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  {t('nav.tryFree')} <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5 text-slate-700" /> : <Menu className="w-5 h-5 text-slate-700" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-lg">
          <div className="px-6 py-4 space-y-1">
            <button
              className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
              onClick={() => { scrollToSection('how-it-works'); setMobileOpen(false); }}
            >
              {t('nav.howItWorks')}
            </button>
            <button
              className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
              onClick={() => { setCurrentPage('cover-letter'); setMobileOpen(false); }}
            >
              {t('nav.coverLetter')}
            </button>
            <button
              className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
              onClick={() => { setCurrentPage('pricing'); setMobileOpen(false); }}
            >
              {t('nav.pricing')}
            </button>
            {user.isLoggedIn ? (
              <>
                <div className="flex items-center gap-3 px-4 py-3">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.fullName} className="w-8 h-8 rounded-full object-cover border-2 border-slate-200" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm font-medium text-slate-700">{user.fullName}</span>
                </div>
                <button
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
                  onClick={() => { setCurrentPage('dashboard'); setMobileOpen(false); }}
                >
                  {t('nav.profile')}
                </button>
                <button
                  className="w-full text-center px-4 py-3 rounded-xl text-sm font-semibold bg-slate-900 text-white cursor-pointer mt-2"
                  onClick={() => { setCurrentPage('app'); setMobileOpen(false); }}
                >
                  {t('nav.createCV')}
                </button>
                <button
                  className="w-full text-center px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 cursor-pointer transition-colors"
                  onClick={() => { logout(); setMobileOpen(false); }}
                >
                  {t('nav.signOut')}
                </button>
              </>
            ) : (
              <>
                <button
                  className="w-full text-center px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
                  onClick={() => { setShowAuthModal(true); setMobileOpen(false); }}
                >
                  {t('nav.signIn')}
                </button>
                <button
                  className="w-full text-center px-4 py-3 rounded-xl text-sm font-semibold bg-slate-900 text-white cursor-pointer mt-2"
                  onClick={() => { setShowAuthModal(true); setMobileOpen(false); }}
                >
                  {t('nav.tryFree')}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
