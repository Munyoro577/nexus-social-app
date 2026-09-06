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
}();