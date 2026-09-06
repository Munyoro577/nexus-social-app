/**
 * Nexus Theme System
 * 7 app-inspired themes + Nexus default + custom palette support.
 * Each theme defines CSS variables for both dark and light modes.
 */

export type ThemeId = 'nexus' | 'telegram' | 'whatsapp' | 'instagram' | 'x' | 'facebook' | 'spotify' | 'snapchat' | 'custom';
export type ColorMode = 'dark' | 'light';

export interface ThemePalette {
  id: ThemeId;
  name: string;
  icon: string;
  description: string;
  dark: Record<string, string>;
  light: Record<string, string>;
}

export const THEMES: ThemePalette[] = [
  {
    id: 'nexus',
    name: 'Nexus',
    icon: '✨',
    description: 'Default — indigo/purple gradient',
    dark: {
      '--bg': '#0a0a0f', '--surface': '#13131a', '--card': '#1a1a24',
      '--border': 'rgba(255,255,255,0.06)', '--text': '#e4e4e7', '--muted': '#71717a',
      '--accent': '#6366f1', '--accent-2': '#8b5cf6', '--accent-3': '#ec4899',
      '--gradient': 'linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)',
    },
    light: {
      '--bg': '#ffffff', '--surface': '#f4f4f5', '--card': '#ffffff',
      '--border': 'rgba(0,0,0,0.08)', '--text': '#18181b', '--muted': '#71717a',
      '--accent': '#6366f1', '--accent-2': '#8b5cf6', '--accent-3': '#ec4899',
      '--gradient': 'linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)',
    },
  },
  {
    id: 'telegram',
    name: 'Telegram',
    icon: '✈️',
    description: 'Clean blue messaging',
    dark: {
      '--bg': '#0e1621', '--surface': '#17212b', '--card': '#1c2733',
      '--border': 'rgba(255,255,255,0.05)', '--text': '#ffffff', '--muted': '#7d8c99',
      '--accent': '#2ea6ff', '--accent-2': '#2ea6ff', '--accent-3': '#2ea6ff',
      '--gradient': 'linear-gradient(135deg, #2ea6ff, #0088cc)',
    },
    light: {
      '--bg': '#ffffff', '--surface': '#f0f2f5', '--card': '#ffffff',
      '--border': 'rgba(0,0,0,0.08)', '--text': '#000000', '--muted': '#707579',
      '--accent': '#3390ec', '--accent-2': '#3390ec', '--accent-3': '#3390ec',
      '--gradient': 'linear-gradient(135deg, #3390ec, #0088cc)',
    },
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: '💬',
    description: 'Warm green chat',
    dark: {
      '--bg': '#0b141a', '--surface': '#111b21', '--card': '#1f2c34',
      '--border': 'rgba(255,255,255,0.04)', '--text': '#e9edef', '--muted': '#8696a0',
      '--accent': '#00a884', '--accent-2': '#06cf9c', '--accent-3': '#00a884',
      '--gradient': 'linear-gradient(135deg, #00a884, #06cf9c)',
    },
    light: {
      '--bg': '#ffffff', '--surface': '#f0f2f5', '--card': '#ffffff',
      '--border': 'rgba(0,0,0,0.08)', '--text': '#111b21', '--muted': '#667781',
      '--accent': '#00a884', '--accent-2': '#06cf9c', '--accent-3': '#00a884',
      '--gradient': 'linear-gradient(135deg, #00a884, #06cf9c)',
    },
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: '📸',
    description: 'Vibrant gradient social',
    dark: {
      '--bg': '#000000', '--surface': '#0a0a0a', '--card': '#121212',
      '--border': 'rgba(255,255,255,0.08)', '--text': '#ffffff', '--muted': '#737373',
      '--accent': '#e1306c', '--accent-2': '#f77737', '--accent-3': '#fd1d1d',
      '--gradient': 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
    },
    light: {
      '--bg': '#fafafa', '--surface': '#ffffff', '--card': '#ffffff',
      '--border': 'rgba(0,0,0,0.1)', '--text': '#000000', '--muted': '#737373',
      '--accent': '#e1306c', '--accent-2': '#f77737', '--accent-3': '#fd1d1d',
      '--gradient': 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
    },
  },
  {
    id: 'x',
    name: 'X (Twitter)',
    icon: '🐦',
    description: 'Minimal black & white',
    dark: {
      '--bg': '#000000', '--surface': '#16181c', '--card': '#1d1f23',
      '--border': 'rgba(255,255,255,0.08)', '--text': '#e7e9ea', '--muted': '#71767b',
      '--accent': '#1d9bf0', '--accent-2': '#1d9bf0', '--accent-3': '#1d9bf0',
      '--gradient': 'linear-gradient(135deg, #1d9bf0, #0c7abf)',
    },
    light: {
      '--bg': '#ffffff', '--surface': '#f7f9f9', '--card': '#ffffff',
      '--border': 'rgba(0,0,0,0.1)', '--text': '#0f1419', '--muted': '#536471',
      '--accent': '#1d9bf0', '--accent-2': '#1d9bf0', '--accent-3': '#1d9bf0',
      '--gradient': 'linear-gradient(135deg, #1d9bf0, #0c7abf)',
    },
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: '👤',
    description: 'Classic blue social',
    dark: {
      '--bg': '#18191a', '--surface': '#242526', '--card': '#3a3b3c',
      '--border': 'rgba(255,255,255,0.08)', '--text': '#e4e6eb', '--muted': '#b0b3b8',
      '--accent': '#1877f2', '--accent-2': '#1877f2', '--accent-3': '#1877f2',
      '--gradient': 'linear-gradient(135deg, #1877f2, #0a5dc7)',
    },
    light: {
      '--bg': '#f0f2f5', '--surface': '#ffffff', '--card': '#ffffff',
      '--border': 'rgba(0,0,0,0.1)', '--text': '#050505', '--muted': '#65676b',
      '--accent': '#1877f2', '--accent-2': '#1877f2', '--accent-3': '#1877f2',
      '--gradient': 'linear-gradient(135deg, #1877f2, #0a5dc7)',
    },
  },
  {
    id: 'spotify',
    name: 'Spotify',
    icon: '🎵',
    description: 'Dark green music',
    dark: {
      '--bg': '#121212', '--surface': '#181818', '--card': '#282828',
      '--border': 'rgba(255,255,255,0.06)', '--text': '#ffffff', '--muted': '#a7a7a7',
      '--accent': '#1db954', '--accent-2': '#1ed760', '--accent-3': '#1db954',
      '--gradient': 'linear-gradient(135deg, #1db954, #1ed760)',
    },
    light: {
      '--bg': '#ffffff', '--surface': '#f5f5f5', '--card': '#ffffff',
      '--border': 'rgba(0,0,0,0.08)', '--text': '#000000', '--muted': '#6a6a6a',
      '--accent': '#1db954', '--accent-2': '#1ed760', '--accent-3': '#1db954',
      '--gradient': 'linear-gradient(135deg, #1db954, #1ed760)',
    },
  },
  {
    id: 'snapchat',
    name: 'Snapchat',
    icon: '👻',
    description: 'Bright yellow ghost',
    dark: {
      '--bg': '#1a1a1a', '--surface': '#262626', '--card': '#333333',
      '--border': 'rgba(255,255,255,0.08)', '--text': '#ffffff', '--muted': '#999999',
      '--accent': '#fffc00', '--accent-2': '#fffc00', '--accent-3': '#fffc00',
      '--gradient': 'linear-gradient(135deg, #fffc00, #ffe600)',
    },
    light: {
      '--bg': '#ffffff', '--surface': '#f8f8f8', '--card': '#ffffff',
      '--border': 'rgba(0,0,0,0.08)', '--text': '#000000', '--muted': '#666666',
      '--accent': '#fffc00', '--accent-2': '#fffc00', '--accent-3': '#fffc00',
      '--gradient': 'linear-gradient(135deg, #fffc00, #ffe600)',
    },
  },
];

export function getTheme(id: ThemeId): ThemePalette {
  return THEMES.find(t => t.id === id) || THEMES[0];
}

export function applyTheme(themeId: ThemeId, colorMode: ColorMode, customPalette?: Record<string, string>) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  if (themeId === 'custom' && customPalette) {
    Object.entries(customPalette).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    root.setAttribute('data-theme', 'custom');
    root.setAttribute('data-color-mode', colorMode);
    return;
  }

  const theme = getTheme(themeId);
  const vars = colorMode === 'dark' ? theme.dark : theme.light;

  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });

  root.setAttribute('data-theme', themeId);
  root.setAttribute('data-color-mode', colorMode);
}
