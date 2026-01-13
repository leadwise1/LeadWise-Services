

// src/app/services/layout.tsx
// Server component — no 'use client'

export const metadata = {
  title: "LeadWise Foundation | Free Google Certifications & Resume Builder",
  description: "Empowering careers with free Google Cloud & Workspace certifications, ATS-optimized resume builder, and professional development tools.",
  keywords: [
    "Google Certification",
    "Resume Builder",
    "ATS Resume",
    "Free Courses",
    "Career Development",
    "LeadWise Foundation",
    "Google Cloud",
    "Google Workspace"
  ],
  openGraph: {
    title: "LeadWise Foundation | Turn Ambition into Action",
    description: "Join a community dedicated to economic mobility. Get certified in Google Cloud & Workspace for free and build an ATS-ready resume.",
    url: "https://services.letsleadwise.org/services",
    siteName: "LeadWise Foundation",
    images: [
      {
        url: "/logolw.jpg",
        width: 800,
        height: 600,
        alt: "LeadWise Foundation Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LeadWise Foundation",
    description: "Free Google Certifications & ATS Resume Builder.",
    images: ["/logolw.jpg"],
  },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}