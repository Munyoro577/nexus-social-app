'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import BottomNav from './BottomNav';
import TopBar from './TopBar';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStoryViewer = pathname === '/stories/view';

  return (
    <div className="min-h-screen bg-nexus-bg text-nexus-text">
      {!isStoryViewer && <TopBar />}
      <main className={`${isStoryViewer ? '' : 'pb-20 pt-14'} max-w-lg mx-auto min-h-screen`}>
        {children}
      </main>
      {!isStoryViewer && <BottomNav />}
    </div>
  );
}
