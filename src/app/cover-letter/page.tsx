'use client';
import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CoverLetterEditorView } from '@/components/Editor';

function CoverLetterEditorWrapper() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const templateId = searchParams.get('template') || 'modern-blue';

  return (
    <CoverLetterEditorView 
      templateId={templateId} 
      onBack={() => router.push('/#templates')} 
    />
  );
}

export default function CoverLetterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <CoverLetterEditorWrapper />
    </Suspense>
  );
}
