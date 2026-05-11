import { useEffect, useState } from 'react';
import { useApp } from '../store';
import { CheckCircle2, Sparkles, FileText, Search, Wand2, FileOutput } from 'lucide-react';

const steps = [
  { id: 0, icon: Search,    title: 'Analyzing Your Information', desc: 'Reading your experience and skills...',           color: 'blue' },
  { id: 1, icon: Wand2,     title: 'Building CV Sections',       desc: 'Assembling summary, experience and education...', color: 'indigo' },
  { id: 2, icon: FileText,  title: 'Applying Template',          desc: 'Styling your CV with the chosen template...',     color: 'violet' },
  { id: 3, icon: FileOutput,title: 'Preparing Preview',          desc: 'Almost done — preparing your CV preview...',      color: 'green' },
];

const colorMap: Record<string, { text: string; light: string; dot: string }> = {
  blue:   { text: 'text-blue-600',   light: 'bg-blue-50',   dot: 'bg-blue-500' },
  violet: { text: 'text-violet-600', light: 'bg-violet-50', dot: 'bg-violet-500' },
  indigo: { text: 'text-indigo-600', light: 'bg-indigo-50', dot: 'bg-indigo-500' },
  green:  { text: 'text-green-600',  light: 'bg-green-50',  dot: 'bg-green-500' },
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

export function GeneratingPage() {
  const { generatingStep } = useApp();
  const [dots, setDots] = useState('');
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 400);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const progress = Math.round(((generatingStep + 1) / steps.length) * 100);
  const isDone = generatingStep >= steps.length - 1;

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-white/60 text-sm font-medium">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            cvio.app
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
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
                    {isDone ? 'Your CV is Ready!' : `Working${dots}`}
                  </p>
                  <p className="text-white/40 text-xs">{elapsed}s elapsed</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-bold text-lg">{progress}%</p>
                <p className="text-white/40 text-xs">complete</p>
              </div>
            </div>

            <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
            </div>
          </div>

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
                    isActive ? 'bg-white/10 border border-white/20' : isDoneStep ? 'bg-white/5' : 'opacity-40'
                  }`}
                >
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
                        {isDoneStep ? 'Completed' : step.desc}
                      </p>
                    )}
                  </div>

                  <div className={`text-xs font-bold transition-colors duration-300 ${
                    isDoneStep ? 'text-green-400/60' : isActive ? 'text-white/40' : 'text-white/20'
                  }`}>
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
