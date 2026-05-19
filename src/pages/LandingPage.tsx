import {
  FileText, Target, Globe, Zap, ArrowRight, CheckCircle,
  ClipboardList, Download, Star, TrendingUp, Shield,
  Users, Award, ChevronRight, BarChart2, Briefcase, Sparkles
} from 'lucide-react';
import { useApp } from '../store';

export function LandingPage() {
  const { user, setCurrentPage, setShowAuthModal } = useApp();

  const handleStart = () => {
    if (user.isLoggedIn) setCurrentPage('app');
    else setShowAuthModal(true);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── HERO ── */}
      <section className="relative pt-24 sm:pt-28 pb-16 sm:pb-24 px-4 sm:px-6 overflow-hidden bg-slate-950">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px),
              linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }}
        />
        {/* Subtle glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600 opacity-10 rounded-full blur-[120px]" />

        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-700 bg-slate-800/60 text-slate-300 text-xs font-medium mb-6 sm:mb-8 backdrop-blur">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                AI-Powered · 8 Languages
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight">
                Professional CV<br />
                <span className="text-blue-400">In Seconds</span>
              </h1>

              <p className="mt-4 sm:mt-6 text-base sm:text-lg text-slate-400 leading-relaxed max-w-lg">
                Enter your info, paste the job posting. Let AI write your{' '}
                <span className="text-slate-200 font-medium">ATS-compatible CV</span> and{' '}
                <span className="text-slate-200 font-medium">job-specific cover letter</span> for you.
              </p>

              <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={handleStart}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-blue-900/40 cursor-pointer"
                >
                  {user.isLoggedIn ? <>Create New CV <ArrowRight className="w-4 h-4" /></> : <>Get Started Free <ArrowRight className="w-4 h-4" /></>}
                </button>
                <button
                  onClick={() => scrollTo('how-it-works')}
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-6 py-3.5 rounded-xl border border-slate-700 transition-all duration-200 cursor-pointer"
                >
                  How It Works?
                </button>
              </div>

              {/* Social proof */}
              <div className="mt-8 sm:mt-12 flex flex-wrap items-center gap-4 sm:gap-6">
                <div className="flex -space-x-2">
                  {['bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500'].map((c, i) => (
                    <div key={i} className={`w-8 h-8 rounded-full ${c} border-2 border-slate-950 flex items-center justify-center text-white text-xs font-bold`}>
                      {['AY', 'MK', 'EO', 'SB'][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-500 text-xs">2,400+ users · <span className="text-slate-300">4.9/5 rating</span></p>
                </div>
                <div className="h-8 w-px bg-slate-800" />
                <p className="text-slate-500 text-xs">
                  <span className="text-emerald-400 font-semibold">87%</span> more interview invitations
                </p>
              </div>
            </div>

            {/* Right — CV Mockup */}
            <div className="relative flex justify-center lg:justify-end mt-4 lg:mt-0">
              {/* Glow behind card */}
              <div className="absolute inset-0 bg-blue-600/10 rounded-3xl blur-2xl" />

              {/* Main CV Card */}
              <div className="relative w-full max-w-xs sm:max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
                {/* Header band */}
                <div className="bg-slate-900 px-6 py-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 border-2 border-blue-400/40 flex items-center justify-center text-blue-300 font-bold text-lg">
                    AY
                  </div>
                  <div>
                    <div className="h-3 bg-white/90 rounded w-32 mb-1.5" />
                    <div className="h-2 bg-slate-500 rounded w-24" />
                  </div>
                  <div className="ml-auto">
                    <div className="w-6 h-6 rounded bg-blue-500/20 flex items-center justify-center">
                      <Briefcase className="w-3 h-3 text-blue-400" />
                    </div>
                  </div>
                </div>

                {/* Contact row */}
                <div className="flex gap-3 px-6 py-3 bg-slate-50 border-b border-slate-100">
                  {['📧 email@mail.com', '📍 New York', '🔗 LinkedIn'].map((item, i) => (
                    <div key={i} className="text-[9px] text-slate-500 truncate">{item}</div>
                  ))}
                </div>

                {/* Content */}
                <div className="px-6 py-4 space-y-4">
                  {/* Summary */}
                  <div>
                    <div className="text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <div className="h-px flex-1 bg-slate-200" />
                      <span>Summary</span>
                      <div className="h-px flex-1 bg-slate-200" />
                    </div>
                    <div className="space-y-1">
                      <div className="h-1.5 bg-slate-100 rounded w-full" />
                      <div className="h-1.5 bg-slate-100 rounded w-5/6" />
                      <div className="h-1.5 bg-slate-100 rounded w-4/5" />
                    </div>
                  </div>

                  {/* Experience */}
                  <div>
                    <div className="text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <div className="h-px flex-1 bg-slate-200" />
                      <span>Experience</span>
                      <div className="h-px flex-1 bg-slate-200" />
                    </div>
                    <div className="space-y-3">
                      {[
                        { title: 'Senior Product Manager', company: 'Stripe · 2021–Present', lines: [85, 75, 65] },
                        { title: 'Product Manager', company: 'HubSpot · 2019–2021', lines: [80, 70] },
                      ].map((exp, i) => (
                        <div key={i} className="pl-3 border-l-2 border-blue-200">
                          <div className="h-2 bg-slate-700 rounded mb-1" style={{ width: `${exp.lines[0]}%` }} />
                          <div className="h-1.5 bg-blue-300/60 rounded mb-1.5 w-2/3" />
                          <div className="space-y-1">
                            {exp.lines.slice(1).map((w, j) => (
                              <div key={j} className="h-1.5 bg-slate-100 rounded" style={{ width: `${w}%` }} />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <div className="text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <div className="h-px flex-1 bg-slate-200" />
                      <span>Skills</span>
                      <div className="h-px flex-1 bg-slate-200" />
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {['Scrum', 'SQL', 'Figma', 'A/B Test', 'Python', 'OKR'].map((skill) => (
                        <span key={skill} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[9px] font-medium rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -bottom-3 -left-4 bg-emerald-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" /> ATS Compatible
              </div>
              <div className="absolute top-6 -right-4 bg-white border border-slate-200 text-slate-700 text-[11px] font-semibold px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" /> Ready in 30s
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LOGO BAR ── */}
      <section className="py-8 sm:py-10 px-4 sm:px-6 bg-slate-50 border-y border-slate-200">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">
            Our users applied to these companies
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-4">
            {['Google', 'Amazon', 'Microsoft', 'Stripe', 'HubSpot', 'Salesforce', 'Apple'].map((co) => (
              <span key={co} className="text-slate-400 font-bold text-sm tracking-tight hover:text-slate-600 transition-colors">
                {co}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-16 sm:py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold uppercase tracking-wider mb-4 border border-blue-100">
              Process
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Professional CV in 3 Steps</h2>
            <p className="mt-3 text-base sm:text-lg text-slate-500 max-w-xl mx-auto">
              No complex editors. No wasted hours. Just enter your info and let AI handle the rest.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-14 left-1/3 right-1/3 h-px bg-gradient-to-r from-slate-200 via-blue-300 to-slate-200" />

            {[
              {
                num: '01',
                icon: ClipboardList,
                title: 'Enter Your Info',
                desc: 'Add your experience, education, and skills step by step. Even raw notes are fine — AI will polish them.',
                color: 'blue',
                bg: 'bg-blue-50',
                border: 'border-blue-100',
                iconColor: 'text-blue-600',
                numColor: 'text-blue-500',
              },
              {
                num: '02',
                icon: Target,
                title: 'Paste the Job Posting',
                desc: 'Add the text of the job you want to apply for. AI analyzes keywords and optimizes your CV.',
                color: 'violet',
                bg: 'bg-violet-50',
                border: 'border-violet-100',
                iconColor: 'text-violet-600',
                numColor: 'text-violet-500',
              },
              {
                num: '03',
                icon: Download,
                title: 'Download & Apply',
                desc: 'Download your ATS-compatible CV and job-specific cover letter as PDF. Ready in minutes.',
                color: 'emerald',
                bg: 'bg-emerald-50',
                border: 'border-emerald-100',
                iconColor: 'text-emerald-600',
                numColor: 'text-emerald-500',
              },
            ].map((step, i) => (
              <div key={i} className={`relative bg-white border ${step.border} rounded-2xl p-8 hover:shadow-lg transition-all duration-300 group`}>
                <div className={`text-5xl font-black ${step.numColor} opacity-10 absolute top-6 right-6 font-mono`}>
                  {step.num}
                </div>
                <div className={`w-14 h-14 ${step.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform`}>
                  <step.icon className={`w-7 h-7 ${step.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button
              onClick={handleStart}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white font-semibold px-6 py-3 rounded-xl transition-all cursor-pointer"
            >
              Start Now <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-slate-900">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {[
            { value: '2,400+', label: 'Active Users', icon: Users },
            { value: '87%', label: 'More Interviews', icon: TrendingUp },
            { value: '5', label: 'Professional Templates', icon: FileText },
            { value: '30s', label: 'Average Generation Time', icon: Zap },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="flex justify-center mb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-blue-400" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-16 sm:py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left text */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold uppercase tracking-wider mb-4 border border-slate-200">
                Features
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Features That Make<br />Your Application Stand Out
              </h2>
              <p className="mt-4 text-slate-500 leading-relaxed">
                Not just a CV editor — a career assistant that optimizes every step of your application.
              </p>

              <div className="mt-10 space-y-6">
                {[
                  {
                    icon: Shield,
                    title: 'ATS-Compatible Format',
                    desc: 'Passes through applicant tracking systems used by large companies (Workday, Greenhouse, Lever) seamlessly.',
                    color: 'text-blue-600',
                    bg: 'bg-blue-50',
                  },
                  {
                    icon: Target,
                    title: 'Job-Specific Optimization',
                    desc: 'AI analyzes keywords, requirements, and company culture from the posting to tailor your CV and cover letter.',
                    color: 'text-violet-600',
                    bg: 'bg-violet-50',
                  },
                  {
                    icon: Globe,
                    title: 'Bilingual Support',
                    desc: 'Create professional, fluent CVs in both English and Turkish.',
                    color: 'text-emerald-600',
                    bg: 'bg-emerald-50',
                  },
                  {
                    icon: BarChart2,
                    title: 'Action-Oriented Language',
                    desc: 'Transforms raw notes into powerful statements like "Led, increased by 40%, reached 3M users".',
                    color: 'text-amber-600',
                    bg: 'bg-amber-50',
                  },
                ].map((f, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className={`w-11 h-11 ${f.bg} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                      <f.icon className={`w-5 h-5 ${f.color}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">{f.title}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Feature cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Award, title: 'Professional Templates', desc: '5 different design options', color: 'from-blue-500 to-blue-600' },
                { icon: Zap, title: 'Ready in 30 Seconds', desc: 'AI-speed generation', color: 'from-amber-500 to-orange-500' },
                { icon: FileText, title: 'PDF Download', desc: 'Instant high-quality PDF', color: 'from-emerald-500 to-teal-500' },
                { icon: Users, title: 'Cover Letter', desc: 'Personalized writing', color: 'from-violet-500 to-purple-500' },
                { icon: Globe, title: 'Multilingual', desc: 'EN & TR support', color: 'from-rose-500 to-pink-500' },
                { icon: Shield, title: 'Secure Storage', desc: 'Save & edit your CVs', color: 'from-slate-600 to-slate-700' },
              ].map((card, i) => (
                <div
                  key={i}
                  className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
                >
                  <div className={`w-10 h-10 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                    <card.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm mb-1">{card.title}</h3>
                  <p className="text-xs text-slate-500">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-slate-50 border-y border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-slate-600 text-xs font-semibold uppercase tracking-wider mb-4 border border-slate-200">
              User Reviews
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Real Users, Real Results
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Alex Carter',
                role: 'Marketing Specialist',
                company: 'HubSpot',
                text: 'I created my CV in an hour and got an interview invitation within 3 days. I was amazed watching the AI adapt when I pasted the job posting.',
                rating: 5,
                avatar: 'AC',
                color: 'bg-blue-500',
              },
              {
                name: 'Mike Zhang',
                role: 'Software Developer',
                company: 'Stripe',
                text: 'I used to struggle with writing CVs. This tool handled both the content and the language perfectly. Now I prepare a separate CV for every job posting.',
                rating: 5,
                avatar: 'MZ',
                color: 'bg-emerald-500',
              },
              {
                name: 'Emily Ross',
                role: 'Financial Analyst',
                company: 'Goldman Sachs',
                text: 'The professional templates are truly impressive. The cover letter feature is amazing too — it generates a personalized, genuine letter for each company.',
                rating: 5,
                avatar: 'ER',
                color: 'bg-violet-500',
              },
            ].map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-7 border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className={`w-9 h-9 rounded-full ${t.color} flex items-center justify-center text-white text-xs font-bold`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role} · {t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COVER LETTER CTA ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl overflow-hidden p-10 sm:p-14">
            {/* Decorative blobs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

            <div className="relative grid lg:grid-cols-2 gap-10 items-center">
              {/* Left */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold uppercase tracking-wider mb-5">
                  <Sparkles className="w-3.5 h-3.5" />
                  New Feature
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
                  Cover Letter<br />
                  <span className="text-violet-400">With AI in Seconds</span>
                </h2>
                <p className="text-slate-400 text-base leading-relaxed mb-8">
                  No CV needed. Paste the job posting, choose your tone — AI writes a personalized,
                  company-specific, job-specific cover letter for you. Download as PDF or copy.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleStart}
                    className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-6 py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-violet-900/40 cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    Start Building
                  </button>
                  <button
                    onClick={() => scrollTo('features')}
                    className="inline-flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold px-6 py-3.5 rounded-xl border border-slate-600 transition-all duration-200 cursor-pointer"
                  >
                    See Features <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right — Mini preview */}
              <div className="hidden lg:block">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs text-slate-400 font-medium">AI Writing...</span>
                    </div>
                    <div className="flex gap-1">
                      {['Professional', 'Friendly', 'Creative'].map((t, i) => (
                        <span key={i} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${i === 0 ? 'bg-violet-500/30 text-violet-300 border border-violet-500/30' : 'text-slate-600'}`}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    <div className="h-2 bg-white/10 rounded-full w-4/5" />
                    <div className="h-2 bg-white/10 rounded-full w-full" />
                    <div className="h-2 bg-white/10 rounded-full w-3/4" />
                    <div className="h-2 bg-white/5 rounded-full w-full mt-4" />
                    <div className="h-2 bg-white/10 rounded-full w-full" />
                    <div className="h-2 bg-white/10 rounded-full w-5/6" />
                    <div className="h-2 bg-white/10 rounded-full w-full" />
                    <div className="h-2 bg-white/5 rounded-full w-full mt-4" />
                    <div className="h-2 bg-white/10 rounded-full w-4/5" />
                    <div className="h-2 bg-white/10 rounded-full w-2/3" />
                  </div>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-xs text-slate-500">250–350 words · EN / TR</span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 bg-white/5 px-2 py-1 rounded-lg border border-white/10">
                        <Download className="w-3 h-3" /> PDF
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 bg-white/5 px-2 py-1 rounded-lg border border-white/10">
                        <ClipboardList className="w-3 h-3" /> Copy
                      </div>
                    </div>
                  </div>
                </div>

                {/* Checklist */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {[
                    'Job-specific content',
                    '3 tone options',
                    'EN & TR support',
                    'Instant PDF',
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-16 sm:py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold uppercase tracking-wider mb-4 border border-slate-200">
              Pricing
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Transparent and Simple Pricing
            </h2>
            <p className="mt-3 text-slate-500">Start free, upgrade when you need to.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Free */}
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 hover:border-slate-300 transition-colors">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-1">Free</h3>
                <p className="text-sm text-slate-500">Perfect for trying it out</p>
              </div>
              <div className="flex items-end gap-1 mb-8">
                <span className="text-5xl font-extrabold text-slate-900">$0</span>
                <span className="text-slate-500 mb-2">/mo</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  { text: '1 CV creation', ok: true },
                  { text: '1 Cover Letter', ok: true },
                  { text: '2 Templates', ok: true },
                  { text: 'English & Turkish', ok: true },
                  { text: 'PDF with watermark', ok: false },
                  { text: 'Save CVs', ok: false },
                ].map((item, i) => (
                  <li key={i} className={`flex items-center gap-2.5 text-sm ${item.ok ? 'text-slate-700' : 'text-slate-400 line-through'}`}>
                    <CheckCircle className={`w-4 h-4 flex-shrink-0 ${item.ok ? 'text-emerald-500' : 'text-slate-300'}`} />
                    {item.text}
                  </li>
                ))}
              </ul>
              <button
                onClick={handleStart}
                className="w-full py-3 rounded-xl border-2 border-slate-900 text-slate-900 font-semibold hover:bg-slate-50 transition-colors cursor-pointer text-sm"
              >
                Get Started Free
              </button>
            </div>

            {/* Pro */}
            <div className="bg-slate-900 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-2xl" />
              <div className="absolute top-5 right-5 bg-amber-400 text-slate-900 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                Recommended
              </div>
              <div className="mb-6 relative">
                <h3 className="text-lg font-bold text-white mb-1">Pro</h3>
                <p className="text-sm text-slate-500">For active job seekers</p>
              </div>
              <div className="flex items-end gap-1 mb-8 relative">
                <span className="text-5xl font-extrabold text-white">$9</span>
                <span className="text-slate-500 mb-2">/mo</span>
              </div>
              <ul className="space-y-3 mb-8 relative">
                {[
                  'Unlimited CV creation',
                  'Unlimited Cover Letters',
                  '5 Premium Templates',
                  'No watermark',
                  'Save & edit CVs',
                  'Job-specific optimization',
                  'Priority support',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 text-blue-400" />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={handleStart}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors cursor-pointer text-sm relative"
              >
                Upgrade to Pro — $9/mo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 bg-slate-950">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-blue-400" />
          </div>
          <h2 className="text-4xl font-extrabold text-white tracking-tight mb-4">
            Your Next Career Step<br />Starts Here
          </h2>
          <p className="text-slate-500 text-lg mb-8 max-w-xl mx-auto">
            Join 2,400+ professionals. Build your CV, apply for your dream position.
          </p>
          <button
            onClick={handleStart}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg shadow-blue-900/30 cursor-pointer text-base"
          >
            Get Started Free <ArrowRight className="w-5 h-5" />
          </button>
          <p className="mt-4 text-slate-600 text-sm">No credit card required · Ready in 2 minutes</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-950 border-t border-slate-800/50 py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <button onClick={() => setCurrentPage('landing')} className="flex items-center gap-2.5 cursor-pointer group">
              <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center group-hover:bg-slate-700 transition-colors">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white text-lg">
                CV<span className="text-blue-400">App</span>
              </span>
            </button>

            <div className="flex items-center gap-6 text-sm text-slate-500">
              <button onClick={() => scrollTo('features')} className="hover:text-slate-300 transition-colors cursor-pointer">Features</button>
              <button onClick={() => scrollTo('how-it-works')} className="hover:text-slate-300 transition-colors cursor-pointer">How It Works</button>
              <button className="hover:text-slate-300 transition-colors cursor-pointer">Privacy Policy</button>
              <button className="hover:text-slate-300 transition-colors cursor-pointer">Contact</button>
            </div>

            <p className="text-sm text-slate-600">© 2025 CVio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
 
