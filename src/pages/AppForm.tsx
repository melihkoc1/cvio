import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, Plus, X, Briefcase, GraduationCap, User, Award, Settings, Sparkles, CheckCircle2, AlertCircle, Zap, Camera, Trash2, FileText, BookOpen, Eye } from 'lucide-react';
import { useApp } from '../store';
import type { CVData, GeneratedContent } from '../types';
import { CVRenderer } from '../components/templates/CVRenderer';

const steps = [
  { title: 'Personal Info', subtitle: 'Your basic contact details', icon: User, color: 'blue' },
  { title: 'Experience & Projects', subtitle: 'Work, projects, volunteering & more', icon: Briefcase, color: 'indigo' },
  { title: 'Education', subtitle: 'Your academic background', icon: GraduationCap, color: 'violet' },
  { title: 'Skills', subtitle: 'Your strengths', icon: Sparkles, color: 'purple' },
  { title: 'Certificates', subtitle: 'Optional — your certifications', icon: Award, color: 'pink' },
  { title: 'Preferences', subtitle: 'CV settings and template', icon: Settings, color: 'rose' },
];

const sectors = [
  'Technology / Software', 'Finance / Accounting', 'Marketing / Advertising',
  'Healthcare', 'Education', 'Legal', 'Engineering', 'Other'
];
const levels = ['Intern', 'Junior', 'Mid-Level', 'Senior', 'Manager', 'Director'];
const degrees = ['High School', "Associate's", "Bachelor's", "Master's", 'PhD'];

const popularSkills = [
  ['Excel', 'Python', 'JavaScript', 'SQL', 'React'],
  ['Project Management', 'Communication', 'Teamwork', 'Problem Solving', 'Leadership'],
  ['Customer Relations', 'Data Analysis', 'Presentation Skills', 'Marketing', 'Sales'],
];

const templateInfo = [
  { id: 'modern',       name: 'Modern',       desc: 'Blue sidebar',     color: 'bg-blue-600' },
  { id: 'classic',      name: 'Classic',      desc: 'Single column',    color: 'bg-gray-800' },
  { id: 'minimal',      name: 'Minimal',      desc: 'Clean & simple',   color: 'bg-slate-400' },
  { id: 'professional', name: 'Professional', desc: 'Dark header',      color: 'bg-slate-900' },
  { id: 'creative',     name: 'Creative',     desc: 'Colorful & bold',  color: 'bg-purple-600' },
  { id: 'executive',    name: 'Executive',    desc: 'Navy & gold',      color: 'bg-[#1a2744]' },
  { id: 'tech',         name: 'Tech',         desc: 'Dark code style',  color: 'bg-[#0d1117]' },
  { id: 'compact',      name: 'Compact',      desc: 'Two-column dense', color: 'bg-teal-600' },
] as const;

function TemplateMiniPreview({ id }: { id: string }) {
  if (id === 'modern') return (
    <div className="w-full h-full flex bg-white">
      <div className="w-[35%] bg-blue-700 p-1 flex flex-col gap-1">
        <div className="w-6 h-6 rounded-full bg-blue-500 mx-auto mb-1" />
        <div className="h-1 bg-blue-500 rounded w-full" />
        <div className="h-0.5 bg-blue-600 rounded w-3/4 mx-auto" />
        <div className="mt-1 h-0.5 bg-blue-500/50 rounded w-full" />
        <div className="h-0.5 bg-blue-600/60 rounded w-full mt-0.5" />
        <div className="h-0.5 bg-blue-600/60 rounded w-3/4 mt-0.5" />
        <div className="mt-1 h-0.5 bg-blue-500/50 rounded w-full" />
        <div className="h-1 bg-blue-500/40 rounded w-1/2 mt-0.5" />
        <div className="h-1 bg-blue-500/40 rounded w-2/3 mt-0.5" />
      </div>
      <div className="flex-1 p-1.5 flex flex-col gap-1">
        <div className="h-0.5 bg-blue-600 rounded w-full mb-0.5" />
        <div className="h-0.5 bg-gray-200 rounded w-full" />
        <div className="h-0.5 bg-gray-200 rounded w-3/4" />
        <div className="h-0.5 bg-blue-600 rounded w-full mt-1 mb-0.5" />
        <div className="h-0.5 bg-gray-300 rounded w-full" />
        <div className="h-0.5 bg-gray-200 rounded w-3/4" />
        <div className="h-0.5 bg-gray-200 rounded w-full" />
        <div className="h-0.5 bg-gray-200 rounded w-2/3 mt-0.5" />
      </div>
    </div>
  );
  if (id === 'classic') return (
    <div className="w-full h-full bg-white p-1.5 flex flex-col gap-1">
      <div className="text-center mb-1">
        <div className="h-1 bg-gray-900 rounded w-2/3 mx-auto mb-0.5" />
        <div className="h-0.5 bg-gray-400 rounded w-1/2 mx-auto" />
        <div className="h-px bg-gray-900 w-full mt-1" />
      </div>
      <div className="h-0.5 bg-gray-900 rounded w-1/2 mb-0.5" />
      <div className="h-px bg-gray-200 rounded w-full mb-0.5" />
      <div className="h-0.5 bg-gray-300 rounded w-full" />
      <div className="h-0.5 bg-gray-200 rounded w-3/4" />
      <div className="h-0.5 bg-gray-900 rounded w-1/2 mt-1 mb-0.5" />
      <div className="h-px bg-gray-200 rounded w-full mb-0.5" />
      <div className="h-0.5 bg-gray-300 rounded w-full" />
      <div className="h-0.5 bg-gray-200 rounded w-2/3" />
    </div>
  );
  if (id === 'minimal') return (
    <div className="w-full h-full bg-white p-2 flex flex-col gap-1.5">
      <div className="h-1.5 bg-gray-900 rounded w-2/3 mb-0.5" />
      <div className="h-0.5 bg-gray-300 rounded w-1/2" />
      <div className="h-0.5 bg-gray-200 rounded w-full" />
      <div className="w-4 h-px bg-gray-900 mt-1" />
      <div className="h-0.5 bg-gray-200 rounded w-1/3 mb-1" />
      <div className="grid grid-cols-[30px_1fr] gap-1">
        <div className="h-0.5 bg-gray-200 rounded text-right" />
        <div className="space-y-0.5">
          <div className="h-0.5 bg-gray-800 rounded" />
          <div className="h-0.5 bg-gray-200 rounded w-3/4" />
          <div className="h-0.5 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  );
  if (id === 'professional') return (
    <div className="w-full h-full bg-white flex flex-col">
      <div className="bg-slate-900 p-1.5">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-slate-700 flex-shrink-0" />
          <div>
            <div className="h-0.5 bg-white rounded w-10 mb-0.5" />
            <div className="h-0.5 bg-slate-400 rounded w-8" />
          </div>
        </div>
      </div>
      <div className="flex flex-1">
        <div className="flex-1 p-1">
          <div className="h-0.5 bg-slate-900 rounded w-8 mb-0.5" />
          <div className="h-0.5 bg-gray-200 rounded w-full" />
          <div className="h-0.5 bg-gray-200 rounded w-3/4" />
        </div>
        <div className="w-1/3 bg-gray-50 p-1 space-y-1">
          <div className="h-0.5 bg-slate-700 rounded w-full" />
          <div className="h-0.5 bg-gray-200 rounded w-full" />
        </div>
      </div>
    </div>
  );
  if (id === 'executive') return (
    <div className="w-full h-full bg-white flex flex-col">
      <div className="h-1 bg-[#1a2744]" />
      <div className="px-1.5 py-1 border-b border-gray-200 flex justify-between items-center">
        <div>
          <div className="h-1 bg-[#1a2744] rounded w-10 mb-0.5" />
          <div className="h-0.5 bg-[#b8962e] rounded w-7" />
        </div>
        <div className="space-y-0.5">
          <div className="h-0.5 bg-gray-300 rounded w-6" />
          <div className="h-0.5 bg-gray-300 rounded w-5" />
        </div>
      </div>
      <div className="flex-1 px-1.5 py-1 space-y-1">
        <div className="h-0.5 bg-[#1a2744] rounded w-1/3" />
        <div className="h-px bg-[#b8962e] w-full" />
        <div className="h-0.5 bg-gray-200 rounded w-full" />
        <div className="h-0.5 bg-gray-200 rounded w-3/4" />
        <div className="h-0.5 bg-[#1a2744] rounded w-1/3 mt-1" />
        <div className="h-px bg-[#b8962e] w-full" />
        <div className="h-0.5 bg-gray-800 rounded w-1/2" />
        <div className="h-0.5 bg-gray-300 rounded w-full" />
      </div>
      <div className="h-0.5 bg-[#b8962e]" />
    </div>
  );
  if (id === 'tech') return (
    <div className="w-full h-full flex bg-white">
      <div className="w-[32%] bg-[#0d1117] p-1 flex flex-col gap-1">
        <div className="w-5 h-5 rounded-full border border-[#30a14e] mx-auto mb-0.5" />
        <div className="h-0.5 bg-[#30a14e]/60 rounded w-full" />
        <div className="h-px bg-[#8b949e]/40 rounded w-full mt-1" />
        <div className="h-px bg-[#8b949e]/40 rounded w-3/4" />
        <div className="h-0.5 bg-[#30a14e]/60 rounded w-full mt-1" />
        <div className="h-px bg-[#8b949e]/40 rounded w-full" />
        <div className="h-px bg-[#8b949e]/40 rounded w-2/3" />
      </div>
      <div className="flex-1 p-1.5 flex flex-col gap-1">
        <div className="border-b border-gray-200 pb-1 mb-0.5">
          <div className="h-1 bg-gray-900 rounded w-3/4" />
          <div className="h-0.5 bg-[#30a14e] rounded w-1/2 mt-0.5" />
        </div>
        <div className="border-l-2 border-[#30a14e] pl-1 space-y-0.5">
          <div className="h-0.5 bg-gray-800 rounded w-3/4" />
          <div className="h-0.5 bg-[#30a14e] rounded w-1/2" />
        </div>
        <div className="space-y-0.5 mt-0.5">
          <div className="h-0.5 bg-gray-200 rounded w-full" />
          <div className="h-0.5 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
    </div>
  );
  if (id === 'compact') return (
    <div className="w-full h-full bg-white flex flex-col">
      <div className="bg-teal-600 px-1.5 py-1">
        <div className="h-1 bg-white rounded w-2/3 mb-0.5" />
        <div className="h-0.5 bg-teal-200 rounded w-1/2" />
      </div>
      <div className="flex flex-1 px-1 py-1 gap-1">
        <div className="w-[58%] border-r border-gray-200 pr-1 space-y-1">
          <div className="h-0.5 bg-teal-600 rounded w-1/3" />
          <div className="h-0.5 bg-gray-200 rounded w-full" />
          <div className="h-0.5 bg-gray-200 rounded w-3/4" />
          <div className="h-0.5 bg-teal-600 rounded w-1/3 mt-0.5" />
          <div className="h-0.5 bg-gray-800 rounded w-1/2" />
          <div className="h-0.5 bg-teal-500 rounded w-2/5" />
          <div className="h-0.5 bg-gray-200 rounded w-full" />
          <div className="h-0.5 bg-gray-200 rounded w-3/4" />
        </div>
        <div className="w-[42%] pl-1 space-y-1">
          <div className="h-0.5 bg-teal-600 rounded w-2/3" />
          <div className="flex flex-wrap gap-0.5">
            <div className="h-1.5 bg-teal-50 border border-teal-200 rounded w-4" />
            <div className="h-1.5 bg-teal-50 border border-teal-200 rounded w-5" />
            <div className="h-1.5 bg-teal-50 border border-teal-200 rounded w-3" />
          </div>
          <div className="h-0.5 bg-teal-600 rounded w-2/3 mt-0.5" />
          <div className="h-0.5 bg-gray-800 rounded w-full" />
          <div className="h-0.5 bg-gray-200 rounded w-3/4" />
        </div>
      </div>
    </div>
  );
  // creative (default)
  return (
    <div className="w-full h-full bg-white flex flex-col">
      <div className="p-1.5" style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded-lg bg-white/20 flex-shrink-0" />
          <div>
            <div className="h-0.5 bg-white rounded w-10 mb-0.5" />
            <div className="h-0.5 bg-purple-200 rounded w-8" />
          </div>
        </div>
      </div>
      <div className="flex flex-1">
        <div className="flex-1 p-1">
          <div className="space-y-0.5 pl-1.5 border-l border-purple-300">
            <div className="h-0.5 bg-gray-700 rounded w-full" />
            <div className="h-0.5 bg-purple-400 rounded w-1/2" />
          </div>
        </div>
        <div className="w-1/3 bg-gray-50 p-1">
          <div className="flex flex-wrap gap-0.5">
            <div className="h-1.5 bg-purple-100 rounded-full w-5" />
            <div className="h-1.5 bg-pink-100 rounded-full w-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Photo Upload Component
function PhotoUpload({ photo, onChange }: { photo: string; onChange: (v: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => onChange(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex items-center gap-5">
      <div
        onClick={() => inputRef.current?.click()}
        className="relative w-20 h-20 rounded-full flex-shrink-0 cursor-pointer group overflow-hidden border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors bg-gray-50"
      >
        {photo ? (
          <>
            <img src={photo} alt="Profile" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1">
            <Camera className="w-5 h-5 text-gray-400" />
            <span className="text-[9px] text-gray-400 font-medium">Photo</span>
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-700">Profile Photo <span className="text-gray-400 font-normal text-xs">(optional)</span></p>
        <p className="text-xs text-gray-400 mt-0.5">Used in Modern, Professional & Creative templates</p>
        <div className="flex gap-2 mt-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-xs px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium rounded-lg transition-colors cursor-pointer border border-blue-200"
          >
            {photo ? 'Change photo' : 'Upload photo'}
          </button>
          {photo && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="text-xs px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-500 font-medium rounded-lg transition-colors cursor-pointer border border-red-200 flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" /> Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Reusable Field Components
function FormField({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 text-xs">*</span>}
        {hint && <span className="text-xs text-gray-400 font-normal">— {hint}</span>}
      </label>
      {children}
    </div>
  );
}

function StyledInput({ error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  return (
    <div>
      <input
        {...props}
        className={`w-full px-3.5 py-2.5 border rounded-xl text-sm text-gray-900 placeholder-gray-400
          focus:outline-none focus:ring-2 focus:border-transparent transition-all
          ${error ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-100 focus:border-blue-400'}
          ${props.disabled ? 'bg-gray-50 text-gray-400' : 'bg-white hover:border-gray-300'}`}
      />
      {error && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{error}</p>}
    </div>
  );
}

function StyledTextarea({ rows = 3, helperText, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { helperText?: string }) {
  return (
    <div>
      <textarea
        {...props}
        rows={rows}
        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:border-transparent
          hover:border-gray-300 transition-all resize-none"
      />
      {helperText && (
        <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
          <Zap className="w-3 h-3" />{helperText}
        </p>
      )}
    </div>
  );
}

function StyledSelect({ options, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { options: { value: string; label: string }[] }) {
  return (
    <select
      {...props}
      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900
        focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400
        hover:border-gray-300 transition-all bg-white appearance-none cursor-pointer"
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

function EmptyState({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-6 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
      <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
        <Icon className="w-7 h-7 text-gray-400" />
      </div>
      <p className="font-semibold text-gray-700 text-sm">{title}</p>
      <p className="text-xs text-gray-400 mt-1 text-center">{desc}</p>
    </div>
  );
}

function buildPreviewContent(cvData: CVData): GeneratedContent {
  const { personalInfo, experience, education, skills, certificates } = cvData;
  return {
    cvContent: {
      summary: personalInfo.summary
        || (personalInfo.fullName
          ? `${personalInfo.fullName} — ${cvData.preferences.level} professional in ${cvData.preferences.sector}.`
          : ''),
      experience: experience.map(exp => ({
        company: exp.company || 'Company',
        position: exp.position || 'Position',
        startDate: exp.startDate || '—',
        endDate: exp.isCurrent ? 'Present' : (exp.endDate || 'Present'),
        bullets: exp.description
          ? exp.description.split(/[.\n]/).map(s => s.trim()).filter(s => s.length > 8).slice(0, 3)
          : [`Worked as ${exp.position || 'professional'} at ${exp.company || 'organization'}`],
      })),
      education: education.map(edu => ({
        school: edu.school || 'University',
        department: edu.department,
        degree: edu.degree,
        year: edu.graduationYear,
        gpa: edu.gpa || undefined,
      })),
      skills,
      certificates: certificates.map(c => ({ name: c.name, institution: c.institution, year: c.year })),
    },
    aiGenerated: false,
  };
}

const PREVIEW_SCALE = 0.58;
const TEMPLATE_W = 800;
const TEMPLATE_H = 1131; // A4 ratio: 800 * (297/210)
const PREVIEW_W = Math.round(TEMPLATE_W * PREVIEW_SCALE); // ~464px
const PREVIEW_H = Math.round(TEMPLATE_H * PREVIEW_SCALE); // ~656px

function LivePreviewPanel({ cvData }: { cvData: CVData }) {
  const [showMobile, setShowMobile] = useState(false);
  const previewContent = buildPreviewContent(cvData);
  const templateName = cvData.preferences.template.charAt(0).toUpperCase() + cvData.preferences.template.slice(1);

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setShowMobile(v => !v)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-full shadow-lg text-sm font-semibold cursor-pointer"
      >
        <Eye className="w-4 h-4" /> {showMobile ? 'Hide Preview' : 'Preview CV'}
      </button>

      {/* Preview modal */}
      {showMobile && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4 overflow-auto">
          <div className="bg-white rounded-2xl overflow-hidden shadow-2xl" style={{ width: PREVIEW_W + 2 }}>
            <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-gray-800">Live Preview — {templateName}</span>
              </div>
              <button onClick={() => setShowMobile(false)} className="text-gray-400 hover:text-gray-700 cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <div style={{ width: PREVIEW_W, height: PREVIEW_H, overflow: 'hidden', position: 'relative' }}>
              <div
                style={{
                  width: TEMPLATE_W,
                  height: TEMPLATE_H,
                  transform: `scale(${PREVIEW_SCALE})`,
                  transformOrigin: 'top left',
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}
              >
                <CVRenderer data={cvData} content={previewContent} watermark={true} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function DesktopPreview({ cvData }: { cvData: CVData }) {
  const previewContent = buildPreviewContent(cvData);
  const templateName = cvData.preferences.template.charAt(0).toUpperCase() + cvData.preferences.template.slice(1);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="flex items-center gap-2">
        <Eye className="w-4 h-4 text-blue-600" />
        <span className="text-sm font-semibold text-gray-700">Live Preview</span>
        <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{templateName}</span>
      </div>
      <div
        className="rounded-xl border border-gray-200 shadow-sm bg-white"
        style={{ width: PREVIEW_W, height: 540, overflow: 'hidden' }}
      >
        <div
          style={{
            width: TEMPLATE_W,
            transform: `scale(${PREVIEW_SCALE})`,
            transformOrigin: 'top left',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <CVRenderer data={cvData} content={previewContent} watermark={true} />
        </div>
      </div>
      <p className="text-center text-xs text-gray-400">AI will enhance the content when you generate</p>
    </div>
  );
}

const STEP_TIPS: Record<number, { title: string; items: { label: string; text: string }[] }> = {
  0: {
    title: 'Personal Info Tips',
    items: [
      { label: 'LinkedIn URL', text: 'Only enter your username (e.g. "john-doe-123"). The prefix is added automatically.' },
      { label: 'AI Summary Hint', text: 'Write keywords or a rough sentence — AI will rewrite it into a polished 2-3 sentence summary. Example: "5 yrs React, led teams, fintech background"' },
      { label: 'Personal Statement', text: 'This is for a longer personal narrative that goes verbatim on your CV — goals, values, or a unique pitch. AI will never change it. Leave blank if not needed.' },
    ],
  },
  1: {
    title: 'Experience & Projects Tips',
    items: [
      { label: 'Description quality', text: 'Focus on impact, not duties. Instead of "worked on backend" → write "Built REST APIs serving 10k req/day, reduced response time by 40%".' },
      { label: 'Numbers matter', text: 'Add metrics wherever possible: team size, % improvement, revenue impact, number of users. AI can estimate if you\'re unsure — just note the context.' },
      { label: 'Projects & freelance', text: 'Side projects, open-source contributions, freelance work all count. Hiring managers value initiative. Use the type selector to categorize correctly.' },
      { label: 'Sparse is OK', text: 'If you have little to write, just fill in company name and position. AI will generate realistic bullet points from the role title alone.' },
    ],
  },
  2: {
    title: 'Education Tips',
    items: [
      { label: 'GPA', text: 'Only include GPA if it\'s strong (3.5+ / 3.0+ for competitive fields). Leave blank otherwise.' },
      { label: 'Recent grads', text: 'Put education near the top of your CV if you graduated within the last 2 years. AI handles this based on your experience count.' },
      { label: 'Online degrees', text: 'Bootcamps, online degrees (Coursera, edX) count — especially in tech. Add them here.' },
    ],
  },
  3: {
    title: 'Skills Tips',
    items: [
      { label: 'Sweet spot', text: 'Aim for 8–14 skills. Too few looks thin; too many looks unfocused. AI will pad to 10 if you add fewer than 4.' },
      { label: 'Mix hard & soft', text: 'Balance technical skills (Python, Figma, SQL) with soft skills (Team Leadership, Stakeholder Communication). Both matter.' },
      { label: 'Job-specific', text: 'If you\'re pasting a job posting on the next step, add the tools/technologies mentioned in the posting here for a stronger ATS match.' },
    ],
  },
  4: {
    title: 'Certificates Tips',
    items: [
      { label: 'What counts', text: 'Online certifications (Google, AWS, Coursera, Udemy), language certifications (IELTS, TOEFL), and professional licenses all count.' },
      { label: 'Recency', text: 'Include certs from the last 5–7 years. Older ones are fine if still industry-relevant.' },
    ],
  },
};

function calculateATSScore(cvData: CVData) {
  const { personalInfo, experience, education, skills, certificates } = cvData;

  // Contact Info — 20 pts
  const contactScore = Math.min(20,
    (personalInfo.fullName.trim() ? 5 : 0) +
    (personalInfo.email.trim() ? 5 : 0) +
    (personalInfo.phone.trim() ? 4 : 0) +
    (personalInfo.linkedin.trim() ? 4 : 0) +
    ((personalInfo.city.trim() || personalInfo.country.trim()) ? 2 : 0)
  );

  // Summary — 10 pts (meaningful length required)
  const summaryLen = personalInfo.summary.trim().length;
  const summaryScore = summaryLen === 0 ? 0 : summaryLen >= 150 ? 10 : summaryLen >= 80 ? 6 : 3;

  // Experience — 35 pts (quantity + quality)
  const hasMetrics = (desc: string) => /\d+|%|increased|reduced|led|managed|built|developed/i.test(desc);
  const richDescs = experience.filter(e => e.description.trim().length >= 100 && hasMetrics(e.description));
  const expScore = Math.min(35,
    (experience.length >= 1 ? 8 : 0) +
    (experience.length >= 2 ? 5 : 0) +
    (experience.length >= 3 ? 4 : 0) +
    (richDescs.length >= 1 ? 10 : experience.filter(e => e.description.trim().length >= 40).length >= 1 ? 5 : 0) +
    (richDescs.length >= 2 ? 8 : 0)
  );

  // Education — 15 pts
  const eduScore = Math.min(15,
    (education.length >= 1 ? 7 : 0) +
    (education[0]?.graduationYear ? 4 : 0) +
    (education[0]?.degree ? 4 : 0)
  );

  // Skills — 15 pts (more required for full score)
  const skillScore = Math.min(15,
    (skills.length >= 3 ? 4 : 0) +
    (skills.length >= 7 ? 4 : 0) +
    (skills.length >= 12 ? 4 : 0) +
    (skills.length >= 15 ? 3 : 0)
  );

  // Certificates bonus — 5 pts
  const certScore = Math.min(5, certificates.length >= 1 ? 3 : 0, certificates.length >= 2 ? 5 : 0);

  const breakdown = [
    { label: 'Contact Info', earned: contactScore, max: 20, tip: contactScore < 20 ? 'Add phone number, LinkedIn URL, and location' : '' },
    { label: 'Summary', earned: summaryScore, max: 10, tip: summaryScore < 10 ? `Write at least 150 characters (currently ${summaryLen})` : '' },
    { label: 'Experience', earned: expScore, max: 35, tip: expScore < 35 ? 'Add 3+ entries with detailed descriptions including numbers/metrics' : '' },
    { label: 'Education', earned: eduScore, max: 15, tip: eduScore < 15 ? 'Add degree type and graduation year' : '' },
    { label: 'Skills', earned: skillScore, max: 15, tip: skillScore < 15 ? `Add more skills (currently ${skills.length}, aim for 15+)` : '' },
    { label: 'Certificates', earned: certScore, max: 5, tip: certScore < 5 ? 'Add certifications for bonus points' : '' },
  ];

  return { score: contactScore + summaryScore + expScore + eduScore + skillScore + certScore, breakdown };
}

function ATSScoreWidget({ cvData }: { cvData: CVData }) {
  const [expanded, setExpanded] = useState(false);
  const { score, breakdown } = calculateATSScore(cvData);
  const color = score >= 70 ? 'green' : score >= 40 ? 'amber' : 'red';
  const label = score >= 70 ? 'ATS Ready' : score >= 40 ? 'Needs Improvement' : 'Incomplete';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5">
      <button onClick={() => setExpanded(v => !v)} className="w-full flex items-center gap-3 cursor-pointer">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-base font-bold text-white flex-shrink-0 ${
          color === 'green' ? 'bg-green-500' : color === 'amber' ? 'bg-amber-400' : 'bg-red-400'
        }`}>
          {score}
        </div>
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-gray-800">ATS Score</p>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              color === 'green' ? 'bg-green-50 text-green-700' : color === 'amber' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-600'
            }`}>{label}</span>
          </div>
          <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden w-full">
            <div className={`h-full rounded-full transition-all duration-700 ${
              color === 'green' ? 'bg-green-500' : color === 'amber' ? 'bg-amber-400' : 'bg-red-400'
            }`} style={{ width: `${score}%` }} />
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {expanded && (
        <div className="mt-4 space-y-3 border-t border-gray-50 pt-4">
          {breakdown.map((item, i) => (
            <div key={i}>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-gray-700">{item.label}</span>
                <span className={`font-semibold ${item.earned === item.max ? 'text-green-600' : 'text-gray-400'}`}>
                  {item.earned}/{item.max}
                </span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    item.earned / item.max >= 0.7 ? 'bg-green-500' :
                    item.earned / item.max >= 0.4 ? 'bg-amber-400' : 'bg-red-400'
                  }`}
                  style={{ width: `${(item.earned / item.max) * 100}%` }}
                />
              </div>
              {item.tip && <p className="text-[10px] text-amber-600 mt-0.5">💡 {item.tip}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function GuidedTipsBox({ step, show, onToggle }: { step: number; show: boolean; onToggle: () => void }) {
  const tips = STEP_TIPS[step];
  if (!tips) return null;
  return (
    <div className="rounded-xl border border-amber-100 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 bg-amber-50 hover:bg-amber-100 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span className="text-sm font-semibold text-amber-800">{tips.title}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-amber-600 transition-transform ${show ? 'rotate-180' : ''}`} />
      </button>
      {show && (
        <div className="bg-white px-4 py-3 space-y-3">
          {tips.items.map((item, i) => (
            <div key={i} className="flex gap-2 text-sm">
              <span className="font-semibold text-gray-700 flex-shrink-0 min-w-[120px]">{item.label}:</span>
              <span className="text-gray-500 text-xs leading-relaxed">{item.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function AppForm() {
  const app = useApp();
  const [step, setStep] = useState(() => {
    const saved = sessionStorage.getItem('cvio_form_step');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [skillInput, setSkillInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState(false);
  const [selectedSkillCategory, setSelectedSkillCategory] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [showTips, setShowTips] = useState(false);

  const { cvData, updatePersonalInfo, addExperience, updateExperience, removeExperience,
    addEducation, updateEducation, removeEducation, addSkill, removeSkill,
    addCertificate, updateCertificate, removeCertificate, updatePreferences,
    setCurrentPage, generateCV, user, setShowUpgradeModal } = app;

  useEffect(() => {
    sessionStorage.setItem('cvio_form_step', String(step));
    setShowTips(false);
  }, [step]);

  // Pre-fill from user profile if name/email not set
  useEffect(() => {
    if (user.isLoggedIn && !cvData.personalInfo.fullName && user.fullName) {
      updatePersonalInfo({ fullName: user.fullName, email: cvData.personalInfo.email || user.email });
    }
  }, [user.isLoggedIn]);

  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    if (step === 0) {
      if (!cvData.personalInfo.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!cvData.personalInfo.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(cvData.personalInfo.email)) newErrors.email = 'Enter a valid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goNext = () => {
    setTouched(true);
    if (!validateStep()) return;
    setAnimating(true);
    setTimeout(() => {
      setStep(s => Math.min(s + 1, 5));
      setAnimating(false);
      setTouched(false);
      setErrors({});
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 200);
  };

  const goPrev = () => {
    setAnimating(true);
    setTimeout(() => {
      setStep(s => Math.max(s - 1, 0));
      setAnimating(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 200);
  };

  const handleGenerate = (withJob: boolean) => {
    if (user.plan === 'free' && user.cvCount >= 1) {
      setShowUpgradeModal(true);
      return;
    }
    if (withJob) setCurrentPage('job');
    else generateCV(false);
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      addSkill(skillInput.trim());
      setSkillInput('');
    }
  };

  useEffect(() => {
    if (touched) validateStep();
  }, [cvData.personalInfo.fullName, cvData.personalInfo.email]);

  const completionPct = Math.round(((step) / 6) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 pt-20 pb-16">
      <div className="max-w-[1300px] mx-auto px-4">
      <div>

        {/* Header */}
        <div className="text-center mb-8 pt-6">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-3 border border-blue-100">
            <Zap className="w-3.5 h-3.5" />
            AI-powered CV builder
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Enter Your CV Information</h1>
          <p className="text-gray-500 text-sm mt-1">Step {step + 1}/6 — {steps[step].subtitle}</p>
        </div>

        {/* Step Progress */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
          {/* Steps */}
          <div className="flex items-center justify-between mb-4 relative">
            <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-100 -z-0" />
            <div
              className="absolute top-5 left-5 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-700 -z-0"
              style={{ width: `${(step / 5) * (100 - (10 / 3))}%` }}
            />
            {steps.map((s, i) => (
              <button
                key={i}
                onClick={() => i < step && setStep(i)}
                disabled={i > step}
                className="flex flex-col items-center gap-1.5 relative z-10 group"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                  i < step
                    ? 'bg-green-500 border-green-500 text-white shadow-sm shadow-green-200'
                    : i === step
                    ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200 scale-110'
                    : 'bg-white border-gray-200 text-gray-300'
                } ${i < step ? 'cursor-pointer hover:scale-110' : ''}`}>
                  {i < step ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <s.icon className="w-4.5 h-4.5" />
                  )}
                </div>
                <span className={`text-[10px] font-semibold hidden sm:block transition-colors ${
                  i === step ? 'text-blue-600' : i < step ? 'text-green-600' : 'text-gray-300'
                }`}>
                  {s.title.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 rounded-full transition-all duration-700"
              style={{ width: `${((step + 1) / 6) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[10px] text-gray-400">Start</span>
            <span className="text-[10px] text-blue-600 font-semibold">{completionPct}% complete</span>
            <span className="text-[10px] text-gray-400">Done</span>
          </div>
        </div>

        {/* ATS Score */}
        <ATSScoreWidget cvData={cvData} />

        {/* Form Card */}
        <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm transition-all duration-200 ${animating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
          {/* Card Header */}
          <div className="px-6 py-5 border-b border-gray-50">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                step === 0 ? 'bg-blue-100 text-blue-600' :
                step === 1 ? 'bg-indigo-100 text-indigo-600' :
                step === 2 ? 'bg-violet-100 text-violet-600' :
                step === 3 ? 'bg-purple-100 text-purple-600' :
                step === 4 ? 'bg-pink-100 text-pink-600' :
                'bg-rose-100 text-rose-600'
              }`}>
                {(() => { const Icon = steps[step].icon; return <Icon className="w-5 h-5" />; })()}
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">{steps[step].title}</h2>
                <p className="text-xs text-gray-400">{steps[step].subtitle}</p>
              </div>
            </div>
          </div>

          <div className="p-6">

            {/* STEP 0: Personal Info */}
            {step === 0 && (
              <div className="space-y-5">
                <GuidedTipsBox step={0} show={showTips} onToggle={() => setShowTips(v => !v)} />
                {/* Photo Upload */}
                <PhotoUpload
                  photo={cvData.personalInfo.photo || ''}
                  onChange={photo => updatePersonalInfo({ photo })}
                />
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField label="Full Name" required>
                    <StyledInput
                      placeholder="John Smith"
                      value={cvData.personalInfo.fullName}
                      onChange={e => updatePersonalInfo({ fullName: e.target.value })}
                      error={errors.fullName}
                    />
                  </FormField>
                  <FormField label="Email" required>
                    <StyledInput
                      type="email"
                      placeholder="john@example.com"
                      value={cvData.personalInfo.email}
                      onChange={e => updatePersonalInfo({ email: e.target.value })}
                      error={errors.email}
                    />
                  </FormField>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField label="Phone" hint="optional">
                    <StyledInput
                      placeholder="+1 555 123 4567"
                      value={cvData.personalInfo.phone}
                      onChange={e => updatePersonalInfo({ phone: e.target.value })}
                    />
                  </FormField>
                  <FormField label="LinkedIn URL" hint="optional">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">linkedin.com/in/</span>
                      <input
                        placeholder="your-username"
                        value={cvData.personalInfo.linkedin.replace('linkedin.com/in/', '')}
                        onChange={e => updatePersonalInfo({ linkedin: e.target.value })}
                        className="w-full pl-[130px] pr-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 hover:border-gray-300 transition-all"
                      />
                    </div>
                  </FormField>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField label="GitHub URL" hint="optional">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">github.com/</span>
                      <input
                        placeholder="your-username"
                        value={cvData.personalInfo.github.replace('github.com/', '')}
                        onChange={e => updatePersonalInfo({ github: e.target.value })}
                        className="w-full pl-[90px] pr-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 hover:border-gray-300 transition-all"
                      />
                    </div>
                  </FormField>
                  <div className="grid grid-cols-2 gap-2">
                    <FormField label="City" hint="optional">
                      <StyledInput placeholder="New York" value={cvData.personalInfo.city} onChange={e => updatePersonalInfo({ city: e.target.value })} />
                    </FormField>
                    <FormField label="Country" hint="optional">
                      <StyledInput placeholder="USA" value={cvData.personalInfo.country} onChange={e => updatePersonalInfo({ country: e.target.value })} />
                    </FormField>
                  </div>
                </div>

                <FormField label="AI Summary Hint" hint="optional">
                  <StyledTextarea
                    placeholder="Briefly introduce yourself or list keywords... AI will rewrite this into a polished summary."
                    rows={3}
                    value={cvData.personalInfo.summary}
                    onChange={e => updatePersonalInfo({ summary: e.target.value })}
                    helperText="Leave blank and AI will generate your summary automatically"
                  />
                </FormField>

                <FormField label="Personal Statement" hint="optional — shown verbatim on CV">
                  <StyledTextarea
                    placeholder="Write a personal paragraph exactly as you want it to appear on your CV. AI will NOT modify this — it goes directly as-is."
                    rows={4}
                    value={cvData.personalInfo.personalStatement || ''}
                    onChange={e => updatePersonalInfo({ personalStatement: e.target.value })}
                    helperText="This appears on your CV exactly as written — great for a personal touch, goals statement, or unique narrative"
                  />
                </FormField>

                {/* Info tip */}
                <div className="flex items-start gap-3 bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <Zap className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-700 space-y-1">
                    <p><strong>Tip:</strong> Only Full Name and Email are required. Leave the rest blank — AI will fill in the gaps.</p>
                    <p className="text-xs text-blue-600">Use <strong>AI Summary Hint</strong> for keywords/notes the AI will polish. Use <strong>Personal Statement</strong> for text you want verbatim on your CV.</p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 1: Experience & Projects */}
            {step === 1 && (
              <div className="space-y-5">
                <GuidedTipsBox step={1} show={showTips} onToggle={() => setShowTips(v => !v)} />
                {/* Encouragement banner */}
                <div className="flex items-start gap-3 bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                  <Sparkles className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-indigo-700 space-y-1">
                    <p className="font-semibold">Not just jobs — add anything valuable</p>
                    <p className="text-indigo-600 text-xs leading-relaxed">
                      Personal projects, open-source work, freelance gigs, volunteering, internships — all count. Hiring managers love seeing initiative beyond a job title.
                    </p>
                  </div>
                </div>

                {cvData.experience.length === 0 && (
                  <EmptyState icon={Briefcase} title="Nothing added yet" desc="Add work experience, a project, volunteer work, or freelance work below" />
                )}
                {cvData.experience.map((exp, i) => {
                  const expType = exp.type || 'work';
                  const typeConfig = {
                    work:      { label: 'Work',      orgLabel: 'Company / Organization', roleLabel: 'Position / Title',   orgPlaceholder: 'ABC Technologies Inc.',  rolePlaceholder: 'Software Developer',       ongoingLabel: 'Currently working here',      descPlaceholder: 'E.g. Built REST APIs, led a team of 3, reduced load time by 40%' },
                    project:   { label: 'Project',   orgLabel: 'Project Name',           roleLabel: 'Your Role',          orgPlaceholder: 'E.g. Portfolio Website',  rolePlaceholder: 'Full-Stack Developer',     ongoingLabel: 'Ongoing / still active',      descPlaceholder: 'E.g. Built a full-stack e-commerce site with React & Node.js, deployed to AWS' },
                    volunteer: { label: 'Volunteer', orgLabel: 'Organization',           roleLabel: 'Your Role',          orgPlaceholder: 'E.g. Red Cross',         rolePlaceholder: 'Event Coordinator',        ongoingLabel: 'Currently volunteering',      descPlaceholder: 'E.g. Coordinated food distribution for 200+ families, managed 10 volunteers' },
                    freelance: { label: 'Freelance', orgLabel: 'Client / Company',       roleLabel: 'Service Provided',   orgPlaceholder: 'E.g. Various clients',   rolePlaceholder: 'UI/UX Designer',           ongoingLabel: 'Currently active',            descPlaceholder: 'E.g. Designed landing pages for 5+ clients, increased conversion rates by 25%' },
                  }[expType];

                  return (
                  <div key={exp.id} className="border border-gray-200 rounded-2xl overflow-hidden group hover:border-indigo-200 transition-colors">
                    {/* Card Header */}
                    <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center">
                          <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">
                          {exp.company || exp.position
                            ? `${exp.position || 'Role'}${exp.company ? ` — ${exp.company}` : ''}`
                            : `Entry ${i + 1}`}
                        </span>
                      </div>
                      <button
                        onClick={() => removeExperience(exp.id)}
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-red-50"
                      >
                        <X className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                    <div className="p-5 space-y-4">
                      {/* Type selector */}
                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-2">Type</p>
                        <div className="flex gap-2 flex-wrap">
                          {(['work', 'project', 'volunteer', 'freelance'] as const).map(t => (
                            <button
                              key={t}
                              onClick={() => updateExperience(exp.id, { type: t })}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer capitalize ${
                                expType === t
                                  ? 'bg-indigo-600 text-white border-indigo-600'
                                  : 'bg-white text-gray-500 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
                              }`}
                            >
                              {t === 'work' ? 'Work' : t === 'project' ? 'Project' : t === 'volunteer' ? 'Volunteer' : 'Freelance'}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormField label={typeConfig.orgLabel}>
                          <StyledInput placeholder={typeConfig.orgPlaceholder} value={exp.company} onChange={e => updateExperience(exp.id, { company: e.target.value })} />
                        </FormField>
                        <FormField label={typeConfig.roleLabel}>
                          <StyledInput placeholder={typeConfig.rolePlaceholder} value={exp.position} onChange={e => updateExperience(exp.id, { position: e.target.value })} />
                        </FormField>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormField label="Start Date">
                          <StyledInput type="month" value={exp.startDate} onChange={e => updateExperience(exp.id, { startDate: e.target.value })} />
                        </FormField>
                        <FormField label="End Date">
                          <StyledInput
                            type="month"
                            value={exp.endDate}
                            onChange={e => updateExperience(exp.id, { endDate: e.target.value })}
                            disabled={exp.isCurrent}
                          />
                          <label className="flex items-center gap-2 mt-2 cursor-pointer group/check">
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${exp.isCurrent ? 'bg-indigo-500 border-indigo-500' : 'border-gray-300 group-hover/check:border-indigo-300'}`}>
                              {exp.isCurrent && <CheckCircle2 className="w-3 h-3 text-white" />}
                            </div>
                            <input type="checkbox" className="sr-only" checked={exp.isCurrent} onChange={e => updateExperience(exp.id, { isCurrent: e.target.checked, endDate: '' })} />
                            <span className="text-sm text-gray-600">{typeConfig.ongoingLabel}</span>
                          </label>
                        </FormField>
                      </div>
                      <FormField label="What did you do?">
                        <StyledTextarea
                          placeholder={typeConfig.descPlaceholder}
                          rows={3}
                          value={exp.description}
                          onChange={e => updateExperience(exp.id, { description: e.target.value })}
                          helperText="AI will convert this into professional bullet points"
                        />
                      </FormField>
                    </div>
                  </div>
                  );
                })}
                <button
                  onClick={addExperience}
                  className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-indigo-200 rounded-2xl text-indigo-600 text-sm font-semibold hover:border-indigo-400 hover:bg-indigo-50 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Entry
                </button>
                <div className="flex items-start gap-3 bg-amber-50 rounded-xl p-4 border border-amber-100">
                  <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-amber-700">This step is optional. If you have nothing to add, click "Next" to continue.</p>
                </div>
              </div>
            )}

            {/* STEP 2: Education */}
            {step === 2 && (
              <div className="space-y-5">
                <GuidedTipsBox step={2} show={showTips} onToggle={() => setShowTips(v => !v)} />
                {cvData.education.length === 0 && (
                  <EmptyState icon={GraduationCap} title="No education added yet" desc="Add the schools or universities you graduated from" />
                )}
                {cvData.education.map((edu, i) => (
                  <div key={edu.id} className="border border-gray-200 rounded-2xl overflow-hidden hover:border-violet-200 transition-colors">
                    <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-violet-100 flex items-center justify-center">
                          <GraduationCap className="w-3.5 h-3.5 text-violet-600" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">
                          {edu.school || `Education ${i + 1}`}
                        </span>
                      </div>
                      <button onClick={() => removeEducation(edu.id)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-red-50">
                        <X className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                    <div className="p-5 space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormField label="School / University">
                          <StyledInput placeholder="MIT" value={edu.school} onChange={e => updateEducation(edu.id, { school: e.target.value })} />
                        </FormField>
                        <FormField label="Field of Study">
                          <StyledInput placeholder="Computer Science" value={edu.department} onChange={e => updateEducation(edu.id, { department: e.target.value })} />
                        </FormField>
                      </div>
                      <div className="grid sm:grid-cols-3 gap-4">
                        <FormField label="Degree">
                          <StyledSelect value={edu.degree} onChange={e => updateEducation(edu.id, { degree: e.target.value })} options={degrees.map(d => ({ value: d, label: d }))} />
                        </FormField>
                        <FormField label="Graduation Year">
                          <StyledInput placeholder="2023" value={edu.graduationYear} onChange={e => updateEducation(edu.id, { graduationYear: e.target.value })} />
                        </FormField>
                        <FormField label="GPA" hint="optional">
                          <StyledInput placeholder="3.50 / 4.00" value={edu.gpa} onChange={e => updateEducation(edu.id, { gpa: e.target.value })} />
                        </FormField>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={addEducation}
                  className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-violet-200 rounded-2xl text-violet-600 text-sm font-semibold hover:border-violet-400 hover:bg-violet-50 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Education
                </button>
              </div>
            )}

            {/* STEP 3: Skills */}
            {step === 3 && (
              <div className="space-y-5">
                <GuidedTipsBox step={3} show={showTips} onToggle={() => setShowTips(v => !v)} />
                {/* Input */}
                <FormField label="Add Skill" hint="press Enter to add">
                  <div className="relative">
                    <input
                      className="w-full pl-4 pr-12 py-2.5 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-400 hover:border-gray-300 transition-all"
                      placeholder="e.g. Excel, Python, Project Management..."
                      value={skillInput}
                      onChange={e => setSkillInput(e.target.value)}
                      onKeyDown={handleSkillKeyDown}
                    />
                    <button
                      onClick={() => { if (skillInput.trim()) { addSkill(skillInput.trim()); setSkillInput(''); } }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg hover:bg-purple-700 transition-colors cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </FormField>

                {/* Added skills */}
                {cvData.skills.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Added Skills ({cvData.skills.length})</p>
                    <div className="flex flex-wrap gap-2 p-4 bg-purple-50 rounded-xl border border-purple-100 min-h-[60px]">
                      {cvData.skills.map(skill => (
                        <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-purple-700 border border-purple-200 rounded-lg text-sm font-medium shadow-sm">
                          {skill}
                          <button onClick={() => removeSkill(skill)} className="hover:text-red-500 transition-colors cursor-pointer">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {cvData.skills.length === 0 && (
                  <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 min-h-[60px] items-center justify-center">
                    <p className="text-sm text-gray-400">No skills added yet. Type above and press Enter.</p>
                  </div>
                )}

                {/* Popular skills */}
                <div className="border border-gray-100 rounded-xl overflow-hidden">
                  <div className="flex border-b border-gray-100">
                    {['Technical', 'Soft Skills', 'Industry'].map((cat, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedSkillCategory(i)}
                        className={`flex-1 py-2.5 text-xs font-semibold transition-colors cursor-pointer ${
                          selectedSkillCategory === i ? 'bg-purple-600 text-white' : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <div className="p-4 flex flex-wrap gap-2">
                    {popularSkills[selectedSkillCategory].map(s => (
                      <button
                        key={s}
                        onClick={() => addSkill(s)}
                        disabled={cvData.skills.includes(s)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all cursor-pointer ${
                          cvData.skills.includes(s)
                            ? 'bg-green-50 text-green-600 border-green-200 cursor-default'
                            : 'border-gray-200 text-gray-600 hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50'
                        }`}
                      >
                        {cvData.skills.includes(s) ? '✓ ' : '+ '}{s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Certificates */}
            {step === 4 && (
              <div className="space-y-5">
                <GuidedTipsBox step={4} show={showTips} onToggle={() => setShowTips(v => !v)} />
                <div className="flex items-start gap-3 bg-pink-50 rounded-xl p-4 border border-pink-100">
                  <Award className="w-4 h-4 text-pink-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-pink-700">This step is completely optional. If you have no certifications, click "Next" to continue.</p>
                </div>
                {cvData.certificates.length === 0 && (
                  <EmptyState icon={Award} title="No certificates added yet" desc="Add your AWS, Google, Microsoft, or other certifications" />
                )}
                {cvData.certificates.map((cert, i) => (
                  <div key={cert.id} className="border border-gray-200 rounded-2xl overflow-hidden hover:border-pink-200 transition-colors">
                    <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-pink-100 flex items-center justify-center">
                          <Award className="w-3.5 h-3.5 text-pink-600" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">{cert.name || `Certificate ${i + 1}`}</span>
                      </div>
                      <button onClick={() => removeCertificate(cert.id)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-red-50">
                        <X className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                    <div className="p-5">
                      <div className="grid sm:grid-cols-3 gap-4">
                        <FormField label="Certificate Name">
                          <StyledInput placeholder="AWS Solutions Architect" value={cert.name} onChange={e => updateCertificate(cert.id, { name: e.target.value })} />
                        </FormField>
                        <FormField label="Issuing Organization">
                          <StyledInput placeholder="Amazon Web Services" value={cert.institution} onChange={e => updateCertificate(cert.id, { institution: e.target.value })} />
                        </FormField>
                        <FormField label="Year">
                          <StyledInput placeholder="2024" value={cert.year} onChange={e => updateCertificate(cert.id, { year: e.target.value })} />
                        </FormField>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={addCertificate}
                  className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-pink-200 rounded-2xl text-pink-600 text-sm font-semibold hover:border-pink-400 hover:bg-pink-50 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Certificate
                </button>
              </div>
            )}

            {/* STEP 5: Preferences */}
            {step === 5 && (
              <div className="space-y-6">
                {/* Language */}
                <FormField label="CV Language">
                  <div className="grid grid-cols-2 gap-3">
                    {([
                      { v: 'en', flag: '🇬🇧', l: 'English' },
                      { v: 'tr', flag: '🇹🇷', l: 'Turkish' },
                      { v: 'fr', flag: '🇫🇷', l: 'French' },
                      { v: 'es', flag: '🇪🇸', l: 'Spanish' },
                      { v: 'de', flag: '🇩🇪', l: 'German' },
                      { v: 'it', flag: '🇮🇹', l: 'Italian' },
                      { v: 'pt', flag: '🇵🇹', l: 'Portuguese' },
                      { v: 'nl', flag: '🇳🇱', l: 'Dutch' },
                    ] as const).map(o => (
                      <button
                        key={o.v}
                        onClick={() => updatePreferences({ language: o.v })}
                        className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-semibold transition-all cursor-pointer ${
                          cvData.preferences.language === o.v
                            ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-xl">{o.flag}</span> {o.l}
                        {cvData.preferences.language === o.v && <CheckCircle2 className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                </FormField>

                {/* Level & Sector */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField label="Position Level">
                    <div className="grid grid-cols-2 gap-2">
                      {levels.map(l => (
                        <button
                          key={l}
                          onClick={() => updatePreferences({ level: l })}
                          className={`py-2.5 rounded-xl border-2 text-sm font-semibold transition-all cursor-pointer ${
                            cvData.preferences.level === l
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </FormField>
                  <FormField label="Target Sector">
                    <StyledSelect
                      value={cvData.preferences.sector}
                      onChange={e => updatePreferences({ sector: e.target.value })}
                      options={sectors.map(s => ({ value: s, label: s }))}
                    />
                  </FormField>
                </div>

                {/* Template */}
                <FormField label="Choose Template">
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {templateInfo.map(t => (
                      <button
                        key={t.id}
                        onClick={() => {
                          if ((t.id === 'creative' || t.id === 'professional' || t.id === 'minimal') && user.plan === 'free') {
                            setShowUpgradeModal(true);
                            return;
                          }
                          updatePreferences({ template: t.id as any });
                        }}
                        className={`rounded-2xl border-2 p-2 transition-all cursor-pointer text-left relative overflow-hidden ${
                          cvData.preferences.template === t.id
                            ? 'border-blue-500 shadow-md ring-2 ring-blue-100'
                            : 'border-gray-200 hover:border-gray-300'
                        } ${(t.id === 'creative' || t.id === 'professional' || t.id === 'minimal') && user.plan === 'free' ? 'opacity-70' : ''}`}
                      >
                        {(t.id === 'creative' || t.id === 'professional' || t.id === 'minimal') && user.plan === 'free' && (
                          <div className="absolute top-1.5 right-1.5 z-10">
                            <span className="text-[8px] bg-amber-500 text-white font-bold px-1.5 py-0.5 rounded-full">PRO</span>
                          </div>
                        )}
                        {cvData.preferences.template === t.id && (
                          <div className="absolute top-1.5 left-1.5 z-10">
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                              <CheckCircle2 className="w-3 h-3 text-white" />
                            </div>
                          </div>
                        )}
                        <div className="aspect-[3/4] rounded-xl overflow-hidden mb-2 shadow-sm border border-gray-100">
                          <TemplateMiniPreview id={t.id} />
                        </div>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <div className={`w-2 h-2 rounded-full ${t.color}`} />
                          <p className="text-xs font-bold text-gray-900">{t.name}</p>
                        </div>
                        <p className="text-[10px] text-gray-400">{t.desc}</p>
                      </button>
                    ))}
                  </div>
                </FormField>

                {/* Final tip */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4 text-blue-600" />
                    <p className="text-sm font-bold text-blue-900">You're ready!</p>
                  </div>
                  <p className="text-sm text-blue-700 mb-4">If you paste a job posting, AI will optimize both your CV and cover letter for that specific position.</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleGenerate(false)}
                      className="flex items-center justify-center gap-2 py-3 bg-white border-2 border-blue-200 text-blue-700 rounded-xl text-sm font-semibold hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer"
                    >
                      <FileText className="w-4 h-4" />
                      CV Only
                    </button>
                    <button
                      onClick={() => handleGenerate(true)}
                      className="flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all cursor-pointer shadow-sm shadow-blue-200"
                    >
                      <Zap className="w-4 h-4" />
                      Job-Targeted
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Navigation Footer */}
          {step < 5 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-50 bg-gray-50/50 rounded-b-2xl">
              <button
                onClick={goPrev}
                disabled={step === 0}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  step === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-white hover:shadow-sm'
                }`}
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{step + 1} / 6</span>
              </div>

              <button
                onClick={goNext}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all cursor-pointer shadow-sm shadow-blue-200 disabled:opacity-50"
              >
                {step === 4 ? 'Last Step' : 'Next'} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Bottom padding */}
        <div className="h-8" />

      {/* Mobile preview button */}
      <LivePreviewPanel cvData={cvData} />
      </div>{/* end main content div */}
      </div>{/* end max-w container */}
    </div>
  );
}
