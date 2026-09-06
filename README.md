# Nexus \u2014 Social Super-App

A secure social super-app combining features of Telegram, WhatsApp, Instagram, X, Facebook, Spotify, and Snapchat with an AI Playground inspired by Google AI Studio.

## Features

### Social
- **Feed** \u2014 Scrollable social feed with posts, likes, comments
- **Stories** \u2014 Ephemeral stories with gradient backgrounds
- **Chat** \u2014 Real-time messaging with E2E encryption indicators
- **Music** \u2014 Full music player with 8 tracks, play/pause/next/prev
- **Profile** \u2014 User profile with stats and editing

### AI Playground (Google AI Studio-inspired)
- **Chat** \u2014 6 simulated Gemini models with streaming, token tracking
- **Compare** \u2014 Side-by-side dual-model comparison
- **Media** \u2014 Image generation gallery
- **Live** \u2014 Real-time voice interaction UI with waveform
- **URL Context** \u2014 AI-powered URL summarization
- **Usage** \u2014 Rate limits dashboard (RPM/TPM/RPD)

### Security & Privacy
- **E2E Encryption** \u2014 AES-GCM 256-bit via Web Crypto API
- **Biometric Auth** \u2014 WebAuthn (fingerprint/face ID)
- **OAuth** \u2014 Google, Apple, GitHub login
- **Server Mode** \u2014 Toggle between centralized and decentralized
- **Ephemeral Storage** \u2014 Auto-delete sensitive data
- **2FA** \u2014 Two-factor authentication

### Experience
- **7 App Themes** \u2014 Telegram, WhatsApp, Instagram, X, Facebook, Spotify, Snapchat + Nexus default
- **Custom Palettes** \u2014 Pick any accent color
- **Dark/Light Mode** \u2014 Full color mode switching
- **Haptic Feedback** \u2014 Vibration patterns for all interactions
- **Offline Support** \u2014 Service worker with cache strategy
- **Cross-Device Sync** \u2014 Real-time sync indicator
- **Cloud Backup** \u2014 Encrypted backup indicators
- **PWA** \u2014 Installable with app manifest and service worker

## Tech Stack
- Next.js 14 (App Router, static export)
- TypeScript
- Tailwind CSS
- Zustand with persist middleware
- Web Crypto API for encryption
- WebAuthn for biometric auth
- Service Worker for offline

## Deploy
Deployed to GitHub Pages: https://munyoro577.github.io/nexus/nexus-social-app/
