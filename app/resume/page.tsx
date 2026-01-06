'use client';
import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const ResumeEditorView = dynamic(() => import('../components/Editor').then(mod => mod.ResumeEditorView), { ssr: false });

function ResumeEditorWrapper() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const templateId = searchParams.get('template') || 'modern-blue';

  return (
    <ResumeEditorView 
      templateId={templateId} 
      onBack={() => router.push('/')} 
    />
  );
}

export default function ResumePage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading Editor...</div>}>
      <ResumeEditorWrapper />
    </Suspense>
  );
}
