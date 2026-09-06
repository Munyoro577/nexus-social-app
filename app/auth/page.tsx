'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { simulateOAuth, registerBiometric, isBiometricAvailable, createSession, storeAuth } from '@/lib/auth';
import { haptic } from '@/lib/haptics';

export default function AuthPage() {
  const router = useRouter();
  const setAuthUser = useStore((s) => s.setAuthUser);
  const setBiometricEnabled = useStore((s) => s.setBiometricEnabled);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [biometricAvail, setBiometricAvail] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    isBiometricAvailable().then(setBiometricAvail);
  }, []);

  const handleOAuth = (provider: 'google' | 'apple' | 'github') => {
    haptic('medium');
    setLoading(true);
    setTimeout(() => {
      const user = simulateOAuth(provider);
      storeAuth(user);
      setAuthUser(user);
      haptic('success');
      router.push('/');
    }, 800);
  };

  const handleEmail = () => {
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      haptic('error');
      return;
    }
    haptic('medium');
    setLoading(true);
    setTimeout(() => {
      const user = createSession('email', name || email.split('@')[0], email, '&#9993;');
      storeAuth(user);
      setAuthUser(user);
      haptic('success');
      router.push('/');
    }, 800);
  };

  const handleBiometric = async () => {
    haptic('medium');
    setLoading(true);
    const success = await registerBiometric();
    if (success) {
      setBiometricEnabled(true);
      const user = createSession('biometric', 'Nexus User', 'user@nexus.app', '&#128274;');
      storeAuth(user);
      setAuthUser(user);
      haptic('success');
      router.push('/');
    } else {
      setError('Biometric authentication failed');
      haptic('error');
      setLoading(false);
    }
  };

  const handleGuest = () => {
    haptic('light');
    const user = createSession('biometric', 'Guest User', 'guest@nexus.app', '&#129399;');
    user.verified = false;
    storeAuth(user);
    setAuthUser(user);
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">&#10024;</div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>Nexus</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Secure social super-app</p>
        </div>

        {/* Security indicators */}
        <div className="flex items-center justify-center gap-3 mb-6 text-[10px]" style={{ color: 'var(--muted)' }}>
          <span>&#128274; E2E Encrypted</span>
          <span>&#149;</span>
          <span>&#128737; Biometric Ready</span>
          <span>&#149;</span>
          <span>&#9729; Cloud Sync</span>
        </div>

        {/* OAuth buttons */}
        <div className="space-y-2.5 mb-4">
          <button
            onClick={() => handleOAuth('google')}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl font-medium text-sm transition-all disabled:opacity-50"
            style={{ background: 'var(--card)', color: 'var(--text)', border: '1px solid var(--border)' }}
          >
            <span className="text-lg">&#128308;</span> Continue with Google
          </button>
          <button
            onClick={() => handleOAuth('apple')}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl font-medium text-sm transition-all disabled:opacity-50"
            style={{ background: 'var(--card)', color: 'var(--text)', border: '1px solid var(--border)' }}
          >
            <span className="text-lg">&#9899;</span> Continue with Apple
          </button>
          <button
            onClick={() => handleOAuth('github')}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl font-medium text-sm transition-all disabled:opacity-50"
            style={{ background: 'var(--card)', color: 'var(--text)', border: '1px solid var(--border)' }}
          >
            <span className="text-lg">&#128054;</span> Continue with GitHub
          </button>
        </div>

        {/* Biometric */}
        {biometricAvail && (
          <>
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
              <span className="text-xs" style={{ color: 'var(--muted)' }}>or</span>
              <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            </div>
            <button
              onClick={handleBiometric}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all disabled:opacity-50"
              style={{ background: 'var(--gradient)', color: '#fff' }}
            >
              <span className="text-lg">&#128274;</span> Biometric Login
            </button>
          </>
        )}

        {/* Email/Password */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          <span className="text-xs" style={{ color: 'var(--muted)' }}>or {mode === 'login' ? 'sign in' : 'register'} with email</span>
          <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        </div>

        <div className="space-y-2.5">
          {mode === 'register' && (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: 'var(--card)', color: 'var(--text)', border: '1px solid var(--border)' }}
            />
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: 'var(--card)', color: 'var(--text)', border: '1px solid var(--border)' }}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleEmail()}
            placeholder="Password"
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: 'var(--card)', color: 'var(--text)', border: '1px solid var(--border)' }}
          />
          {error && <p className="text-xs text-red-500 px-1">{error}</p>}
          <button
            onClick={handleEmail}
            disabled={loading}
            className="w-full py-3 rounded-xl font-medium text-sm transition-all disabled:opacity-50"
            style={{ background: 'var(--gradient)', color: '#fff' }}
          >
            {loading ? '...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </div>

        <div className="flex items-center justify-between mt-4 text-xs">
          <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} style={{ color: 'var(--accent)' }}>
            {mode === 'login' ? 'Need an account? Register' : 'Have an account? Sign in'}
          </button>
          <button onClick={handleGuest} style={{ color: 'var(--muted)' }}>Skip for now</button>
        </div>
      </div>
    </div>
  );
}
