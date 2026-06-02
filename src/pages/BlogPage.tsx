import { useApp } from '../store';
import { ArrowRight, Clock, ChevronLeft, ArrowUpRight } from 'lucide-react';

export const BLOG_POSTS = [
  {
    slug: 'anatomy-of-a-perfect-cv-2026',
    week: '01',
    category: 'Fundamentals',
    title: 'The Anatomy of a Perfect CV: 2026 Standards',
    excerpt: 'What does a CV that actually works look like in 2026, where AI screening and ATS systems dominate hiring? We break it down section by section.',
    readTime: '8 min',
    date: 'April 2, 2026',
    featured: true,
  },
];

const COMING_SOON = [
  { week: '02', category: 'ATS', title: 'How ATS Systems Work — and Why Your CV Gets Rejected' },
  { week: '03', category: 'Writing', title: 'Reading Job Postings: How to Mirror Keywords in Your CV' },
  { week: '04', category: 'Industry', title: 'The Software Developer CV Guide: Technical vs. General Roles' },
  { week: '05', category: 'Career', title: 'Updating Your CV When Changing Industries' },
];

const CATEGORY_COLORS: Record<string, string> = {
  'Fundamentals': 'bg-blue-100 text-blue-700',
  'ATS': 'bg-emerald-100 text-emerald-700',
  'Writing': 'bg-violet-100 text-violet-700',
  'Industry': 'bg-orange-100 text-orange-700',
  'Career': 'bg-rose-100 text-rose-700',
};

export function BlogPage() {
  const { setCurrentPage } = useApp();
  const featured = BLOG_POSTS.find(p => p.featured);

  return (
    <div className="min-h-screen bg-white pt-24 pb-24">
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <div className="mb-14 border-b border-slate-100 pb-8">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-[0.2em] mb-3">CVio Blog</p>
          <div className="flex items-end justify-between gap-4">
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 leading-none tracking-tight">
              CV & Career<br />Guide
            </h1>
            <p className="text-slate-400 text-sm max-w-xs text-right hidden sm:block">
              Weekly guides on job applications, CV writing, and career growth.
            </p>
          </div>
        </div>

        {/* Featured post */}
        {featured && (
          <button
            onClick={() => setCurrentPage(`blog/${featured.slug}` as any)}
            className="w-full group mb-14 cursor-pointer text-left"
          >
            <div className="grid sm:grid-cols-[1fr_420px] gap-0 rounded-2xl overflow-hidden border border-slate-100 hover:border-blue-200 transition-colors shadow-sm hover:shadow-md">
              {/* Left — content */}
              <div className="bg-slate-950 p-8 sm:p-10 flex flex-col justify-between min-h-[240px]">
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Week {featured.week}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[featured.category] || 'bg-slate-100 text-slate-600'}`}>
                      {featured.category}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight group-hover:text-blue-400 transition-colors">
                    {featured.title}
                  </h2>
                  <p className="mt-3 text-slate-400 text-sm leading-relaxed line-clamp-2">{featured.excerpt}</p>
                </div>
                <div className="flex items-center gap-4 mt-6">
                  <span className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />{featured.readTime} read
                  </span>
                  <span className="text-xs text-slate-600">{featured.date}</span>
                  <span className="ml-auto flex items-center gap-1.5 text-blue-400 text-xs font-semibold">
                    Read <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
              {/* Right — decorative */}
              <div className="hidden sm:flex bg-gradient-to-br from-blue-600 to-indigo-700 items-center justify-center p-10">
                <div className="text-center">
                  <div className="text-8xl font-black text-white/20 leading-none">01</div>
                  <div className="mt-4 space-y-2">
                    {['Header', 'Summary', 'Experience', 'Skills', 'Education'].map((s, i) => (
                      <div key={s} className="flex items-center gap-2">
                        <div className="h-1.5 rounded-full bg-white/30" style={{ width: `${[100, 80, 120, 90, 70][i]}px` }} />
                        <span className="text-white/40 text-[10px]">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </button>
        )}

        {/* Coming soon */}
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Coming Soon</p>
          <div className="divide-y divide-slate-100">
            {COMING_SOON.map((p) => (
              <div key={p.week} className="py-5 flex items-center gap-5 opacity-40 select-none">
                <span className="text-3xl font-black text-slate-100 w-12 flex-shrink-0 leading-none">{p.week}</span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${CATEGORY_COLORS[p.category] || 'bg-slate-100 text-slate-600'}`}>
                  {p.category}
                </span>
                <span className="text-sm font-semibold text-slate-400 flex-1">{p.title}</span>
                <span className="text-xs text-slate-300 flex-shrink-0">Coming soon</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export function BlogPostPage({ slug }: { slug: string }) {
  const { setCurrentPage } = useApp();
  const post = BLOG_POSTS.find(p => p.slug === slug);
  if (!post) return null;

  return (
    <div className="min-h-screen bg-white pt-20 pb-24">
      {/* Top bar */}
      <div className="border-b border-slate-100 bg-white sticky top-[72px] z-40">
        <div className="max-w-2xl mx-auto px-6 h-12 flex items-center gap-4">
          <button
            onClick={() => setCurrentPage('blog' as any)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Blog
          </button>
          <span className="text-slate-200">/</span>
          <span className="text-xs text-slate-400 truncate">{post.title}</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 pt-10">
        {/* Meta */}
        <div className="flex items-center gap-3 mb-6">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[post.category] || 'bg-slate-100 text-slate-600'}`}>
            {post.category}
          </span>
          <span className="text-xs text-slate-400">Week {post.week}</span>
          <span className="text-slate-200">·</span>
          <span className="text-xs text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
          <span className="text-slate-200">·</span>
          <span className="text-xs text-slate-400">{post.date}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight tracking-tight mb-6">
          {post.title}
        </h1>

        <p className="text-lg text-slate-500 leading-relaxed border-l-4 border-blue-500 pl-5 mb-10">
          {post.excerpt}
        </p>

        <BlogPostContent slug={slug} onCTA={() => setCurrentPage('app')} />
      </div>
    </div>
  );
}

function BlogPostContent({ slug, onCTA }: { slug: string; onCTA: () => void }) {
  if (slug === 'anatomy-of-a-perfect-cv-2026') return <Post01 onCTA={onCTA} />;
  return null;
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-bold text-slate-900 mt-10 mb-3">{children}</h2>;
}
function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-base font-bold text-slate-800 mt-7 mb-2">{children}</h3>;
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="text-slate-600 leading-relaxed mb-4 text-[15px]">{children}</p>;
}
function Li({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2.5 text-slate-600 leading-relaxed mb-2.5 text-[15px]">
      <span className="text-blue-400 mt-[3px] flex-shrink-0 text-xs">▸</span>
      <span>{children}</span>
    </li>
  );
}
function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-xl px-5 py-4 my-7 text-sm text-blue-800 leading-relaxed">
      {children}
    </div>
  );
}
function Warning({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl px-5 py-4 my-7 text-sm text-amber-800 leading-relaxed">
      {children}
    </div>
  );
}

function Post01({ onCTA }: { onCTA: () => void }) {
  return (
    <article>
      <H2>Why CVs Are Different in 2026</H2>
      <P>A significant portion of the CV rules that worked three years ago no longer apply. There are two core reasons: AI-powered recruitment tools and the dramatically more sophisticated ATS (Applicant Tracking System) filters now used across the industry.</P>
      <P>According to LinkedIn's 2025 Hiring Report, <strong>78% of applications</strong> sent to large companies are filtered out by automated systems before a human ever sees them. That figure was 52% in 2022. Which means you're no longer competing against other candidates first — you're competing against an algorithm.</P>
      <Callout>
        <strong>Key insight:</strong> Your CV needs to pass two separate tests. First, the ATS scan — can a machine read it? Second, the human test — does it grab attention in 6 seconds? Doing both at once is a balancing act.
      </Callout>

      <H2>The 7 Sections of a Perfect CV</H2>
      <P>A successful CV in 2026 includes the following sections, in order:</P>

      <H3>1. Header</H3>
      <P>Name, title, email, phone, city, and LinkedIn URL — all in one block at the top of the page. A physical address is no longer required; city alone is fine.</P>
      <ul className="mb-5">
        <Li>Write your LinkedIn URL as <em>linkedin.com/in/your-handle</em> — the full URL isn't necessary.</Li>
        <Li>Add GitHub or a personal site for technical roles.</Li>
        <Li>Photo: still expected in Turkey, Germany, and many European countries. Controversial in the US and UK.</Li>
      </ul>

      <H3>2. Professional Summary</H3>
      <P>The most underestimated and most frequently botched section. Generic openers like "Results-driven, passionate professional seeking..." are instant killers — both for ATS and human readers.</P>
      <Warning>
        <strong>Banned phrases:</strong> "passionate about", "results-driven", "team player", "hard worker", "self-motivated", "detail-oriented", "fast learner", "go-getter" — these are now flagged as empty content by ATS systems.
      </Warning>
      <P>A good summary is 2–3 sentences that <strong>concretely</strong> describe who you are: what you do, where you're strong, what you're after. Not generic — it should feel written specifically for this role.</P>

      <H3>3. Experience</H3>
      <P>The most critical rule for each experience entry: <strong>not a list of duties — a list of impact.</strong> Instead of "Responded to customer queries", try "Handled 400+ monthly customer requests, lifting satisfaction scores to 87%."</P>
      <ul className="mb-5">
        <Li>3–5 bullet points per role is enough. More than that doesn't get read.</Li>
        <Li>Start every bullet with a strong action verb: Led, Built, Reduced, Launched, Shipped, Scaled…</Li>
        <Li>Add numbers, percentages, timeframes, team sizes. If you can't remember, make a reasonable estimate.</Li>
        <Li>Use consistent date formats: "Jan 2023 – Jun 2024" or "01/2023 – 06/2024" — don't mix them.</Li>
      </ul>

      <H3>4. Education</H3>
      <P>If you have 3+ years of experience, put education below experience. If you're a recent graduate, it can go at the top.</P>
      <ul className="mb-5">
        <Li>School name, field of study, degree type, and graduation year — four fields is enough.</Li>
        <Li>Only include GPA if it's 3.5 or above.</Li>
        <Li>Bootcamps and online programs (Coursera, edX) carry real weight in technical roles.</Li>
      </ul>

      <H3>5. Skills</H3>
      <P>This section feeds keywords to ATS. Write technology and tool names exactly as they appear in the job posting — not equivalents, not abbreviations.</P>
      <ul className="mb-5">
        <Li>10–15 skills is the ideal range. Too few looks thin; too many dilutes the signal.</Li>
        <Li>Categorize where possible: Technical / Tools / Languages / Soft Skills.</Li>
        <Li>ATS may not treat "React.js" and "React" as the same — use the exact string from the posting.</Li>
      </ul>

      <H3>6. Certificates</H3>
      <P>Recognized certifications like AWS, Google Cloud, PMP, or CFA both boost your ATS score and stand out to human reviewers. Always include the issuing institution and year.</P>

      <H3>7. Projects / Additional Info</H3>
      <P>For technical roles, GitHub projects, portfolio links, and open-source contributions send strong signals. For other roles, publications, talks, or memberships belong here.</P>

      <H2>ATS Compatibility: Technical Rules</H2>
      <ul className="mb-5">
        <Li><strong>Single-column or simple two-column layout</strong> — complex tables, text boxes, and graphics can't be parsed by ATS.</Li>
        <Li><strong>Standard fonts:</strong> Arial, Calibri, Georgia, Times New Roman — decorative fonts break character recognition.</Li>
        <Li><strong>PDF format</strong> is preferred — Word documents can render incorrectly in some systems.</Li>
        <Li><strong>Standard section headings:</strong> "Experience", "Education", "Skills" — creative names like "My Journey" confuse ATS parsers.</Li>
        <Li><strong>Don't put contact info in the footer</strong> — some systems can't read footers. Keep everything in the body.</Li>
      </ul>

      <H2>Length: How Many Pages?</H2>
      <ul className="mb-5">
        <Li><strong>0–5 years of experience:</strong> 1 page, no exceptions. Don't pad it to fill a second page.</Li>
        <Li><strong>5–15 years:</strong> 1–2 pages. Only spill onto page two if you genuinely need to.</Li>
        <Li><strong>15+ years / academic:</strong> 2–3 pages is acceptable, but the first page must still carry your strongest content.</Li>
      </ul>

      <H2>5 Common Mistakes</H2>
      <ul className="mb-5">
        <Li><strong>Sending the same CV everywhere</strong> — tailor the summary and skills section to match each posting.</Li>
        <Li><strong>Duty-focused bullets</strong> — "Was responsible for" instead of "What did I achieve?"</Li>
        <Li><strong>Inconsistent date formats</strong> — confuses ATS parsers.</Li>
        <Li><strong>Generic summary openers</strong> — starting with "passionate about" is an instant filter.</Li>
        <Li><strong>Contact info in the footer</strong> — some systems simply can't read it.</Li>
      </ul>

      <Callout>
        <strong>Bottom line:</strong> The 2026 CV isn't built around "looking good" — it's built around "being read correctly." There's no single perfect template, but a document that passes both machine and human filters, with strong content and genuine personalization, will always stand out.
      </Callout>

      {/* CTA */}
      <div className="mt-12 bg-slate-950 rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-6">
        <div className="flex-1">
          <p className="text-white font-bold text-lg">Build a CV that follows every rule in this guide</p>
          <p className="text-slate-400 text-sm mt-1">CVio applies all the ATS rules above automatically.</p>
        </div>
        <button
          onClick={onCTA}
          className="flex-shrink-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
        >
          Get Started Free <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </article>
  );
}
