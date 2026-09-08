/**
 * Nexus Onboarding — Canonical Types & Step Definitions
 *
 * One source of truth for the onboarding flow:
 *   WELCOME → ACCOUNT → PROFILE → INTERESTS → PEOPLE → AI → PRIVACY → COMPLETE → HOME
 *
 * Back must work. Continue must work. Refresh must resume. Completion must persist.
 */

export type OnboardingStep =
  | 'welcome'
  | 'account'
  | 'profile'
  | 'interests'
  | 'people'
  | 'ai'
  | 'privacy'
  | 'complete';

export type OnboardingStatus = 'not_started' | 'in_progress' | 'completed';

export interface OnboardingData {
  account?: { username?: string; email?: string };
  profile?: { displayName?: string; bio?: string; avatar?: string };
  interests?: string[];
  people?: string[];
  ai?: { persona?: string; uiStyle?: string };
  privacy?: {
    privateAccount?: boolean;
    showOnlineStatus?: boolean;
    readReceipts?: boolean;
    personalization?: boolean;
    aiTraining?: boolean;
  };
}

export interface OnboardingStepDef {
  id: OnboardingStep;
  index: number;
  title: string;
  description: string;
  buttonText: string;
}

export const ONBOARDING_STEPS: OnboardingStepDef[] = [
  { id: 'welcome', index: 0, title: 'Welcome to Nexus', description: 'Your secure social super-app. Let\u2019s set things up.', buttonText: 'Get Started' },
  { id: 'account', index: 1, title: 'Your Account', description: 'Choose your username and confirm your details.', buttonText: 'Continue' },
  { id: 'profile', index: 2, title: 'Profile', description: 'Personalise how you appear across Nexus.', buttonText: 'Continue' },
  { id: 'interests', index: 3, title: 'Interests', description: 'Pick a few things you love to personalise your feed.', buttonText: 'Continue' },
  { id: 'people', index: 4, title: 'People to Follow', description: 'Follow some accounts to get started.', buttonText: 'Continue' },
  { id: 'ai', index: 5, title: 'AI Assistant', description: 'Choose how your AI assistant behaves.', buttonText: 'Continue' },
  { id: 'privacy', index: 6, title: 'Privacy', description: 'Control your data and visibility.', buttonText: 'Finish' },
  { id: 'complete', index: 7, title: 'All Set!', description: 'You\u2019re ready to go. Welcome to Nexus.', buttonText: 'Enter Nexus' },
];

export const TOTAL_ONBOARDING_STEPS = ONBOARDING_STEPS.length - 1;

export function getStepDef(step: OnboardingStep): OnboardingStepDef {
  return ONBOARDING_STEPS.find((s) => s.id === step) || ONBOARDING_STEPS[0];
}

export function getNextStep(step: OnboardingStep): OnboardingStep | null {
  const idx = ONBOARDING_STEPS.findIndex((s) => s.id === step);
  if (idx < 0 || idx >= ONBOARDING_STEPS.length - 1) return null;
  return ONBOARDING_STEPS[idx + 1].id;
}

export function getPrevStep(step: OnboardingStep): OnboardingStep | null {
  const idx = ONBOARDING_STEPS.findIndex((s) => s.id === step);
  if (idx <= 0) return null;
  return ONBOARDING_STEPS[idx - 1].id;
}

export function isLastStepBeforeComplete(step: OnboardingStep): boolean {
  return step === 'privacy';
}

export function getStepNumber(step: OnboardingStep): number {
  return getStepDef(step).index + 1;
}
