'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { THEMES, ThemeId, ColorMode } from '@/lib/themes';
import { haptic } from '@/lib/haptics';
import { clearAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import SecurityBadge from '@/components/SecurityBadge';

type Section = 'appearance' | 'security' | 'ai' | 'account' | 'sync' | 'experience';

export default function SettingsPage() {
  const store = useStore();
  const router = useRouter();
  const [section, setSection] = useState<Section>('appearance');

  const sections: { id: Section; label: string; icon: string }[] = [
    { id: 'appearance', label: 'Appearance', icon: '&#127912;' },
    { id: 'security', label: 'Security & Privacy', icon: '&#128274;' },
    { id: 'ai', label: 'AI Persona', icon: '&#129504;' },
    { id: 'account', label: 'Account & Auth', icon: '&#128100;' },
    { id: 'sync', label: 'Sync & Backup', icon: '&#9729;' },
    { id: 'experience', label: 'Experience', icon: '&#9889;' },
  ];

  const handleLogout = () => {
    haptic('warning');
    clearAuth();
    store.setAuthUser(null);
    router.push('/auth');
  };

  return (
    <div className="min-h-screen pb-20" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      {/* Header */}
      <div className="glass sticky top-0 z-30 border-b" style={{ borderColor: 'var(--border)', background: 'rgba(10,10,15,0.8)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold">Settings</h1>
          <SecurityBadge />
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4 flex gap-4">
        {/* Sidebar */}
        <div className="w-32 space-y-1 sticky top-16 self-start">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => { haptic('selection'); setSection(s.id); }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                section === s.id ? 'bg-[var(--accent)] text-white' : ''
              }`}
              style={section === s.id ? {} : { color: 'var(--muted)' }}
            >
              <span dangerouslySetInnerHTML={{ __html: s.icon }} />
              <span className="truncate">{s.label}</span>
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-red-500 mt-4"
          >
            <span>&#8634;</span> Log out
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {section === 'appearance' && <AppearanceSection />}
          {section === 'security' && <SecuritySection />}
          {section === 'ai' && <AIPersonaSection />}
          {section === 'account' && <AccountSection />}
          {section === 'sync' && <SyncSection />}
          {section === 'experience' && <ExperienceSection />}
        </div>
      </div>
    </div>
  );
}

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <div className="flex-1 min-w-0 mr-3">
        <div className="text-sm font-medium">{label}</div>
        {description && <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{description}</div>}
      </div>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={() => { haptic('impact'); onChange(); }}
      className="relative w-11 h-6 rounded-full transition-all"
      style={{ background: checked ? 'var(--accent)' : 'var(--border)' }}
    >
      <div
        className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all"
        style={{ left: checked ? '22px' : '2px' }}
      />
    </button>
  );
}

function AppearanceSection() {
  const store = useStore();
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-bold uppercase" style={{ color: 'var(--muted)' }}>Theme</h2>
      <div className="grid grid-cols-2 gap-2">
        {THEMES.map((t) => (
          <button
            key={t.id}
            onClick={() => { haptic('selection'); store.setThemeId(t.id); }}
            className={`p-3 rounded-xl text-left transition-all ${store.themeId === t.id ? 'ring-2' : ''}`}
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              '--tw-ring-color': 'var(--accent)',
            } as React.CSSProperties}
          >
            <div className="text-2xl mb-1">{t.icon}</div>
            <div className="text-sm font-medium">{t.name}</div>
            <div className="text-[10px]" style={{ color: 'var(--muted)' }}>{t.description}</div>
          </button>
        ))}
      </div>

      <h2 className="text-sm font-bold uppercase mt-4" style={{ color: 'var(--muted)' }}>Color Mode</h2>
      <div className="grid grid-cols-2 gap-2">
        {(['dark', 'light'] as ColorMode[]).map((m) => (
          <button
            key={m}
            onClick={() => { haptic('selection'); store.setColorMode(m); }}
            className={`p-3 rounded-xl text-sm font-medium capitalize transition-all ${store.colorMode === m ? 'ring-2' : ''}`}
            style={{ background: 'var(--card)', border: '1px solid var(--border)', '--tw-ring-color': 'var(--accent)' } as React.CSSProperties}
          >
            {m === 'dark' ? '&#127769; Dark' : '&#9728; Light'}
          </button>
        ))}
      </div>

      <h2 className="text-sm font-bold uppercase mt-4" style={{ color: 'var(--muted)' }}>Custom Palette</h2>
      <div className="space-y-2">
        <input
          type="color"
          value={store.customPalette?.['--accent'] || '#6366f1'}
          onChange={(e) => {
            const palette = { ...store.customPalette, '--accent': e.target.value, '--gradient': `linear-gradient(135deg, ${e.target.value}, ${e.target.value})` };
            store.setCustomPalette(palette);
            store.setThemeId('custom');
          }}
          className="w-full h-10 rounded-xl cursor-pointer"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
        />
        <p className="text-xs" style={{ color: 'var(--muted)' }}>Pick any accent color to create your own theme</p>
      </div>
    </div>
  );
}

function SecuritySection() {
  const store = useStore();
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-bold uppercase" style={{ color: 'var(--muted)' }}>Server Architecture</h2>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => { haptic('impact'); store.setServerMode('centralized'); }}
          className={`p-3 rounded-xl text-left transition-all ${store.serverMode === 'centralized' ? 'ring-2' : ''}`}
          style={{ background: 'var(--card)', border: '1px solid var(--border)', '--tw-ring-color': 'var(--accent)' } as React.CSSProperties}
        >
          <div className="text-sm font-medium">&#9729; Centralized</div>
          <div className="text-[10px] mt-0.5" style={{ color: 'var(--muted)' }}>Cloud servers, faster sync</div>
        </button>
        <button
          onClick={() => { haptic('impact'); store.setServerMode('decentralized'); }}
          className={`p-3 rounded-xl text-left transition-all ${store.serverMode === 'decentralized' ? 'ring-2' : ''}`}
          style={{ background: 'var(--card)', border: '1px solid var(--border)', '--tw-ring-color': 'var(--accent)' } as React.CSSProperties}
        >
          <div className="text-sm font-medium">&#128260; Decentralized</div>
          <div className="text-[10px] mt-0.5" style={{ color: 'var(--muted)' }}>P2P, maximum privacy</div>
        </button>
      </div>

      <h2 className="text-sm font-bold uppercase mt-4" style={{ color: 'var(--muted)' }}>Encryption</h2>
      <SettingRow label="End-to-End Encryption" description="AES-GCM 256-bit encryption for all messages and media">
        <Toggle checked={store.e2eEncryption} onChange={() => store.setE2eEncryption(!store.e2eEncryption)} />
      </SettingRow>
      <SettingRow label="Ephemeral Storage" description="Auto-delete sensitive data after 24h">
        <Toggle checked={store.ephemeralStorage} onChange={() => store.setEphemeralStorage(!store.ephemeralStorage)} />
      </SettingRow>

      <h2 className="text-sm font-bold uppercase mt-4" style={{ color: 'var(--muted)' }}>Authentication</h2>
      <SettingRow label="Biometric Login" description="Fingerprint / Face ID for app access">
        <Toggle checked={store.biometricEnabled} onChange={() => store.setBiometricEnabled(!store.biometricEnabled)} />
      </SettingRow>
      <SettingRow label="Two-Factor Authentication" description="Extra code via email on new devices">
        <Toggle checked={store.twoFactorEnabled} onChange={() => store.setTwoFactorEnabled(!store.twoFactorEnabled)} />
      </SettingRow>

      <h2 className="text-sm font-bold uppercase mt-4" style={{ color: 'var(--muted)' }}>Privacy</h2>
      <SettingRow label="Read Receipts" description="Show others when you read messages">
        <Toggle checked={store.readReceipts} onChange={() => store.setReadReceipts(!store.readReceipts)} />
      </SettingRow>
      <SettingRow label="Online Status" description="Show when you're active">
        <Toggle checked={store.onlineStatus} onChange={() => store.setOnlineStatus(!store.onlineStatus)} />
      </SettingRow>
    </div>
  );
}

function AIPersonaSection() {
  const store = useStore();
  const personas = [
    { id: 'professional', name: 'Professional', icon: '&#128188;', desc: 'Formal, precise, business-focused' },
    { id: 'friendly', name: 'Friendly', icon: '&#128522;', desc: 'Warm, casual, supportive' },
    { id: 'creative', name: 'Creative', icon: '&#127912;', desc: 'Imaginative, playful, expressive' },
    { id: 'concise', name: 'Concise', icon: '&#9889;', desc: 'Brief, direct, efficient' },
    { id: 'academic', name: 'Academic', icon: '&#128218;', desc: 'Scholarly, detailed, cited' },
    { id: 'witty', name: 'Witty', icon: '&#128526;', desc: 'Clever, humorous, sharp' },
  ];

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-bold uppercase" style={{ color: 'var(--muted)' }}>AI Persona</h2>
      <p className="text-xs" style={{ color: 'var(--muted)' }}>Choose how the AI communicates with you</p>
      <div className="space-y-2">
        {personas.map((p) => (
          <button
            key={p.id}
            onClick={() => { haptic('selection'); store.setAiPersona(p.id); }}
            className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${store.aiPersona === p.id ? 'ring-2' : ''}`}
            style={{ background: 'var(--card)', border: '1px solid var(--border)', '--tw-ring-color': 'var(--accent)' } as React.CSSProperties}
          >
            <span className="text-2xl" dangerouslySetInnerHTML={{ __html: p.icon }} />
            <div className="flex-1">
              <div className="text-sm font-medium">{p.name}</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>{p.desc}</div>
            </div>
            {store.aiPersona === p.id && <span style={{ color: 'var(--accent)' }}>&#10003;</span>}
          </button>
        ))}
      </div>

      <h2 className="text-sm font-bold uppercase mt-4" style={{ color: 'var(--muted)' }}>AI UI Theme</h2>
      <p className="text-xs" style={{ color: 'var(--muted)' }}>Switch between different AI interface styles</p>
      <div className="grid grid-cols-2 gap-2">
        {[
          { id: 'studio', name: 'AI Studio', icon: '&#10024;' },
          { id: 'terminal', name: 'Terminal', icon: '&#128187;' },
          { id: 'chat', name: 'Chat', icon: '&#128172;' },
          { id: 'minimal', name: 'Minimal', icon: '&#11044;' },
        ].map((ui) => (
          <button
            key={ui.id}
            onClick={() => { haptic('selection'); store.setAiUiStyle(ui.id); }}
            className={`p-3 rounded-xl text-center transition-all ${store.aiUiStyle === ui.id ? 'ring-2' : ''}`}
            style={{ background: 'var(--card)', border: '1px solid var(--border)', '--tw-ring-color': 'var(--accent)' } as React.CSSProperties}
          >
            <div className="text-2xl mb-1" dangerouslySetInnerHTML={{ __html: ui.icon }} />
            <div className="text-xs font-medium">{ui.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function AccountSection() {
  const store = useStore();
  const user = store.authUser;
  if (!user) return <div className="text-sm" style={{ color: 'var(--muted)' }}>Not logged in</div>;
  return (
    <div className="space-y-3">
      <div className="p-4 rounded-xl text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="text-4xl mb-2">{user.avatar}</div>
        <div className="text-lg font-bold">{user.name}</div>
        <div className="text-sm" style={{ color: 'var(--muted)' }}>{user.email}</div>
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--accent)', color: '#fff' }}>
            {user.provider}
          </span>
          {user.verified && <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-500">&#10003; Verified</span>}
        </div>
      </div>
      <SettingRow label="Connected Accounts" description="Google, Apple, GitHub">
        <span className="text-xs" style={{ color: 'var(--muted)' }}>{user.provider}</span>
      </SettingRow>
      <SettingRow label="Session Timeout" description="Auto-logout after inactivity">
        <span className="text-xs" style={{ color: 'var(--muted)' }}>30 days</span>
      </SettingRow>
      <SettingRow label="Data Export" description="Download all your data">
        <button className="text-xs px-2 py-1 rounded-lg" style={{ background: 'var(--accent)', color: '#fff' }}>Export</button>
      </SettingRow>
    </div>
  );
}

function SyncSection() {
  const store = useStore();
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-bold uppercase" style={{ color: 'var(--muted)' }}>Device Sync</h2>
      <SettingRow label="Cross-Device Sync" description="Sync data across all devices in real-time">
        <Toggle checked={store.syncEnabled} onChange={() => store.setSyncEnabled(!store.syncEnabled)} />
      </SettingRow>
      <SettingRow label="Offline Mode" description="Access data without network">
        <Toggle checked={store.offlineMode} onChange={() => store.setOfflineMode(!store.offlineMode)} />
      </SettingRow>

      <h2 className="text-sm font-bold uppercase mt-4" style={{ color: 'var(--muted)' }}>Cloud Backup</h2>
      <SettingRow label="Auto Backup" description="Real-time encrypted backups to cloud">
        <Toggle checked={store.cloudBackup} onChange={() => store.setCloudBackup(!store.cloudBackup)} />
      </SettingRow>
      <SettingRow label="Backup Encryption" description="Encrypt all backup data with AES-256">
        <Toggle checked={store.backupEncryption} onChange={() => store.setBackupEncryption(!store.backupEncryption)} />
      </SettingRow>
      <SettingRow label="Backup Frequency" description="How often to backup">
        <span className="text-xs" style={{ color: 'var(--muted)' }}>Real-time</span>
      </SettingRow>

      <div className="p-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="text-xs" style={{ color: 'var(--muted)' }}>Last backup</div>
        <div className="text-sm font-medium mt-0.5">Just now &#10003;</div>
      </div>
    </div>
  );
}

function ExperienceSection() {
  const store = useStore();
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-bold uppercase" style={{ color: 'var(--muted)' }}>Haptics & Feedback</h2>
      <SettingRow label="Haptic Feedback" description="Vibration on tap, swipe, and actions">
        <Toggle checked={store.hapticsEnabled} onChange={() => store.setHapticsEnabled(!store.hapticsEnabled)} />
      </SettingRow>
      <SettingRow label="Sound Effects" description="Subtle UI sounds">
        <Toggle checked={store.soundEnabled} onChange={() => store.setSoundEnabled(!store.soundEnabled)} />
      </SettingRow>
      <SettingRow label="Animations" description="Smooth transitions and motion">
        <Toggle checked={store.animationsEnabled} onChange={() => store.setAnimationsEnabled(!store.animationsEnabled)} />
      </SettingRow>

      <h2 className="text-sm font-bold uppercase mt-4" style={{ color: 'var(--muted)' }}>Performance</h2>
      <SettingRow label="Reduced Motion" description="Minimize animations for performance">
        <Toggle checked={store.reducedMotion} onChange={() => store.setReducedMotion(!store.reducedMotion)} />
      </SettingRow>
      <SettingRow label="Data Saver" description="Reduce image quality to save data">
        <Toggle checked={store.dataSaver} onChange={() => store.setDataSaver(!store.dataSaver)} />
      </SettingRow>
    </div>
  );
}
