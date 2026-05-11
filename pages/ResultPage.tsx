import { useState } from 'react';
import { Download, FileText, Loader2, ArrowLeft, LayoutTemplate, CheckCircle2 } from 'lucide-react';
import { useApp } from '../store';
import { Button } from '../components/ui/Button';
import { CVRenderer } from '../components/templates/CVRenderer';
import { CVPdfDocument } from '../components/templates/CVPdfDocument';
import { pdf } from '@react-pdf/renderer';
import type { TemplateId } from '../types';

const templates: { id: TemplateId; name: string; color: string }[] = [
  { id: 'modern',       name: 'Modern',      color: 'bg-blue-500' },
  { id: 'classic',      name: 'Classic',     color: 'bg-gray-700' },
  { id: 'professional', name: 'Professional', color: 'bg-slate-800' },
];

export function ResultPage() {
  const { cvData, generatedContent, setCurrentPage, updatePreferences } = useApp();
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!generatedContent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-20">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-600 font-medium">No CV created yet</p>
          <Button onClick={() => setCurrentPage('app')}>
            <FileText className="w-4 h-4" /> Create CV
          </Button>
        </div>
      </div>
    );
  }
  

  const name = cvData.personalInfo.fullName.replace(/\s/g, '_') || 'CV';
  const currentTemplate = templates.find(t => t.id === cvData.preferences.template) || templates[0];

  const downloadCV = async () => {
    setDownloading(true);
    setError(null);
    try {
      const doc = <CVPdfDocument data={cvData} content={generatedContent} watermark={false} />;
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CV_${name}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('PDF generation error:', e);
      setError('Could not generate PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentPage('app')}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div className="w-px h-4 bg-slate-200" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-semibold text-slate-800">Your CV is Ready!</span>
            </div>
            <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-white ${currentTemplate.color}`}>
              <LayoutTemplate className="w-3 h-3" />
              {currentTemplate.name}
            </div>
          </div>

          <button
            onClick={downloadCV}
            disabled={downloading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer shadow-sm"
          >
            {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {downloading ? 'Generating PDF...' : 'Download PDF'}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid lg:grid-cols-[300px_1fr] gap-6">
        {/* Sidebar — Template Switcher */}
        <aside className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <LayoutTemplate className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-800">Choose Template</h3>
            </div>
            <div className="space-y-2">
              {templates.map(t => (
                <button
                  key={t.id}
                  onClick={() => updatePreferences({ template: t.id })}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer ${
                    cvData.preferences.template === t.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${t.color}`} />
                    {t.name}
                  </span>
                  {cvData.preferences.template === t.id && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </aside>

        {/* Preview */}
        <main>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Preview</span>
              <span className="text-xs text-slate-400">A4 · {currentTemplate.name}</span>
            </div>
            <div className="p-6 overflow-auto" style={{ maxHeight: '80vh' }}>
              <div className="mx-auto" style={{ width: 800 }}>
                <CVRenderer data={cvData} content={generatedContent} watermark={false} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
