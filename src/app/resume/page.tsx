'use client';
import React from 'react';
import ResumeBuilder from '@/components/Editor';

// This is the SINGLE PAGE ENTRY POINT the user requested.
// It loads the ResumeBuilder component which contains:
// 1. Template Gallery
// 2. Resume Editor
// 3. Cover Letter Editor
export default function ResumePage() {
  return <ResumeBuilder />;
}
