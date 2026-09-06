'use client';

import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { applyTheme } from '@/lib/themes';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const themeId = useStore((s) => s.themeId);
  const colorMode = useStore((s) => s.colorMode);
  const customPalette = useStore((s) => s.customPalette);

  useEffect(() => {
    applyTheme(themeId, colorMode, customPalette);
  }, [themeId, colorMode, customPalette]);

  return <>{children}</>;
}
