import Script from 'next/script'
import type { Metadata } from "next";
import React from "react";
import { Analytics } from "@vercel/analytics/next";
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
        {/* Google Analytics / Ad Grant Tag */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17987808548"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17987808548');
          `}
        </Script>

        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-5TMRPFMF');
          `}
        </Script>

        {/* Fonts, meta tags, etc. */}
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5TMRPFMF"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
