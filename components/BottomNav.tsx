'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/store/useStore';

const tabs = [
  {
    label: 'Feed',
    href: '/',
    icon: (active: boolean) => (
      <svg className="w-6 h-6" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: 'Stories',
    href: '/stories',
    icon: (active: boolean) => (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="3" fill={active ? 'currentColor' : 'none'} />
      </svg>
    ),
  },
  {
    label: 'Chat',
    href: '/chat',
    icon: (active: boolean) => (
      <svg className="w-6 h-6" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    label: 'Music',
    href: '/music',
    icon: (active: boolean) => (
      <svg className="w-6 h-6" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3zm12-3c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z" />
      </svg>
    ),
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: (active: boolean) => (
      <svg className="w-6 h-6" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { currentTrack } = useStore();

  return (
    <>
      {currentTrack && (
        <div className="fixed bottom-16 left-0 right-0 z-40 px-4">
          <div className="max-w-lg mx-auto">
            <Link href="/music" className="glass rounded-xl px-3 py-2 flex items-center gap-3 mb-1 animate-slide-up">
              <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center text-xs font-bold">
                {currentTrack.title[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{currentTrack.title}</div>
                <div className="text-xs text-nexus-muted truncate">{currentTrack.artist}</div>
              </div>
              <svg className="w-5 h-5 text-nexus-accent animate-pulse-slow" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </Link>
          </div>
        </div>
      )}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-nexus-border">
        <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-2">
          {tabs.map((tab) => {
            const active = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href));
            return (
              <Link key={tab.href} href={tab.href} className="flex flex-col items-center gap-1 py-1 px-3 min-w-[60px]">
                <div className={`${active ? 'text-nexus-accent' : 'text-nexus-muted'}`}>
                  {tab.icon(active)}
                </div>
                <span className={`text-[10px] font-medium ${active ? 'text-nexus-text' : 'text-nexus-muted'}`}>
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
