import { ArrowLeft, Sparkles, FileText } from 'lucide-react';
import { useApp } from '../store';
import { Button } from '../components/ui/Button';

export function JobPage() {
  const { jobPosting, setJobPosting, generateCV, setCurrentPage, t } = useApp();

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => setCurrentPage('app')} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> {t('result.back')}
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{t('job.title')}</h2>
              <p className="text-sm text-gray-500">{t('job.desc')}</p>
            </div>
          </div>

          <div className="space-y-2">
            <textarea
              className="w-full h-64 px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder={t('job.placeholder')}
              value={jobPosting}
              onChange={e => setJobPosting(e.target.value)}
            />
          </div>

          <Button
            className="w-full mt-6"
            size="lg"
            disabled={!jobPosting.trim()}
            onClick={() => generateCV(true)}
          >
            <Sparkles className="w-5 h-5" /> {t('job.generate')}
          </Button>
        </div>
      </div>
    </div>
  );
}
