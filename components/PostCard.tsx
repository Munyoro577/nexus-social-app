'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { timeAgo } from '@/lib/utils';

export default function PostCard({ post }: { post: any }) {
  const { toggleLike, addComment } = useStore();
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');

  const handleComment = () => {
    if (!comment.trim()) return;
    addComment(post.id, comment.trim());
    setComment('');
  };

  return (
    <div className="px-4 py-3">
      <div className="glass rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 p-4">
          <div className="w-10 h-10 rounded-full bg-nexus-card flex items-center justify-center text-xl">
            {post.userAvatar}
          </div>
          <div className="flex-1">
            <div className="font-medium text-sm">{post.userName}</div>
            <div className="text-xs text-nexus-muted">{timeAgo(post.timestamp)}</div>
          </div>
          <button className="p-1 text-nexus-muted">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01" />
            </svg>
          </button>
        </div>

        {/* Content */}
        {post.content && (
          <p className="px-4 pb-3 text-sm leading-relaxed">{post.content}</p>
        )}

        {/* Image placeholder */}
        {post.image && (
          <div className="aspect-video bg-nexus-card flex items-center justify-center text-4xl">
            {post.image}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1 px-2 py-2 border-t border-nexus-border">
          <button
            onClick={() => toggleLike(post.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all ${
              post.liked ? 'text-nexus-accent3' : 'text-nexus-muted hover:text-nexus-text'
            }`}
          >
            <svg className="w-5 h-5" fill={post.liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {post.likes}
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-nexus-muted hover:text-nexus-text transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {post.comments.length}
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-nexus-muted hover:text-nexus-text transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </button>
        </div>

        {/* Comments */}
        {showComments && (
          <div className="px-4 pb-3 space-y-2 animate-fade-in">
            {post.comments.map((c: any) => (
              <div key={c.id} className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-nexus-card flex items-center justify-center text-sm flex-shrink-0">
                  {c.userAvatar}
                </div>
                <div className="flex-1 bg-nexus-card/50 rounded-lg px-3 py-1.5">
                  <div className="text-xs font-medium">{c.userName}</div>
                  <div className="text-xs text-nexus-text">{c.content}</div>
                </div>
              </div>
            ))}
            <div className="flex gap-2 pt-1">
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleComment()}
                placeholder="Add a comment..."
                className="flex-1 bg-nexus-card/50 rounded-lg px-3 py-1.5 text-sm placeholder:text-nexus-muted"
              />
              <button
                onClick={handleComment}
                disabled={!comment.trim()}
                className="px-3 py-1.5 rounded-lg gradient-bg text-white text-sm font-medium disabled:opacity-30"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
