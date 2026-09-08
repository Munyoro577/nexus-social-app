'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { getStoredAuth } from '@/lib/auth';
import { setHapticsEnabled } from '@/lib/haptics';
import BottomNav from './BottomNav';
import SyncIndicator from './SyncIndicator';
import SecurityBadge from './SecurityBadge';
import OnboardingShell from './OnboardingShell';

const PUBLIC_ROUTES = ['/auth'];

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const authUser = useStore((s) => s.authUser);
  const onboardingStatus = useStore((s) => s.onboardingStatus);
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

    // Not authenticated → redirect to auth
    if (!authUser && !isPublic) {
      router.push('/auth');
      return;
    }

    // Authenticated but on auth page → redirect to /
    if (authUser && isPublic) {
      router.push('/');
      return;
    }
  }, [checked, authUser, pathname, onboardingStatus, router]);

  // Loading state
  if (!checked) {
    return (
      <div className="app-loading">
        <div className="app-loading-icon">\u2728</div>
      </div>
    );
  }

  const isAuthPage = pathname === '/auth';

  // ---- Shell 1: Auth (not authenticated) ----
  if (!authUser || isAuthPage) {
    return (
      <div className="auth-shell">
        {children}
      </div>
    );
  }

  // ---- Shell 2: Onboarding (authenticated, onboarding not completed) ----
  if (onboardingStatus !== 'completed') {
    return <OnboardingShell />;
  }

  // ---- Shell 3: Authenticated App (authenticated, onboarding completed) ----
  return (
    <div className="app-shell-root">
      <div className="app-shell-header">
        <SyncIndicator />
        <SecurityBadge />
      </div>
      <main className="app-shell-main">{children}</main>
      <BottomNav />
    </div>
  );
}
