import type { CVData, GeneratedContent } from '../../types';
import { Mail, Phone, MapPin } from 'lucide-react';

interface Props { data: CVData; content: GeneratedContent; watermark?: boolean; }

export function ModernTemplate({ data, content, watermark = false }: Props) {
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
      style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", height: '1131px', fontSize: '11px' }}
    >
      {watermark && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 rotate-[-35deg]">
          <span className="text-gray-200 font-bold text-5xl select-none opacity-60 tracking-widest">cvio.app</span>
        </div>
      )}

      <div className="flex h-full">
        {/* ── Sidebar ── */}
        <div className="w-[33%] bg-slate-800 text-white flex flex-col">
          {/* Avatar & Name */}
          <div className="bg-blue-600 px-6 pt-8 pb-6">
            <div className="w-20 h-20 rounded-full border-2 border-white/40 mb-4 mx-auto overflow-hidden flex items-center justify-center bg-white/20">
              {personalInfo.photo
                ? <img src={personalInfo.photo} alt={personalInfo.fullName} className="w-full h-full object-cover" />
                : <span className="text-2xl font-bold">{initials}</span>
              }
            </div>
            <h1 className="text-[15px] font-bold text-white text-center leading-tight">{personalInfo.fullName}</h1>
            {cvContent.experience[0] && (
              <p className="text-blue-200 text-[10px] text-center mt-1 font-medium">{cvContent.experience[0].position}</p>
            )}
          </div>

          <div className="px-5 py-6 flex flex-col gap-5 flex-1">
            {/* Contact */}
            <div>
              <h2 className="text-[9px] font-bold uppercase tracking-[0.15em] text-blue-400 mb-3">
                Contact
              </h2>
              <div className="space-y-2">
                {personalInfo.email && (
                  <div className="flex items-center gap-2 text-[9.5px] text-slate-300">
                    <Mail className="w-3 h-3 text-blue-400 flex-shrink-0" />
                    <span className="truncate">{personalInfo.email}</span>
                  </div>
                )}
                {personalInfo.phone && (
                  <div className="flex items-center gap-2 text-[9.5px] text-slate-300">
                    <Phone className="w-3 h-3 text-blue-400 flex-shrink-0" />
                    <span>{personalInfo.phone}</span>
                  </div>
                )}
                {(personalInfo.city || personalInfo.country) && (
                  <div className="flex items-center gap-2 text-[9.5px] text-slate-300">
                    <MapPin className="w-3 h-3 text-blue-400 flex-shrink-0" />
                    <span>{[personalInfo.city, personalInfo.country].filter(Boolean).join(', ')}</span>
                  </div>
                )}
                {personalInfo.linkedin && (
                  <div className="flex items-center gap-2 text-[9.5px] text-slate-300">
                    <span className="text-blue-400 flex-shrink-0 text-[10px] font-bold">in</span>
                    <span className="truncate">{personalInfo.linkedin.replace('https://linkedin.com/in/', '')}</span>
                  </div>
                )}
                {personalInfo.github && (
                  <div className="flex items-center gap-2 text-[9.5px] text-slate-300">
                    <span className="text-blue-400 flex-shrink-0 text-[10px] font-bold">gh</span>
                    <span className="truncate">{personalInfo.github.replace('https://github.com/', '')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Skills */}
            {cvContent.skills.length > 0 && (
              <div>
                <h2 className="text-[9px] font-bold uppercase tracking-[0.15em] text-blue-400 mb-3">
                  Skills
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {cvContent.skills.map((s, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-blue-600/30 border border-blue-500/30 text-blue-200 rounded text-[9px] font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {cvContent.education.length > 0 && (
              <div>
                <h2 className="text-[9px] font-bold uppercase tracking-[0.15em] text-blue-400 mb-3">
                  Education
                </h2>
                <div className="space-y-3">
                  {cvContent.education.map((edu, i) => (
                    <div key={i} className="border-l-2 border-blue-500/50 pl-3">
                      <p className="font-semibold text-white text-[10px] leading-tight">{edu.school}</p>
                      <p className="text-blue-300 text-[9px] mt-0.5">{edu.degree}</p>
                      <p className="text-slate-400 text-[9px]">{edu.department}</p>
                      <p className="text-slate-500 text-[9px]">{edu.year}</p>
                      {edu.gpa && <p className="text-slate-500 text-[9px]">GPA: {edu.gpa}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certificates */}
            {cvContent.certificates.length > 0 && (
              <div>
                <h2 className="text-[9px] font-bold uppercase tracking-[0.15em] text-blue-400 mb-3">
                  Certificates
                </h2>
                <div className="space-y-2">
                  {cvContent.certificates.map((cert, i) => (
                    <div key={i}>
                      <p className="font-semibold text-white text-[9.5px]">{cert.name}</p>
                      <p className="text-slate-400 text-[9px]">{cert.institution} · {cert.year}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Main Content ── */}
        <div className="w-[67%] px-7 py-8 flex flex-col gap-6">
          {/* Personal Statement */}
          {personalInfo.personalStatement && (
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-[10px] font-bold text-slate-800 uppercase tracking-[0.12em]">Personal Statement</h2>
                <div className="flex-1 h-px bg-blue-600" />
              </div>
              <p className="text-slate-600 text-[10px] leading-[1.7]">{personalInfo.personalStatement}</p>
            </div>
          )}

          {/* Summary */}
          {cvContent.summary && (
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-[10px] font-bold text-slate-800 uppercase tracking-[0.12em]">
                  Professional Summary
                </h2>
                <div className="flex-1 h-px bg-blue-600" />
              </div>
              <p className="text-slate-600 text-[10px] leading-[1.7]">{cvContent.summary}</p>
            </div>
          )}

          {/* Experience */}
          {cvContent.experience.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-[10px] font-bold text-slate-800 uppercase tracking-[0.12em]">
                  Work Experience
                </h2>
                <div className="flex-1 h-px bg-blue-600" />
              </div>
              <div className="space-y-4">
                {cvContent.experience.map((exp, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="font-bold text-slate-900 text-[11px]">{exp.position}</h3>
                        <p className="text-blue-600 font-semibold text-[10px]">{exp.company}</p>
                      </div>
                      <span className="text-[9px] text-white bg-blue-600 px-2 py-0.5 rounded-full flex-shrink-0 ml-2">
                        {exp.startDate} — {exp.endDate}
                      </span>
                    </div>
                    <ul className="space-y-1 mt-1.5">
                      {exp.bullets.map((b, j) => (
                        <li key={j} className="flex items-start gap-2 text-[10px] text-slate-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
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
      </div>
    </div>
  );
}
