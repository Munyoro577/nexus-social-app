'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { haptic } from '@/lib/haptics';

function StoryViewer() {
  const searchParams = useSearchParams();
  const stories = useStore((s) => s.stories);
  const markStoryViewed = useStore((s) => s.markStoryViewed);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (stories[idx]) {
      markStoryViewed(stories[idx].id);
    }
  }, [idx, stories]);

  const next = () => { haptic('light'); setIdx((i) => (i + 1) % stories.length); };
  const prev = () => { haptic('light'); setIdx((i) => (i - 1 + stories.length) % stories.length); };

  if (!stories.length) return <div className="flex items-center justify-center min-h-screen" style={{ color: 'var(--muted)' }}>No stories</div>;
  const story = stories[idx];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      <div className="flex gap-1 p-2" style={{ marginTop: 'env(safe-area-inset-top)' }}>
        {stories.map((_, i) => (
          <div key={i} className="flex-1 h-0.5 rounded-full" style={{ background: i <= idx ? 'var(--accent)' : 'var(--border)' }} />
        ))}
      </div>
      <div className="flex-1 flex items-center justify-center relative" onClick={next}>
        <div className="absolute inset-0 flex items-center justify-center" style={{ background: story.bgColor }}>
          <div className="text-center">
            <div className="text-6xl mb-4">{story.userAvatar}</div>
            <div className="text-xl font-bold text-white">{story.userName}</div>
            <div className="text-lg text-white/80 mt-2">{story.content}</div>
          </div>
        </div>
        <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-0 top-0 bottom-0 w-1/3" />
        <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-0 top-0 bottom-0 w-1/3" />
      </div>
    </div>
  );
}

export default function StoryViewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: 'var(--bg)' }} />}>
      <StoryViewer />
    </Suspense>
  );
}
