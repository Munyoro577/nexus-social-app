'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { haptic } from '@/lib/haptics';

export default function StoriesPage() {
  const { stories, addStory, markStoryViewed, storyColors } = useStore();
  const [showCreate, setShowCreate] = useState(false);
  const [content, setContent] = useState('');
  const [selectedColor, setSelectedColor] = useState(0);
  const [viewingStoryId, setViewingStoryId] = useState<string | null>(null);

  const handleCreateStory = () => {
    if (!content.trim()) return;
    haptic('medium');
    addStory(content, storyColors[selectedColor]);
    setContent('');
    setShowCreate(false);
  };

  const viewingStory = stories.find(s => s.id === viewingStoryId);

  if (viewingStory) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer"
        onClick={() => { markStoryViewed(viewingStory.id); setViewingStoryId(null); }}
        style={{ background: viewingStory.bgColor }}
      >
        <div className="text-center text-white">
          <p className="text-sm opacity-75 mb-2">{viewingStory.userName}</p>
          <p className="text-3xl mb-4">{viewingStory.content}</p>
          <p className="text-xs opacity-50">
            {new Date(viewingStory.timestamp).toLocaleString()}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20" style={{ background: 'var(--bg)' }}>
      <div className="glass sticky top-0 z-30 border-b px-4 py-3" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-lg mx-auto">
          <h1 className="text-xl font-bold gradient-text">Stories</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4">
        <button
          onClick={() => { haptic('light'); setShowCreate(!showCreate); }}
          className="w-full p-4 rounded-2xl mb-4 text-left"
          style={{ background: 'var(--card)', border: '2px dashed var(--border)' }}
        >
          <div className="text-2xl mb-2">➕</div>
          <p className="font-medium text-sm">Create Story</p>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>Share what's on your mind</p>
        </button>

        {showCreate && (
          <div className="p-4 rounded-2xl mb-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's happening?!"
              rows={4}
              className="w-full rounded-xl px-3 py-2 text-sm resize-none outline-none mb-3"
              style={{ background: 'var(--surface)', color: 'var(--text)' }}
            />
            <div className="flex gap-2 mb-3">
              {storyColors.map((color, i) => (
                <button
                  key={i}
                  onClick={() => { haptic('selection'); setSelectedColor(i); }}
                  className="w-8 h-8 rounded-full border-2 transition-transform"
                  style={{
                    background: color,
                    borderColor: selectedColor === i ? '#fff' : 'transparent',
                    transform: selectedColor === i ? 'scale(1.1)' : 'scale(1)',
                  }}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCreate(false)}
                className="flex-1 px-3 py-2 rounded-lg text-sm font-medium"
                style={{ background: 'var(--surface)', color: 'var(--text)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateStory}
                disabled={!content.trim()}
                className="flex-1 px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                style={{ background: 'var(--gradient)', color: '#fff' }}
              >
                Share
              </button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {stories.map((story) => (
            <button
              key={story.id}
              onClick={() => { haptic('selection'); setViewingStoryId(story.id); }}
              className="w-full h-32 rounded-2xl overflow-hidden relative group cursor-pointer transition-transform"
              style={{
                background: story.bgColor,
                opacity: story.viewed ? 0.6 : 1,
              }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <p className="text-2xl mb-2">{story.content}</p>
                <p className="text-xs opacity-75">{story.userName}</p>
              </div>
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
