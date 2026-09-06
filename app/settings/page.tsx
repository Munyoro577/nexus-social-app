'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { haptic } from '@/lib/haptics';

type SettingsTab = 'theme' | 'security' | 'experience' | 'sync';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('theme');
  const store = useStore();

  const tabs: { id: SettingsTab; label: string; icon: string }[] = [
    { id: 'theme', label: 'Theme', icon: '🎨' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'experience', label: 'Experience', icon: '✨' },
    { id: 'sync', label: 'Sync', icon: '☁️' },
  ];

  return (
    <div className="min-h-screen pb-20" style={{ background: 'var(--bg)' }}>
      <div className="glass sticky top-0 z-30 border-b px-4 py-3" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-lg mx-auto">
          <h1 className="text-xl font-bold gradient-text mb-3">Settings</h1>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { haptic('selection'); setActiveTab(tab.id); }}
                className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all"
                style={activeTab === tab.id
                  ? { background: 'var(--gradient)', color: '#fff' }
                  : { background: 'var(--card)', color: 'var(--muted)' }
                }
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4">
        {activeTab === 'theme' && <ThemeSettings />}
        {activeTab === 'security' && <SecuritySettings />}
        {activeTab === 'experience' && <ExperienceSettings />}
        {activeTab === 'sync' && <SyncSettings />}
      </div>
    </div>
  );
}

function ToggleSetting({ label, description, value, onChange }: any) {
  return (
    <div className="p-3 rounded-xl flex items-center justify-between" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <div>
        <p className="font-medium text-sm">{label}</p>
        {description && <p className="text-xs" style={{ color: 'var(--muted)' }}>{description}</p>}
      </div>
      <button
        onClick={() => { haptic('light'); onChange(!value); }}
        className="w-12 h-6 rounded-full transition-all flex items-center px-1"
        style={{
          background: value ? '#10b981' : 'var(--surface)',
        }}
      >
        <div
          className="w-5 h-5 rounded-full transition-transform"
          style={{
            background: '#fff',
            transform: value ? 'translateX(24px)' : 'translateX(0)',
          }}
        />
      </button>
    </div>
  );
}

function ThemeSettings() {
  const store = useStore();
  const themes = ['nexus', 'telegram', 'whatsapp', 'instagram', 'x', 'facebook', 'spotify', 'snapchat'];

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium mb-2">App Theme</p>
        <div className="grid grid-cols-2 gap-2">
          {themes.map(theme => (
            <button
              key={theme}
              onClick={() => { haptic('selection'); store.setThemeId(theme as any); }}
              className="p-3 rounded-lg text-sm font-medium capitalize transition-all"
              style={{
                background: store.themeId === theme ? 'var(--gradient)' : 'var(--card)',
                color: store.themeId === theme ? '#fff' : 'var(--text)',
                border: `1px solid ${store.themeId === theme ? 'transparent' : 'var(--border)'}`,
              }}
            >
              {theme}
            </button>
          ))}
        </div>
      </div>

      <ToggleSetting
        label="Dark Mode"
        description="Use dark theme for reduced eye strain"
        value={store.colorMode === 'dark'}
        onChange={(v: boolean) => store.setColorMode(v ? 'dark' : 'light')}
      />

      <div>
        <p className="text-sm font-medium mb-2">Accent Color</p>
        <div className="flex gap-2 p-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          {['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#ef4444'].map(color => (
            <button
              key={color}
              onClick={() => { haptic('selection'); store.setCustomPalette({ accent: color }); }}
              className="w-8 h-8 rounded-full border-2 transition-transform"
              style={{
                background: color,
                borderColor: store.customPalette?.accent === color ? '#fff' : 'transparent',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function SecuritySettings() {
  const store = useStore();

  return (
    <div className="space-y-3">
      <ToggleSetting
        label="E2E Encryption"
        description="Encrypt all messages end-to-end"
        value={store.e2eEncryption}
        onChange={store.setE2eEncryption}
      />

      <ToggleSetting
        label="Biometric Authentication"
        description="Use fingerprint or face ID to unlock"
        value={store.biometricEnabled}
        onChange={store.setBiometricEnabled}
      />

      <ToggleSetting
        label="Two-Factor Authentication"
        description="Add extra security layer to your account"
        value={store.twoFactorEnabled}
        onChange={store.setTwoFactorEnabled}
      />

      <ToggleSetting
        label="Ephemeral Storage"
        description="Auto-delete sensitive data after period"
        value={store.ephemeralStorage}
        onChange={store.setEphemeralStorage}
      />

      <div className="p-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <p className="font-medium text-sm mb-2">Server Mode</p>
        <div className="flex gap-2">
          {['centralized', 'decentralized'].map(mode => (
            <button
              key={mode}
              onClick={() => { haptic('selection'); store.setServerMode(mode as any); }}
              className="flex-1 px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all"
              style={{
                background: store.serverMode === mode ? 'var(--gradient)' : 'var(--surface)',
                color: store.serverMode === mode ? '#fff' : 'var(--text)',
              }}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <ToggleSetting
        label="Read Receipts"
        description="Let others know when you read messages"
        value={store.readReceipts}
        onChange={store.setReadReceipts}
      />

      <ToggleSetting
        label="Online Status"
        description="Show when you're active"
        value={store.onlineStatus}
        onChange={store.setOnlineStatus}
      />
    </div>
  );
}

function ExperienceSettings() {
  const store = useStore();

  return (
    <div className="space-y-3">
      <ToggleSetting
        label="Haptic Feedback"
        description="Feel vibrations for interactions"
        value={store.hapticsEnabled}
        onChange={store.setHapticsEnabled}
      />

      <ToggleSetting
        label="Sound Effects"
        description="Play sounds for notifications"
        value={store.soundEnabled}
        onChange={store.setSoundEnabled}
      />

      <ToggleSetting
        label="Animations"
        description="Enable smooth transitions"
        value={store.animationsEnabled}
        onChange={store.setAnimationsEnabled}
      />

      <ToggleSetting
        label="Reduced Motion"
        description="Minimize animation and transitions"
        value={store.reducedMotion}
        onChange={store.setReducedMotion}
      />

      <ToggleSetting
        label="Data Saver"
        description="Reduce data usage (lower quality media)"
        value={store.dataSaver}
        onChange={store.setDataSaver}
      />
    </div>
  );
}

function SyncSettings() {
  const store = useStore();

  return (
    <div className="space-y-3">
      <ToggleSetting
        label="Cross-Device Sync"
        description="Sync data across your devices"
        value={store.syncEnabled}
        onChange={store.setSyncEnabled}
      />

      <ToggleSetting
        label="Offline Support"
        description="Use app without internet connection"
        value={store.offlineMode}
        onChange={store.setOfflineMode}
      />

      <ToggleSetting
        label="Cloud Backup"
        description="Backup your data to the cloud"
        value={store.cloudBackup}
        onChange={store.setCloudBackup}
      />

      <ToggleSetting
        label="Backup Encryption"
        description="Encrypt cloud backups"
        value={store.backupEncryption}
        onChange={store.setBackupEncryption}
      />

      <div className="p-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <p className="font-medium text-sm mb-2">Last Backup</p>
        <p className="text-xs" style={{ color: 'var(--muted)' }}>Just now</p>
      </div>

      <button
        onClick={() => { haptic('medium'); alert('Backup created!'); }}
        className="w-full px-4 py-2 rounded-lg font-medium text-sm"
        style={{ background: 'var(--gradient)', color: '#fff' }}
      >
        Create Backup Now
      </button>
    </div>
  );
}
