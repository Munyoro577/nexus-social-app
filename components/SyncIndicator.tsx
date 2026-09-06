'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';

export default function SyncIndicator() {
  const syncEnabled = useStore((s) => s.syncEnabled);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'offline'>('synced');

  useEffect(() => {
    if (!syncEnabled) return;
    const updateStatus = () => {
      if (!navigator.onLine) {
        setSyncStatus('offline');
      } else {
        setSyncStatus('synced');
      }
    };
    updateStatus();
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
    };
  }, [syncEnabled]);

  if (!syncEnabled) return null;

  const colors = {
    idle: 'var(--muted)',
    syncing: '#f59e0b',
    synced: '#10b981',
    offline: '#ef4444',
  };

  const icons = {
    idle: '&#9679;',
    syncing: '&#8635;',
    synced: '&#10003;',
    offline: '&#9888;',
  };

  return (
    <div className="flex items-center gap-1 text-[10px]" style={{ color: colors[syncStatus] }}>
      <span dangerouslySetInnerHTML={{ __html: icons[syncStatus] }} />
      <span>{syncStatus === 'syncing' ? 'Syncing...' : syncStatus === 'synced' ? 'Synced' : syncStatus === 'offline' ? 'Offline' : 'Idle'}</span>
    </div>
  );
}
