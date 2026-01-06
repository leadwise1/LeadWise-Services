import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LeadWise Resume Builder | Free ATS-Friendly Resume Maker",
  description: "Create professional, ATS-friendly resumes and cover letters for free. LeadWise empowers women and marginalized voices in STEM with tools to build leadership careers.",
  keywords: "resume builder, free resume maker, cover letter builder, ATS friendly resume, women in STEM, leadership resume, diversity in tech",
  openGraph: {
    type: "website",
    url: "https://services.letsleadwise.org/",
    title: "LeadWise Resume Builder | Free ATS-Friendly Resume Maker",
    description: "Free resume and cover letter builder designed to empower marginalized voices in STEM. Build your future today.",
    images: ["https://services.letsleadwise.org/leadwise-logo.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "LeadWise Resume Builder | Free ATS-Friendly Resume Maker",
    description: "Create professional, ATS-friendly resumes and cover letters for free. Join the movement for equity and impact.",
    images: ["https://services.letsleadwise.org/leadwise-logo.svg"],
  },
  alternates: {
    canonical: "https://services.letsleadwise.org/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "LeadWise Resume Builder",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Any",
              "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
              "description": "LeadWise's free resume and cover letter builder empowers women and marginalized voices in STEM and leadership."
            }),
          }}
        />
      </body>
    </html>
  );
}
