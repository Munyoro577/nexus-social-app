'use client';

import { useEffect } from 'react';
import BottomNav from './BottomNav';
import TopBar from './TopBar';
import SyncIndicator from './SyncIndicator';
import SecurityBadge from './SecurityBadge';
import { registerServiceWorker } from '@/lib/sw-register';

export default function Layout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <>
      <TopBar />
      {children}
      <SyncIndicator />
      <SecurityBadge />
      <BottomNav />
    </>
  );
}
