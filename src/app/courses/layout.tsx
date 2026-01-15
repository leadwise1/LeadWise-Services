// src/app/courses/layout.tsx
// Server component — no 'use client' here

export const metadata = {
  title: "Free Google Certification Courses | LeadWise",
  description:
    "Enroll in free Google Cloud and Workspace certification courses. Build in-demand tech skills and earn credentials trusted by employers.",
  keywords: [
    "free Google certification courses",
    "Google Cloud certification free",
    "Google Workspace training",
    "tech certification for jobs",
    "career upskilling platform",
  ],
  openGraph: {
    title: "Free Google Certification Courses That Employers Trust",
    description:
      "Learn Google Cloud and Workspace skills with free certification courses designed to lead directly to job opportunities.",
    url: "https://services.letsleadwise.org/courses",
    siteName: "LeadWise Foundation",
    images: [
      {
        url: "/og/courses.png",
        width: 1200,
        height: 630,
        alt: "Free Google Certification Courses by LeadWise",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Google Certification Courses | LeadWise",
    description:
      "Build real-world Google Cloud & Workspace skills with free certification courses.",
    images: ["/og/courses.png"],
  },
};

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-[radial-gradient(ellipse_at_top,_#1B2735_0%,_#090A0F_100%)] text-white font-sans selection:bg-[#FFBEA0] selection:text-[#1B2735]">
      <main id="main-content">
        {children}
      </main>
    </div>
  );
}