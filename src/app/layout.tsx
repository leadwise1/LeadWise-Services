import type { Metadata } from "next";
import React from "react";
import Script from "next/script";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "LeadWise Foundation | Free Google Certifications & Resume Builder",
  description:
    "Empowering careers with free Google Cloud & Workspace certifications, ATS-optimized resume builder, and professional development tools.",
  keywords: [
    "Google Certification",
    "Resume Builder",
    "ATS Resume",
    "Free Courses",
    "Career Development",
    "LeadWise Foundation",
    "Google Cloud",
    "Google Workspace",
  ],
  openGraph: {
    title: "LeadWise Foundation | Turn Ambition into Action",
    description:
      "Join a community dedicated to economic mobility. Get certified in Google Cloud & Workspace for free and build an ATS-ready resume.",
    url: "https://services.letsleadwise.org",
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-730C30SNVM"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-730C30SNVM');
          `}
        </Script>
      </head>
      <body>
        <div className="min-h-screen w-full bg-[radial-gradient(ellipse_at_top,_#1B2735_0%,_#090A0F_100%)] text-white font-sans selection:bg-[#FFBEA0] selection:text-[#1B2735]">
          <main id="main-content">{children}</main>
        </div>
      </body>
    </html>
  );
}
