import type { CVData, GeneratedContent } from '../types';

async function callAI(prompt: string, temperature = 0.85): Promise<string> {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      temperature,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenRouter API hatası: ${err}`);
  }

  const data = await res.json();
  return data.choices[0].message.content as string;
}

function buildCVPrompt(data: CVData, jobPosting?: string): string {
  const isEn = data.preferences.language === 'en';
  const langMap: Record<string, string> = { en: 'English', tr: 'Turkish', fr: 'French', es: 'Spanish', de: 'German', it: 'Italian', pt: 'Portuguese', nl: 'Dutch' };
  const lang = langMap[data.preferences.language] ?? 'English';

  // Detect sparseness
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

  const jobCtx = jobPosting
    ? `

════════════════════════════════════════
HEDEF İŞ İLANI — YÜKSEK ÖNCELİK
════════════════════════════════════════
${jobPosting}
════════════════════════════════════════

İLANA GÖRE OPTİMİZASYON KURALLARI — KESİNLİKLE UYGULA:

1. ÖZET: İlanın pozisyon adını ve öne çıkardığı 2-3 kritik özelliği (teknik beceri, deneyim alanı, soft skill) özete organik biçimde yansıt. Genel değil, bu ilan için yazılmış gibi hissettir.

2. BULLET'LAR: Her deneyim için en az 2 bullet, ilanın temel gereksinimlerini karşılasın. İlanda geçen araç/teknoloji/metodoloji isimlerini (Python, Agile, Salesforce vb.) bire bir ya da eşdeğerleriyle bullet'lara ekle.

3. BECERİLER: İlandan çıkardığın kritik skill'leri listenin BAŞINA koy. İlana özel beceriler (araçlar, sertifikalar, metodolojiler) kullanıcı girmemiş olsa bile makul çıkarım yaparak ekle.

4. ATS OPTİMİZASYONU: ATS taramasını geçmek için ilandaki önemli anahtar kelimeleri CV geneline yay — özet, bullet ve skills bölümlerinde geçsin.

5. TERMİNOLOJİ: İlanın dilini ve sektör jargonunu kullan. Farklı sektörden kullanıcı için transferable skill'leri öne çıkar.`
    : '';

  const sparseInstructions = isSparse ? `
⚠️ SEYREK VERİ MODU — KULLANICI AZ BİLGİ VERDİ:
Kullanıcı minimal bilgi girmiş. AŞAĞIDAKİLERİ MUTLAKA YAP:
${sparse.noDescriptions || sparse.someDescriptions ? `• Her deneyim için 4-5 güçlü bullet üret. Sadece pozisyon ve şirket adından gerçekçi sorumluluklar, araçlar, ölçülebilir başarılar çıkarsa. Örnek: "Software Developer @ Startup" → REST API geliştirme, CI/CD pipeline, %X performans iyileştirmesi vb.` : ''}
${sparse.fewSkills ? `• Skills bölümüne 10-14 beceri ekle. Sektörün (${data.preferences.sector}) ve seviyenin (${data.preferences.level}) gerektirdiği teknik + soft skill kombinasyonu oluştur. Kullanıcının girdiği becerileri koru, eksikleri tamamla.` : ''}
${sparse.noExperience ? `• Deneyim yok ama "${data.preferences.level}" seviye belirtilmiş. Sektöre (${data.preferences.sector}) uygun 1-2 staj/proje/freelance deneyimi uydurma — bunun yerine education ve skills'i daha zengin yap, özeti güçlendir.` : ''}
${sparse.noSummary ? `• Özet bölümünü 3 güçlü cümleyle doldur: (1) kim olduğu/ne yaptığı, (2) en önemli yetkinlikleri, (3) neye katkı sağlayabileceği.` : ''}
Hedef: CV tam ve güçlü görünsün. Asla ince veya eksik bırakma.
` : '';

  const bulletCount = (sparse.noDescriptions || sparse.someDescriptions) ? '4-5' : '3-4';

  return `Sen deneyimli bir CV yazarısın. Aşağıdaki ham bilgileri alıp ATS uyumlu, özgün ve etkileyici bir CV içeriği oluşturacaksın.
${sparseInstructions}
ADAY:
Ad: ${data.personalInfo.fullName || 'Belirtilmemiş'}
Sektör: ${data.preferences.sector}
Seviye: ${data.preferences.level}
Özet ipucu (keyword varsa kullan ama MUTLAKA tam paragraf olarak yeniden yaz): ${data.personalInfo.summary || '(yok)'}

İŞ DENEYİMİ:
${experience}

EĞİTİM:
${education}

BECERİLER: ${skills}
SERTİFİKALAR: ${certs}
${jobCtx}

YAZIM KURALLARI — BUNLARA KESİNLİKLE UY:
1. Dil: ${lang}
2. Her bullet güçlü bir eylem fiiliyle başlasın${{
     en: ' (Led, Built, Reduced, Launched, Designed, Shipped, Scaled, Automated, Mentored, Architected, Negotiated, Delivered, Optimized, Streamlined, Spearheaded…)',
     tr: ' (Geliştirdi, Tasarladı, Azalttı, Hayata geçirdi, Kurdu, Ölçeklendirdi, Otomatize etti, Mentörlük etti, Teslim etti, Optimize etti, Yönetti…)',
     fr: ' (Dirigé, Développé, Réduit, Lancé, Conçu, Livré, Optimisé, Automatisé, Encadré, Négocié, Déployé, Rationalisé…)',
     es: ' (Lideró, Desarrolló, Redujo, Lanzó, Diseñó, Entregó, Optimizó, Automatizó, Mentorizó, Negoció, Desplegó, Implementó…)',
     de: ' (Geleitet, Entwickelt, Reduziert, Gestartet, Entworfen, Geliefert, Optimiert, Automatisiert, Betreut, Verhandelt, Implementiert, Skaliert…)',
     it: ' (Guidato, Sviluppato, Ridotto, Lanciato, Progettato, Consegnato, Ottimizzato, Automatizzato, Mentored, Negoziato, Implementato…)',
     pt: ' (Liderou, Desenvolveu, Reduziu, Lançou, Projetou, Entregou, Otimizou, Automatizou, Orientou, Negociou, Implementou…)',
     nl: ' (Geleid, Ontwikkeld, Verminderd, Gelanceerd, Ontworpen, Geleverd, Geoptimaliseerd, Geautomatiseerd, Begeleid, Onderhandeld, Geïmplementeerd…)',
   }[data.preferences.language] ?? ' (Led, Built, Reduced, Launched, Designed, Shipped, Scaled, Automated…)'}
3. Bullet'lar SOMUT olsun: mümkünse sayı, yüzde, süre, ölçek ekle — uydurma ama mantıklı tahmin yap (örn. "500+ kullanıcı", "%30 süre azaltımı", "6 kişilik ekip")
4. YASAK KLİŞELER — bunları veya benzerlerini kesinlikle kullanma:
   ${{
     en: '"passionate about", "results-driven", "team player", "hard worker", "self-motivated", "detail-oriented", "fast learner", "go-getter", "dedicated professional", "highly motivated", "dynamic", "synergy", "responsible for", "worked closely with", "helped the team", "assisted with", "various tasks", "multiple responsibilities"',
     tr: '"tutku ile", "çok tutkulu", "sonuç odaklı", "takım oyuncusu", "çeşitli görevler", "takıma katkı sağladı", "sorumlu oldu", "yardımcı oldu", "dinamik", "mükemmeliyetçi", "kendini adamış"',
     fr: '"passionné par", "orienté résultats", "esprit d\'équipe", "travailleur acharné", "motivé", "dynamique", "synergies", "responsable de", "a contribué à", "a aidé l\'équipe"',
     es: '"apasionado por", "orientado a resultados", "jugador de equipo", "trabajador", "motivado", "dinámico", "sinergia", "responsable de", "ayudó al equipo", "contribuyó a"',
     de: '"leidenschaftlich", "ergebnisorientiert", "Teamplayer", "fleißig", "motiviert", "dynamisch", "Synergie", "verantwortlich für", "hat dem Team geholfen", "hat beigetragen"',
     it: '"appassionato di", "orientato ai risultati", "giocatore di squadra", "lavoratore instancabile", "motivato", "dinamico", "sinergia", "responsabile di", "ha aiutato il team"',
     pt: '"apaixonado por", "orientado a resultados", "jogador de equipe", "trabalhador", "motivado", "dinâmico", "sinergia", "responsável por", "ajudou a equipe"',
     nl: '"gepassioneerd door", "resultaatgericht", "teamspeler", "hardwerkend", "gemotiveerd", "dynamisch", "synergie", "verantwoordelijk voor", "heeft het team geholpen"',
   }[data.preferences.language] ?? '"passionate about", "results-driven", "team player", "hard worker", "self-motivated", "detail-oriented"'}
5. Her deneyim için ${bulletCount} bullet — her biri farklı bir yetkinliği öne çıkarsın (teknik, liderlik, sonuç, iş birliği gibi)
6. Özet: 2-3 cümle, klişesiz, adayı gerçekten tanımlayan.
   ${isEn
     ? 'NEVER open with "results-driven", "passionate", "highly motivated", "dedicated", "dynamic professional" or any generic adjective. Start with a specific fact about the candidate (their role, impact, or specialty).'
     : '"Sonuç odaklı profesyonel", "kendini adamış", "tutkulu" gibi generik açılışlar YASAK. Adayı gerçekten tanımlayan spesifik bir cümleyle başla.'}
   Özet ipucunda sadece keyword listesi varsa onları bağlamlı cümleye dönüştür, asla olduğu gibi kopyalama.
7. Ham notlar yetersizse pozisyon/şirketten mantıklı çıkarsama yap — asla "bilgi yok" yazma
8. skills dizisine en az ${sparse.fewSkills ? '10' : '6'} beceri ekle

SADECE aşağıdaki JSON'ı döndür, başka hiçbir şey ekleme:

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

function buildCoverLetterPrompt(data: CVData, jobPosting: string): string {
  const langMap2 = { en: 'English', tr: 'Turkish', fr: 'French', es: 'Spanish' };
  const lang = langMap2[data.preferences.language as keyof typeof langMap2] ?? 'English';
  const firstLine = jobPosting.split('\n')[0].trim();

  return `Sen profesyonel bir kariyer danışmanısın. İlgi çekici, kişisel ama profesyonel kapak mektupları yazıyorsun.

Aşağıdaki bilgileri kullanarak bir kapak mektubu yaz:

ADAY BİLGİLERİ:
Ad: ${data.personalInfo.fullName}
Deneyim: ${data.experience.map(e => `${e.position} @ ${e.company}`).join(', ') || 'Belirtilmemiş'}
Beceriler: ${data.skills.join(', ') || 'Belirtilmemiş'}
Sektör: ${data.preferences.sector}
Seviye: ${data.preferences.level}

İŞ İLANI:
${jobPosting}

İş ilanı başlığı / şirket: ${firstLine}

Mektup şunları içermeli:
- Neden bu pozisyon ve şirkete ilgi duyduğunu
- En güçlü 2-3 deneyimini bu pozisyonla bağdaştır
- Şirkete nasıl değer katacağını
- Profesyonel ama samimi bir kapanış

${lang} dilinde, 3-4 paragraf, 250-350 kelime arası olsun.
Mektubu doğrudan başlat, "İşte kapak mektubunuz:" gibi giriş cümleleri kullanma.
Sadece mektup metnini yaz.`;
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

  const prompt = `Sen uzman bir kariyer danışmanısın. ${toneDesc} tonda, klişesiz ve özgün bir kapak mektubu yaz.

ADAY: ${params.fullName}
POZİSYON: ${params.position || 'İlanda belirtilen pozisyon'}
ŞİRKET: ${params.company || 'İlanda belirtilen şirket'}
DENEYİM: ${params.experience || 'Belirtilmemiş'}
BECERİLER: ${params.skills || 'Belirtilmemiş'}

İLAN:
${params.jobPosting}

KURALLAR:
- Dil: ${lang} | Ton: ${toneDesc}
- 3-4 paragraf, 250-350 kelime
- İlk cümle dikkat çekici ve spesifik olsun — YASAK açılışlar: "I am writing to express my interest", "I would like to apply", "Başvurumu sunmak istiyorum", "I am a passionate", "As a dedicated professional"
- YASAK klişeler (bunları veya çok benzerlerini hiçbir yerde kullanma):
  "passionate about", "I am passionate", "results-driven", "team player", "hard worker", "detail-oriented", "highly motivated", "dedicated professional", "I believe I would be a great fit", "I am confident that", "my skills align perfectly", "I am excited about the opportunity", "değerlendirmenizi rica ederim", "ilginizi bekliyorum", "tutku ile", "kendimi adıyorum"
- Adayın spesifik deneyimini ve ilanın spesifik gereksinimini somut biçimde eşleştir
- Şirkete/pozisyona özgü bir detay içersin (ilandan çıkarsama yap)
- Kapanış doğrudan ve özgün olsun — next steps öner, klişe bitirme cümlelerinden kaçın
- Sadece mektup metnini yaz, başka hiçbir şey ekleme`;

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
    throw new Error(`OpenRouter API hatası: ${msg}`);
  }

  let coverLetter: string | undefined;
  if (jobPosting && jobPosting.trim().length > 20) {
    try {
      const coverPrompt = buildCoverLetterPrompt(data, jobPosting);
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
