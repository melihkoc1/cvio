import { useState } from 'react';
import { X, FileText, Loader2 } from 'lucide-react';
import { useApp } from '../store';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

export function AuthModal() {
  const { showAuthModal, setShowAuthModal, login, loginWithGoogle } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState('');

  if (!showAuthModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim()) {
      login(name.trim(), email.trim());
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setGoogleError('');
    try {
      await loginWithGoogle();
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        setGoogleError('Google sign-in failed. Please try again.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAuthModal(false)} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-in fade-in zoom-in">
        <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 cursor-pointer">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome to CVio</h2>
          <p className="text-gray-500 mt-1">Start building your professional CV</p>
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogle}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mb-4"
        >
          {googleLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          )}
          <span className="font-semibold text-slate-700">
            {googleLoading ? 'Signing in...' : 'Continue with Google'}
          </span>
        </button>

        {googleError && (
          <p className="text-red-500 text-sm text-center mb-4">{googleError}</p>
        )}

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-xs text-slate-400 font-medium">or continue with email</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="John Smith"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <Input
            label="Email"
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" size="lg">
            Sign In
          </Button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-4">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
