export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  city: string;
  country: string;
  summary: string;
  personalStatement?: string;
  photo?: string;
}

export interface Experience {
  id: string;
  type: 'work' | 'project' | 'volunteer' | 'freelance';
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  department: string;
  degree: string;
  graduationYear: string;
  gpa: string;
}

export interface Certificate {
  id: string;
  name: string;
  institution: string;
  year: string;
}

export type TemplateId = 'modern' | 'classic' | 'professional';

export interface Preferences {
  language: 'tr' | 'en';
  template: TemplateId;
  sector: string;
  level: string;
}

export interface CVData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: string[];
  certificates: Certificate[];
  preferences: Preferences;
}

export interface GeneratedContent {
  cvContent: {
    summary: string;
    experience: { company: string; position: string; startDate: string; endDate: string; bullets: string[] }[];
    education: { school: string; department: string; degree: string; year: string; gpa?: string }[];
    skills: string[];
    certificates: { name: string; institution: string; year: string }[];
  };
}

export interface UserProfile {
  fullName: string;
  email: string;
  isLoggedIn: boolean;
  googleUid?: string;
  avatar?: string;
}
