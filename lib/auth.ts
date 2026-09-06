/**
 * Nexus Authentication Layer
 * OAuth providers + biometric + email/password.
 * Session management with secure token storage.
 */

export type AuthMethod = 'oauth-google' | 'oauth-apple' | 'oauth-github' | 'biometric' | 'email' | 'guest';
export type AuthProvider = 'google' | 'apple' | 'github' | 'biometric' | 'email';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar: string;
  provider: AuthProvider;
  verified: boolean;
  token: string;
  expiresAt: number;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  method: AuthMethod | null;
  biometricEnabled: boolean;
  twoFactorEnabled: boolean;
  sessionTimeout: number; // minutes
}

const SESSION_KEY = 'nexus-auth-session';

export function getStoredAuth(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(SESSION_KEY);
  if (!stored) return null;

  try {
    const user: AuthUser = JSON.parse(stored);
    if (user.expiresAt < Date.now()) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return user;
  } catch {
    return null;
  }
}

export function storeAuth(user: AuthUser): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function clearAuth(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_KEY);
}

export function createSession(provider: AuthProvider, name: string, email: string, avatar: string): AuthUser {
  return {
    id: `user-${Date.now()}`,
    email,
    name,
    avatar,
    provider,
    verified: provider !== 'guest',
    token: btoa(`${provider}-${Date.now()}-${Math.random().toString(36).slice(2)}`),
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
  };
}

// Biometric authentication using WebAuthn
export async function isBiometricAvailable(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  if (!window.PublicKeyCredential) return false;
  try {
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch {
    return false;
  }
}

export async function registerBiometric(): Promise<boolean> {
  if (typeof window === 'undefined' || !window.PublicKeyCredential) return false;
  try {
    const challenge = crypto.getRandomValues(new Uint8Array(32));
    const userId = crypto.getRandomValues(new Uint8Array(16));

    const credential = await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: { name: 'Nexus' },
        user: { id: userId, name: 'Nexus User', displayName: 'Nexus User' },
        pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
        authenticatorSelection: { userVerification: 'required', authenticatorAttachment: 'platform' },
        timeout: 60000,
      },
    } as PublicKeyCredentialCreationOptions);
    return !!credential;
  } catch {
    return false;
  }
}

export async function verifyBiometric(): Promise<boolean> {
  if (typeof window === 'undefined' || !window.PublicKeyCredential) return false;
  try {
    const challenge = crypto.getRandomValues(new Uint8Array(32));
    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge,
        timeout: 60000,
        userVerification: 'required',
      },
    } as PublicKeyCredentialRequestOptions);
    return !!assertion;
  } catch {
    return false;
  }
}

// OAuth redirect URLs (simulated)
export const OAUTH_CONFIG = {
  google: { name: 'Google', icon: '🔵', color: '#4285f4' },
  apple: { name: 'Apple', icon: '⚫', color: '#000000' },
  github: { name: 'GitHub', icon: '🐙', color: '#333333' },
};

export function simulateOAuth(provider: AuthProvider): AuthUser {
  const names: Record<string, { name: string; email: string; avatar: string }> = {
    google: { name: 'Google User', email: 'user@gmail.com', avatar: '🔵' },
    apple: { name: 'Apple User', email: 'user@icloud.com', avatar: '⚫' },
    github: { name: 'GitHub User', email: 'user@github.com', avatar: '🐙' },
  };
  const info = names[provider] || names.google;
  return createSession(provider, info.name, info.email, info.avatar);
}
