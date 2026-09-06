'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { haptic } from '@/lib/haptics';

export default function CreatePost() {
  const [content, setContent] = useState('');
  const addPost = useStore((s) => s.addPost);

  const handlePost = () => {
    if (!content.trim()) return;
    haptic('success');
    addPost(content.trim());
    setContent('');
  };

  return (
    <div className="p-4 rounded-2xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <div className="flex gap-3">
        <span className="text-2xl">{useStore((s) => s.user.avatar)}</span>
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            rows={2}
            className="w-full bg-transparent text-sm resize-none outline-none placeholder:opacity-50"
            style={{ color: 'var(--text)' }}
          />
          <div className="flex items-center justify-between mt-2">
            <div className="flex gap-2 text-lg">
              <button onClick={() => haptic('light')} className="opacity-50 hover:opacity-100">\ud83d\udcf7</button>
              <button onClick={() => haptic('light')} className="opacity-50 hover:opacity-100">\ud83d\udc99</button>
              <button onClick={() => haptic('light')} className="opacity-50 hover:opacity-100">\ud83c\udfa4</button>
            </div>
            <button
              onClick={handlePost}
              disabled={!content.trim()}
              className="px-4 py-1.5 rounded-full text-sm font-medium disabled:opacity-30"
              style={{ background: 'var(--gradient)', color: '#fff' }}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
