import { useState, useEffect } from "react";
import { ModernBlueTemplate } from "@/components/ResumeTemplates";
import { ResumeData, getResumeFromStorage, saveResumeToStorage } from "@shared/resume";
import { Trash2, Plus } from "lucide-react";

export default function Editor() {
  const [resume, setResume] = useState<ResumeData>(getResumeFromStorage());

  useEffect(() => {
    saveResumeToStorage(resume);
  }, [resume]);

  const updatePersonalInfo = (field: string, value: string) => {
    setResume({
      ...resume,
      personalInfo: {
        ...resume.personalInfo,
        [field]: value,
      },
    });
  };

  const updateSummary = (value: string) => {
    setResume({
      ...resume,
      professionalSummary: value,
    });
  };

  const addExperience = () => {
    const newId = Date.now().toString();
    setResume({
      ...resume,
      experience: [
        ...resume.experience,
        {
          id: newId,
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          currentlyWorking: false,
          description: "",
        },
      ],
    });
  };

  const updateExperience = (id: string, field: string, value: any) => {
    setResume({
      ...resume,
      experience: resume.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  const deleteExperience = (id: string) => {
    setResume({
      ...resume,
      experience: resume.experience.filter((exp) => exp.id !== id),
    });
  };

  const addEducation = () => {
    const newId = Date.now().toString();
    setResume({
      ...resume,
      education: [
        ...resume.education,
        {
          id: newId,
          school: "",
          degree: "",
          field: "",
          graduationDate: "",
        },
      ],
    });
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setResume({
      ...resume,
      education: resume.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    });
  };

  const deleteEducation = (id: string) => {
    setResume({
      ...resume,
      education: resume.education.filter((edu) => edu.id !== id),
    });
  };

  const addSkill = () => {
    const newId = Date.now().toString();
    setResume({
      ...resume,
      skills: [
        ...resume.skills,
        {
          id: newId,
          name: "",
        },
      ],
    });
  };

  const updateSkill = (id: string, value: string) => {
    setResume({
      ...resume,
      skills: resume.skills.map((skill) =>
        skill.id === id ? { ...skill, name: value } : skill
      ),
    });
  };

  const deleteSkill = (id: string) => {
    setResume({
      ...resume,
      skills: resume.skills.filter((skill) => skill.id !== id),
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-primary sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-primary font-bold text-xl">R</span>
            </div>
            <span className="font-bold text-white text-lg">ResumeCraft</span>
          </div>
          <div className="flex items-center gap-8">
            <a href="/" className="text-gray-100 hover:text-white transition">Home</a>
            <a href="/templates" className="text-gray-100 hover:text-white transition">Templates</a>
            <a href="/courses" className="text-gray-100 hover:text-white transition">Courses</a>
          </div>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Left: Form Editor */}
        <div className="bg-white rounded-xl shadow-lg p-8 h-fit lg:sticky lg:top-24 overflow-y-auto max-h-[calc(100vh-120px)]">
          <h1 className="text-3xl font-bold text-primary mb-8">Edit Resume</h1>

          {/* Personal Information */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-primary mb-4">Personal Information</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={resume.personalInfo.fullName}
                onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="email"
                placeholder="Email"
                value={resume.personalInfo.email}
                onChange={(e) => updatePersonalInfo("email", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={resume.personalInfo.phone}
                onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="text"
                placeholder="Location"
                value={resume.personalInfo.location}
                onChange={(e) => updatePersonalInfo("location", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="text"
                placeholder="LinkedIn URL (optional)"
                value={resume.personalInfo.linkedIn || ""}
                onChange={(e) => updatePersonalInfo("linkedIn", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Professional Summary */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-primary mb-4">Professional Summary</h2>
            <textarea
              placeholder="Write a brief summary of your professional background and goals..."
              value={resume.professionalSummary}
              onChange={(e) => updateSummary(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Experience */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-primary">Experience</h2>
              <button
                onClick={addExperience}
                className="flex items-center gap-2 bg-primary hover:bg-opacity-90 text-white px-3 py-1 rounded-lg text-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            <div className="space-y-6">
              {resume.experience.map((exp) => (
                <div key={exp.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-900">{exp.position || "New Entry"}</h3>
                    <button
                      onClick={() => deleteExperience(exp.id)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="text"
                      placeholder="Job Title"
                      value={exp.position}
                      onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Start Date (e.g., 2020)"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <input
                        type="text"
                        placeholder="End Date (e.g., 2023)"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                        disabled={exp.currentlyWorking}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
                      />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={exp.currentlyWorking}
                        onChange={(e) => updateExperience(exp.id, "currentlyWorking", e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-700">Currently working here</span>
                    </label>
                    <textarea
                      placeholder="Job description and achievements..."
                      value={exp.description}
                      onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-primary">Education</h2>
              <button
                onClick={addEducation}
                className="flex items-center gap-2 bg-primary hover:bg-opacity-90 text-white px-3 py-1 rounded-lg text-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            <div className="space-y-4">
              {resume.education.map((edu) => (
                <div key={edu.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-900">{edu.school || "New Education"}</h3>
                    <button
                      onClick={() => deleteEducation(edu.id)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="School/University"
                      value={edu.school}
                      onChange={(e) => updateEducation(edu.id, "school", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="text"
                      placeholder="Degree"
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="text"
                      placeholder="Field of Study"
                      value={edu.field}
                      onChange={(e) => updateEducation(edu.id, "field", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="text"
                      placeholder="Graduation Date (e.g., 2020)"
                      value={edu.graduationDate}
                      onChange={(e) => updateEducation(edu.id, "graduationDate", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-primary">Skills</h2>
              <button
                onClick={addSkill}
                className="flex items-center gap-2 bg-primary hover:bg-opacity-90 text-white px-3 py-1 rounded-lg text-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            <div className="space-y-2">
              {resume.skills.map((skill) => (
                <div key={skill.id} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Skill name"
                    value={skill.name}
                    onChange={(e) => updateSkill(skill.id, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    onClick={() => deleteSkill(skill.id)}
                    className="text-red-600 hover:text-red-700 p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-8 border-t">
            <button className="flex-1 bg-primary hover:bg-opacity-90 text-white font-bold py-3 px-4 rounded-lg transition-colors">
              Download as PDF
            </button>
            <button className="flex-1 border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold py-3 px-4 rounded-lg transition-colors">
              Download as HTML
            </button>
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden lg:sticky lg:top-24 h-fit">
          <div className="bg-primary text-white p-4 font-bold">Live Preview</div>
          <div className="p-6 bg-gray-50 max-h-[calc(100vh-180px)] overflow-y-auto">
            <div className="scale-75 origin-top-left" style={{ minWidth: "133.333%" }}>
              <ModernBlueTemplate data={resume} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
