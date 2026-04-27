import type { CVData, GeneratedContent } from '../types';

async function callAI(prompt: string, temperature = 0.85): Promise<string> {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, temperature }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API hatası [${res.status}]: ${err}`);
  }

  const data = await res.json();
  return data.text as string;
}

function buildCVPrompt(data: CVData, jobPosting?: string): string {
  const isEn = data.preferences.language === 'en';
  const langMap: Record<string, string> = { en: 'English', tr: 'Turkish', fr: 'French', es: 'Spanish', de: 'German', it: 'Italian', pt: 'Portuguese', nl: 'Dutch' };
  const lang = langMap[data.preferences.language] ?? 'English';

  const sparse = {
    noDescriptions: data.experience.length > 0 && data.experience.every(e => !e.description || e.description.trim().length < 20),
    someDescriptions: data.experience.some(e => !e.description || e.description.trim().length < 20),
    fewSkills: data.skills.length < 4,
    noExperience: data.experience.length === 0,
    noSummary: !data.personalInfo.summary || data.personalInfo.summary.trim().length < 15,
  };
  const isSparse = sparse.noDescriptions || sparse.fewSkills || sparse.noExperience;

  const experience = data.experience.length > 0
    ? data.experience.map(e => {
        const hasDesc = e.description && e.description.trim().length >= 20;
        return `
Tip: ${e.type || 'work'}
Şirket/Proje: ${e.company || '(belirtilmemiş)'}
Pozisyon: ${e.position || '(belirtilmemiş)'}
Tarih: ${e.startDate || '?'} - ${e.isCurrent ? 'Devam Ediyor' : (e.endDate || '?')}
Ham notlar: ${hasDesc ? e.description : '(YOK — pozisyon, şirket tipi ve sektörden çıkarsama yap, gerçekçi ve detaylı bullet üret)'}
        `.trim();
      }).join('\n\n---\n\n')
    : 'Deneyim yok';

  const education = data.education.length > 0
    ? data.education.map(e => `${e.degree} — ${e.department}, ${e.school} (${e.graduationYear})${e.gpa ? `, GPA: ${e.gpa}` : ''}`).join('\n')
    : 'Eğitim bilgisi yok';

  const skills = data.skills.length > 0 ? data.skills.join(', ') : '(yok — sektör ve pozisyona göre üret)';
  const certs = data.certificates.length > 0
    ? data.certificates.map(c => `${c.name} — ${c.institution} (${c.year})`).join('\n')
    : 'Yok';

  const jobCtx = jobPosting ? `\n\nHEDEF İŞ İLANI:\n${jobPosting}` : '';

  const sparseInstructions = isSparse ? `
⚠️ SEYREK VERİ MODU — KULLANICI AZ BİLGİ VERDİ:
${sparse.noDescriptions || sparse.someDescriptions ? `• Her deneyim için 4-5 güçlü bullet üret.` : ''}
${sparse.fewSkills ? `• Skills bölümüne 10-14 beceri ekle.` : ''}
${sparse.noSummary ? `• Özet bölümünü 3 güçlü cümleyle doldur.` : ''}
` : '';

  const bulletCount = (sparse.noDescriptions || sparse.someDescriptions) ? '4-5' : '3-4';

  void isEn;

  return `Sen deneyimli bir CV yazarısın.
${sparseInstructions}
ADAY:
Ad: ${data.personalInfo.fullName || 'Belirtilmemiş'}
Sektör: ${data.preferences.sector}
Seviye: ${data.preferences.level}

İŞ DENEYİMİ:
${experience}

EĞİTİM:
${education}

BECERİLER: ${skills}
SERTİFİKALAR: ${certs}
${jobCtx}

YAZIM KURALLARI:
1. Dil: ${lang}
2. Her bullet güçlü bir eylem fiiliyle başlasın
3. Her deneyim için ${bulletCount} bullet
4. Özet: 2-3 cümle, klişesiz

SADECE aşağıdaki JSON'ı döndür:

{
  "summary": "...",
  "experience": [
    {
      "company": "...",
      "position": "...",
      "startDate": "...",
      "endDate": "...",
      "bullets": ["...", "...", "..."]
    }
  ],
  "education": [
    { "school": "...", "department": "...", "degree": "...", "year": "...", "gpa": null }
  ],
  "skills": ["..."],
  "certificates": [{ "name": "...", "institution": "...", "year": "..." }]
}`;
}

export async function generateCoverLetterOnly(params: {
  fullName: string;
  email: string;
  phone: string;
  position: string;
  company: string;
  jobPosting: string;
  tone: 'professional' | 'friendly' | 'creative';
  language: 'tr' | 'en' | 'fr' | 'es';
  experience?: string;
  skills?: string;
}): Promise<string> {
  const langMap3 = { en: 'English', tr: 'Turkish', fr: 'French', es: 'Spanish' };
  const lang = langMap3[params.language] ?? 'English';
  const toneDesc = {
    professional: 'formal, corporate and professional',
    friendly: 'warm, friendly and approachable',
    creative: 'creative, original and attention-grabbing',
  }[params.tone];

  const prompt = `Sen uzman bir kariyer danışmanısın. ${toneDesc} tonda bir kapak mektubu yaz.

ADAY: ${params.fullName}
POZİSYON: ${params.position || 'İlanda belirtilen pozisyon'}
ŞİRKET: ${params.company || 'İlanda belirtilen şirket'}

İLAN:
${params.jobPosting}

Dil: ${lang} | 3-4 paragraf, 250-350 kelime`;

  return await callAI(prompt, 0.8);
}

export async function generateCVWithGemini(data: CVData, jobPosting?: string): Promise<GeneratedContent> {
  const cvPrompt = buildCVPrompt(data, jobPosting);

  let cvResult;
  try {
    const cvText = await callAI(cvPrompt, 0.85);
    const cleaned = cvText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    cvResult = JSON.parse(cleaned);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`API hatası: ${msg}`);
  }

  let coverLetter: string | undefined;
  if (jobPosting && jobPosting.trim().length > 20) {
    try {
      const coverPrompt = `Kapak mektubu yaz. Aday: ${data.personalInfo.fullName}. İlan: ${jobPosting.slice(0, 200)}`;
      coverLetter = await callAI(coverPrompt, 0.8);
    } catch (err) {
      console.error('Kapak mektubu hatası:', err);
      coverLetter = undefined;
    }
  }

  return {
    cvContent: {
      summary: (cvResult.summary && cvResult.summary.split(' ').length >= 8) ? cvResult.summary : (data.personalInfo.summary && data.personalInfo.summary.split(' ').length >= 8 ? data.personalInfo.summary : ''),
      experience: cvResult.experience || [],
      education: cvResult.education || [],
      skills: cvResult.skills || data.skills,
      certificates: cvResult.certificates || [],
    },
    coverLetter,
    jobPosting: jobPosting || undefined,
    aiGenerated: true,
  };
}
