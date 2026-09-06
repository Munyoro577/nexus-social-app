/**
 * Nexus Haptic Feedback System
 * Uses navigator.vibrate with fallback for unsupported devices.
 */

type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'warning' | 'selection' | 'impact';

const PATTERNS: Record<HapticPattern, number | number[]> = {
  light: 10,
  medium: 20,
  heavy: 40,
  success: [10, 30, 10],
  error: [40, 20, 40],
  warning: [20, 10, 20],
  selection: 5,
  impact: 30,
};

let hapticsEnabled = true;

export function setHapticsEnabled(enabled: boolean) {
  hapticsEnabled = enabled;
}

export function isHapticsEnabled(): boolean {
  return hapticsEnabled;
}

export function haptic(pattern: HapticPattern = 'light') {
  if (!hapticsEnabled) return;
  if (typeof navigator === 'undefined' || !navigator.vibrate) return;
  navigator.vibrate(PATTERNS[pattern]);
}

export class HapticButton {
  static onTap() { haptic('light'); }
  static onPress() { haptic('medium'); }
  static onLongPress() { haptic('heavy'); }
  static onSuccess() { haptic('success'); }
  static onError() { haptic('error'); }
  static onSelect() { haptic('selection'); }
  static onToggle() { haptic('impact'); }
}
