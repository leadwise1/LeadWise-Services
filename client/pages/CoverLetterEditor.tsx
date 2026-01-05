import { useSearchParams } from "react-router-dom";
import {
  ModernBlueCoverLetter,
  ElegantClassicCoverLetter,
  CreativeVibrantCoverLetter,
  MinimalCleanCoverLetter,
  ExecutiveBoldCoverLetter,
  AcademicProfessionalCoverLetter,
} from "@/components/CoverLetters";
import { ArrowLeft, Printer } from "lucide-react";

export default function CoverLetterEditor() {
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get("template") || "modern-blue";

  const templates: Record<string, React.FC<{ data?: any }>> = {
    "modern-blue": ModernBlueCoverLetter,
    "elegant-classic": ElegantClassicCoverLetter,
    "creative-vibrant": CreativeVibrantCoverLetter,
    "minimal-clean": MinimalCleanCoverLetter,
    "executive-bold": ExecutiveBoldCoverLetter,
    "academic-professional": AcademicProfessionalCoverLetter,
  };

  const SelectedTemplate = templates[templateId] || ModernBlueCoverLetter;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-primary sticky top-0 z-40 shadow-md print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/templates" className="text-white hover:text-gray-200 flex items-center gap-2">
              <ArrowLeft className="w-5 h-5" />
              Back to Templates
            </a>
            <span className="text-white/50">|</span>
            <span className="font-bold text-white text-lg">Cover Letter Builder</span>
          </div>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-white text-primary px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print / Save PDF
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-8 px-4 print:p-0 print:max-w-none">
        <div className="bg-white shadow-lg rounded-xl overflow-hidden print:shadow-none">
          <SelectedTemplate />
        </div>
      </div>
    </div>
  );
}