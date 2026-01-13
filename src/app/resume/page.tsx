import React from 'react';
import type { Metadata } from "next";
import ResumeBuilder from '@/components/Editor';

// DEV TEMP WORKAROUND: Forces metadata to refresh on route change
if (process.env.NODE_ENV === 'development') {
  import('next/headers').then(({ headers }) => headers());
}

export const metadata: Metadata = {
  title: "Free ATS Resume Builder | LeadWise Foundation",
  description: "Create a professional, ATS-optimized resume in minutes. Choose from free templates designed to pass automated screenings and get you hired.",
  keywords: ["Resume Builder", "ATS Resume", "Free Resume Templates", "CV Maker", "Cover Letter Builder", "Google Certified"],
  openGraph: {
    title: "Build Your ATS-Optimized Resume for Free",
    description: "Don't let bots reject your resume. Use our free builder to create a professional, keyword-optimized resume that gets seen by recruiters.",
    url: "https://services.letsleadwise.org/resume",
    siteName: "LeadWise Foundation",
    images: [
      {
        url: "/logolw.jpg",
        width: 800,
        height: 600,
        alt: "LeadWise Resume Builder",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free ATS Resume Builder",
    description: "Build a job-winning resume with LeadWise Foundation's free tools.",
    images: ["/logolw.jpg"],
  },
};

export default function ResumePage() {
  return (
    <ResumeBuilder
      templateId="modern-blue"
      switchLabel="Cover Letter"
      switchHref="/cover-letter"
    />
  );
}
