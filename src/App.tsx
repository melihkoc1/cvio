import { AppProvider, useApp } from './store';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { UpgradeModal } from './components/UpgradeModal';
import { LandingPage } from './pages/LandingPage';
import { AppForm } from './pages/AppForm';
import { JobPage } from './pages/JobPage';
import { GeneratingPage } from './pages/GeneratingPage';
import { ResultPage } from './pages/ResultPage';
import { DashboardPage } from './pages/DashboardPage';
import { PricingPage } from './pages/PricingPage';
import { CoverLetterPage } from './pages/CoverLetterPage';
import { BlogPage, BlogPostPage } from './pages/BlogPage';

function AppContent() {
  const { currentPage, user, setShowAuthModal } = useApp();

  const renderPage = () => {
    // If trying to access protected pages without login, show auth
    if (['app', 'job', 'dashboard'].includes(currentPage) && !user.isLoggedIn) {
      // Show auth modal and fallback to landing
      setTimeout(() => setShowAuthModal(true), 100);
      return <LandingPage />;
    }

    switch (currentPage) {
      case 'app': return <AppForm />;
      case 'job': return <JobPage />;
      case 'generating': return <GeneratingPage />;
      case 'result': return <ResultPage />;
      case 'dashboard': return <DashboardPage />;
      case 'pricing': return <PricingPage />;
      case 'cover-letter': return <CoverLetterPage />;
      case 'blog': return <BlogPage />;
      default:
        if (currentPage.startsWith('blog/')) return <BlogPostPage slug={currentPage.replace('blog/', '')} />;
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {currentPage !== 'generating' && <Navbar />}
      {renderPage()}
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
