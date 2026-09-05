'use client';

import { useStore } from '@/store/useStore';
import CreatePost from '@/components/CreatePost';
import PostCard from '@/components/PostCard';

export default function FeedPage() {
  const { posts } = useStore();

  return (
    <div className="animate-fade-in">
      <CreatePost />
      <div className="h-px bg-nexus-border mx-4" />
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      <div className="text-center py-6 text-nexus-muted text-xs">
        You're all caught up ✨
      </div>
    </div>
  );
}
