import { useState } from "react";

export default function Editor() {
  const [name, setName] = useState("John Anderson");

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

      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-primary mb-8">Resume Editor</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-primary mb-4">Edit Your Resume</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-bold text-primary mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex gap-4">
            <button className="flex-1 bg-primary hover:bg-opacity-90 text-white font-bold py-3 px-6 rounded-lg transition-colors">
              Save Resume
            </button>
            <button className="flex-1 border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold py-3 px-6 rounded-lg transition-colors">
              Download as PDF
            </button>
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-600">Preview: <strong>{name}</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}
