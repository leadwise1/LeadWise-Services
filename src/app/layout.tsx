import Script from 'next/script'
import type { Metadata } from "next";
import React from "react";
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Fonts, meta tags, etc. */}
      </head>
      <body>
        {children}

        {/* Google Analytics / Ad Grant Tag */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-T9GJJL0N2V"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-T9GJJL0N2V');
          `}
        </Script>
      </body>
    </html>
  )
}
