import { useState } from "react";
import { ModernBlueTemplate, ElegantClassicTemplate, CreativeVibrantTemplate, MinimalCleanTemplate, ExecutiveBoldTemplate, AcademicProfessionalTemplate } from "@/components/ResumeTemplates";

interface Template {
  id: string;
  name: string;
  description: string;
  component: React.ComponentType<{ data?: any }>;
  category: string;
  color: string;
}

const templates: Template[] = [
  {
    id: "modern-blue",
    name: "Modern Blue",
    description: "Clean and professional with a bold blue accent. Perfect for tech and creative fields.",
    component: ModernBlueTemplate,
    category: "Modern",
    color: "blue"
  },
  {
    id: "elegant-classic",
    name: "Elegant Classic",
    description: "Timeless design with serif typography. Ideal for executives and traditional industries.",
    component: ElegantClassicTemplate,
    category: "Professional",
    color: "slate"
  },
  {
    id: "creative-vibrant",
    name: "Creative Vibrant",
    description: "Bold and colorful design showcasing creativity. Great for designers and marketing professionals.",
    component: CreativeVibrantTemplate,
    category: "Creative",
    color: "indigo"
  },
  {
    id: "minimal-clean",
    name: "Minimal Clean",
    description: "Ultra-minimal design with maximum focus on content. Perfect for engineers and analysts.",
    component: MinimalCleanTemplate,
    category: "Minimal",
    color: "gray"
  },
  {
    id: "executive-bold",
    name: "Executive Bold",
    description: "Strong visual hierarchy with sidebar. Ideal for sales and business development roles.",
    component: ExecutiveBoldTemplate,
    category: "Executive",
    color: "blue"
  },
  {
    id: "academic-professional",
    name: "Academic Professional",
    description: "Structured layout for academic credentials and research. Perfect for scholars and researchers.",
    component: AcademicProfessionalTemplate,
    category: "Academic",
    color: "slate"
  }
];

export default function Templates() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<"list" | "preview">("list");

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);
  const SelectedComponent = selectedTemplateData?.component;

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-primary sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold text-xl">R</span>
              </div>
              <span className="font-bold text-white">ResumeCraft</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="text-gray-100 hover:text-white transition">Home</a>
            <a href="/templates" className="text-white font-semibold">Templates</a>
            <a href="/courses" className="text-gray-100 hover:text-white transition">Courses</a>
          </div>
        </div>
      </nav>

      {previewMode === "list" ? (
        <>
          {/* Header */}
          <div className="bg-primary text-white py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Resume Templates
              </h1>
              <p className="text-xl text-gray-100 max-w-2xl mx-auto">
                Choose from 6 professionally designed resume templates. Each template includes a matching cover letter design to create a cohesive application package.
              </p>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-accent"
                >
                  {/* Template Preview Thumbnail */}
                  <div className="h-48 bg-gradient-to-br from-primary/10 to-gray-100 p-4 overflow-hidden relative">
                    <div className="text-xs text-gray-600 absolute top-2 right-2 bg-gray-200 px-3 py-1 rounded-full">
                      {template.category}
                    </div>
                    <div className={`h-full rounded-lg border-2 border-dashed border-gray-300 bg-white overflow-hidden flex items-center justify-center`}>
                      <div className="text-center">
                        <div className={`text-3xl font-bold text-primary mb-2`}>
                          {template.name}
                        </div>
                        <p className="text-xs text-gray-600">[Template Preview]</p>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-primary mb-2">
                      {template.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-6">
                      {template.description}
                    </p>

                    {/* Features */}
                    <div className="mb-6 space-y-2">
                      <p className="text-xs font-semibold text-primary uppercase tracking-wider">Includes:</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>✓ Professional resume design</li>
                        <li>✓ Matching cover letter template</li>
                        <li>✓ Print-ready layout</li>
                        <li>✓ ATS-optimized format</li>
                      </ul>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setSelectedTemplate(template.id);
                          setPreviewMode("preview");
                        }}
                        className="flex-1 bg-primary hover:bg-opacity-90 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                      >
                        Preview
                      </button>
                      <a
                        href="/editor"
                        className="flex-1 border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-center"
                      >
                        Use Template
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <div className="bg-primary/10 border-t border-primary/20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-xl">📄</span>
                  </div>
                  <h3 className="font-bold text-primary mb-2">Resume + Cover Letter</h3>
                  <p className="text-sm text-gray-700">Each template includes matching resume and cover letter designs</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-xl">✨</span>
                  </div>
                  <h3 className="font-bold text-primary mb-2">Professional Design</h3>
                  <p className="text-sm text-gray-700">Crafted by design professionals for maximum impact</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-xl">🎨</span>
                  </div>
                  <h3 className="font-bold text-primary mb-2">Fully Customizable</h3>
                  <p className="text-sm text-gray-700">Edit colors, fonts, and layouts to match your style</p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : SelectedComponent ? (
        <div className="py-8">
          {/* Preview Header */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-primary">
                  {selectedTemplateData?.name}
                </h2>
                <p className="text-gray-600 mt-2">
                  {selectedTemplateData?.description}
                </p>
              </div>
              <button
                onClick={() => setPreviewMode("list")}
                className="bg-gray-200 hover:bg-gray-300 text-primary font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
              >
                ← Back to Templates
              </button>
            </div>
          </div>

          {/* Full Template Preview */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-6xl mx-auto">
            <SelectedComponent data={undefined} />
          </div>

          {/* Actions */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex gap-4 justify-center">
            <button className="bg-primary hover:bg-opacity-90 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
              Use This Template
            </button>
            <button className="border-2 border-gray-300 hover:border-primary text-primary hover:bg-primary hover:text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
              Download as PDF
            </button>
          </div>
        </div>
      ) : null}

      {/* Footer */}
      <footer className="bg-primary text-gray-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-4">ResumeCraft</h3>
              <p className="text-sm">Professional resume templates for every career.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/" className="hover:text-white transition">Templates</a></li>
                <li><a href="/courses" className="hover:text-white transition">Courses</a></li>
                <li><a href="#" className="hover:text-white transition">Tracker</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Guide</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary/20 pt-8 text-center text-sm">
            <p>&copy; 2024 ResumeCraft. Free tools for your success.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
