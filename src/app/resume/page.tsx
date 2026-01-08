'use client';
import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ResumeEditorView } from '@/components/Editor';

function ResumeEditorWrapper() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const templateId = searchParams.get('template') || 'modern-blue';

  return (
    <ResumeEditorView 
      templateId={templateId} 
      onBack={() => router.push('/#templates')} 
    />
  );
}

export default function ResumePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ResumeEditorWrapper />
    </Suspense>
  );
}
