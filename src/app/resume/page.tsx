'use client';
import React, { Suspense } from 'react';
import ResumeApp from '@/components/Editor';

export default function ResumePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ResumeApp />
    </Suspense>
  );
}
