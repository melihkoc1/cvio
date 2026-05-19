import type { CVData, GeneratedContent } from '../../types';

interface Props { data: CVData; content: GeneratedContent; watermark?: boolean; }

export function ClassicTemplate({ data, content, watermark = false }: Props) {
  const { personalInfo } = data;
  const { cvContent } = content;
  const isEn = data.preferences.language === 'en';

  return (
    <div
      className="bg-white w-full relative"
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif", minHeight: '842px', fontSize: '11px', lineHeight: '1.6' }}
    >
      {watermark && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 rotate-[-35deg]">
          <span className="text-gray-200 font-bold text-5xl select-none opacity-60 tracking-widest">cvio.app</span>
        </div>
      )}

      <div className="px-12 py-10">
        {/* ── Header ── */}
        <div className="text-center mb-6">
          <h1 className="text-[22px] font-bold text-gray-900 tracking-widest uppercase mb-2">
            {personalInfo.fullName}
          </h1>
          {cvContent.experience[0] && (
            <p className="text-gray-500 text-[11px] tracking-wider uppercase mb-3 font-normal italic">
              {cvContent.experience[0].position}
            </p>
          )}
          <div className="flex items-center justify-center flex-wrap gap-x-2 gap-y-1 text-[9.5px] text-gray-600">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <><span className="text-gray-300">|</span><span>{personalInfo.phone}</span></>}
            {(personalInfo.city || personalInfo.country) && (
              <><span className="text-gray-300">|</span><span>{[personalInfo.city, personalInfo.country].filter(Boolean).join(', ')}</span></>
            )}
            {personalInfo.linkedin && (
              <><span className="text-gray-300">|</span><span>{personalInfo.linkedin.replace('https://', '')}</span></>
            )}
            {personalInfo.github && (
              <><span className="text-gray-300">|</span><span>{personalInfo.github.replace('https://', '')}</span></>
            )}
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="flex items-center gap-2 mb-5">
          <div className="flex-1 h-px bg-gray-900" />
          <div className="flex-1 h-px bg-gray-900" />
        </div>

        {/* ── Personal Statement ── */}
        {personalInfo.personalStatement && (
          <div className="mb-5">
            <h2 className="text-[10px] font-bold tracking-[0.18em] uppercase text-gray-900 mb-2 border-b border-gray-300 pb-1">
              Personal Statement
            </h2>
            <p className="text-gray-700 text-[10px] leading-relaxed">{personalInfo.personalStatement}</p>
          </div>
        )}

        {/* ── Summary ── */}
        {cvContent.summary && (
          <div className="mb-5">
            <h2 className="text-[10px] font-bold tracking-[0.18em] uppercase text-gray-900 mb-2 border-b border-gray-300 pb-1">
              Professional Summary
            </h2>
            <p className="text-gray-700 text-[10px] leading-relaxed italic">{cvContent.summary}</p>
          </div>
        )}

        {/* ── Experience ── */}
        {cvContent.experience.length > 0 && (
          <div className="mb-5">
            <h2 className="text-[10px] font-bold tracking-[0.18em] uppercase text-gray-900 mb-3 border-b border-gray-300 pb-1">
              Professional Experience
            </h2>
            <div className="space-y-4">
              {cvContent.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline">
                    <div>
                      <span className="font-bold text-gray-900 text-[11px]">{exp.position}</span>
                      <span className="text-gray-500 text-[10px]"> · {exp.company}</span>
                    </div>
                    <span className="text-gray-500 text-[9.5px] italic flex-shrink-0 ml-4">
                      {exp.startDate} – {exp.endDate}
                    </span>
                  </div>
                  <ul className="mt-1.5 ml-4 space-y-1">
                    {exp.bullets.map((b, j) => (
                      <li key={j} className="text-gray-700 text-[10px] list-disc list-outside leading-relaxed">{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Education ── */}
        {cvContent.education.length > 0 && (
          <div className="mb-5">
            <h2 className="text-[10px] font-bold tracking-[0.18em] uppercase text-gray-900 mb-3 border-b border-gray-300 pb-1">
              Education
            </h2>
            <div className="space-y-2">
              {cvContent.education.map((edu, i) => (
                <div key={i} className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-gray-900 text-[10px]">{edu.school}</span>
                    <span className="text-gray-600 text-[10px]"> · {edu.degree}{edu.department ? `, ${edu.department}` : ''}</span>
                    {edu.gpa && <span className="text-gray-500 text-[9px]"> · GPA: {edu.gpa}</span>}
                  </div>
                  <span className="text-gray-500 text-[9.5px] italic flex-shrink-0 ml-4">{edu.year}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Skills ── */}
        {cvContent.skills.length > 0 && (
          <div className="mb-5">
            <h2 className="text-[10px] font-bold tracking-[0.18em] uppercase text-gray-900 mb-2 border-b border-gray-300 pb-1">
              Core Skills
            </h2>
            <p className="text-gray-700 text-[10px] leading-relaxed">
              {cvContent.skills.join(' · ')}
            </p>
          </div>
        )}

        {/* ── Certificates ── */}
        {cvContent.certificates.length > 0 && (
          <div>
            <h2 className="text-[10px] font-bold tracking-[0.18em] uppercase text-gray-900 mb-2 border-b border-gray-300 pb-1">
              Certifications
            </h2>
            <div className="space-y-1">
              {cvContent.certificates.map((cert, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-gray-700 text-[10px]">
                    <strong>{cert.name}</strong> · {cert.institution}
                  </span>
                  <span className="text-gray-500 text-[9.5px] italic">{cert.year}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
