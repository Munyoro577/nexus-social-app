'use client';

import { postService } from '@/lib/services';
import CreatePost from '@/components/CreatePost';
import PostCard from '@/components/PostCard';
import { useStore } from '@/store/useStore';

export default function FeedPage() {
  const posts = useStore((s) => s.posts);
  const user = useStore((s) => s.user);

  return (
    <div className="feed-page">
      <div className="feed-header glass">
        <div className="feed-header-inner">
          <h1 className="feed-title gradient-text">Nexus</h1>
          <span className="feed-avatar">{user.avatar}</span>
        </div>
      </div>
      <div className="feed-content">
        <CreatePost />
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
        <div className="feed-end">
          You're all caught up \u2728
        </div>
      </div>
    </div>
  );
}
