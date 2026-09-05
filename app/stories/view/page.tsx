'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { Suspense } from 'react';

function StoryViewerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { stories, markStoryViewed } = useStore();
  const startIdx = parseInt(searchParams.get('start') || '0', 10);
  const [currentIdx, setCurrentIdx] = useState(Math.min(startIdx, stories.length - 1));
  const [progress, setProgress] = useState(0);
  const story = stories[currentIdx];

  useEffect(() => {
    if (!story) return;
    markStoryViewed(story.id);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          if (currentIdx < stories.length - 1) { setCurrentIdx(currentIdx + 1); return 0; }
          else { router.push('/stories'); return 0; }
        }
        return p + 2;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [currentIdx, story]);

  if (!story) {
    return <div className="min-h-screen bg-nexus-bg flex items-center justify-center"><p className="text-nexus-muted">No stories available</p></div>;
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: story.bgColor }}>
      <div className="fixed top-0 left-0 right-0 z-50 flex gap-1 p-2">
        {stories.map((_, i) => (
          <div key={i} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
            <div className="h-full bg-white transition-all duration-75" style={{ width: i < currentIdx ? '100%' : i === currentIdx ? `${progress}%` : '0%' }} />
          </div>
        ))}
      </div>
      <button onClick={() => router.push('/stories')} className="fixed top-4 right-4 z-50 p-2 text-white/80">
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
      <div className="absolute inset-0 flex">
        <button className="w-1/3 h-full" onClick={() => currentIdx > 0 && setCurrentIdx(currentIdx - 1)} />
        <button className="flex-1 h-full" onClick={() => currentIdx < stories.length - 1 ? setCurrentIdx(currentIdx + 1) : router.push('/stories')} />
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
        <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-4xl mb-4">{story.userAvatar}</div>
        <div className="text-white font-medium mb-2">{story.userName}</div>
        <p className="text-white text-2xl font-bold text-center leading-snug">{story.content}</p>
      </div>
      <div className="fixed bottom-4 left-0 right-0 px-4">
        <div className="max-w-lg mx-auto flex items-center gap-2">
          <input placeholder={`Reply to ${story.userName}...`} className="flex-1 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-2.5 text-white text-sm placeholder:text-white/60" />
          <button className="p-2.5 rounded-full bg-white/10 backdrop-blur">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StoryViewer() {
  return <Suspense fallback={<div className="min-h-screen bg-nexus-bg" />}><StoryViewerContent /></Suspense>;
}
