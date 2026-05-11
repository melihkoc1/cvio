import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { signInWithGoogle, signOutUser } from './lib/firebase';
import type { CVData, GeneratedContent, UserProfile, PersonalInfo, Experience, Education, Certificate, Preferences } from './types';

function pathToPage(path: string): string {
  const p = path.replace(/^\//, '') || 'landing';
  if (p === '') return 'landing';
  return p;
}

function pageToPath(page: string): string {
  if (page === 'landing') return '/';
  return '/' + page;
}

interface AppState {
  user: UserProfile;
  cvData: CVData;
  generatedContent: GeneratedContent | null;
  isGenerating: boolean;
  generatingStep: number;
  currentPage: string;
  showAuthModal: boolean;
}

interface AppContextType extends AppState {
  setCurrentPage: (page: string) => void;
  setUser: (user: UserProfile) => void;
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
  generateCV: () => Promise<void>;
  setGeneratedContent: (content: GeneratedContent | null) => void;
  setShowAuthModal: (show: boolean) => void;
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
  fullName: '', email: '', isLoggedIn: false
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

// Week 5 hedefi: bu fonksiyonu Gemini API çağrısı ile değiştir.
function buildCVContent(data: CVData): GeneratedContent {
  const skillsStr = data.skills.slice(0, 3).join(', ');
  const expStr = data.experience.length > 0 ? data.experience[0].position : null;
  const summary = data.personalInfo.summary && data.personalInfo.summary.split(' ').length >= 8
    ? data.personalInfo.summary
    : `${data.personalInfo.fullName || 'Candidate'} is a ${data.preferences.level}-level professional in ${data.preferences.sector}${expStr ? `, with hands-on experience as ${expStr}` : ''}. ${skillsStr ? `Proficient in ${skillsStr}.` : 'Eager to grow and contribute to ambitious teams.'}`;

  const experience = data.experience.map(exp => {
    const desc = exp.description || 'Worked on various projects and responsibilities';
    const bullets = desc.split(/[.,;\n]/).map(s => s.trim()).filter(s => s.length > 5);
    return {
      company: exp.company,
      position: exp.position,
      startDate: exp.startDate,
      endDate: exp.isCurrent ? 'Present' : exp.endDate,
      bullets: bullets.length ? bullets : [desc]
    };
  });

  const education = data.education.map(edu => ({
    school: edu.school,
    department: edu.department,
    degree: edu.degree,
    year: edu.graduationYear,
    gpa: edu.gpa || undefined
  }));

  return {
    cvContent: {
      summary,
      experience,
      education,
      skills: data.skills.length ? data.skills : ['Communication', 'Teamwork', 'Problem Solving'],
      certificates: data.certificates.map(c => ({ name: c.name, institution: c.institution, year: c.year }))
    }
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile>(() => {
    const s = localStorage.getItem('cvio_user');
    return s ? JSON.parse(s) : defaultUser;
  });
  const [cvData, setCvData] = useState<CVData>(() => {
    const s = localStorage.getItem('cvio_cvdata');
    return s ? JSON.parse(s) : defaultCVData;
  });
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingStep, setGeneratingStep] = useState(0);
  const [currentPage, setCurrentPageRaw] = useState(() => pathToPage(window.location.pathname));
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const onPop = () => setCurrentPageRaw(pathToPage(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const persistUser = (u: UserProfile) => { setUser(u); localStorage.setItem('cvio_user', JSON.stringify(u)); };
  const persistCvData = (d: CVData) => { setCvData(d); localStorage.setItem('cvio_cvdata', JSON.stringify(d)); };

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
      persistCvData({ ...cvData, personalInfo: {
        ...cvData.personalInfo,
        fullName: firebaseUser.displayName || '',
        email: firebaseUser.email || '',
      }});
    }
    setShowAuthModal(false);
  }, [user, cvData]);

  const logout = useCallback(() => {
    signOutUser();
    persistUser(defaultUser);
    setCurrentPageRaw('landing');
  }, []);

  const updatePersonalInfo = useCallback((info: Partial<PersonalInfo>) => {
    persistCvData({ ...cvData, personalInfo: { ...cvData.personalInfo, ...info } });
  }, [cvData]);

  const addExperience = useCallback(() => {
    const newExp: Experience = { id: generateId(), type: 'work', company: '', position: '', startDate: '', endDate: '', isCurrent: false, description: '' };
    persistCvData({ ...cvData, experience: [...cvData.experience, newExp] });
  }, [cvData]);

  const updateExperience = useCallback((id: string, exp: Partial<Experience>) => {
    persistCvData({ ...cvData, experience: cvData.experience.map(e => e.id === id ? { ...e, ...exp } : e) });
  }, [cvData]);

  const removeExperience = useCallback((id: string) => {
    persistCvData({ ...cvData, experience: cvData.experience.filter(e => e.id !== id) });
  }, [cvData]);

  const addEducation = useCallback(() => {
    const newEdu: Education = { id: generateId(), school: '', department: '', degree: "Bachelor's", graduationYear: '', gpa: '' };
    persistCvData({ ...cvData, education: [...cvData.education, newEdu] });
  }, [cvData]);

  const updateEducation = useCallback((id: string, edu: Partial<Education>) => {
    persistCvData({ ...cvData, education: cvData.education.map(e => e.id === id ? { ...e, ...edu } : e) });
  }, [cvData]);

  const removeEducation = useCallback((id: string) => {
    persistCvData({ ...cvData, education: cvData.education.filter(e => e.id !== id) });
  }, [cvData]);

  const addSkill = useCallback((skill: string) => {
    if (skill && !cvData.skills.includes(skill)) {
      persistCvData({ ...cvData, skills: [...cvData.skills, skill] });
    }
  }, [cvData]);

  const removeSkill = useCallback((skill: string) => {
    persistCvData({ ...cvData, skills: cvData.skills.filter(s => s !== skill) });
  }, [cvData]);

  const addCertificate = useCallback(() => {
    const newCert: Certificate = { id: generateId(), name: '', institution: '', year: '' };
    persistCvData({ ...cvData, certificates: [...cvData.certificates, newCert] });
  }, [cvData]);

  const updateCertificate = useCallback((id: string, cert: Partial<Certificate>) => {
    persistCvData({ ...cvData, certificates: cvData.certificates.map(c => c.id === id ? { ...c, ...cert } : c) });
  }, [cvData]);

  const removeCertificate = useCallback((id: string) => {
    persistCvData({ ...cvData, certificates: cvData.certificates.filter(c => c.id !== id) });
  }, [cvData]);

  const updatePreferences = useCallback((prefs: Partial<Preferences>) => {
    persistCvData({ ...cvData, preferences: { ...cvData.preferences, ...prefs } });
  }, [cvData]);

  const generateCV = useCallback(async () => {
    setIsGenerating(true);
    setGeneratingStep(0);
    setCurrentPageRaw('generating');

    await new Promise(r => setTimeout(r, 600));
    setGeneratingStep(1);
    await new Promise(r => setTimeout(r, 500));
    setGeneratingStep(2);
    await new Promise(r => setTimeout(r, 700));
    setGeneratingStep(3);
    await new Promise(r => setTimeout(r, 500));

    setGeneratedContent(buildCVContent(cvData));
    setIsGenerating(false);
    setCurrentPageRaw('result');
  }, [cvData]);

  return (
    <AppContext.Provider value={{
      user, cvData, generatedContent, isGenerating, generatingStep, currentPage, showAuthModal,
      setCurrentPage, setUser, login, loginWithGoogle, logout, updatePersonalInfo,
      addExperience, updateExperience, removeExperience,
      addEducation, updateEducation, removeEducation,
      addSkill, removeSkill,
      addCertificate, updateCertificate, removeCertificate,
      updatePreferences, generateCV, setGeneratedContent,
      setShowAuthModal
    }}>
      {children}
    </AppContext.Provider>
  );
}
