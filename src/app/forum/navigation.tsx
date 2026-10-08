'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { MessageSquare, Trophy, Calendar, ArrowLeft, Megaphone, Network } from 'lucide-react';

function Navigation() {
  const path = usePathname();
  const params = useSearchParams();
  const isBulletin = params.get('board') === 'bulletin';
  const links = [
    { href: '/forum', label: 'Welcome', Icon: Network, active: path === '/forum' },
    { href: '/forum/discussions', label: 'Open forum', Icon: MessageSquare, active: path === '/forum/discussions' && !isBulletin },
    { href: '/forum/discussions?board=bulletin', label: 'Bulletin board', Icon: Megaphone, active: path === '/forum/discussions' && isBulletin },
    { href: '/forum/events', label: 'Weekly syncs', Icon: Calendar, active: path === '/forum/events' },
    { href: '/forum/leaderboard', label: 'Learner progress', Icon: Trophy, active: path === '/forum/leaderboard' },
  ];

  return (
    <aside className="community-nav w-full md:w-64 md:shrink-0 border-b md:border-b-0 md:border-r border-neutral-800 p-5 md:p-6 flex flex-col gap-6">
      <div>
        <Link href="/courses" className="text-sm text-neutral-400 hover:text-white hidden md:flex items-center gap-2 mb-5">
          <ArrowLeft className="w-4 h-4" /> Back to courses
        </Link>
        <Link href="/forum" className="flex items-center gap-3 text-2xl font-bold text-white"><Network className="w-7 h-7 text-blue-400" />LeadWise</Link>
        <p className="text-sm text-neutral-400 mt-2">Learner community</p>
      </div>
      <nav aria-label="Community" className="flex flex-wrap md:flex-col gap-1">
        {links.map(({ href, label, Icon, active }) => (
          <Link key={href} href={href} aria-current={active ? 'page' : undefined} className={`community-nav-link flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium ${active ? 'text-blue-200' : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'}`}>
            <Icon className="w-5 h-5 shrink-0" /> {label}
          </Link>
        ))}
      </nav>
      <p className="hidden md:block mt-auto border-t border-neutral-800 pt-5 text-sm leading-relaxed text-neutral-400">Learning continues beyond a course. Learners and alumni are welcome here.</p>
    </aside>
  );
}

export default function ForumNavigation() {
  return <Suspense fallback={<aside className="md:w-64 shrink-0 p-6">LeadWise</aside>}><Navigation /></Suspense>;
}
