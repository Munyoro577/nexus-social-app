'use client';

import { useStore } from '@/store/useStore';

export default function SecurityBadge() {
  const serverMode = useStore((s) => s.serverMode);
  const e2eEnabled = useStore((s) => s.e2eEncryption);
  const biometric = useStore((s) => s.biometricEnabled);

  return (
    <div className="flex items-center gap-1.5 text-[10px]">
      <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[var(--accent)]/15">
        <svg className="w-3 h-3" style={{ color: 'var(--accent)' }} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span style={{ color: 'var(--accent)' }}>E2E</span>
      </div>
      <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[var(--accent)]/15">
        <span style={{ color: 'var(--accent)' }}>{serverMode === 'decentralized' ? 'P2P' : 'CLOUD'}</span>
      </div>
      {biometric && (
        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[var(--accent)]/15">
          <span style={{ color: 'var(--accent)' }}>&#128274;</span>
        </div>
      )}
    </div>
  );
}
