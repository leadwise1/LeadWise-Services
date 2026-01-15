// src/app/cover-letter/layout.tsx
// Server component — no 'use client'

export const metadata = {
  title: "Cover Letter Builder | LeadWise",
  description:
    "Create professional cover letters quickly with LeadWise. Customize templates and get employer-ready results.",
  keywords: [
    "cover letter builder",
    "free cover letter templates",
    "leadwise cover letter",
    "job application help",
    "career tools",
  ],
  openGraph: {
    title: "LeadWise Cover Letter Builder",
    description: "Build a professional cover letter with free templates and guidance.",
    url: "https://services.letsleadwise.org/cover-letter",
    siteName: "LeadWise Foundation",
    images: [
      {
        url: "/og/cover-letter.png",
        width: 1200,
        height: 630,
        alt: "LeadWise Cover Letter Builder",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cover Letter Builder | LeadWise",
    description:
      "Quickly create professional cover letters using LeadWise templates and guidance.",
    images: ["/og/cover-letter.png"],
  },
};

export default function CoverLetterLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-[radial-gradient(ellipse_at_top,_#1B2735_0%,_#090A0F_100%)] text-white font-sans selection:bg-[#FFBEA0] selection:text-[#1B2735]">
      <main id="main-content">
        <h1 className="sr-only">Cover Letter Builder | LeadWise Foundation</h1>
        {children}
      </main>
    </div>
  );
}