import type { Metadata } from "next";
import React from "react";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "LeadWise Resume & Cover Letter Builder",
  description: "Create professional, ATS-friendly resumes and cover letters with free templates.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
