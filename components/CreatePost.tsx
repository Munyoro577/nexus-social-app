'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';

export default function CreatePost() {
  const [content, setContent] = useState('');
  const [showComposer, setShowComposer] = useState(false);
  const { addPost, user } = useStore();

  const handleSubmit = () => {
    if (!content.trim()) return;
    addPost(content.trim());
    setContent('');
    setShowComposer(false);
  };

  if (showComposer) {
    return (
      <div className="px-4 py-3 animate-slide-up">
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-nexus-card flex items-center justify-center text-xl">
              {user.avatar}
            </div>
            <div>
              <div className="font-medium text-sm">{user.name}</div>
              <div className="text-xs text-nexus-muted">Public</div>
            </div>
            <button
              onClick={() => { setShowComposer(false); setContent(''); }}
              className="ml-auto p-1 text-nexus-muted hover:text-nexus-text"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <textarea
            autoFocus
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            rows={3}
            className="w-full bg-transparent text-nexus-text resize-none placeholder:text-nexus-muted"
          />
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-nexus-border">
            <div className="flex gap-2">
              <button className="p-2 rounded-lg hover:bg-nexus-card text-nexus-muted">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
              <button className="p-2 rounded-lg hover:bg-nexus-card text-nexus-muted">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!content.trim()}
              className="px-5 py-1.5 rounded-full gradient-bg text-white text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-3">
      <button
        onClick={() => setShowComposer(true)}
        className="w-full glass rounded-2xl px-4 py-3 flex items-center gap-3 text-left"
      >
        <div className="w-10 h-10 rounded-full bg-nexus-card flex items-center justify-center text-xl">
          {user.avatar}
        </div>
        <span className="text-nexus-muted text-sm flex-1">What's on your mind?</span>
        <span className="text-nexus-accent text-sm font-medium">Post</span>
      </button>
    </div>
  );
}
