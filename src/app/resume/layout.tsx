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
  return <>{children}</>;
}