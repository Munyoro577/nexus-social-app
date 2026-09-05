'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';

export default function StoriesPage() {
  const { stories, addStory, user, storyColors } = useStore();
  const [showCreate, setShowCreate] = useState(false);
  const [content, setContent] = useState('');
  const [colorIdx, setColorIdx] = useState(0);
  const router = useRouter();

  const handleCreate = () => {
    if (!content.trim()) return;
    addStory(content.trim(), storyColors[colorIdx]);
    setContent('');
    setShowCreate(false);
  };

  const openViewer = (idx: number) => {
    router.push(`/stories/view?start=${idx}`);
  };

  if (showCreate) {
    return (
      <div className="animate-fade-in px-4 py-4">
        <div className="rounded-2xl overflow-hidden" style={{ background: storyColors[colorIdx] }}>
          <div className="p-8 min-h-[400px] flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-xl">
                {user.avatar}
              </div>
              <div className="font-medium">{user.name}</div>
              <button
                onClick={() => { setShowCreate(false); setContent(''); }}
                className="ml-auto p-1 text-white/80"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <textarea
              autoFocus
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your moment..."
              rows={4}
              className="flex-1 bg-transparent text-white text-lg font-medium placeholder:text-white/60 resize-none"
            />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          {storyColors.map((c, i) => (
            <button
              key={i}
              onClick={() => setColorIdx(i)}
              className={`w-8 h-8 rounded-full transition-all ${i === colorIdx ? 'ring-2 ring-white ring-offset-2 ring-offset-nexus-bg' : ''}`}
              style={{ background: c }}
            />
          ))}
        </div>
        <button
          onClick={handleCreate}
          disabled={!content.trim()}
          className="w-full mt-4 py-3 rounded-xl gradient-bg text-white font-medium disabled:opacity-30"
        >
          Share Story
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="px-4 py-4">
        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          <button onClick={() => setShowCreate(true)} className="flex-shrink-0 flex flex-col items-center gap-1">
            <div className="w-16 h-16 rounded-full bg-nexus-card border-2 border-dashed border-nexus-border flex items-center justify-center">
              <svg className="w-6 h-6 text-nexus-accent" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-xs text-nexus-muted">Your Story</span>
          </button>
          {stories.map((story, idx) => (
            <button key={story.id} onClick={() => openViewer(idx)} className="flex-shrink-0 flex flex-col items-center gap-1">
              <div className={`story-ring ${story.viewed ? 'opacity-40' : ''}`}>
                <div className="w-16 h-16 rounded-full bg-nexus-card flex items-center justify-center text-2xl border-2 border-nexus-bg">
                  {story.userAvatar}
                </div>
              </div>
              <span className="text-xs text-nexus-muted">{story.userName}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="px-4 space-y-3">
        <h2 className="text-sm font-semibold text-nexus-muted uppercase tracking-wide">Recent Stories</h2>
        {stories.map((story, idx) => (
          <button key={story.id} onClick={() => openViewer(idx)} className="w-full text-left">
            <div className="glass rounded-2xl overflow-hidden">
              <div className="p-4 flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${story.viewed ? 'opacity-50' : ''}`} style={{ background: story.bgColor }}>
                  {story.userAvatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{story.userName}</div>
                  <div className="text-xs text-nexus-muted truncate">{story.content}</div>
                </div>
                <svg className="w-5 h-5 text-nexus-muted" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
