'use client';

import { usePathname } from 'next/navigation';
import { useStore } from '@/store/useStore';

const pageTitles: Record<string, string> = {
  '/': 'Feed',
  '/stories': 'Stories',
  '/chat': 'Chats',
  '/music': 'Music',
  '/profile': 'Profile',
};

export default function TopBar() {
  const pathname = usePathname();
  const title = pageTitles[pathname] || 'Nexus';
  const { unreadChats } = useStore();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-nexus-border">
      <div className="max-w-lg mx-auto flex items-center justify-between px-4 h-14">
        <h1 className="text-xl font-bold gradient-text">{title === 'Nexus' ? 'Nexus' : title}</h1>
        <div className="flex items-center gap-3">
          <button className="relative p-1">
            <svg className="w-5 h-5 text-nexus-muted" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadChats > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-nexus-accent3 rounded-full" />
            )}
          </button>
          <button className="p-1">
            <svg className="w-5 h-5 text-nexus-muted" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
