'use client';

import { useStore } from '@/store/useStore';
import CreatePost from '@/components/CreatePost';
import PostCard from '@/components/PostCard';
import { haptic } from '@/lib/haptics';

export default function FeedPage() {
  const posts = useStore((s) => s.posts);

  return (
    <div className="min-h-screen pb-20" style={{ background: 'var(--bg)' }}>
      <div className="glass sticky top-0 z-30 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold gradient-text">Nexus</h1>
          <span className="text-2xl">{useStore((s) => s.user.avatar)}</span>
        </div>
      </div>
      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        <CreatePost />
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
        <div className="text-center py-8 text-sm" style={{ color: 'var(--muted)' }}>
          You're all caught up \u2728
        </div>
      </div>
    </div>
  );
}
