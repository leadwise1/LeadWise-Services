'use client'
import React, { useState, useEffect, useRef } from "react";
import { 
  Trash2, Plus, Download, Layout, 
  ChevronLeft, FileText, PenTool, 
  Mail, Phone, MapPin, Linkedin, Printer,
  Palette, Type, CheckCircle
} from "lucide-react";

// ==========================================
// 1. TYPES & DATA STRUCTURES
// ==========================================

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

export interface TemplateConfig {
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

  // SAFETY CHECKS: Ensure arrays exist
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

        {/* FORCE GRID: Removed 'lg:' prefix to ensure it stays 3 columns on print */}
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

        {/* FORCE GRID: Fixed 2 columns for print */}
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

        {/* FORCE GRID: Fixed 3 columns for print */}
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
                // FORCE GRID: Fixed 4 columns for dates vs content
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
          {/* Sidebar */}
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

          {/* Main Content */}
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
                      <span className={`${theme.secondary} font-bold text-sm`}>{exp.startDate} - {exp.currentlyWorking ? "Present" : exp.endDate}</span>
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
// 3. COVER LETTER TEMPLATES (Matched Styles)
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
                 <div>{data.recipient.title}</div>
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
// 4. CONFIGURATION MAP
// ==========================================

export const templates: TemplateConfig[] = [
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
// 5. STORAGE HELPERS
// ==========================================
const RESUME_KEY = "user_resume_data_v2";
const COVER_LETTER_KEY = "user_cover_letter_data_v2";

const getStoredPersonalInfo = (): PersonalInfo => {
    if (typeof window === "undefined") return { fullName: "", email: "", phone: "", location: "", linkedIn: "" };
    try {
        const resume = JSON.parse(localStorage.getItem(RESUME_KEY) || "{}");
        return resume.personalInfo || { fullName: "", email: "", phone: "", location: "", linkedIn: "" };
    } catch { return { fullName: "", email: "", phone: "", location: "", linkedIn: "" }; }
}

const getResumeFromStorage = (): ResumeData | null => {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem(RESUME_KEY) || ""); } catch { return null; }
};

const getCoverLetterFromStorage = (): CoverLetterData | null => {
    if (typeof window === "undefined") return null;
    try { return JSON.parse(localStorage.getItem(COVER_LETTER_KEY) || ""); } catch { return null; }
};

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

  // Safe Access for Summary
  if (data.professionalSummary) {
    text += `--- PROFESSIONAL SUMMARY ---\n${data.professionalSummary}\n\n`;
  }

  // Safe Access for Experience
  const expList = data.experience || [];
  if (expList.length > 0) {
    text += `--- EXPERIENCE ---\n`;
    expList.forEach(exp => {
      text += `${exp.position || "Position"} | ${exp.company || "Company"}\n`;
      text += `${exp.startDate || ""} - ${exp.currentlyWorking ? "Present" : (exp.endDate || "")}\n`;
      text += `${exp.description || ""}\n\n`;
    });
  }

  // Safe Access for Education
  const eduList = data.education || [];
  if (eduList.length > 0) {
    text += `--- EDUCATION ---\n`;
    eduList.forEach(edu => {
      text += `${edu.school || "School"} | ${edu.degree || "Degree"}\n`;
      text += `Graduated: ${edu.graduationDate || ""}\n\n`;
    });
  }

  // Safe Access for Skills
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

// ==========================================
// 7. EDITOR VIEWS
// ==========================================

export const ResumeEditorView: React.FC<{ templateId: string, onBack: () => void }> = ({ templateId, onBack }) => {
  const [activeTemplateId, setActiveTemplateId] = useState(templateId);
  const previewRef = useRef<HTMLDivElement>(null);
  
  // Initial state with Safety Merge for old data
  const [resume, setResume] = useState<ResumeData>(() => {
    const saved = getResumeFromStorage();
    const defaultSettings: DesignSettings = { themeColor: 'blue', font: 'sans' };
    
    // Safety Merge: If saved data lacks arrays (old data bug), force them to exist
    if (saved) {
        return {
            ...saved,
            settings: saved.settings || defaultSettings,
            experience: saved.experience || [],
            education: saved.education || [],
            skills: saved.skills || [],
            professionalSummary: saved.professionalSummary || "",
            personalInfo: saved.personalInfo || { fullName: "", email: "", phone: "", location: "", linkedIn: "" }
        }
    }

    return {
      personalInfo: { fullName: "", email: "", phone: "", location: "", linkedIn: "" },
      professionalSummary: "",
      experience: [],
      education: [],
      skills: [],
      template: templateId,
      settings: defaultSettings
    };
  });

  const SelectedTemplate = templates.find(t => t.id === activeTemplateId)?.resumeComponent || ModernBlueTemplate;

  useEffect(() => { saveResumeToStorage(resume); }, [resume]);

  const updateInfo = (f: keyof PersonalInfo, v: string) => setResume(p => ({...p, personalInfo: {...p.personalInfo, [f]: v}}));
  const updateSettings = (f: keyof DesignSettings, v: any) => setResume(p => ({...p, settings: {...p.settings, [f]: v}}));
  
  // Basic list handlers
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
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
      {/* CRITICAL PRINT STYLES */}
      <style>{`
        @media print {
          @page { margin: 0; size: auto; }
          body { background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          /* Reset the grid to basic block for printing */
          .grid { display: block !important; padding: 0 !important; margin: 0 !important; }
          /* Hide the editor column */
          .grid > div:first-child { display: none !important; }
          /* Force the preview column to take full width */
          .grid > div:last-child { display: block !important; width: 100% !important; height: auto !important; position: absolute !important; top: 0 !important; left: 0 !important; margin: 0 !important; padding: 0 !important; }
          /* Reset container styles */
          .print-container { overflow: visible !important; height: auto !important; box-shadow: none !important; border: none !important; background: white !important; padding: 0 !important; }
          /* Allow preview to expand naturally */
          .print-scale { transform: none !important; width: 100% !important; min-height: auto !important; height: auto !important; box-shadow: none !important; }
        }
      `}</style>
      
      <nav className="bg-[#232136] text-white p-4 sticky top-0 z-40 shadow-md no-print flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-start">
          <a href="https://services.letsleadwise.org" className="flex items-center gap-2">
            <img src="/leadwise-logo.svg" alt="LeadWise" className="w-8 h-8 rounded-lg" />
            <h1 className="font-bold text-lg hidden sm:inline">LeadWise</h1>
          </a>
          <div className="h-6 w-px bg-[#4b486c] hidden md:block"></div>
          <div className="flex items-center gap-4">
             <button onClick={onBack} className="flex items-center gap-1 text-gray-300 hover:text-white transition text-sm font-medium"><ChevronLeft size={16} /> Templates</button>
             <a href="https://services.letsleadwise.org/courses" className="text-gray-300 hover:text-white transition text-sm font-medium">Courses</a>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
           <select value={activeTemplateId} onChange={(e) => setActiveTemplateId(e.target.value)} className="bg-[#3a3758] text-white text-sm rounded px-3 py-1 border border-[#4b486c]">
             {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
           </select>
           <button onClick={() => downloadATS(resume)} className="bg-[#3a3758] hover:bg-opacity-80 px-3 py-1 rounded text-sm flex items-center gap-2 border border-[#4b486c]">
             <FileText size={16}/> ATS Text
           </button>
           <button onClick={() => window.print()} className="bg-[#fac0ab] text-[#232136] px-3 py-1 rounded text-sm font-bold flex items-center gap-2">
             <Printer size={16}/> Save PDF
           </button>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8 h-fit lg:sticky lg:top-24 overflow-y-auto max-h-[calc(100vh-120px)] no-print">
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
             <div className="flex items-center gap-2 mb-3 text-[#232136] font-bold text-sm uppercase tracking-wider">
               <Palette size={16}/> Design Settings
             </div>
             <div className="grid grid-cols-2 gap-6">
               <div>
                  <label className="text-xs font-semibold text-gray-500 mb-2 block">Accent Color</label>
                  <div className="flex gap-2">
                    {['blue', 'green', 'purple', 'red', 'black'].map(c => (
                      <button 
                        key={c}
                        onClick={() => updateSettings('themeColor', c)} 
                        className={`w-6 h-6 rounded-full border-2 ${resume.settings?.themeColor === c ? 'border-gray-900 scale-110' : 'border-transparent opacity-70 hover:opacity-100'}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
               </div>
               <div>
                  <label className="text-xs font-semibold text-gray-500 mb-2 block">Font Style</label>
                  <div className="flex gap-2 text-xs">
                     {['sans', 'serif', 'mono'].map(f => (
                       <button 
                         key={f}
                         onClick={() => updateSettings('font', f)}
                         className={`px-2 py-1 rounded border ${resume.settings?.font === f ? 'bg-[#fac0ab]/20 border-[#fac0ab] text-[#232136]' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                       >
                         {f === 'sans' ? 'Modern' : f === 'serif' ? 'Classic' : 'Tech'}
                       </button>
                     ))}
                  </div>
               </div>
             </div>
          </div>

          <div className="space-y-6">
            <section>
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Personal Info</h2>
              <div className="space-y-3">
                <input className="w-full p-2 border rounded" placeholder="Full Name" value={resume.personalInfo.fullName} onChange={e => updateInfo('fullName', e.target.value)} />
                <div className="grid grid-cols-2 gap-3">
                  <input className="w-full p-2 border rounded" placeholder="Email" value={resume.personalInfo.email} onChange={e => updateInfo('email', e.target.value)} />
                  <input className="w-full p-2 border rounded" placeholder="Phone" value={resume.personalInfo.phone} onChange={e => updateInfo('phone', e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input className="w-full p-2 border rounded" placeholder="Location" value={resume.personalInfo.location} onChange={e => updateInfo('location', e.target.value)} />
                  <input className="w-full p-2 border rounded" placeholder="LinkedIn" value={resume.personalInfo.linkedIn} onChange={e => updateInfo('linkedIn', e.target.value)} />
                </div>
              </div>
            </section>
            
            <section>
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Summary</h2>
              <textarea className="w-full p-2 border rounded min-h-[100px]" placeholder="Brief professional summary..." value={resume.professionalSummary} onChange={e => setResume(p => ({...p, professionalSummary: e.target.value}))} />
            </section>

            <section>
              <div className="flex justify-between mb-2">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Experience</h2>
                <button onClick={addExp} className="text-[#4b486c] text-sm font-medium flex items-center gap-1"><Plus size={14}/> Add</button>
              </div>
              {resume.experience.map(exp => (
                <div key={exp.id} className="p-4 bg-gray-50 rounded mb-3 border relative group">
                  <button onClick={() => delExp(exp.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><Trash2 size={16}/></button>
                  <input className="w-full p-1 bg-transparent font-medium mb-1 border-b border-transparent focus:border-[#fac0ab] focus:outline-none" placeholder="Company Name" value={exp.company} onChange={e => updateExp(exp.id, 'company', e.target.value)} />
                  <input className="w-full p-1 bg-transparent text-sm mb-2 border-b border-transparent focus:border-[#fac0ab] focus:outline-none" placeholder="Job Title" value={exp.position} onChange={e => updateExp(exp.id, 'position', e.target.value)} />
                  <div className="flex gap-2 mb-2">
                    <input className="w-1/2 p-1 text-xs border rounded" placeholder="Start" value={exp.startDate} onChange={e => updateExp(exp.id, 'startDate', e.target.value)} />
                    <input className="w-1/2 p-1 text-xs border rounded" placeholder="End" value={exp.endDate} onChange={e => updateExp(exp.id, 'endDate', e.target.value)} disabled={exp.currentlyWorking}/>
                  </div>
                  <textarea className="w-full p-2 text-sm border rounded" placeholder="Description..." value={exp.description} onChange={e => updateExp(exp.id, 'description', e.target.value)} />
                </div>
              ))}
            </section>

             <section>
              <div className="flex justify-between mb-2">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Education</h2>
                <button onClick={addEdu} className="text-[#4b486c] text-sm font-medium flex items-center gap-1"><Plus size={14}/> Add</button>
              </div>
              {resume.education.map(edu => (
                <div key={edu.id} className="p-4 bg-gray-50 rounded mb-3 border relative">
                  <button onClick={() => delEdu(edu.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><Trash2 size={16}/></button>
                  <input className="w-full p-1 bg-transparent font-medium mb-1 focus:outline-none" placeholder="School" value={edu.school} onChange={e => updateEdu(edu.id, 'school', e.target.value)} />
                  <div className="flex gap-2">
                    <input className="w-full p-1 text-sm border rounded" placeholder="Degree" value={edu.degree} onChange={e => updateEdu(edu.id, 'degree', e.target.value)} />
                    <input className="w-24 p-1 text-sm border rounded" placeholder="Year" value={edu.graduationDate} onChange={e => updateEdu(edu.id, 'graduationDate', e.target.value)} />
                  </div>
                </div>
              ))}
            </section>

             <section>
              <div className="flex justify-between mb-2">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Skills</h2>
                <button onClick={addSkill} className="text-[#4b486c] text-sm font-medium flex items-center gap-1"><Plus size={14}/> Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {resume.skills.map(skill => (
                  <div key={skill.id} className="flex items-center bg-gray-100 rounded-full px-3 py-1 border">
                    <input className="bg-transparent text-sm w-20 focus:outline-none" placeholder="Skill" value={skill.name} onChange={e => updateSkill(skill.id, e.target.value)} />
                    <button onClick={() => delSkill(skill.id)} className="ml-1 text-gray-400 hover:text-red-500"><Trash2 size={12}/></button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <div className="hidden lg:block relative">
           <div className="sticky top-24">
              <div className="bg-gray-800 text-white text-xs uppercase font-bold py-2 px-4 rounded-t-lg flex justify-between no-print">
                 <span>Live Preview</span>
                 <span className="opacity-50">A4 Size</span>
              </div>
              {/* Added print-container class for targeting */}
              <div className="bg-gray-300 p-8 rounded-b-lg shadow-2xl h-[calc(100vh-160px)] overflow-y-auto print-container">
                 <div ref={previewRef} className="bg-white shadow-sm min-h-[297mm] w-[210mm] origin-top-left transform scale-[0.45] md:scale-[0.55] xl:scale-[0.65] print-scale">
                    <SelectedTemplate data={resume} />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export const CoverLetterEditorView: React.FC<{ templateId: string, onBack: () => void }> = ({ templateId, onBack }) => {
    const [activeTemplateId, setActiveTemplateId] = useState(templateId);
    const [data, setData] = useState<CoverLetterData>(() => {
        const saved = getCoverLetterFromStorage();
        const defaultInfo = getStoredPersonalInfo();
        const defaultSettings: DesignSettings = { themeColor: 'blue', font: 'sans' };

        if (saved) {
             return {
                 ...saved,
                 settings: saved.settings || defaultSettings
             }
        }
        return {
            personalInfo: defaultInfo.fullName ? defaultInfo : { fullName: "", email: "", phone: "", location: "", linkedIn: "" },
            recipient: { name: "", title: "", company: "", address: "" },
            content: { greeting: "Dear Hiring Manager,", body: "I am writing...", closing: "Sincerely," },
            template: templateId,
            settings: defaultSettings
        };
    });

    useEffect(() => { saveCoverLetterToStorage(data); }, [data]);
    const SelectedTemplate = templates.find(t => t.id === activeTemplateId)?.coverLetterComponent || ModernBlueCoverLetter;
    
    // Helpers
    const updateRecipient = (f: keyof CoverLetterData['recipient'], v: string) => setData(p => ({...p, recipient: {...p.recipient, [f]: v}}));
    const updateContent = (f: keyof CoverLetterData['content'], v: string) => setData(p => ({...p, content: {...p.content, [f]: v}}));
    const updateSettings = (f: keyof DesignSettings, v: any) => setData(p => ({...p, settings: {...p.settings, [f]: v}}));

    return (
        <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
             <style>{`
                @media print {
                  @page { margin: 0; size: auto; }
                  body { background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                  .no-print { display: none !important; }
                  .grid { display: block !important; padding: 0 !important; margin: 0 !important; }
                  .grid > div:first-child { display: none !important; }
                  .grid > div:last-child { display: block !important; width: 100% !important; height: auto !important; position: absolute !important; top: 0 !important; left: 0 !important; margin: 0 !important; padding: 0 !important; }
                  .print-container { overflow: visible !important; height: auto !important; box-shadow: none !important; border: none !important; background: white !important; padding: 0 !important; }
                  .print-scale { transform: none !important; width: 100% !important; min-height: auto !important; height: auto !important; box-shadow: none !important; }
                }
              `}</style>
             <nav className="bg-[#232136] text-white p-4 sticky top-0 z-40 shadow-md no-print flex flex-col md:flex-row justify-between items-center gap-4">
               <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-start">
                  <a href="https://services.letsleadwise.org" className="flex items-center gap-2">
                    <img src="/leadwise-logo.svg" alt="LeadWise" className="w-8 h-8 rounded-lg" />
                    <h1 className="font-bold text-lg hidden sm:inline">LeadWise</h1>
                  </a>
                  <div className="h-6 w-px bg-[#4b486c] hidden md:block"></div>
                  <div className="flex items-center gap-4">
                     <button onClick={onBack} className="flex items-center gap-1 text-gray-300 hover:text-white transition text-sm font-medium"><ChevronLeft size={16} /> Templates</button>
                     <a href="https://services.letsleadwise.org/courses" className="text-gray-300 hover:text-white transition text-sm font-medium">Courses</a>
                  </div>
               </div>
               <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                  <select value={activeTemplateId} onChange={(e) => setActiveTemplateId(e.target.value)} className="bg-[#3a3758] text-white text-sm rounded px-3 py-1 border border-[#4b486c]">
                    {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                  <button onClick={() => window.print()} className="bg-[#fac0ab] text-[#232136] px-3 py-1 rounded text-sm font-bold flex items-center gap-2">
                    <Printer size={16}/> Save PDF
                  </button>
               </div>
             </nav>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 max-w-7xl mx-auto">
               <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8 h-fit lg:sticky lg:top-24 overflow-y-auto max-h-[calc(100vh-120px)] no-print">
                  
                  {/* DESIGN SETTINGS FOR COVER LETTER */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 mb-3 text-[#232136] font-bold text-sm uppercase tracking-wider">
                      <Palette size={16}/> Appearance
                    </div>
                    <div className="flex gap-4">
                       <div className="flex gap-1">
                          {['blue', 'green', 'purple', 'red', 'black'].map(c => (
                            <button key={c} onClick={() => updateSettings('themeColor', c)} className={`w-5 h-5 rounded-full border ${data.settings?.themeColor === c ? 'border-gray-900 scale-125' : 'border-transparent'}`} style={{ backgroundColor: c }}/>
                          ))}
                       </div>
                       <div className="h-5 w-px bg-gray-300"></div>
                       <div className="flex gap-2 text-xs">
                          {['sans', 'serif', 'mono'].map(f => (
                            <button key={f} onClick={() => updateSettings('font', f)} className={`px-2 rounded border ${data.settings?.font === f ? 'bg-[#fac0ab]/20 text-[#232136]' : 'bg-white'}`}>{f === 'sans' ? 'Modern' : f === 'serif' ? 'Classic' : 'Tech'}</button>
                          ))}
                       </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <section>
                      <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Recipient Details</h2>
                      <div className="space-y-3">
                        <input className="w-full p-2 border rounded" placeholder="Hiring Manager Name" value={data.recipient.name} onChange={e => updateRecipient('name', e.target.value)} />
                        <input className="w-full p-2 border rounded" placeholder="Title" value={data.recipient.title} onChange={e => updateRecipient('title', e.target.value)} />
                        <input className="w-full p-2 border rounded" placeholder="Company" value={data.recipient.company} onChange={e => updateRecipient('company', e.target.value)} />
                        <textarea className="w-full p-2 border rounded h-20" placeholder="Address" value={data.recipient.address} onChange={e => updateRecipient('address', e.target.value)} />
                      </div>
                    </section>
                    <section>
                      <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Content</h2>
                      <div className="space-y-3">
                         <input className="w-full p-2 border rounded font-medium" placeholder="Greeting" value={data.content.greeting} onChange={e => updateContent('greeting', e.target.value)} />
                         <textarea className="w-full p-3 border rounded min-h-[300px]" placeholder="Body..." value={data.content.body} onChange={e => updateContent('body', e.target.value)} />
                         <input className="w-full p-2 border rounded font-medium" placeholder="Closing" value={data.content.closing} onChange={e => updateContent('closing', e.target.value)} />
                      </div>
                    </section>
                  </div>
               </div>

               <div className="hidden lg:block relative">
                 <div className="sticky top-24">
                   <div className="bg-gray-800 text-white text-xs uppercase font-bold py-2 px-4 rounded-t-lg flex justify-between no-print">
                     <span>Letter Preview</span>
                     <span className="opacity-50">A4 Size</span>
                   </div>
                   <div className="bg-gray-300 p-8 rounded-b-lg shadow-2xl h-[calc(100vh-160px)] overflow-y-auto print-container">
                      <div className="bg-white shadow-sm min-h-[297mm] w-[210mm] origin-top-left transform scale-[0.45] md:scale-[0.55] xl:scale-[0.65] print-scale">
                         <SelectedTemplate data={data} />
                      </div>
                   </div>
                 </div>
               </div>
             </div>
        </div>
    );
}

export default function ResumeApp() {
  const [currentView, setCurrentView] = useState<"templates" | "editor" | "cover-letter">("templates");
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

  if (currentView === "templates") {
    return (
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
        <nav className="bg-[#232136] sticky top-0 z-40 shadow-sm text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <a href="https://services.letsleadwise.org" className="flex items-center gap-2">
                <img src="/leadwise-logo.svg" alt="LeadWise" className="w-10 h-10 rounded-lg" />
                <span className="font-bold text-xl">LeadWise Foundation</span>
              </a>
            </div>
            <div className="flex items-center gap-6 text-sm font-medium">
              <a href="https://services.letsleadwise.org" className="text-gray-300 hover:text-white transition">Home</a>
              <button className="text-white">Templates</button>
              <a href="https://services.letsleadwise.org/courses" className="text-gray-300 hover:text-white transition">Courses</a>
            </div>
          </div>
        </nav>

        <div className="bg-[#232136] text-white py-20 px-4 text-center">
           <h1 className="text-4xl md:text-5xl font-bold mb-6">Resume Templates</h1>
           <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
             Professionally designed, ATS-friendly templates. Now with full personalization support.
           </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((template) => (
              <div key={template.id} className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#fac0ab]">
                <div className="h-48 bg-gray-100 p-4 relative overflow-hidden flex items-center justify-center">
                   <div className="text-center opacity-40">
                      <Layout size={48} className="mx-auto mb-2"/>
                      <span className="text-sm font-bold uppercase tracking-widest">{template.name}</span>
                   </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{template.name}</h3>
                  <p className="text-gray-500 text-sm mb-6 h-10">{template.description}</p>
                  
                  <div className="flex gap-3">
                    <button onClick={() => setPreviewModalTemplate(template.id)} className="flex-1 border border-gray-300 hover:border-[#4b486c] hover:text-[#232136] text-gray-600 font-semibold py-2 px-4 rounded-lg transition-colors text-sm">Preview</button>
                    <button onClick={() => navigateToEditor(template.id)} className="flex-1 bg-[#232136] hover:bg-[#3a3758] text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">Use Template</button>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                     <button onClick={() => navigateToEditor(template.id)} className="text-xs text-center text-gray-500 hover:text-[#232136] hover:underline">Resume</button>
                     <button onClick={() => navigateToCoverLetter(template.id)} className="text-xs text-center text-gray-500 hover:text-[#232136] hover:underline">Cover Letter</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {previewModalTemplate && ModalComponent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
             <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b">
                   <div>
                      <h2 className="text-xl font-bold">{selectedModalTemplateData?.name}</h2>
                      <p className="text-sm text-gray-500">{selectedModalTemplateData?.description}</p>
                   </div>
                   <button onClick={() => setPreviewModalTemplate(null)} className="p-2 hover:bg-gray-100 rounded-full">✕</button>
                </div>
                <div className="flex-1 overflow-auto bg-gray-100 p-8">
                   <div className="mx-auto shadow-lg bg-white max-w-[210mm] min-h-[297mm]">
                      <ModalComponent data={{
                        personalInfo: { fullName: "Alex Morgan", email: "alex@example.com", phone: "(555) 123-4567", location: "New York, NY", linkedIn: "linkedin.com/in/alex" },
                        professionalSummary: "Experienced professional with a demonstrated history of working in the industry.",
                        experience: [{ id: "1", company: "Tech Solutions Inc.", position: "Senior Manager", startDate: "2020", endDate: "Present", currentlyWorking: true, description: "Leading a team of 15 developers." }],
                        education: [{ id: "1", school: "State University", degree: "Bachelor of Science", field: "Computer Science", graduationDate: "2018" }],
                        skills: [{id:"1", name:"Leadership"}, {id:"2", name:"Project Management"}],
                        template: previewModalTemplate,
                        settings: { themeColor: 'blue', font: 'sans' }
                      }} />
                   </div>
                </div>
                <div className="p-4 border-t flex justify-end gap-3 bg-white">
                   <button onClick={() => setPreviewModalTemplate(null)} className="px-6 py-2 border rounded-lg hover:bg-gray-50">Close</button>
                   <button onClick={() => { setPreviewModalTemplate(null); navigateToEditor(previewModalTemplate); }} className="px-6 py-2 bg-[#232136] text-white rounded-lg hover:bg-[#3a3758]">Use This Template</button>
                </div>
             </div>
          </div>
        )}
      </div>
    );
  }

  if (currentView === "cover-letter") {
    return <CoverLetterEditorView templateId={selectedTemplateId} onBack={() => setCurrentView("templates")} />;
  }

  return <ResumeEditorView templateId={selectedTemplateId} onBack={() => setCurrentView("templates")} />;
}
