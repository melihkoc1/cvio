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
import type { CVData, SavedCV, GeneratedContent, UserProfile, PersonalInfo, Experience, Education, Certificate, Preferences } from './types';

interface AppState {
  user: UserProfile;
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

export function AppProvider({ children }: { children: ReactNode }) {
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

    try {
      setGeneratingStep(0);
      await new Promise(r => setTimeout(r, 600));

      if (withJob) {
        setGeneratingStep(1);
        await new Promise(r => setTimeout(r, 500));
      }

      setGeneratingStep(2);
      const content = await generateCVWithGemini(cvData, withJob ? jobPosting : undefined);

      setGeneratingStep(5);
      await new Promise(r => setTimeout(r, 400));

      setGeneratedContent(content);

      const newUser = { ...user, cvCount: user.cvCount + 1 };
      persistUser(newUser);

      setIsGenerating(false);
    } catch (error) {
      console.error('API hatası:', error);
      const errMsg = error instanceof Error ? error.message : String(error);
      setGeneratingError(errMsg);
      setIsGenerating(false);
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
      user, cvData, savedCVs, generatedContent, jobPosting, isGenerating, generatingStep, generatingError, currentPage, showAuthModal, showUpgradeModal,
      setCurrentPage, setUser, setGeneratingError, login, loginWithGoogle, logout, updatePersonalInfo,
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
