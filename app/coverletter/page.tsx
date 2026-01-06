'use client';
import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const CoverLetterEditorView = dynamic(() => import('../components/Editor').then(mod => mod.CoverLetterEditorView), { ssr: false });

function CoverLetterEditorWrapper() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const templateId = searchParams.get('template') || 'modern-blue';

  return (
    <CoverLetterEditorView 
      templateId={templateId} 
      onBack={() => router.push('/')} 
    />
  );
}

export default function CoverLetterPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading Editor...</div>}>
      <CoverLetterEditorWrapper />
    </Suspense>
  );
}
