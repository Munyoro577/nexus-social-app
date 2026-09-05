# Nexus — Social Super-App

> A social super-app combining features of X, Facebook, Instagram, WhatsApp, Spotify, Telegram, and Snapchat.

Built with Next.js 14, TypeScript, Tailwind CSS, and Zustand. Deployed on Cloudflare Pages.

## Features

### Feed (X / Facebook style)
- Create posts with text
- Like and comment on posts
- Scroll through a social feed
- Real-time interaction states

### Stories (Instagram / Snapchat style)
- Create stories with gradient backgrounds
- Auto-advancing story viewer with progress bars
- Story rings showing viewed/unviewed status
- Reply to stories

### Chat (WhatsApp / Telegram style)
- Contact list with online status
- Real-time messaging with auto-replies
- Unread badges
- Message timestamps
- Search chats

### Music (Spotify style)
- Full playlist with 8 tracks
- Play / pause / next / previous controls
- Progress bar with time tracking
- Now playing card with animated cover art
- Mini player accessible from any page

### Profile (Instagram style)
- User stats (posts, followers, following)
- Edit profile (name, username, bio)
- Post grid view
- Tab navigation

## Tech Stack

- **Framework**: Next.js 14 (App Router, static export)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom glassmorphism design
- **State**: Zustand with localStorage persistence
- **PWA**: Installable with offline support
- **Deployment**: Cloudflare Pages

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Build

```bash
npm run build
```

Outputs static files to `out/` directory.

## Deploy

Push to GitHub and connect to Cloudflare Pages. The app is configured for static export with `output: 'export'`.

## Design

- Dark glassmorphism UI with gradient accents (indigo, purple, pink)
- Mobile-first, max-width 480px container
- Bottom navigation bar with 5 tabs
- Smooth animations and transitions
- PWA installable on mobile devices

## Project Structure

```
nexus-social-app/
- app/ (layout, pages, globals.css)
- components/ (Layout, TopBar, BottomNav, CreatePost, PostCard)
- store/ (Zustand store with all state)
- lib/ (utility functions)
- public/ (manifest, sw, icons, robots)
```

## License

MIT
