import { useEffect, useState } from 'react';
import { useApp } from '../store';
import { CheckCircle2, Sparkles, FileText, Search, Wand2, Mail, FileOutput, Rocket } from 'lucide-react';

const allStepsEN = [
  { id: 0, icon: Search,     title: 'Analyzing Your Information', desc: 'Evaluating your experience and skills...',                          color: 'blue',   duration: 600 },
  { id: 1, icon: FileText,   title: 'Reviewing Job Posting',      desc: 'Identifying position requirements and keywords...',                  color: 'violet', duration: 500, jobOnly: true },
  { id: 2, icon: Wand2,      title: 'Optimizing CV',              desc: 'AI generating professional content, ensuring ATS compatibility...', color: 'indigo', duration: 0 },
  { id: 3, icon: Mail,       title: 'Writing Cover Letter',       desc: 'Crafting a compelling, company-specific letter...',                 color: 'purple', duration: 400, jobOnly: true },
  { id: 4, icon: FileOutput, title: 'Preparing PDF',              desc: 'Converting documents to professional format...',                    color: 'cyan',   duration: 600 },
  { id: 5, icon: Rocket,     title: 'Done!',                      desc: 'Your CV has been successfully created.',                           color: 'green',  duration: 400 },
];

const allStepsTR = [
  { id: 0, icon: Search,     title: 'Bilgilerin Analiz Ediliyor', desc: 'Deneyim ve beceriler değerlendiriliyor...',           color: 'blue',   duration: 600 },
  { id: 1, icon: FileText,   title: 'İş İlanı İnceleniyor',      desc: 'Pozisyon gereksinimleri ve anahtar kelimeler belirleniyor...', color: 'violet', duration: 500, jobOnly: true },
  { id: 2, icon: Wand2,      title: 'CV Optimize Ediliyor',       desc: 'Yapay zeka profesyonel içerik oluşturuyor, ATS uyumluluğu sağlanıyor...', color: 'indigo', duration: 0 },
  { id: 3, icon: Mail,       title: 'Ön Yazı Yazılıyor',         desc: 'Şirkete özel, etkileyici bir mektup hazırlanıyor...', color: 'purple', duration: 400, jobOnly: true },
  { id: 4, icon: FileOutput, title: 'PDF Hazırlanıyor',           desc: 'Belgeler profesyonel formata dönüştürülüyor...',      color: 'cyan',   duration: 600 },
  { id: 5, icon: Rocket,     title: 'Tamamlandı!',                desc: 'CV\'in başarıyla oluşturuldu.',                      color: 'green',  duration: 400 },
];

const colorMap: Record<string, { bg: string; ring: string; text: string; glow: string; light: string; dot: string }> = {
  blue:   { bg: 'bg-blue-600',   ring: 'ring-blue-400',   text: 'text-blue-600',   glow: 'shadow-blue-500/40',   light: 'bg-blue-50',   dot: 'bg-blue-500' },
  violet: { bg: 'bg-violet-600', ring: 'ring-violet-400', text: 'text-violet-600', glow: 'shadow-violet-500/40', light: 'bg-violet-50', dot: 'bg-violet-500' },
  indigo: { bg: 'bg-indigo-600', ring: 'ring-indigo-400', text: 'text-indigo-600', glow: 'shadow-indigo-500/40', light: 'bg-indigo-50', dot: 'bg-indigo-500' },
  purple: { bg: 'bg-purple-600', ring: 'ring-purple-400', text: 'text-purple-600', glow: 'shadow-purple-500/40', light: 'bg-purple-50', dot: 'bg-purple-500' },
  cyan:   { bg: 'bg-cyan-600',   ring: 'ring-cyan-400',   text: 'text-cyan-600',   glow: 'shadow-cyan-500/40',   light: 'bg-cyan-50',   dot: 'bg-cyan-500' },
  green:  { bg: 'bg-green-600',  ring: 'ring-green-400',  text: 'text-green-600',  glow: 'shadow-green-500/40',  light: 'bg-green-50',  dot: 'bg-green-500' },
};

function Spinner({ color }: { color: string }) {
  const c = colorMap[color];
  return (
    <div className="relative flex items-center justify-center w-5 h-5">
      <div className={`absolute inset-0 rounded-full border-2 border-transparent border-t-current ${c.text} animate-spin`} />
      <div className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
    </div>
  );
}

function ParticleField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-blue-400/20 animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
  );
}

function AIVisualizer({ step }: { step: number }) {
  const bars = [4, 7, 3, 8, 5, 9, 4, 6, 3, 7, 5, 8];
  return (
    <div className="flex items-end gap-1 h-12">
      {bars.map((h, i) => (
        <div
          key={i}
          className="w-1.5 rounded-full bg-gradient-to-t from-blue-600 to-indigo-400 transition-all duration-300"
          style={{
            height: `${(h / 9) * 100}%`,
            opacity: step >= 2 ? 1 : 0.2,
            animation: step === 2 ? `pulse ${0.5 + i * 0.1}s ease-in-out infinite alternate` : 'none',
          }}
        />
      ))}
    </div>
  );
}

export function GeneratingPage() {
  const { generatingStep, jobPosting, t, uiLang } = useApp();
  const hasJob = !!jobPosting.trim();
  const allSteps = uiLang === 'tr' ? allStepsTR : allStepsEN;
  const steps = allSteps.filter(s => !s.jobOnly || hasJob);

  const [dots, setDots] = useState('');
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(d => d.length >= 3 ? '' : d + '.');
    }, 400);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(e => e + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const currentStepIndex = steps.findIndex(s => s.id === generatingStep);
  const progress = steps.length > 0 ? Math.round(((currentStepIndex + 1) / steps.length) * 100) : 0;
  const isDone = generatingStep === 5;

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-3xl" />
        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <ParticleField />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-white/60 text-sm font-medium">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            cvio.app
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          {/* Top Bar */}
          <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border-b border-white/10 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isDone ? (
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/40">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                ) : (
                  <div className="relative w-8 h-8">
                    <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-30" />
                    <div className="relative w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white animate-pulse" />
                    </div>
                  </div>
                )}
                <div>
                  <p className="text-white font-semibold text-sm">
                    {isDone ? t('result.ready') : `AI Working${dots}`}
                  </p>
                  <p className="text-white/40 text-xs">{elapsed}s elapsed</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-bold text-lg">{progress}%</p>
                <p className="text-white/40 text-xs">complete</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Steps */}
          <div className="p-6 space-y-3">
            {steps.map((step, idx) => {
              const isActive = generatingStep === step.id;
              const isDoneStep = generatingStep > step.id || isDone;
              const c = colorMap[step.color];
              const Icon = step.icon;

              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-4 p-3 rounded-2xl transition-all duration-500 ${
                    isActive
                      ? 'bg-white/10 border border-white/20'
                      : isDoneStep
                      ? 'bg-white/5'
                      : 'opacity-40'
                  }`}
                >
                  {/* Icon */}
                  <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                    isDoneStep ? 'bg-green-500/20' : isActive ? `${c.light}/20` : 'bg-white/5'
                  }`}>
                    {isDoneStep ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    ) : isActive ? (
                      <>
                        <Icon className={`w-5 h-5 ${c.text} opacity-70`} />
                        <div className="absolute -top-0.5 -right-0.5">
                          <Spinner color={step.color} />
                        </div>
                      </>
                    ) : (
                      <Icon className="w-5 h-5 text-white/30" />
                    )}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold transition-colors duration-300 ${
                      isDoneStep ? 'text-green-400' : isActive ? 'text-white' : 'text-white/30'
                    }`}>
                      {step.title}
                    </p>
                    {(isActive || isDoneStep) && (
                      <p className={`text-xs mt-0.5 transition-all duration-300 ${
                        isDoneStep ? 'text-green-400/60' : 'text-white/50'
                      }`}>
                        {isDoneStep ? (uiLang === 'tr' ? 'Tamamlandı ✓' : 'Completed ✓') : step.desc}
                      </p>
                    )}
                  </div>

                  {/* Step number */}
                  <div className={`text-xs font-bold transition-colors duration-300 ${
                    isDoneStep ? 'text-green-400/60' : isActive ? 'text-white/40' : 'text-white/20'
                  }`}>
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom — AI Visualizer */}
          <div className="px-6 pb-6">
            <div className="bg-white/5 rounded-2xl border border-white/10 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  <p className="text-white/50 text-xs font-medium">AI Engine Activity</p>
                </div>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-green-400/70 text-xs">Gemini 2.0 Flash</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <AIVisualizer step={generatingStep} />
                <div className="flex-1 space-y-1.5">
                  {[
                    { label: 'ATS Score', value: isDone ? '98%' : generatingStep >= 2 ? '...' : '--' },
                    { label: 'Keywords', value: isDone ? '24' : generatingStep >= 2 ? '...' : '--' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className="text-white/30 text-xs">{item.label}</span>
                      <span className={`text-xs font-bold ${isDone ? 'text-green-400' : 'text-white/50'}`}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="mt-3 text-center">
              <p className="text-white/25 text-xs">
                {[
                  '💡 ATS systems reject 75% of CVs — we protect you.',
                  '📊 Recruiters spend an average of 7 seconds on each CV.',
                  '🎯 Keyword matching increases application success by 60%.',
                  '✨ A strong professional summary is the fastest way to stand out.',
                ][Math.floor(elapsed / 3) % 4]}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
