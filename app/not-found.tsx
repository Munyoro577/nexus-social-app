'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <div className="text-6xl mb-4">🌌</div>
      <h1 className="text-2xl font-bold gradient-text mb-2">Lost in the Nexus</h1>
      <p className="text-nexus-muted text-sm mb-6">This page doesn't exist yet.</p>
      <Link href="/" className="px-6 py-2.5 rounded-full gradient-bg text-white font-medium text-sm">
        Back to Feed
      </Link>
    </div>
  );
}
