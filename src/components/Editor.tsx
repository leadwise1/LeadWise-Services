'use client';
import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  Trash2, Plus, FileText, 
  ChevronLeft, Mail, Phone, MapPin, Linkedin, Printer,
  Palette, Layout, Cloud, CheckCircle, ArrowRight
} from "lucide-react";

// ==========================================
// 1. TYPES & DATA STRUCTURES
// ==========================================

// --- FIX: Added specific type for Views ---
export type ViewType = "templates" | "editor" | "cover-letter";

interface EditorProps {
  templateId?: string;
  switchLabel?: string;
  switchHref?: string;
  initialView?: ViewType;
  onBack?: () => void;
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

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedIn: string;
}

export interface DesignSettings {
  themeColor: 'blue' | 'green' | 'purple' | 'red' | 'black';
  font: 'sans' | 'serif' | 'mono';
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  professionalSummary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  template: string;
  settings: DesignSettings;
}

export interface CoverLetterData {
  personalInfo: PersonalInfo;
  recipient: {
    name: string;
    title: string;
    company: string;
    address: string;
  };
  content: {
    greeting: string;
    body: string;
    closing: string;
  };
  template: string;
  settings: DesignSettings;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  resumeComponent: React.FC<{ data: ResumeData }>;
  coverLetterComponent: React.FC<{ data: CoverLetterData }>;
  category: string;
  color: string;
}

// ==========================================
// 2. THEME ENGINE & HELPERS
// ==========================================

const getTheme = (color: string) => {
  const themes: Record<string, any> = {
    blue: { 
      primary: 'text-blue-900', secondary: 'text-blue-600', accent: 'bg-blue-600', 
      border: 'border-blue-600', light: 'bg-blue-50', borderLight: 'border-blue-100' 
    },
    green: { 
      primary: 'text-emerald-900', secondary: 'text-emerald-600', accent: 'bg-emerald-600', 
      border: 'border-emerald-600', light: 'bg-emerald-50', borderLight: 'border-emerald-100'
    },
    purple: { 
      primary: 'text-purple-900', secondary: 'text-purple-600', accent: 'bg-purple-600', 
      border: 'border-purple-600', light: 'bg-purple-50', borderLight: 'border-purple-100'
    },
    red: { 
      primary: 'text-red-900', secondary: 'text-red-700', accent: 'bg-red-700', 
      border: 'border-red-700', light: 'bg-red-50', borderLight: 'border-red-100'
    },
    black: { 
      primary: 'text-gray-900', secondary: 'text-gray-600', accent: 'bg-gray-800', 
      border: 'border-gray-800', light: 'bg-gray-100', borderLight: 'border-gray-200'
    },
  };
  return themes[color] || themes.blue;
};

const getFont = (font: string) => {
  const fonts: Record<string, string> = {
    sans: 'font-sans',
    serif: 'font-serif',
    mono: 'font-mono',
  };
  return fonts[font] || 'font-sans';
};

// ==========================================
// 3. DYNAMIC RESUME TEMPLATES
// ==========================================

// Template 1: Modern Blue
const ModernBlueTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const theme = getTheme(data.settings?.themeColor || 'blue');
  const font = getFont(data.settings?.font || 'sans');
  const experience = data.experience || [];
  const education = data.education || [];
  const skills = data.skills || [];

  return (
    <div className={`bg-white min-h-[1000px] p-12 ${font} text-gray-800 w-full`}>
      <div className="max-w-4xl mx-auto">
        <div className={`border-b-4 ${theme.border} pb-6 mb-8`}>
          <h1 className={`text-4xl font-bold ${theme.primary} uppercase`}>{data.personalInfo.fullName || "Your Name"}</h1>
          <div className="flex gap-6 mt-4 text-sm text-gray-600 flex-wrap">
            {data.personalInfo.email && <span className="flex items-center gap-1"><Mail size={12}/> {data.personalInfo.email}</span>}
            {data.personalInfo.phone && <span className="flex items-center gap-1"><Phone size={12}/> {data.personalInfo.phone}</span>}
            {data.personalInfo.location && <span className="flex items-center gap-1"><MapPin size={12}/> {data.personalInfo.location}</span>}
            {data.personalInfo.linkedIn && <span className="flex items-center gap-1"><Linkedin size={12}/> {data.personalInfo.linkedIn}</span>}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2">
            {data.professionalSummary && (
              <section className="mb-8">
                <h2 className={`text-xl font-bold ${theme.primary} mb-4 pb-2 border-b-2 ${theme.border}`}>PROFESSIONAL SUMMARY</h2>
                <p className="text-gray-700 leading-relaxed text-sm">{data.professionalSummary}</p>
              </section>
            )}

            {experience.length > 0 && (
              <section className="mb-8">
                <h2 className={`text-xl font-bold ${theme.primary} mb-4 pb-2 border-b-2 ${theme.border}`}>EXPERIENCE</h2>
                {experience.map((exp) => (
                  <div key={exp.id} className="mb-6">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
                      <span className="text-sm text-gray-600">{exp.startDate} - {exp.currentlyWorking ? "Present" : exp.endDate}</span>
                    </div>
                    <p className={`${theme.secondary} font-semibold mb-2`}>{exp.company}</p>
                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                  </div>
                ))}
              </section>
            )}
          </div>

          <div>
            {skills.length > 0 && (
              <section className="mb-6">
                <h2 className={`text-lg font-bold ${theme.primary} mb-3 pb-2 border-b-2 ${theme.border}`}>SKILLS</h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <p key={skill.id} className={`${theme.light} ${theme.secondary} px-2 py-1 rounded text-sm font-medium`}>• {skill.name}</p>
                  ))}
                </div>
              </section>
            )}

            {education.length > 0 && (
              <section className="mb-6">
                <h2 className={`text-lg font-bold ${theme.primary} mb-3 pb-2 border-b-2 ${theme.border}`}>EDUCATION</h2>
                {education.map((edu) => (
                  <div key={edu.id} className="mb-4">
                    <p className="font-semibold text-gray-900 text-sm">{edu.degree}</p>
                    <p className="text-gray-700 text-sm">{edu.school}</p>
                    <p className="text-gray-600 text-xs mt-1">{edu.graduationDate}</p>
                  </div>
                ))}
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Template 2: Elegant Classic
const ElegantClassicTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const theme = getTheme(data.settings?.themeColor || 'blue');
  const font = getFont(data.settings?.font || 'serif');
  const experience = data.experience || [];
  const education = data.education || [];
  const skills = data.skills || [];

  return (
    <div className={`bg-white min-h-[1000px] p-12 ${font} text-gray-900 w-full`}>
      <div className="max-w-4xl mx-auto">
        <div className={`text-center mb-8 pb-6 border-b-2 ${theme.border}`}>
          <h1 className="text-5xl font-bold mb-2">{data.personalInfo.fullName}</h1>
          <div className="flex justify-center gap-4 mt-4 text-sm text-gray-600">
            <span>{data.personalInfo.email}</span>
            <span>•</span>
            <span>{data.personalInfo.phone}</span>
            <span>•</span>
            <span>{data.personalInfo.location}</span>
          </div>
        </div>

        {data.professionalSummary && (
          <section className="mb-8 text-center">
            <h2 className="text-sm font-bold uppercase tracking-widest mb-3">Professional Profile</h2>
            <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto">{data.professionalSummary}</p>
          </section>
        )}

        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-gray-200 pb-2">Experience</h2>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-6">
              <div className="flex justify-between mb-1">
                <h3 className="text-gray-900 font-bold text-lg">{exp.position}</h3>
                <span className="text-gray-600 text-sm italic">{exp.startDate} – {exp.currentlyWorking ? "Present" : exp.endDate}</span>
              </div>
              <p className={`${theme.secondary} italic mb-2`}>{exp.company}</p>
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{exp.description}</p>
            </div>
          ))}
        </section>

        <div className="grid grid-cols-2 gap-12">
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-4 border-b border-gray-200 pb-2">Education</h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-4">
                <p className="font-bold text-gray-900">{edu.school}</p>
                <p className="text-gray-700 italic">{edu.degree}</p>
                <p className="text-gray-500 text-xs">{edu.graduationDate}</p>
              </div>
            ))}
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-4 border-b border-gray-200 pb-2">Skills</h2>
            <ul className="text-gray-700 text-sm space-y-1 list-disc list-inside">
              {skills.map((skill) => (
                <li key={skill.id}>{skill.name}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

// Template 3: Creative Vibrant
const CreativeVibrantTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const theme = getTheme(data.settings?.themeColor || 'blue');
  const font = getFont(data.settings?.font || 'sans');
  const colorKey = data.settings?.themeColor || 'blue';
  const experience = data.experience || [];
  const education = data.education || [];
  const skills = data.skills || [];

  const getGradient = () => {
    if (colorKey === 'blue') return 'from-blue-600 to-indigo-600';
    if (colorKey === 'green') return 'from-emerald-600 to-teal-600';
    if (colorKey === 'purple') return 'from-purple-600 to-violet-600';
    if (colorKey === 'red') return 'from-red-600 to-rose-600';
    return 'from-gray-800 to-gray-900';
  };

  return (
    <div className={`bg-gray-50 min-h-[1000px] p-8 ${font} w-full`}>
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden h-full">
        <div className={`bg-gradient-to-r ${getGradient()} p-12 text-white`}>
          <h1 className="text-5xl font-bold mb-2">{data.personalInfo.fullName}</h1>
          <p className="text-xl opacity-90 tracking-wide">Professional Resume</p>
          <div className="flex flex-wrap gap-6 mt-6 text-sm opacity-90">
            <span className="flex items-center gap-2"><Mail size={14}/> {data.personalInfo.email}</span>
            <span className="flex items-center gap-2"><Phone size={14}/> {data.personalInfo.phone}</span>
            <span className="flex items-center gap-2"><MapPin size={14}/> {data.personalInfo.location}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8 p-12">
          <div className="col-span-2">
            {data.professionalSummary && (
              <section className="mb-10">
                <h2 className={`text-2xl font-bold ${theme.secondary} mb-4`}>PROFILE</h2>
                <p className="text-gray-700 leading-relaxed">{data.professionalSummary}</p>
              </section>
            )}

            <section>
              <h2 className={`text-2xl font-bold ${theme.secondary} mb-6`}>EXPERIENCE</h2>
              <div className="space-y-8">
                {experience.map((exp) => (
                  <div key={exp.id} className={`border-l-4 ${theme.borderLight} pl-6 relative`}>
                    <div className={`absolute -left-[5px] top-2 w-2 h-2 rounded-full ${theme.accent}`}></div>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-gray-900 text-xl">{exp.position}</h3>
                      <span className="text-sm text-gray-500 font-medium">{exp.startDate} - {exp.currentlyWorking ? "Present" : exp.endDate}</span>
                    </div>
                    <p className={`${theme.secondary} font-semibold text-sm mb-3`}>{exp.company}</p>
                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-10">
            <section>
              <h2 className={`text-xl font-bold ${theme.secondary} mb-4`}>SKILLS</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill.id} className={`px-3 py-1 ${theme.light} ${theme.secondary} rounded-full text-sm font-medium`}>
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <h2 className={`text-xl font-bold ${theme.secondary} mb-4`}>EDUCATION</h2>
              {education.map((edu) => (
                <div key={edu.id} className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <p className="font-bold text-gray-900">{edu.school}</p>
                  <p className={`${theme.secondary} text-sm font-medium`}>{edu.degree}</p>
                  <p className="text-gray-500 text-xs mt-1">{edu.graduationDate}</p>
                </div>
              ))}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

// Template 4: Minimal Clean
const MinimalCleanTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const font = getFont(data.settings?.font || 'sans');
  const experience = data.experience || [];
  const education = data.education || [];
  const skills = data.skills || [];

  return (
    <div className={`bg-white min-h-[1000px] p-16 ${font} text-gray-900 w-full`}>
      <div className="max-w-3xl mx-auto">
        <div className="mb-16">
          <h1 className="text-4xl font-light tracking-tight mb-2">{data.personalInfo.fullName}</h1>
          <div className="flex gap-4 text-sm text-gray-500">
            <span>{data.personalInfo.email}</span>
            <span>/</span>
            <span>{data.personalInfo.phone}</span>
            <span>/</span>
            <span>{data.personalInfo.location}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12">
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Experience</h2>
            <div className="space-y-8">
              {experience.map((exp) => (
                <div key={exp.id} className="grid grid-cols-4 gap-4">
                  <div className="col-span-1 text-xs text-gray-500 font-medium pt-1">
                    {exp.startDate} — {exp.currentlyWorking ? "Present" : exp.endDate}
                  </div>
                  <div className="col-span-3">
                    <h3 className="font-semibold text-lg mb-1">{exp.position}</h3>
                    <div className="text-sm text-gray-600 font-medium mb-2">{exp.company}</div>
                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Education & Skills</h2>
            <div className="grid grid-cols-2 gap-8">
              <div>
                {education.map((edu) => (
                  <div key={edu.id} className="mb-4">
                    <p className="font-semibold text-sm">{edu.school}</p>
                    <p className="text-sm text-gray-600">{edu.degree}</p>
                    <p className="text-xs text-gray-400">{edu.graduationDate}</p>
                  </div>
                ))}
              </div>
              <div>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {skills.map((skill) => (
                    <span key={skill.id} className="text-sm text-gray-700 border-b border-gray-100 pb-1">{skill.name}</span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

// Template 5: Executive Bold
const ExecutiveBoldTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const [firstName, ...lastNameParts] = (data.personalInfo.fullName || "").split(" ");
  const lastName = lastNameParts.join(" ");
  const theme = getTheme(data.settings?.themeColor || 'red'); 
  const font = getFont(data.settings?.font || 'sans');
  const experience = data.experience || [];
  const education = data.education || [];
  const skills = data.skills || [];

  return (
    <div className={`bg-slate-900 min-h-[1000px] p-12 ${font} w-full`}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-12 gap-8">
          <div className={`col-span-4 ${theme.accent} text-white p-8 rounded-l-lg h-full min-h-[800px]`}>
            <div className="mb-12">
              <h1 className="text-4xl font-bold mb-0 leading-none">{firstName}</h1>
              <p className="text-4xl font-light opacity-90 leading-tight">{lastName}</p>
            </div>

            <section className="mb-10">
              <h3 className="text-xs font-bold uppercase mb-4 opacity-60 tracking-wider">Contact</h3>
              <div className="text-sm space-y-3 font-light">
                <p>{data.personalInfo.email}</p>
                <p>{data.personalInfo.phone}</p>
                <p>{data.personalInfo.location}</p>
                <p>{data.personalInfo.linkedIn}</p>
              </div>
            </section>

            <section className="mb-10">
              <h3 className="text-xs font-bold uppercase mb-4 opacity-60 tracking-wider">Education</h3>
              {education.map((edu) => (
                <div key={edu.id} className="mb-4">
                  <p className="font-bold text-sm">{edu.school}</p>
                  <p className="text-xs opacity-80">{edu.degree}</p>
                  <p className="text-xs opacity-60">{edu.graduationDate}</p>
                </div>
              ))}
            </section>

            <section>
              <h3 className="text-xs font-bold uppercase mb-4 opacity-60 tracking-wider">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill.id} className="text-xs bg-black/20 px-2 py-1 rounded">{skill.name}</span>
                ))}
              </div>
            </section>
          </div>

          <div className="col-span-8 bg-white text-gray-900 p-10 rounded-r-lg">
            {data.professionalSummary && (
              <section className="mb-12">
                <h2 className={`text-2xl font-bold mb-4 pb-2 border-b-2 ${theme.border}`}>PROFILE</h2>
                <p className="text-gray-700 leading-relaxed">{data.professionalSummary}</p>
              </section>
            )}

            <section>
              <h2 className={`text-2xl font-bold mb-6 pb-2 border-b-2 ${theme.border}`}>EXPERIENCE</h2>
              <div className="space-y-8">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-xl text-gray-900">{exp.position}</h3>
                      <span className={`{theme.secondary} font-bold text-sm`}>{exp.startDate} - {exp.currentlyWorking ? "Present" : exp.endDate}</span>
                    </div>
                    <p className="text-gray-600 font-medium mb-3 uppercase text-sm tracking-wide">{exp.company}</p>
                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

// Template 6: Academic Professional
const AcademicProfessionalTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const font = getFont(data.settings?.font || 'serif');
  const theme = getTheme(data.settings?.themeColor || 'green');
  const experience = data.experience || [];
  const education = data.education || [];
  const skills = data.skills || [];

  return (
    <div className={`bg-white min-h-[1000px] p-10 ${font} text-gray-900 w-full`}>
      <div className="max-w-4xl mx-auto border border-gray-300 shadow-sm min-h-[1000px]">
        <div className="bg-gray-800 text-white p-10 text-center">
          <h1 className="text-4xl font-bold tracking-wide">{data.personalInfo.fullName}</h1>
          <p className="text-sm opacity-70 mt-2 tracking-widest uppercase">Curriculum Vitae</p>
        </div>

        <div className="p-10">
          <div className="flex justify-center gap-8 mb-8 text-sm border-b border-gray-200 pb-8">
            <span>{data.personalInfo.email}</span>
            <span>{data.personalInfo.phone}</span>
            <span>{data.personalInfo.location}</span>
          </div>

          {data.professionalSummary && (
            <section className="mb-8">
              <h2 className="text-lg font-bold uppercase text-gray-800 mb-4 border-b-2 border-gray-800 pb-1">Research Interest</h2>
              <p className="text-gray-700 leading-relaxed text-sm">{data.professionalSummary}</p>
            </section>
          )}

          <section className="mb-8">
            <h2 className="text-lg font-bold uppercase text-gray-800 mb-4 border-b-2 border-gray-800 pb-1">Professional Experience</h2>
            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between mb-1">
                    <h3 className="font-bold text-gray-900">{exp.position}</h3>
                    <span className="text-sm text-gray-600">{exp.startDate} – {exp.currentlyWorking ? "Present" : exp.endDate}</span>
                  </div>
                  <p className="text-gray-800 italic text-sm mb-2">{exp.company}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold uppercase text-gray-800 mb-4 border-b-2 border-gray-800 pb-1">Education</h2>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id}>
                  <p className="font-bold text-gray-900">{edu.school}</p>
                  <div className="flex justify-between">
                    <p className="text-gray-700 text-sm italic">{edu.degree}</p>
                    <p className="text-sm text-gray-600">{edu.graduationDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold uppercase text-gray-800 mb-4 border-b-2 border-gray-800 pb-1">Skills & Expertise</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                 <span key={skill.id} className={`text-sm text-gray-700 ${theme.light} px-2 py-1 rounded`}>{skill.name}</span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. COVER LETTER TEMPLATES
// ==========================================

const ModernBlueCoverLetter: React.FC<{ data: CoverLetterData }> = ({ data }) => {
  const theme = getTheme(data.settings?.themeColor || 'blue');
  const font = getFont(data.settings?.font || 'sans');

  return (
    <div className={`bg-white min-h-[1000px] p-12 ${font} text-gray-800 w-full`}>
      <div className="max-w-3xl mx-auto">
        <header className={`border-b-4 ${theme.border} pb-6 mb-10 flex justify-between items-end`}>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 uppercase">{data.personalInfo.fullName}</h1>
            <div className={`${theme.secondary} font-bold mt-2 uppercase tracking-widest text-sm`}>Cover Letter</div>
          </div>
          <div className="text-right text-sm text-gray-600 space-y-1">
            <div>{data.personalInfo.email}</div>
            <div>{data.personalInfo.phone}</div>
          </div>
        </header>
        <div className="text-sm space-y-6 text-gray-700 leading-relaxed">
          <div className="text-gray-500 font-medium">{new Date().toLocaleDateString()}</div>
          <div className="space-y-1">
             <div className="font-bold text-gray-900 text-base">{data.recipient.name}</div>
             <div>{data.recipient.title}</div>
             <div>{data.recipient.company}</div>
             <div className="whitespace-pre-wrap">{data.recipient.address}</div>
          </div>
          <div className="h-4"></div>
          <div>{data.content.greeting}</div>
          <div className="whitespace-pre-wrap min-h-[200px]">{data.content.body}</div>
          <div className="mt-8">
             <div>{data.content.closing}</div>
             <div className="mt-8 pt-2 w-48 font-bold text-gray-900 border-t border-gray-200">{data.personalInfo.fullName}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ElegantClassicCoverLetter: React.FC<{ data: CoverLetterData }> = ({ data }) => (
  <div className="bg-white min-h-[1000px] p-16 font-serif text-gray-900 w-full">
    <div className="max-w-2xl mx-auto">
      <div className="text-center border-b-2 border-gray-800 pb-8 mb-12">
        <h1 className="text-4xl font-bold mb-3">{data.personalInfo.fullName}</h1>
        <div className="text-sm italic text-gray-600 flex justify-center gap-4">
          <span>{data.personalInfo.email}</span>
          <span>&bull;</span>
          <span>{data.personalInfo.phone}</span>
        </div>
      </div>
      <div className="space-y-6 text-base leading-loose">
         <div className="flex justify-between items-start mb-8 text-sm">
           <div>
             <div className="font-bold">{data.recipient.name}</div>
             <div className="italic">{data.recipient.title}</div>
             <div>{data.recipient.company}</div>
           </div>
           <div className="italic text-gray-500">{new Date().toLocaleDateString()}</div>
         </div>
         <div>{data.content.greeting}</div>
         <div className="whitespace-pre-wrap text-justify">{data.content.body}</div>
         <div className="mt-10">
            <div>{data.content.closing}</div>
            <div className="mt-8 font-bold text-xl">{data.personalInfo.fullName}</div>
         </div>
      </div>
    </div>
  </div>
);

const CreativeVibrantCoverLetter: React.FC<{ data: CoverLetterData }> = ({ data }) => {
  const theme = getTheme(data.settings?.themeColor || 'purple');
  const font = getFont(data.settings?.font || 'sans');
  return (
    <div className={`bg-gradient-to-br from-indigo-50 to-purple-50 min-h-[1000px] p-10 ${font} w-full`}>
       <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden flex min-h-[800px]">
          <aside className={`w-1/3 bg-gradient-to-b ${theme.accent} to-gray-900 text-white p-10 flex flex-col justify-between`}>
             <div>
                <h1 className="text-3xl font-bold leading-tight mb-6">{data.personalInfo.fullName}</h1>
                <div className="w-12 h-1 bg-white mb-8 opacity-50"></div>
                <div className="text-sm opacity-80 space-y-3">
                   <p>{data.personalInfo.email}</p>
                   <p>{data.personalInfo.phone}</p>
                   <p>{data.personalInfo.location}</p>
                </div>
             </div>
             <div className="text-6xl font-black text-white opacity-5 rotate-90 origin-bottom-left whitespace-nowrap">COVER LETTER</div>
          </aside>
          <main className="w-2/3 p-12 flex flex-col">
             <div className="mb-10 text-sm">
                <div className="text-gray-400 font-medium mb-4">{new Date().toLocaleDateString()}</div>
                <div className="font-bold text-gray-900 text-lg">{data.recipient.name}</div>
                <div className={`${theme.secondary} font-medium`}>{data.recipient.title}</div>
                <div className="text-gray-500">{data.recipient.company}</div>
             </div>
             <div className="space-y-6 text-gray-600 leading-relaxed flex-1">
               <div className="font-bold text-gray-900">{data.content.greeting}</div>
               <div className="whitespace-pre-wrap">{data.content.body}</div>
               <div className="mt-8">
                 <div>{data.content.closing}</div>
                 <div className={`mt-4 font-bold ${theme.secondary}`}>{data.personalInfo.fullName}</div>
               </div>
             </div>
          </main>
       </div>
    </div>
  );
};

const MinimalCleanCoverLetter: React.FC<{ data: CoverLetterData }> = ({ data }) => (
  <div className="bg-white min-h-[1000px] p-20 font-sans text-gray-900 w-full">
    <div className="max-w-2xl mx-auto">
      <header className="mb-16 border-b border-gray-200 pb-6 flex justify-between items-end">
         <div>
           <h1 className="text-4xl font-light tracking-tight mb-1">{data.personalInfo.fullName}</h1>
         </div>
         <div className="text-right text-sm text-gray-500">
           <div>{data.personalInfo.email}</div>
           <div>{data.personalInfo.phone}</div>
         </div>
      </header>
      <div className="text-base leading-relaxed text-gray-800">
         <div className="mb-12">
           <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">To</div>
           <div className="font-medium">{data.recipient.name}</div>
           <div className="text-gray-500">{data.recipient.company}</div>
         </div>
         <div className="mb-6">{data.content.greeting}</div>
         <div className="whitespace-pre-wrap mb-10">{data.content.body}</div>
         <div>
           <div>{data.content.closing}</div>
           <div className="mt-8 border-t border-black w-24 pt-2 font-medium">{data.personalInfo.fullName}</div>
         </div>
      </div>
    </div>
  </div>
);

const ExecutiveBoldCoverLetter: React.FC<{ data: CoverLetterData }> = ({ data }) => {
  const theme = getTheme(data.settings?.themeColor || 'blue');
  return (
    <div className="bg-slate-900 min-h-[1000px] p-12 font-sans w-full">
      <div className="max-w-4xl mx-auto bg-white rounded-lg overflow-hidden flex min-h-[800px]">
         <div className={`w-1/4 ${theme.accent} p-8 text-white flex flex-col items-center pt-16`}>
            <div className="w-20 h-1 bg-white mb-8"></div>
            <h1 className="text-2xl font-bold text-center uppercase tracking-widest">{data.personalInfo.fullName}</h1>
         </div>
         <div className="w-3/4 p-12 bg-white">
            <div className={`flex justify-between items-start mb-12 border-b-2 ${theme.border} pb-4`}>
               <div className="text-sm">
                  <div className="font-bold text-gray-900">{data.recipient.name}</div>
                  <div className="text-gray-500">{data.recipient.company}</div>
               </div>
               <div className="text-right text-sm text-gray-500">
                  <div>{data.personalInfo.email}</div>
                  <div>{data.personalInfo.phone}</div>
               </div>
            </div>
            <div className="space-y-6 text-gray-700 leading-relaxed">
               <div>{data.content.greeting}</div>
               <div className="whitespace-pre-wrap">{data.content.body}</div>
               <div className="mt-12">
                 <div>{data.content.closing}</div>
                 <div className={`mt-8 font-bold text-xl ${theme.secondary}`}>{data.personalInfo.fullName}</div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

const AcademicProfessionalCoverLetter: React.FC<{ data: CoverLetterData }> = ({ data }) => (
  <div className="bg-white min-h-[1000px] p-12 font-serif text-gray-900 w-full">
     <div className="max-w-3xl mx-auto border border-gray-300 shadow-sm p-12 min-h-[900px]">
        <div className="text-center border-b-2 border-gray-800 pb-6 mb-10">
           <h1 className="text-3xl font-bold">{data.personalInfo.fullName}</h1>
           <div className="text-sm mt-2 flex justify-center gap-4 text-gray-600">
             <span>{data.personalInfo.email}</span>
             <span>{data.personalInfo.phone}</span>
             <span>{data.personalInfo.location}</span>
           </div>
        </div>
        <div className="text-sm space-y-6 leading-relaxed">
           <div className="flex justify-between items-start">
             <div>
                <div className="font-bold">{data.recipient.name}</div>
                <div className="italic">{data.recipient.title}</div>
                <div>{data.recipient.company}</div>
             </div>
             <div>{new Date().toLocaleDateString()}</div>
           </div>
           <div className="h-4"></div>
           <div>{data.content.greeting}</div>
           <div className="whitespace-pre-wrap text-justify">{data.content.body}</div>
           <div className="mt-8">
             <div>{data.content.closing}</div>
             <div className="mt-6 font-bold">{data.personalInfo.fullName}</div>
           </div>
        </div>
     </div>
  </div>
);

// ==========================================
// 5. CONFIGURATION MAP
// ==========================================

export const templates: Template[] = [
  {
    id: "modern-blue",
    name: "Modern Blue",
    description: "Clean and professional with a bold blue accent.",
    resumeComponent: ModernBlueTemplate,
    coverLetterComponent: ModernBlueCoverLetter,
    category: "Modern",
    color: "bg-blue-600"
  },
  {
    id: "elegant-classic",
    name: "Elegant Classic",
    description: "Timeless design with serif typography.",
    resumeComponent: ElegantClassicTemplate,
    coverLetterComponent: ElegantClassicCoverLetter,
    category: "Professional",
    color: "bg-slate-800"
  },
  {
    id: "creative-vibrant",
    name: "Creative Vibrant",
    description: "Bold and colorful design showcasing creativity.",
    resumeComponent: CreativeVibrantTemplate,
    coverLetterComponent: CreativeVibrantCoverLetter,
    category: "Creative",
    color: "bg-purple-600"
  },
  {
    id: "minimal-clean",
    name: "Minimal Clean",
    description: "Ultra-minimal design with maximum focus on content.",
    resumeComponent: MinimalCleanTemplate,
    coverLetterComponent: MinimalCleanCoverLetter,
    category: "Minimal",
    color: "bg-gray-400"
  },
  {
    id: "executive-bold",
    name: "Executive Bold",
    description: "Strong visual hierarchy with sidebar.",
    resumeComponent: ExecutiveBoldTemplate,
    coverLetterComponent: ExecutiveBoldCoverLetter,
    category: "Executive",
    color: "bg-red-700"
  },
  {
    id: "academic-professional",
    name: "Academic Professional",
    description: "Structured layout for academic credentials.",
    resumeComponent: AcademicProfessionalTemplate,
    coverLetterComponent: AcademicProfessionalCoverLetter,
    category: "Academic",
    color: "bg-emerald-800"
  }
];

// ==========================================
// 6. HELPERS & STORAGE
// ==========================================

const RESUME_KEY = "user_resume_data_v2";
const COVER_LETTER_KEY = "user_cover_letter_data_v2";

const getResumeFromStorage = (): ResumeData | null => {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem(RESUME_KEY) || ""); } catch { return null; }
};

const getCoverLetterFromStorage = (): CoverLetterData | null => {
    if (typeof window === "undefined") return null;
    try { return JSON.parse(localStorage.getItem(COVER_LETTER_KEY) || ""); } catch { return null; }
};

const getStoredPersonalInfo = (): PersonalInfo => {
    if (typeof window === "undefined") return { fullName: "", email: "", phone: "", location: "", linkedIn: "" };
    try {
        const resume = JSON.parse(localStorage.getItem(RESUME_KEY) || "{}");
        return resume.personalInfo || { fullName: "", email: "", phone: "", location: "", linkedIn: "" };
    } catch { return { fullName: "", email: "", phone: "", location: "", linkedIn: "" }; }
}

const saveResumeToStorage = (data: ResumeData) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(RESUME_KEY, JSON.stringify(data));
};

const saveCoverLetterToStorage = (data: CoverLetterData) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(COVER_LETTER_KEY, JSON.stringify(data));
};

const downloadATS = (data: ResumeData) => {
  let text = "";
  
  // Safe Access for Personal Info
  text += `NAME: ${data.personalInfo?.fullName || ""}\n`;
  text += `EMAIL: ${data.personalInfo?.email || ""} | PHONE: ${data.personalInfo?.phone || ""}\n`;
  text += `LOCATION: ${data.personalInfo?.location || ""} | LINKEDIN: ${data.personalInfo?.linkedIn || ""}\n\n`;

  if (data.professionalSummary) {
    text += `--- PROFESSIONAL SUMMARY ---\n${data.professionalSummary}\n\n`;
  }

  const expList = data.experience || [];
  if (expList.length > 0) {
    text += `--- EXPERIENCE ---\n`;
    expList.forEach(exp => {
      text += `${exp.position || "Position"} | ${exp.company || "Company"}\n`;
      text += `${exp.startDate || ""} - ${exp.currentlyWorking ? "Present" : (exp.endDate || "")}\n`;
      text += `${exp.description || ""}\n\n`;
    });
  }

  const eduList = data.education || [];
  if (eduList.length > 0) {
    text += `--- EDUCATION ---\n`;
    eduList.forEach(edu => {
      text += `${edu.school || "School"} | ${edu.degree || "Degree"}\n`;
      text += `Graduated: ${edu.graduationDate || ""}\n\n`;
    });
  }

  const skillsList = data.skills || [];
  if (skillsList.length > 0) {
    text += `--- SKILLS ---\n`;
    text += skillsList.map(s => s.name).join(", ") + "\n";
  }

  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${(data.personalInfo?.fullName || "resume").replace(/\s+/g, '_')}_ATS_Resume.txt`;
  a.click();
  URL.revokeObjectURL(url);
};

const printStyles = `
  @media print {
    @page { margin: 0; size: auto; }
    body { background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .no-print { display: none !important; }
    .print-container { overflow: visible !important; height: auto !important; box-shadow: none !important; border: none !important; background: white !important; padding: 0 !important; }
    .print-scale { transform: none !important; width: 100% !important; min-height: auto !important; height: auto !important; box-shadow: none !important; }
  }
`;

// ==========================================
// 7. EDITOR VIEWS
// ==========================================

export const ResumeEditorView: React.FC<{ templateId: string, onBack: () => void }> = ({ templateId, onBack }) => {
  const [activeTemplateId, setActiveTemplateId] = useState(templateId);
  const previewRef = useRef<HTMLDivElement>(null);
  
  const [resume, setResume] = useState<ResumeData>({
    personalInfo: { fullName: "", email: "", phone: "", location: "", linkedIn: "" },
    professionalSummary: "",
    experience: [],
    education: [],
    skills: [], 
    template: templateId || "modern-blue",
    settings: { themeColor: 'blue', font: 'sans' }
  });

  useEffect(() => {
    const saved = getResumeFromStorage();
    const defaultSettings: DesignSettings = { themeColor: 'blue', font: 'sans' };
    
    if (saved) {
      setResume({
        ...saved,
        settings: saved.settings || defaultSettings,
        experience: saved.experience || [],
        education: saved.education || [],
        skills: saved.skills || [],
        professionalSummary: saved.professionalSummary || "",
        personalInfo: saved.personalInfo || { fullName: "", email: "", phone: "", location: "", linkedIn: "" }
      });
    }
  }, []);

  const SelectedTemplate = templates.find(t => t.id === activeTemplateId)?.resumeComponent || ModernBlueTemplate;

  useEffect(() => { saveResumeToStorage(resume); }, [resume]);

  const updateInfo = (f: keyof PersonalInfo, v: string) => setResume(p => ({...p, personalInfo: {...p.personalInfo, [f]: v}}));
  const updateSettings = (f: keyof DesignSettings, v: any) => setResume(p => ({...p, settings: {...p.settings, [f]: v}}));
  
  const addExp = () => setResume(p => ({...p, experience: [...p.experience, { id: Date.now().toString(), company: "", position: "", startDate: "", endDate: "", currentlyWorking: false, description: "" }]}));
  const updateExp = (id: string, f: keyof Experience, v: any) => setResume(p => ({...p, experience: p.experience.map(e => e.id === id ? {...e, [f]: v} : e)}));
  const delExp = (id: string) => setResume(p => ({...p, experience: p.experience.filter(e => e.id !== id)}));
  
  const addEdu = () => setResume(p => ({...p, education: [...p.education, { id: Date.now().toString(), school: "", degree: "", field: "", graduationDate: "" }]}));
  const updateEdu = (id: string, f: keyof Education, v: string) => setResume(p => ({...p, education: p.education.map(e => e.id === id ? {...e, [f]: v} : e)}));
  const delEdu = (id: string) => setResume(p => ({...p, education: p.education.filter(e => e.id !== id)}));
  
  const addSkill = () => setResume(p => ({...p, skills: [...p.skills, { id: Date.now().toString(), name: "" }]}));
  const updateSkill = (id: string, v: string) => setResume(p => ({...p, skills: p.skills.map(s => s.id === id ? {...s, name: v} : s)}));
  const delSkill = (id: string) => setResume(p => ({...p, skills: p.skills.filter(s => s.id !== id)}));

  return (
    <>
      <div className="min-h-screen w-full bg-[radial-gradient(ellipse_at_top,_#1B2735_0%,_#090A0F_100%)] text-white font-sans selection:bg-[#FFBEA0] selection:text-[#1B2735]">
        <style dangerouslySetInnerHTML={{ __html: printStyles }} />
        <nav className="border-b border-white/10 bg-[#090A0F]/50 backdrop-blur-md sticky top-0 z-50 no-print">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
              <div className="flex items-center gap-6">
                  <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition">
                    <ChevronLeft size={20} />
                    <span className="font-semibold">Back to Builder</span>
                  </button>
              </div>
              <div className="flex items-center gap-4">
                 <select 
                    value={activeTemplateId} 
                    onChange={(e) => setActiveTemplateId(e.target.value)} 
                    className="bg-white/5 border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#FFBEA0]"
                >
                  {templates.map(t => <option key={t.id} value={t.id} className="text-black">{t.name}</option>)}
                </select>
                <button onClick={() => downloadATS(resume)} className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"><FileText size={16}/> ATS Text</button>
                <button onClick={() => window.print()} className="bg-[#FFBEA0] hover:bg-white text-[#1B2735] px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(255,190,160,0.3)]"><Printer size={16}/> Save PDF</button>
              </div>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 max-w-7xl mx-auto">
          <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 lg:p-8 h-fit lg:sticky lg:top-24 overflow-y-auto max-h-[calc(100vh-120px)] no-print custom-scrollbar">
            <div className="bg-black/20 border border-white/5 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-3 text-[#FFBEA0] font-bold text-sm uppercase tracking-wider"><Palette size={16}/> Design Settings</div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                     <label className="text-xs font-semibold text-gray-400 mb-2 block">Accent Color</label>
                     <div className="flex gap-2">
                       {['blue', 'green', 'purple', 'red', 'black'].map(c => (
                         <button key={c} onClick={() => updateSettings('themeColor', c)} className={`w-6 h-6 rounded-full border-2 ${resume.settings?.themeColor === c ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'}`} style={{ backgroundColor: c }}/>
                       ))}
                     </div>
                  </div>
                  <div>
                     <label className="text-xs font-semibold text-gray-400 mb-2 block">Font Style</label>
                     <div className="flex gap-2 text-xs">
                        {['sans', 'serif', 'mono'].map(f => (
                          <button key={f} onClick={() => updateSettings('font', f)} className={`px-2 py-1 rounded border transition-colors ${resume.settings?.font === f ? 'bg-[#FFBEA0] border-[#FFBEA0] text-[#1B2735] font-bold' : 'bg-transparent border-white/10 text-gray-400 hover:text-white'}`}>{f === 'sans' ? 'Modern' : f === 'serif' ? 'Classic' : 'Tech'}</button>
                        ))}
                     </div>
                  </div>
                </div>
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="text-sm font-bold text-[#FFBEA0] uppercase tracking-wider mb-4 border-b border-white/10 pb-2">Personal Info</h2>
                <div className="space-y-3">
                  <input className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FFBEA0]" placeholder="Full Name" value={resume.personalInfo.fullName} onChange={e => updateInfo('fullName', e.target.value)} />
                  <div className="grid grid-cols-2 gap-3">
                    <input className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FFBEA0]" placeholder="Email" value={resume.personalInfo.email} onChange={e => updateInfo('email', e.target.value)} />
                    <input className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FFBEA0]" placeholder="Phone" value={resume.personalInfo.phone} onChange={e => updateInfo('phone', e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FFBEA0]" placeholder="Location" value={resume.personalInfo.location} onChange={e => updateInfo('location', e.target.value)} />
                    <input className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FFBEA0]" placeholder="LinkedIn" value={resume.personalInfo.linkedIn} onChange={e => updateInfo('linkedIn', e.target.value)} />
                  </div>
                </div>
              </section>
              
              <section>
                <h2 className="text-sm font-bold text-[#FFBEA0] uppercase tracking-wider mb-4 border-b border-white/10 pb-2">Summary</h2>
                <textarea className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FFBEA0] min-h-[120px]" placeholder="Brief professional summary..." value={resume.professionalSummary} onChange={e => setResume(p => ({...p, professionalSummary: e.target.value}))} />
              </section>

              <section>
                <div className="flex justify-between mb-4 border-b border-white/10 pb-2">
                  <h2 className="text-sm font-bold text-[#FFBEA0] uppercase tracking-wider">Experience</h2>
                  <button onClick={addExp} className="text-white hover:text-[#FFBEA0] text-sm font-medium flex items-center gap-1"><Plus size={14}/> Add Position</button>
                </div>
                {resume.experience.map(exp => (
                  <div key={exp.id} className="p-4 bg-black/20 rounded-xl mb-4 border border-white/5 relative group hover:border-white/20 transition-colors">
                    <button onClick={() => delExp(exp.id)} className="absolute top-2 right-2 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                    <input className="w-full p-1 bg-transparent font-bold text-lg text-white mb-2 border-b border-transparent focus:border-[#FFBEA0] focus:outline-none" placeholder="Company Name" value={exp.company} onChange={e => updateExp(exp.id, 'company', e.target.value)} />
                    <input className="w-full p-1 bg-transparent text-gray-300 text-sm mb-3 border-b border-transparent focus:border-[#FFBEA0] focus:outline-none" placeholder="Job Title" value={exp.position} onChange={e => updateExp(exp.id, 'position', e.target.value)} />
                    <div className="flex gap-2 mb-3">
                      <input className="w-1/2 p-2 bg-white/5 border border-white/10 rounded text-xs text-gray-300" placeholder="Start Date" value={exp.startDate} onChange={e => updateExp(exp.id, 'startDate', e.target.value)} />
                      <input className="w-1/2 p-2 bg-white/5 border border-white/10 rounded text-xs text-gray-300" placeholder="End Date" value={exp.endDate} onChange={e => updateExp(exp.id, 'endDate', e.target.value)} disabled={exp.currentlyWorking}/>
                    </div>
                    <textarea className="w-full p-2 bg-white/5 border border-white/10 rounded text-sm text-gray-300 min-h-[80px]" placeholder="Description of responsibilities..." value={exp.description} onChange={e => updateExp(exp.id, 'description', e.target.value)} />
                  </div>
                ))}
              </section>

               <section>
                <div className="flex justify-between mb-4 border-b border-white/10 pb-2">
                  <h2 className="text-sm font-bold text-[#FFBEA0] uppercase tracking-wider">Education</h2>
                  <button onClick={addEdu} className="text-white hover:text-[#FFBEA0] text-sm font-medium flex items-center gap-1"><Plus size={14}/> Add School</button>
                </div>
                {resume.education.map(edu => (
                  <div key={edu.id} className="p-4 bg-black/20 rounded-xl mb-3 border border-white/5 relative group hover:border-white/20 transition-colors">
                    <button onClick={() => delEdu(edu.id)} className="absolute top-2 right-2 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                    <input className="w-full p-1 bg-transparent font-bold text-white mb-1 focus:outline-none border-b border-transparent focus:border-[#FFBEA0]" placeholder="School Name" value={edu.school} onChange={e => updateEdu(edu.id, 'school', e.target.value)} />
                    <div className="flex gap-2 mt-2">
                      <input className="w-full p-2 bg-white/5 border border-white/10 rounded text-sm text-gray-300" placeholder="Degree / Certification" value={edu.degree} onChange={e => updateEdu(edu.id, 'degree', e.target.value)} />
                      <input className="w-24 p-2 bg-white/5 border border-white/10 rounded text-sm text-gray-300" placeholder="Year" value={edu.graduationDate} onChange={e => updateEdu(edu.id, 'graduationDate', e.target.value)} />
                    </div>
                  </div>
                ))}
              </section>

               <section>
                <div className="flex justify-between mb-4 border-b border-white/10 pb-2">
                  <h2 className="text-sm font-bold text-[#FFBEA0] uppercase tracking-wider">Skills</h2>
                  <button onClick={addSkill} className="text-white hover:text-[#FFBEA0] text-sm font-medium flex items-center gap-1"><Plus size={14}/> Add Skill</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {resume.skills.map(skill => (
                    <div key={skill.id} className="flex items-center bg-white/10 rounded-full px-3 py-1 border border-white/10 group hover:border-[#FFBEA0]/50 transition-colors">
                      <input className="bg-transparent text-sm w-24 text-white focus:outline-none" placeholder="Skill" value={skill.name} onChange={e => updateSkill(skill.id, e.target.value)} />
                      <button onClick={() => delSkill(skill.id)} className="ml-1 text-gray-500 hover:text-red-400"><Trash2 size={12}/></button>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          <div className="hidden lg:block relative">
             <div className="sticky top-24">
                <div className="bg-[#1B2735] border border-white/10 border-b-0 text-white text-xs uppercase font-bold py-3 px-4 rounded-t-xl flex justify-between no-print items-center">
                   <span className="flex items-center gap-2"><Layout size={14}/> Live Preview</span>
                   <span className="opacity-50">A4 Size</span>
                </div>
                <div className="bg-black/40 border border-white/10 backdrop-blur-sm p-8 rounded-b-xl h-[calc(100vh-160px)] overflow-y-auto print-container custom-scrollbar">
                   <div ref={previewRef} className="bg-white shadow-2xl min-h-[297mm] w-[210mm] origin-top-left transform scale-[0.45] md:scale-[0.55] xl:scale-[0.65] print-scale">
                      <SelectedTemplate data={resume} />
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const CoverLetterEditorView: React.FC<Omit<EditorProps, "initialView">> = ({
  templateId,
  switchLabel,
  switchHref,
  onBack,
}) => {
    const router = useRouter();
    const [activeTemplateId, setActiveTemplateId] = useState(templateId);
    const [data, setData] = useState<CoverLetterData>({
        personalInfo: { fullName: "", email: "", phone: "", location: "", linkedIn: "" },
        recipient: { name: "", title: "", company: "", address: "" },
        content: { greeting: "Dear Hiring Manager,", body: "I am writing...", closing: "Sincerely," },
        template: templateId ?? "modern-blue",
        settings: { themeColor: 'blue', font: 'sans' }
    });

    useEffect(() => {
        const saved = getCoverLetterFromStorage();
        const defaultInfo = getStoredPersonalInfo();
        const defaultSettings: DesignSettings = { themeColor: 'blue', font: 'sans' };

        if (saved) {
             setData({
                 ...saved,
                 settings: saved.settings || defaultSettings
             });
        } else if (defaultInfo.fullName) {
             setData(prev => ({ ...prev, personalInfo: defaultInfo }));
        }
    }, []);

    useEffect(() => { saveCoverLetterToStorage(data); }, [data]);
    const SelectedTemplate = templates.find(t => t.id === activeTemplateId)?.coverLetterComponent || ModernBlueCoverLetter;
    
   const updateRecipient = (f: keyof CoverLetterData['recipient'], v: string) => 
      setData(p => ({ ...p, recipient: { ...p.recipient, [f]: v } }));
   const updateContent = (f: keyof CoverLetterData['content'], v: string) => 
      setData(p => ({ ...p, content: { ...p.content, [f]: v } }));
   const updateSettings = (f: keyof DesignSettings, v: any) => 
      setData(p => ({ ...p, settings: { ...p.settings, [f]: v } }));

  // Determine the label and href for "Back" button, handle undefined safely
  const backLabel: string = switchLabel ?? "Back to Resume";
  const backHref: string = switchHref ?? "/resume";
return (
  <>
  <div className="min-h-screen w-full bg-[radial-gradient(ellipse_at_top,_#1B2735_0%,_#090A0F_100%)] text-white font-sans selection:bg-[#FFBEA0] selection:text-[#1B2735]">
    <style dangerouslySetInnerHTML={{ __html: printStyles }} />
    
    <nav className="border-b border-white/10 bg-[#090A0F]/50 backdrop-blur-md sticky top-0 z-50 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
         <div className="flex items-center gap-6">
             <button
               onClick={() => onBack ? onBack() : router.push(backHref)}
               className="flex items-center gap-2 text-gray-400 hover:text-white transition"
             >
               <ChevronLeft size={20} />
               <span className="font-semibold">{backLabel}</span>
             </button>
         </div>
         <div className="flex items-center gap-4">
            <select 
               value={activeTemplateId} 
               onChange={(e) => setActiveTemplateId(e.target.value)} 
               className="bg-white/5 border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#FFBEA0]"
            >
              {templates.map(t => <option key={t.id} value={t.id} className="text-black">{t.name}</option>)}
            </select>
            <button 
              onClick={() => window.print()} 
              className="bg-[#FFBEA0] hover:bg-white text-[#1B2735] px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(255,190,160,0.3)]"
            >
              <Printer size={16}/> Save PDF
            </button>
         </div>
      </div>
    </nav>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 max-w-7xl mx-auto">
      <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 lg:p-8 h-fit lg:sticky lg:top-24 overflow-y-auto max-h-[calc(100vh-120px)] no-print custom-scrollbar">
         <div className="bg-black/20 border border-white/5 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-3 text-[#FFBEA0] font-bold text-sm uppercase tracking-wider">
               <Palette size={16}/> Appearance
            </div>
            <div className="flex gap-4">
               <div className="flex gap-1">
                  {['blue', 'green', 'purple', 'red', 'black'].map(c => (
                  <button key={c} onClick={() => updateSettings('themeColor', c)} className={`w-5 h-5 rounded-full border ${data.settings?.themeColor === c ? 'border-white scale-125' : 'border-transparent'}`} style={{ backgroundColor: c }}/>
                  ))}
               </div>
               <div className="h-5 w-px bg-white/10"></div>
               <div className="flex gap-2 text-xs">
                  {['sans', 'serif', 'mono'].map(f => (
                  <button key={f} onClick={() => updateSettings('font', f)} className={`px-2 rounded border transition-colors ${data.settings?.font === f ? 'bg-[#FFBEA0] text-[#1B2735] font-bold border-[#FFBEA0]' : 'bg-transparent border-white/10 text-gray-400'}`}>{f === 'sans' ? 'Modern' : f === 'serif' ? 'Classic' : 'Tech'}</button>
                  ))}
               </div>
            </div>
         </div>

         <div className="space-y-6">
            <section>
               <h2 className="text-sm font-bold text-[#FFBEA0] uppercase tracking-wider mb-4 border-b border-white/10 pb-2">Recipient</h2>
               <div className="space-y-3">
               <input className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FFBEA0]" placeholder="Hiring Manager Name" value={data.recipient.name} onChange={e => updateRecipient('name', e.target.value)} />
               <input className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FFBEA0]" placeholder="Title" value={data.recipient.title} onChange={e => updateRecipient('title', e.target.value)} />
               <input className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FFBEA0]" placeholder="Company" value={data.recipient.company} onChange={e => updateRecipient('company', e.target.value)} />
               <textarea className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FFBEA0] h-20" placeholder="Address" value={data.recipient.address} onChange={e => updateRecipient('address', e.target.value)} />
               </div>
            </section>
            <section>
               <h2 className="text-sm font-bold text-[#FFBEA0] uppercase tracking-wider mb-4 border-b border-white/10 pb-2">Content</h2>
               <div className="space-y-3">
                  <input className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white font-medium focus:outline-none focus:border-[#FFBEA0]" placeholder="Greeting" value={data.content.greeting} onChange={e => updateContent('greeting', e.target.value)} />
                  <textarea className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#FFBEA0] min-h-[300px]" placeholder="Body..." value={data.content.body} onChange={e => updateContent('body', e.target.value)} />
                  <input className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white font-medium focus:outline-none focus:border-[#FFBEA0]" placeholder="Closing" value={data.content.closing} onChange={e => updateContent('closing', e.target.value)} />
               </div>
            </section>
         </div>
      </div>

      <div className="hidden lg:block relative">
         <div className="sticky top-24">
            <div className="bg-[#1B2735] border border-white/10 border-b-0 text-white text-xs uppercase font-bold py-3 px-4 rounded-t-xl flex justify-between no-print items-center">
               <span className="flex items-center gap-2"><Layout size={14}/> Preview</span>
            </div>
            <div className="bg-black/40 border border-white/10 backdrop-blur-sm p-8 rounded-b-xl h-[calc(100vh-160px)] overflow-y-auto print-container custom-scrollbar">
               <div className="bg-white shadow-2xl min-h-[297mm] w-[210mm] origin-top-left transform scale-[0.45] md:scale-[0.55] xl:scale-[0.65] print-scale">
                  <SelectedTemplate data={data} />
               </div>
            </div>
         </div>
      </div>
    </div>
  </div>
  </>
);
}

// DEFAULT EXPORT (ResumeApp)
// --- FIX: Applied EditorProps here to satisfy TypeScript ---
export default function Editor({ initialView = "templates" }: EditorProps) {
  const [currentView, setCurrentView] = useState<ViewType>(initialView);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("modern-blue");
  const [previewModalTemplate, setPreviewModalTemplate] = useState<string | null>(null);

  const navigateToEditor = (id: string) => {
    setSelectedTemplateId(id);
    setCurrentView("editor");
    window.scrollTo(0,0);
  };
  const navigateToCoverLetter = (id: string) => {
    setSelectedTemplateId(id);
    setCurrentView("cover-letter");
    window.scrollTo(0,0);
  }

  const selectedModalTemplateData = templates.find(t => t.id === previewModalTemplate);
  const ModalComponent = selectedModalTemplateData?.resumeComponent;

  if (currentView === "editor") {
    return (
      <>
        <ResumeEditorView
          templateId={selectedTemplateId}
          onBack={() => setCurrentView("templates")}
        />
      </>
    );
  }

  if (currentView === "cover-letter") {
    return (
      <>
        <CoverLetterEditorView
          templateId={selectedTemplateId}
          switchLabel="Back to Builder"
          onBack={() => setCurrentView("templates")}
        />
      </>
    );
  }

  if (currentView === "templates") {
    return (
      <>
      <div className="min-h-screen w-full bg-[radial-gradient(ellipse_at_top,_#1B2735_0%,_#090A0F_100%)] text-white font-sans selection:bg-[#FFBEA0] selection:text-[#1B2735]">
        
        {/* --- NAVBAR --- */}
        <nav className="border-b border-white/10 bg-[#090A0F]/50 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <img src="/logolw.jpg" alt="LeadWise Logo" className="w-8 h-8 rounded-lg object-cover" />
              <span className="font-bold text-white text-lg tracking-tight">LeadWise Foundation</span>
            </a>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium">
              <a href="/" className="text-gray-400 hover:text-white transition">Home</a>
              <span className="text-[#FFBEA0]">Templates</span>
              <a href="/courses" className="text-gray-400 hover:text-white transition">Courses</a>
              <a 
                href="https://donation.letsleadwise.org" 
                className="bg-[#FF9E80] text-[#1B2735] px-5 py-2 rounded-full font-bold hover:bg-white transition-colors shadow-[0_0_15px_rgba(255,190,160,0.4)]"
              >
                Donate Now
              </a>
            </div>
          </div>
        </nav>

        {/* --- HERO SECTION --- */}
        <div className="relative overflow-hidden py-24 text-center px-4">
           {/* Background Glow */}
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#FF9E80] rounded-full blur-[150px] opacity-10 pointer-events-none"></div>
           
           <div className="relative z-10 max-w-3xl mx-auto">
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-[#FFBEA0]/30 text-[#FFBEA0] text-sm font-semibold mb-8">
               <CheckCircle size={16} /> ATS-Optimized Technology
             </div>
             <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
               Build a Resume that <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#FFBEA0]">Gets You Hired.</span>
             </h1>
             <p className="text-xl text-gray-300 font-light tracking-wide leading-relaxed">
               Professionally designed, ATS-friendly templates engineered to highlight your Google Certifications and pass automated screenings.
             </p>
           </div>
        </div>

        {/* --- TEMPLATES GRID --- */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((template) => (
              <div key={template.id} className="group bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-[#FFBEA0]/50 transition-all duration-300 overflow-hidden hover:-translate-y-1 shadow-lg hover:shadow-[0_0_30px_rgba(255,190,160,0.1)]">
                {/* --- TEMPLATE CARD -- */}
                
                {/* Card Header / Preview */}
                <div className="h-56 bg-[#1B2735]/50 relative overflow-hidden flex items-center justify-center p-8">
                   <div className="absolute inset-0 bg-gradient-to-tr from-[#FF9E80]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                   
                   {/* Abstract representation of the resume */}
                   <div className="bg-white w-32 h-44 shadow-2xl transform group-hover:scale-110 transition-transform duration-500 rounded flex flex-col p-2 gap-2 opacity-90">
                      <div className={`h-2 w-full rounded ${template.color.replace('bg-', 'bg-opacity-50 bg-')}`}></div>
                      <div className="h-1 w-1/2 bg-gray-200 rounded"></div>
                      <div className="h-1 w-full bg-gray-100 rounded mt-2"></div>
                      <div className="h-1 w-full bg-gray-100 rounded"></div>
                      <div className="h-1 w-3/4 bg-gray-100 rounded"></div>
                   </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{template.name}</h3>
                  <p className="text-gray-400 text-sm mb-6 h-10 leading-relaxed">{template.description}</p>
                  
                  <div className="flex gap-3">
                    <button onClick={() => setPreviewModalTemplate(template.id)} className="flex-1 border border-white/20 hover:border-[#FFBEA0] hover:text-[#FFBEA0] text-gray-300 font-bold py-3 px-4 rounded-xl transition-colors text-sm">Preview</button>
                    <button onClick={() => navigateToEditor(template.id)} className="flex-1 bg-[#FF9E80] hover:bg-white text-[#1B2735] font-bold py-3 px-4 rounded-xl transition-colors text-sm shadow-lg">Use Template</button>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-3">
                     <button onClick={() => navigateToEditor(template.id)} className="text-xs text-center text-gray-500 hover:text-white flex items-center justify-center gap-1 group/btn"><FileText size={12}/> Resume <ArrowRight size={10} className="opacity-0 group-hover/btn:opacity-100 transition-opacity"/></button>
                     <button onClick={() => navigateToCoverLetter(template.id)} className="text-xs text-center text-gray-500 hover:text-white flex items-center justify-center gap-1 group/btn"><Mail size={12}/> Cover Letter <ArrowRight size={10} className="opacity-0 group-hover/btn:opacity-100 transition-opacity"/></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
             <h3 className="text-2xl font-bold text-white mb-4">Ready to fill these out?</h3>
             <a href="/courses" className="inline-flex items-center gap-2 text-[#FFBEA0] border-b border-[#FFBEA0] pb-1 hover:text-white hover:border-white transition-colors">
               Take our free Google Certification courses first <ArrowRight size={16}/>
             </a>
          </div>
        </div>

        {/* --- PREVIEW MODAL --- */}
        {previewModalTemplate && ModalComponent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#1B2735] border border-white/10 rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedModalTemplateData?.name}</h2>
                  <p className="text-sm text-gray-400">{selectedModalTemplateData?.description}</p>
                </div>
                <button onClick={() => setPreviewModalTemplate(null)} className="p-2 hover:bg-white/10 rounded-full text-white transition-colors">✕</button>
              </div>
              {/* Preview */}
              <div className="flex-1 overflow-auto bg-black/50 p-8 custom-scrollbar">
                <div className="mx-auto shadow-2xl bg-white max-w-[210mm] min-h-[297mm] transform scale-90 origin-top">
                  <ModalComponent data={{
                    personalInfo: { fullName: "Alex Morgan", email: "alex@example.com", phone: "(555) 123-4567", location: "New York, NY", linkedIn: "linkedin.com/in/alex" },
                    professionalSummary: "Experienced professional with a demonstrated history of working in the industry.",
                    experience: [{ id: "1", company: "Tech Solutions Inc.", position: "Senior Manager", startDate: "2020", endDate: "Present", currentlyWorking: true, description: "Leading a team of 15 developers." }],
                    education: [{ id: "1", school: "State University", degree: "Bachelor of Science", field: "Computer Science", graduationDate: "2018" }],
                    skills: [{ id: "1", name: "Leadership" }, { id: "2", name: "Project Management" }],
                    template: previewModalTemplate!,
                    settings: { themeColor: 'blue', font: 'sans' }
                  }} />
                </div>
              </div>
              {/* Footer Buttons */}
              <div className="p-6 border-t border-white/10 flex justify-end gap-3 bg-[#1B2735]">
                <button onClick={() => setPreviewModalTemplate(null)} className="px-6 py-3 border border-white/10 rounded-xl hover:bg-white/5 text-white font-medium transition-colors">
                  Close
                </button>
                <button onClick={() => { setPreviewModalTemplate(null); navigateToEditor(previewModalTemplate!); }} className="px-6 py-3 bg-[#FF9E80] text-[#1B2735] rounded-xl font-bold hover:bg-white transition-colors shadow-lg">
                  Use for Resume
                </button>
                <button onClick={() => { setPreviewModalTemplate(null); navigateToCoverLetter(previewModalTemplate!); }} className="px-6 py-3 bg-[#6C5CE7] text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg">
                  Use for Cover Letter
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      </>
    );
  }
}