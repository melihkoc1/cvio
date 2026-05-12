import { LogOut, Menu, X, ChevronRight } from 'lucide-react';
import { useApp } from '../store';
import { useState, useEffect, useRef } from 'react';
import { LogoE } from './LogoOptions';

export function Navbar() {
  const { user, currentPage, setCurrentPage, setShowAuthModal, logout } = useApp();
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
          <button
            onClick={() => setCurrentPage('landing')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="flex-shrink-0">
              <LogoE size={36} />
            </div>
            <span className={`text-xl font-bold tracking-tight transition-colors ${
              !scrolled && isLanding ? 'text-white' : 'text-slate-900'
            }`}>
              CV<span className="text-cyan-400">io</span>
            </span>
          </button>

          <div className="hidden md:flex items-center gap-8">
            {[
              { label: 'How It Works', action: () => scrollToSection('how-it-works') },
              { label: 'Features', action: () => scrollToSection('features') },
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

          <div className="hidden md:flex items-center gap-3">
            {user.isLoggedIn ? (
              <>
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
                    <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50">
                      <button
                        onClick={() => { logout(); setAvatarOpen(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setCurrentPage('app')}
                  className="flex items-center gap-1.5 bg-slate-900 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Create CV <ChevronRight className="w-4 h-4" />
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
                  Sign In
                </button>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center gap-1.5 bg-slate-900 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Try Free <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5 text-slate-700" /> : <Menu className="w-5 h-5 text-slate-700" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-lg">
          <div className="px-6 py-4 space-y-1">
            <button
              className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
              onClick={() => { scrollToSection('how-it-works'); setMobileOpen(false); }}
            >
              How It Works
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
                  className="w-full text-center px-4 py-3 rounded-xl text-sm font-semibold bg-slate-900 text-white cursor-pointer mt-2"
                  onClick={() => { setCurrentPage('app'); setMobileOpen(false); }}
                >
                  Create CV
                </button>
                <button
                  className="w-full text-center px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 cursor-pointer transition-colors"
                  onClick={() => { logout(); setMobileOpen(false); }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  className="w-full text-center px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
                  onClick={() => { setShowAuthModal(true); setMobileOpen(false); }}
                >
                  Sign In
                </button>
                <button
                  className="w-full text-center px-4 py-3 rounded-xl text-sm font-semibold bg-slate-900 text-white cursor-pointer mt-2"
                  onClick={() => { setShowAuthModal(true); setMobileOpen(false); }}
                >
                  Try Free
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
