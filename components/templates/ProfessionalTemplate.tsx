import type { CVData, GeneratedContent } from '../../types';

interface Props { data: CVData; content: GeneratedContent; watermark?: boolean; }

export function ProfessionalTemplate({ data, content, watermark = false }: Props) {
  const { personalInfo } = data;
  const { cvContent } = content;
  const isEn = data.preferences.language === 'en';

  const initials = personalInfo.fullName
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="bg-white w-full relative overflow-hidden"
      style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", minHeight: '842px', fontSize: '11px' }}
    >
      {watermark && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 rotate-[-35deg]">
          <span className="text-gray-200 font-bold text-5xl select-none opacity-60 tracking-widest">cvio.app</span>
        </div>
      )}

      {/* ── Top Header Band ── */}
      <div className="bg-slate-900 text-white px-10 py-7 relative overflow-hidden">
        {/* decorative circles */}
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/5" />
        <div className="absolute right-16 -bottom-6 w-20 h-20 rounded-full bg-white/5" />

        <div className="relative flex items-center gap-6">
          <div className="w-16 h-16 rounded-xl border border-white/10 flex-shrink-0 overflow-hidden flex items-center justify-center bg-gradient-to-br from-slate-600 to-slate-700">
            {personalInfo.photo
              ? <img src={personalInfo.photo} alt={personalInfo.fullName} className="w-full h-full object-cover" />
              : <span className="text-xl font-bold">{initials}</span>
            }
          </div>
          <div className="flex-1">
            <h1 className="text-[20px] font-bold tracking-tight leading-tight">{personalInfo.fullName}</h1>
            {cvContent.experience[0] && (
              <p className="text-slate-400 text-[11px] mt-0.5 font-medium">{cvContent.experience[0].position}</p>
            )}
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
              {personalInfo.email && (
                <span className="text-slate-400 text-[9.5px] flex items-center gap-1">
                  <span className="text-slate-500">✉</span> {personalInfo.email}
                </span>
              )}
              {personalInfo.phone && (
                <span className="text-slate-400 text-[9.5px] flex items-center gap-1">
                  <span className="text-slate-500">☎</span> {personalInfo.phone}
                </span>
              )}
              {(personalInfo.city || personalInfo.country) && (
                <span className="text-slate-400 text-[9.5px] flex items-center gap-1">
                  <span className="text-slate-500">⌂</span> {[personalInfo.city, personalInfo.country].filter(Boolean).join(', ')}
                </span>
              )}
              {personalInfo.linkedin && (
                <span className="text-slate-400 text-[9.5px]">
                  {personalInfo.linkedin.replace('https://linkedin.com/in/', 'linkedin/')}
                </span>
              )}
              {personalInfo.github && (
                <span className="text-slate-400 text-[9.5px]">
                  {personalInfo.github.replace('https://github.com/', 'github/')}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex min-h-[700px]">
        {/* Main */}
        <div className="flex-1 px-8 py-7 border-r border-gray-100">
          {/* Personal Statement */}
          {personalInfo.personalStatement && (
            <div className="mb-7">
              <div className="flex items-center gap-2 mb-3 pb-1.5 border-b border-slate-200">
                <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-[0.18em]">Personal Statement</h2>
              </div>
              <p className="text-gray-700 text-[11px] leading-[1.75]">{personalInfo.personalStatement}</p>
            </div>
          )}

          {/* Summary */}
          {cvContent.summary && (
            <div className="mb-7">
              <div className="flex items-center gap-2 mb-3 pb-1.5 border-b border-slate-200">
                <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-[0.18em]">
                  Profile Summary
                </h2>
              </div>
              <p className="text-gray-600 text-[11px] leading-[1.75]">{cvContent.summary}</p>
            </div>
          )}

          {/* Experience */}
          {cvContent.experience.length > 0 && (
            <div className="mb-7">
              <div className="flex items-center gap-2 mb-4 pb-1.5 border-b border-slate-200">
                <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-[0.18em]">
                  Work Experience
                </h2>
              </div>
              <div className="space-y-6">
                {cvContent.experience.map((exp, i) => (
                  <div key={i} className="relative pl-4 border-l-2 border-slate-200">
                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-slate-900 border-2 border-white" />
                    <div className="flex justify-between items-start mb-1.5">
                      <div>
                        <h3 className="font-bold text-slate-900 text-[12px] leading-tight">{exp.position}</h3>
                        <p className="text-slate-500 text-[11px] font-medium mt-0.5">{exp.company}</p>
                      </div>
                      <span className="text-[9.5px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded flex-shrink-0 ml-2 font-medium">
                        {exp.startDate} – {exp.endDate}
                      </span>
                    </div>
                    <ul className="mt-2 space-y-1.5">
                      {exp.bullets.map((b, j) => (
                        <li key={j} className="flex items-start gap-2 text-[10.5px] text-gray-600">
                          <span className="text-slate-400 flex-shrink-0 mt-0.5">▸</span>
                          <span className="leading-[1.6]">{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-[210px] px-6 py-7 bg-gray-50/50">
          {/* Skills */}
          {cvContent.skills.length > 0 && (
            <div className="mb-7">
              <div className="pb-1.5 border-b border-slate-200 mb-3">
                <h2 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.18em]">
                  Skills
                </h2>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {cvContent.skills.map((s, i) => (
                  <span key={i} className="text-[9.5px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {cvContent.education.length > 0 && (
            <div className="mb-7">
              <div className="pb-1.5 border-b border-slate-200 mb-3">
                <h2 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.18em]">
                  Education
                </h2>
              </div>
              <div className="space-y-4">
                {cvContent.education.map((edu, i) => (
                  <div key={i} className="bg-white rounded-lg p-3 border border-gray-200">
                    <p className="font-bold text-slate-900 text-[10px] leading-tight">{edu.school}</p>
                    <p className="text-slate-600 text-[9.5px] mt-1">{edu.degree}</p>
                    {edu.department && <p className="text-slate-500 text-[9.5px]">{edu.department}</p>}
                    <p className="text-slate-400 text-[9px] mt-1">{edu.year}</p>
                    {edu.gpa && <p className="text-slate-400 text-[9px]">GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certificates */}
          {cvContent.certificates.length > 0 && (
            <div>
              <div className="pb-1.5 border-b border-slate-200 mb-3">
                <h2 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.18em]">
                  Certifications
                </h2>
              </div>
              <div className="space-y-3">
                {cvContent.certificates.map((cert, i) => (
                  <div key={i}>
                    <p className="font-bold text-slate-900 text-[10px]">{cert.name}</p>
                    <p className="text-slate-500 text-[9.5px] mt-0.5">{cert.institution}</p>
                    <p className="text-slate-400 text-[9px]">{cert.year}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
