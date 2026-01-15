// src/app/resume/layout.tsx
// Server component — no 'use client'

export const metadata = {
  title: "Resume Builder | LeadWise",
  description:
    "Build professional resumes quickly with LeadWise. Customize templates and get employer-ready results.",
  keywords: [
    "resume builder",
    "free resume templates",
    "leadwise resume",
    "job application help",
    "career tools",
  ],
  openGraph: {
    title: "LeadWise Resume Builder",
    description: "Create a professional resume with free templates and guidance.",
    url: "https://services.letsleadwise.org/resume",
    siteName: "LeadWise Foundation",
    images: [
      {
        url: "/og/resume.png",
        width: 1200,
        height: 630,
        alt: "LeadWise Resume Builder",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Resume Builder | LeadWise",
    description:
      "Quickly create professional resumes using LeadWise templates and guidance.",
    images: ["/og/resume.png"],
  },
};

export default function ResumeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-[radial-gradient(ellipse_at_top,_#1B2735_0%,_#090A0F_100%)] text-white font-sans selection:bg-[#FFBEA0] selection:text-[#1B2735]">
      <main id="main-content">
        <h1 className="sr-only">ATS Resume Builder | LeadWise Foundation</h1>
        {children}
      </main>
    </div>
  );
}