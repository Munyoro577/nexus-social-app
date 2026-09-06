'use client';

import { useStore } from '@/store/useStore';
import Link from 'next/link';
import { haptic } from '@/lib/haptics';
import { formatTimestamp } from '@/lib/utils';

export default function StoriesPage() {
  const stories = useStore((s) => s.stories);
  const addStory = useStore((s) => s.addStory);
  const storyColors = useStore((s) => s.storyColors);
  const user = useStore((s) => s.user);

  return (
    <div className="min-h-screen pb-20" style={{ background: 'var(--bg)' }}>
      <div className="glass sticky top-0 z-30 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-lg mx-auto px-4 py-3">
          <h1 className="text-xl font-bold gradient-text">Stories</h1>
        </div>
      </div>
      <div className="max-w-lg mx-auto px-4 py-4">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-3">
          <button
            onClick={() => { haptic('success'); addStory('New story \u2728', storyColors[Math.floor(Math.random() * storyColors.length)]); }}
            className="flex-shrink-0 flex flex-col items-center gap-1"
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'var(--card)', border: '2px dashed var(--border)' }}>
              <span className="text-2xl">+</span>
            </div>
            <span className="text-[10px]" style={{ color: 'var(--muted)' }}>Add</span>
          </button>
          {stories.map((s) => (
            <Link key={s.id} href="/stories/view" onClick={() => haptic('light')} className="flex-shrink-0 flex flex-col items-center gap-1">
              <div className="w-16 h-16 rounded-full p-0.5" style={{ background: s.viewed ? 'var(--border)' : 'var(--gradient)' }}>
                <div className="w-full h-full rounded-full flex items-center justify-center text-2xl" style={{ background: 'var(--card)' }}>{s.userAvatar}</div>
              </div>
              <span className="text-[10px]" style={{ color: 'var(--muted)' }}>{s.userName}</span>
            </Link>
          ))}
        </div>
        <div className="mt-6 space-y-3">
          {stories.map((s) => (
            <div key={s.id} className="p-4 rounded-2xl flex items-center gap-3" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl" style={{ background: s.bgColor }}>{s.userAvatar}</div>
              <div className="flex-1">
                <div className="text-sm font-medium">{s.userName}</div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>{s.content} \u00b7 {formatTimestamp(s.timestamp)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
