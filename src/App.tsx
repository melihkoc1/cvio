import { AppProvider } from './store';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { UpgradeModal } from './components/UpgradeModal';
import { LandingPage } from './pages/LandingPage';

function AppContent() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <LandingPage />
      <AuthModal />
      <UpgradeModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
