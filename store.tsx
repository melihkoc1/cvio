import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

function pathToPage(path: string): string {
  const p = path.replace(/^\//, '') || 'landing';
  if (p === '') return 'landing';
  return p;
}

function pageToPath(page: string): string {
  if (page === 'landing') return '/';
  return '/' + page;
}
import { generateCVWithGemini } from './lib/gemini';
import { signInWithGoogle, signOutUser } from './lib/firebase';
import { t as translate, type Lang, type TranslationKey } from './lib/i18n';
import type { CVData, SavedCV, GeneratedContent, UserProfile, PersonalInfo, Experience, Education, Certificate, Preferences } from './types';

interface AppState {
  user: UserProfile;
  uiLang: Lang;
  cvData: CVData;
  savedCVs: SavedCV[];
  generatedContent: GeneratedContent | null;
  jobPosting: string;
  isGenerating: boolean;
  generatingStep: number;
  generatingError: string | null;
  currentPage: string;
  showAuthModal: boolean;
  showUpgradeModal: boolean;
}

interface AppContextType extends AppState {
  setUiLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
  setCurrentPage: (page: string) => void;
  setUser: (user: UserProfile) => void;
  setGeneratingError: (err: string | null) => void;
  login: (name: string, email: string) => void;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  addExperience: () => void;
  updateExperience: (id: string, exp: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  addEducation: () => void;
  updateEducation: (id: string, edu: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;
  addCertificate: () => void;
  updateCertificate: (id: string, cert: Partial<Certificate>) => void;
  removeCertificate: (id: string) => void;
  updatePreferences: (prefs: Partial<Preferences>) => void;
  setJobPosting: (text: string) => void;
  generateCV: (withJob: boolean) => Promise<void>;
  setGeneratedContent: (content: GeneratedContent | null) => void;
  saveCV: (title: string) => void;
  deleteCV: (id: string) => void;
  loadCV: (id: string) => void;
  setShowAuthModal: (show: boolean) => void;
  setShowUpgradeModal: (show: boolean) => void;
  upgradeToPro: () => void;
}

const defaultPersonalInfo: PersonalInfo = {
  fullName: '', email: '', phone: '', linkedin: '', github: '', city: '', country: '', summary: '', personalStatement: '', photo: ''
};

const defaultPreferences: Preferences = {
  language: 'en', template: 'modern', sector: 'Technology / Software', level: 'Mid-Level'
};

const defaultCVData: CVData = {
  personalInfo: defaultPersonalInfo,
  experience: [],
  education: [],
  skills: [],
  certificates: [],
  preferences: defaultPreferences
};

const defaultUser: UserProfile = {
  fullName: '', email: '', plan: 'free', cvCount: 0, isLoggedIn: false
};

const AppContext = createContext<AppContextType | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

function simulateAIContent(data: CVData, jobPosting?: string): GeneratedContent {
  const isEn = data.preferences.language !== 'tr';
  const skillsStr = data.skills.slice(0, 3).join(', ');
  const expStr = data.experience.length > 0 ? data.experience[0].position : null;
  const summaryTexts: Record<string, string> = {
    tr: `${data.personalInfo.fullName || 'Candidate'} is a ${data.preferences.level}-level professional in ${data.preferences.sector}${expStr ? `, with hands-on experience as ${expStr}` : ''}. ${skillsStr ? `Proficient in ${skillsStr}, with` : 'With'} a strong foundation built through practical projects and continuous self-development. Brings analytical thinking and collaborative approach to every team environment.`,
    en: `${data.personalInfo.fullName || 'Candidate'} is a ${data.preferences.level}-level professional in ${data.preferences.sector}${expStr ? `, with hands-on experience as ${expStr}` : ''}. ${skillsStr ? `Proficient in ${skillsStr}, with` : 'With'} a strong foundation built through practical projects and continuous self-development. Brings analytical thinking and collaborative approach to every team environment.`
  };

  const actionVerbsEn = ['Managed', 'Developed', 'Increased', 'Delivered', 'Implemented', 'Coordinated', 'Analyzed', 'Optimized', 'Created', 'Designed'];
  const verbs = actionVerbsEn;

  const experience = data.experience.map(exp => {
    const desc = exp.description || 'Worked on various projects and responsibilities';
    const sentences = desc.split(/[.,;]/).filter(s => s.trim().length > 5).slice(0, 4);
    const bullets = sentences.length > 0
      ? sentences.map((s, i) => `${verbs[i % verbs.length]} ${s.trim().toLowerCase().replace(/^(yönetti|geliştirdi|managed|developed)\s*/i, '')}`)
      : [
        `${verbs[0]} key projects and delivered results on time`,
        `${verbs[1]} new processes improving efficiency by 20%`,
        `${verbs[5]} cross-functional teams to achieve goals`
      ];
    return {
      company: exp.company,
      position: exp.position,
      startDate: exp.startDate,
      endDate: exp.isCurrent ? 'Present' : exp.endDate,
      bullets
    };
  });

  const education = data.education.map(edu => ({
    school: edu.school,
    department: edu.department,
    degree: edu.degree,
    year: edu.graduationYear,
    gpa: edu.gpa || undefined
  }));

  let coverLetter: string | undefined;
  if (jobPosting) {
    if (isEn) {
      coverLetter = `Dear Hiring Manager,

I am writing to express my strong interest in the position advertised at your esteemed organization. With my background in ${data.preferences.sector} and experience as ${data.experience[0]?.position || 'a dedicated professional'}, I believe I would be a valuable addition to your team.

Throughout my career, I have developed strong skills in ${data.skills.slice(0, 3).join(', ') || 'various technical and soft skills'} that directly align with the requirements outlined in your job posting. ${data.experience[0] ? `At ${data.experience[0].company}, I ${data.experience[0].description?.slice(0, 100) || 'contributed significantly to team goals and project success'}.` : 'I have consistently demonstrated my ability to deliver results and exceed expectations.'}

I am particularly drawn to this opportunity because it aligns perfectly with my career goals and allows me to leverage my expertise in ${data.preferences.sector}. I am confident that my ${data.preferences.level}-level experience, combined with my passion for excellence, makes me an ideal candidate for this role.

I would welcome the opportunity to discuss how my skills and experience can contribute to your organization's success. Thank you for considering my application.

Sincerely,
${data.personalInfo.fullName || 'Candidate'}`;
    } else {
      coverLetter = `Dear Hiring Manager,

I am writing to express my strong interest in the position advertised at your organization. With my background in ${data.preferences.sector} and experience as ${data.experience[0]?.position || 'a dedicated professional'}, I believe I would be a valuable addition to your team.

Throughout my career, I have developed strong skills in ${data.skills.slice(0, 3).join(', ') || 'various technical and soft skills'} that directly align with the requirements outlined in your job posting. ${data.experience[0] ? `At ${data.experience[0].company}, I ${data.experience[0].description?.slice(0, 100) || 'contributed significantly to team goals and project success'}.` : 'I have consistently demonstrated my ability to deliver results and exceed expectations.'}

I am particularly drawn to this opportunity because it aligns perfectly with my career goals and allows me to leverage my expertise in ${data.preferences.sector}. I am confident that my ${data.preferences.level}-level experience, combined with my drive for excellence, makes me an ideal candidate for this role.

I would welcome the opportunity to discuss how my skills and experience can contribute to your organization's success. Thank you for considering my application.

Sincerely,
${data.personalInfo.fullName || 'Candidate'}`;
    }
  }

  return {
    cvContent: {
      summary: (data.personalInfo.summary && data.personalInfo.summary.split(' ').length >= 8)
        ? data.personalInfo.summary
        : summaryTexts[data.preferences.language],
      experience,
      education,
      skills: data.skills.length > 0 ? data.skills : ['Communication', 'Teamwork', 'Problem Solving'],
      certificates: data.certificates.map(c => ({ name: c.name, institution: c.institution, year: c.year }))
    },
    coverLetter,
    jobPosting: jobPosting || undefined,
    aiGenerated: false,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [uiLang, setUiLang] = useState<Lang>(() => {
    return (localStorage.getItem('cvio_uilang') as Lang) || 'en';
  });
  const [user, setUser] = useState<UserProfile>(() => {
    const s = localStorage.getItem('cvio_user');
    return s ? JSON.parse(s) : defaultUser;
  });
  const [cvData, setCvData] = useState<CVData>(() => {
    const s = localStorage.getItem('cvio_cvdata');
    return s ? JSON.parse(s) : defaultCVData;
  });
  const [savedCVs, setSavedCVs] = useState<SavedCV[]>(() => {
    const s = localStorage.getItem('cvio_saved');
    return s ? JSON.parse(s) : [];
  });
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [jobPosting, setJobPosting] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingStep, setGeneratingStep] = useState(0);
  const [generatingError, setGeneratingError] = useState<string | null>(null);
  const [currentPage, setCurrentPageRaw] = useState(() => pathToPage(window.location.pathname));
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    const onPop = () => setCurrentPageRaw(pathToPage(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const handleSetUiLang = useCallback((lang: Lang) => {
    setUiLang(lang);
    localStorage.setItem('cvio_uilang', lang);
  }, []);

  const tFn = useCallback((key: TranslationKey) => translate(uiLang, key), [uiLang]);

  const persistUser = (u: UserProfile) => { setUser(u); localStorage.setItem('cvio_user', JSON.stringify(u)); };
  const persistCvData = (d: CVData) => { setCvData(d); localStorage.setItem('cvio_cvdata', JSON.stringify(d)); };
  const persistSaved = (s: SavedCV[]) => { setSavedCVs(s); localStorage.setItem('cvio_saved', JSON.stringify(s)); };

  const setCurrentPage = useCallback((page: string) => {
    setCurrentPageRaw(page);
    window.history.pushState(null, '', pageToPath(page));
    window.scrollTo(0, 0);
  }, []);

  const login = useCallback((name: string, email: string) => {
    const u = { ...user, fullName: name, email, isLoggedIn: true };
    persistUser(u);
    if (!cvData.personalInfo.fullName) {
      persistCvData({ ...cvData, personalInfo: { ...cvData.personalInfo, fullName: name, email } });
    }
    setShowAuthModal(false);
  }, [user, cvData]);

  const loginWithGoogle = useCallback(async () => {
    const firebaseUser = await signInWithGoogle();
    const u: UserProfile = {
      ...user,
      fullName: firebaseUser.displayName || '',
      email: firebaseUser.email || '',
      isLoggedIn: true,
      googleUid: firebaseUser.uid,
      avatar: firebaseUser.photoURL || undefined,
    };
    persistUser(u);
    if (!cvData.personalInfo.fullName) {
      persistCvData({ ...cvData, personalInfo: { ...cvData.personalInfo, fullName: firebaseUser.displayName || '', email: firebaseUser.email || '' } });
    }
    setShowAuthModal(false);
  }, [user, cvData]);

  const logout = useCallback(() => {
    signOutUser();
    persistUser(defaultUser);
    setCurrentPageRaw('landing');
  }, []);

  const updatePersonalInfo = useCallback((info: Partial<PersonalInfo>) => {
    const newData = { ...cvData, personalInfo: { ...cvData.personalInfo, ...info } };
    persistCvData(newData);
  }, [cvData]);

  const addExperience = useCallback(() => {
    const newExp: Experience = { id: generateId(), type: 'work', company: '', position: '', startDate: '', endDate: '', isCurrent: false, description: '' };
    const newData = { ...cvData, experience: [...cvData.experience, newExp] };
    persistCvData(newData);
  }, [cvData]);

  const updateExperience = useCallback((id: string, exp: Partial<Experience>) => {
    const newData = { ...cvData, experience: cvData.experience.map(e => e.id === id ? { ...e, ...exp } : e) };
    persistCvData(newData);
  }, [cvData]);

  const removeExperience = useCallback((id: string) => {
    const newData = { ...cvData, experience: cvData.experience.filter(e => e.id !== id) };
    persistCvData(newData);
  }, [cvData]);

  const addEducation = useCallback(() => {
    const newEdu: Education = { id: generateId(), school: '', department: '', degree: 'Lisans', graduationYear: '', gpa: '' };
    const newData = { ...cvData, education: [...cvData.education, newEdu] };
    persistCvData(newData);
  }, [cvData]);

  const updateEducation = useCallback((id: string, edu: Partial<Education>) => {
    const newData = { ...cvData, education: cvData.education.map(e => e.id === id ? { ...e, ...edu } : e) };
    persistCvData(newData);
  }, [cvData]);

  const removeEducation = useCallback((id: string) => {
    const newData = { ...cvData, education: cvData.education.filter(e => e.id !== id) };
    persistCvData(newData);
  }, [cvData]);

  const addSkill = useCallback((skill: string) => {
    if (skill && !cvData.skills.includes(skill)) {
      const newData = { ...cvData, skills: [...cvData.skills, skill] };
      persistCvData(newData);
    }
  }, [cvData]);

  const removeSkill = useCallback((skill: string) => {
    const newData = { ...cvData, skills: cvData.skills.filter(s => s !== skill) };
    persistCvData(newData);
  }, [cvData]);

  const addCertificate = useCallback(() => {
    const newCert: Certificate = { id: generateId(), name: '', institution: '', year: '' };
    const newData = { ...cvData, certificates: [...cvData.certificates, newCert] };
    persistCvData(newData);
  }, [cvData]);

  const updateCertificate = useCallback((id: string, cert: Partial<Certificate>) => {
    const newData = { ...cvData, certificates: cvData.certificates.map(c => c.id === id ? { ...c, ...cert } : c) };
    persistCvData(newData);
  }, [cvData]);

  const removeCertificate = useCallback((id: string) => {
    const newData = { ...cvData, certificates: cvData.certificates.filter(c => c.id !== id) };
    persistCvData(newData);
  }, [cvData]);

  const updatePreferences = useCallback((prefs: Partial<Preferences>) => {
    const newData = { ...cvData, preferences: { ...cvData.preferences, ...prefs } };
    persistCvData(newData);
  }, [cvData]);

  const generateCV = useCallback(async (withJob: boolean) => {
    setIsGenerating(true);
    setGeneratingStep(0);
    setGeneratingError(null);
    setCurrentPageRaw('generating');

    try {
      // Adım 1: Bilgiler analiz ediliyor
      setGeneratingStep(0);
      await new Promise(r => setTimeout(r, 600));

      // Adım 2: İş ilanı inceleniyor (varsa)
      if (withJob) {
        setGeneratingStep(1);
        await new Promise(r => setTimeout(r, 500));
      }

      // Adım 3: CV optimize ediliyor — Gemini API çağrısı
      setGeneratingStep(2);
      const content = await generateCVWithGemini(cvData, withJob ? jobPosting : undefined);

      // Adım 4: Kapak mektubu yazılıyor (varsa)
      if (withJob) {
        setGeneratingStep(3);
        await new Promise(r => setTimeout(r, 400));
      }

      // Adım 5: PDF hazırlanıyor
      setGeneratingStep(4);
      await new Promise(r => setTimeout(r, 600));

      // Adım 6: Hazır!
      setGeneratingStep(5);
      await new Promise(r => setTimeout(r, 400));

      setGeneratedContent(content);

      const newUser = { ...user, cvCount: user.cvCount + 1 };
      persistUser(newUser);

      setIsGenerating(false);
      setCurrentPageRaw('result');

    } catch (error) {
      console.error('Gemini API hatası:', error);
      const errMsg = error instanceof Error ? error.message : String(error);
      setGeneratingError(errMsg);

      // Hata durumunda simulate'e düş — ama hatayı kullanıcıya göster
      setGeneratingStep(2);
      await new Promise(r => setTimeout(r, 800));
      const content = simulateAIContent(cvData, withJob ? jobPosting : undefined);
      content.aiError = errMsg;
      setGeneratingStep(5);
      await new Promise(r => setTimeout(r, 400));
      setGeneratedContent(content);
      const newUser = { ...user, cvCount: user.cvCount + 1 };
      persistUser(newUser);
      setIsGenerating(false);
      setCurrentPageRaw('result');
    }
  }, [cvData, jobPosting, user]);

  const saveCV = useCallback((title: string) => {
    const newCV: SavedCV = {
      id: generateId(),
      title: title || new Date().toLocaleDateString('en-US'),
      data: cvData,
      generatedContent,
      template: cvData.preferences.template,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const newSaved = [newCV, ...savedCVs];
    persistSaved(newSaved);
  }, [cvData, generatedContent, savedCVs]);

  const deleteCV = useCallback((id: string) => {
    const newSaved = savedCVs.filter(cv => cv.id !== id);
    persistSaved(newSaved);
  }, [savedCVs]);

  const loadCV = useCallback((id: string) => {
    const cv = savedCVs.find(c => c.id === id);
    if (cv) {
      persistCvData(cv.data);
      if (cv.generatedContent) setGeneratedContent(cv.generatedContent);
    }
  }, [savedCVs]);

  const upgradeToPro = useCallback(() => {
    const u = { ...user, plan: 'pro' as const };
    persistUser(u);
    setShowUpgradeModal(false);
  }, [user]);

  return (
    <AppContext.Provider value={{
      user, uiLang, cvData, savedCVs, generatedContent, jobPosting, isGenerating, generatingStep, generatingError, currentPage, showAuthModal, showUpgradeModal,
      setUiLang: handleSetUiLang, t: tFn, setCurrentPage, setUser, setGeneratingError, login, loginWithGoogle, logout, updatePersonalInfo,
      addExperience, updateExperience, removeExperience,
      addEducation, updateEducation, removeEducation,
      addSkill, removeSkill,
      addCertificate, updateCertificate, removeCertificate,
      updatePreferences, setJobPosting, generateCV, setGeneratedContent,
      saveCV, deleteCV, loadCV,
      setShowAuthModal, setShowUpgradeModal, upgradeToPro
    }}>
      {children}
    </AppContext.Provider>
  );
}
