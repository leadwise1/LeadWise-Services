import React from 'react';
import type { Metadata } from 'next';
import ForumNavigation from './navigation';
import LearningHubAccess from './learning-hub-access';
import './community.css';

export const metadata: Metadata = {
  title: 'LW Learning Hub | LeadWise',
  description: 'Ask questions, support other learners, and stay connected through community opportunities, workshops, and announcements.',
};

export default function ForumLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="community-shell min-h-screen bg-neutral-950 text-white flex flex-col md:flex-row">
      <LearningHubAccess><ForumNavigation />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0">
        {children}
      </main></LearningHubAccess>
    </div>
  );
}
