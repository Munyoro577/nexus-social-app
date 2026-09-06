'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { getStoredAuth } from '@/lib/auth';
import { setHapticsEnabled } from '@/lib/haptics';
import BottomNav from './BottomNav';
import SyncIndicator from './SyncIndicator';
import SecurityBadge from './SecurityBadge';

const PUBLIC_ROUTES = ['/auth'];

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const authUser = useStore((s) => s.authUser);
  const hapticsEnabled = useStore((s) => s.hapticsEnabled);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setHapticsEnabled(hapticsEnabled);
  }, [hapticsEnabled]);

  useEffect(() => {
    const stored = getStoredAuth();
    if (stored && !authUser) {
      useStore.setState({ authUser: stored });
    }
    setChecked(true);
  }, []);

  useEffect(() => {
    if (!checked) return;
    const isPublic = PUBLIC_ROUTES.includes(pathname);
    if (!authUser && !isPublic) {
      router.push('/auth');
    }
    if (authUser && isPublic) {
      router.push('/');
    }
  }, [checked, authUser, pathname]);

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="text-4xl animate-pulse">\u2728</div>
      </div>
    );
  }

  const isAuthPage = pathname === '/auth';

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      {!isAuthPage && (
        <div className="fixed top-0 right-0 z-40 px-3 py-2 flex items-center gap-3">
          <SyncIndicator />
          <SecurityBadge />
        </div>
      )}
      <main>{children}</main>
      {!isAuthPage && <BottomNav />}
    </div>
  );
}
