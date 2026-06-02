import { useState } from 'react';
import { FileText, Download, Copy, Check, Loader2, RefreshCw, ArrowLeft, Sparkles } from 'lucide-react';
import { useApp } from '../store';
import { generateCoverLetterOnly } from '../lib/gemini';
import jsPDF from 'jspdf';

type Tone = 'professional' | 'friendly' | 'creative';
type Language = 'tr' | 'en' | 'fr' | 'es';

export function CoverLetterPage() {
  const { user, cvData, setCurrentPage, setShowAuthModal, t } = useApp();

  const [fullName, setFullName] = useState(cvData.personalInfo.fullName || user.fullName || '');
  const [email, setEmail] = useState(cvData.personalInfo.email || user.email || '');
  const [phone, setPhone] = useState(cvData.personalInfo.phone || '');
  const [position, setPosition] = useState('');
  const [company, setCompany] = useState('');
  const [jobPosting, setJobPosting] = useState('');
  const [tone, setTone] = useState<Tone>('professional');
  const [language, setLanguage] = useState<Language>('en');
  const [experience, setExperience] = useState(
    cvData.experience.map(e => `${e.position} @ ${e.company}`).join(', ')
  );
  const [skills, setSkills] = useState(cvData.skills.join(', '));

  const [coverLetter, setCoverLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!user.isLoggedIn) {
      setShowAuthModal(true);
      return;
    }
    if (!fullName.trim()) {
      setError(t('clp.err.name'));
      return;
    }
    if (!jobPosting.trim()) {
      setError(t('clp.err.job'));
      return;
    }
    setError('');
    setIsGenerating(true);
    try {
      const result = await generateCoverLetterOnly({
        fullName, email, phone, position, company, jobPosting, tone, language, experience, skills,
      });
      setCoverLetter(result);
    } catch {
      setError(t('clp.err.gen'));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxWidth = pageWidth - margin * 2;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);

    const lines = doc.splitTextToSize(coverLetter, maxWidth);
    let y = margin;

    lines.forEach((line: string) => {
      if (y > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += 7;
    });

    const fileName = `cover-letter-${fullName.replace(/\s+/g, '-').toLowerCase() || 'document'}.pdf`;
    doc.save(fileName);
  };

  const tones: { value: Tone; label: string; desc: string }[] = [
    { value: 'professional', label: t('clp.tone.professional'), desc: t('clp.tone.professionalDesc') },
    { value: 'friendly', label: t('clp.tone.friendly'), desc: t('clp.tone.friendlyDesc') },
    { value: 'creative', label: t('clp.tone.creative'), desc: t('clp.tone.creativeDesc') },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => setCurrentPage('landing')}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-4 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('clp.home')}
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{t('clp.title')}</h1>
              <p className="text-slate-500 text-sm">{t('clp.subtitle')}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">

          {/* Left: Form */}
          <div className="space-y-5">

            {/* Language */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h2 className="font-semibold text-slate-800 mb-3 text-sm">{t('clp.language')}</h2>
              <div className="grid grid-cols-2 gap-2">
                {([
                  { v: 'en', label: '🇬🇧 English' },
                  { v: 'tr', label: '🇹🇷 Türkçe' },
                  { v: 'fr', label: '🇫🇷 Français' },
                  { v: 'es', label: '🇪🇸 Español' },
                ] as { v: Language; label: string }[]).map(({ v, label }) => (
                  <button
                    key={v}
                    onClick={() => setLanguage(v)}
                    className={`py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer border ${
                      language === v
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Personal Info */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h2 className="font-semibold text-slate-800 mb-4 text-sm">{t('clp.personalInfo')}</h2>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">{t('clp.fullName')}</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="Your Full Name"
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">{t('clp.email')}</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">{t('clp.phone')}</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+1 555 123 4567"
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">{t('clp.position')}</label>
                    <input
                      type="text"
                      value={position}
                      onChange={e => setPosition(e.target.value)}
                      placeholder="Frontend Developer"
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">{t('clp.company')}</label>
                  <input
                    type="text"
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    placeholder="Company name (optional)"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Experience & Skills */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-semibold text-slate-800 text-sm">{t('clp.expSkills')}</h2>
                {cvData.experience.length > 0 && (
                  <span className="text-xs text-blue-500 font-medium">{t('clp.filledFromCV')}</span>
                )}
              </div>
              <p className="text-xs text-slate-400 mb-3">{t('clp.youCanEdit')}</p>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">{t('clp.workExp')}</label>
                  <input
                    type="text"
                    value={experience}
                    onChange={e => setExperience(e.target.value)}
                    placeholder="Position @ Company, Position @ Company"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">{t('clp.skills')}</label>
                  <input
                    type="text"
                    value={skills}
                    onChange={e => setSkills(e.target.value)}
                    placeholder="React, TypeScript, Node.js..."
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Tone */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h2 className="font-semibold text-slate-800 mb-3 text-sm">{t('clp.tone')}</h2>
              <div className="space-y-2">
                {tones.map(tone_ => (
                  <button
                    key={tone_.value}
                    onClick={() => setTone(tone_.value)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      tone === tone_.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ${
                      tone === tone_.value ? 'border-blue-500 bg-blue-500' : 'border-slate-300'
                    }`} />
                    <div>
                      <div className={`text-sm font-semibold ${tone === tone_.value ? 'text-blue-700' : 'text-slate-700'}`}>
                        {tone_.label}
                      </div>
                      <div className="text-xs text-slate-400">{tone_.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Job Posting */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h2 className="font-semibold text-slate-800 mb-1 text-sm">{t('clp.jobPosting')}</h2>
              <p className="text-xs text-slate-400 mb-3">{t('clp.jobPostingDesc')}</p>
              <textarea
                value={jobPosting}
                onChange={e => setJobPosting(e.target.value)}
                rows={8}
                placeholder={'Paste the job posting here...\n\nE.g: "We are looking for an experienced Frontend Developer. React, TypeScript knowledge required..."'}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-semibold py-4 rounded-2xl hover:bg-slate-700 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed text-base"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t('clp.generating')}
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  {t('clp.generate')}
                </>
              )}
            </button>
          </div>

          {/* Right: Preview */}
          <div className="lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
                <h2 className="font-semibold text-slate-700 text-sm">{t('clp.preview')}</h2>
                {coverLetter && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer disabled:opacity-40"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                      {t('clp.refresh')}
                    </button>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      {copied
                        ? <Check className="w-3.5 h-3.5 text-green-500" />
                        : <Copy className="w-3.5 h-3.5" />}
                      {copied ? t('clp.copied') : t('clp.copy')}
                    </button>
                    <button
                      onClick={handleDownloadPDF}
                      className="flex items-center gap-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      PDF
                    </button>
                  </div>
                )}
              </div>

              {coverLetter ? (
                <div className="p-8 max-h-[700px] overflow-y-auto">
                  <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-serif">
                    {coverLetter}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-slate-500 text-sm font-medium">{t('clp.empty')}</p>
                  <p className="text-slate-400 text-xs mt-1.5">{t('clp.emptyDesc')}</p>
                </div>
              )}
            </div>

            {/* Tips */}
            {!coverLetter && (
              <div className="mt-4 bg-blue-50 border border-blue-100 rounded-2xl p-5">
                <h3 className="text-xs font-semibold text-blue-700 mb-2 uppercase tracking-wide">{t('clp.tips')}</h3>
                <ul className="space-y-1.5">
                  {[t('clp.tip1'), t('clp.tip2'), t('clp.tip3')].map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-blue-600">
                      <span className="mt-0.5 text-blue-400">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
