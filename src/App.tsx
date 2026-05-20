import { AppProvider, useApp } from './store';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { LandingPage } from './pages/LandingPage';
import { AppForm } from './pages/AppForm';
import { GeneratingPage } from './pages/GeneratingPage';
import { ResultPage } from './pages/ResultPage';

function AppContent() {
  const { currentPage, user, setShowAuthModal } = useApp();

  const renderPage = () => {
    if (currentPage === 'app' && !user.isLoggedIn) {
      setTimeout(() => setShowAuthModal(true), 100);
      return <LandingPage />;
    }

    switch (currentPage) {
      case 'app': return <AppForm />;
      case 'generating': return <GeneratingPage />;
      case 'result': return <ResultPage />;
      default: return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {currentPage !== 'generating' && <Navbar />}
      {renderPage()}
      <AuthModal />
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

