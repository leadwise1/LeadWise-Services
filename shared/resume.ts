export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedIn?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  graduationDate: string;
}

export interface Skill {
  id: string;
  name: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  professionalSummary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  template: string; // template id
}

export const defaultResumeData: ResumeData = {
  personalInfo: {
    fullName: "John Anderson",
    email: "john.anderson@email.com",
    phone: "(555) 123-4567",
    location: "San Francisco, CA",
    linkedIn: "linkedin.com/in/johnanderson",
  },
  professionalSummary:
    "Results-driven professional with 8+ years of experience creating user-centered digital solutions and leading high-performing teams.",
  experience: [
    {
      id: "1",
      company: "Tech Innovation Corp",
      position: "Senior Product Designer",
      startDate: "2020",
      endDate: "Present",
      currentlyWorking: true,
      description:
        "Led design of flagship mobile app serving 2M+ users. Spearheaded creation of comprehensive design system increasing team productivity by 35%.",
    },
    {
      id: "2",
      company: "Digital Solutions Inc",
      position: "Product Designer",
      startDate: "2018",
      endDate: "2020",
      currentlyWorking: false,
      description:
        "Designed and launched 5+ web and mobile applications. Mentored junior designers and established design best practices.",
    },
  ],
  education: [
    {
      id: "1",
      school: "University of California",
      degree: "Bachelor of Arts",
      field: "Design",
      graduationDate: "2018",
    },
  ],
  skills: [
    { id: "1", name: "UI/UX Design" },
    { id: "2", name: "Figma" },
    { id: "3", name: "Prototyping" },
    { id: "4", name: "User Research" },
    { id: "5", name: "Design Systems" },
    { id: "6", name: "Leadership" },
  ],
  template: "modern-blue",
};

export function getResumeFromStorage(): ResumeData {
  try {
    const stored = localStorage.getItem("resumeData");
    return stored ? JSON.parse(stored) : defaultResumeData;
  } catch {
    return defaultResumeData;
  }
}

export function saveResumeToStorage(data: ResumeData): void {
  localStorage.setItem("resumeData", JSON.stringify(data));
}
