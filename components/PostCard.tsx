'use client';

import { useState } from 'react';
import { useStore, Post } from '@/store/useStore';
import { haptic } from '@/lib/haptics';
import { formatTimestamp } from '@/lib/utils';

export default function PostCard({ post }: { post: Post }) {
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const toggleLike = useStore((s) => s.toggleLike);
  const addComment = useStore((s) => s.addComment);
  const e2eEnabled = useStore((s) => s.e2eEncryption);

  const handleLike = () => {
    haptic(post.liked ? 'light' : 'success');
    toggleLike(post.id);
  };

  const handleComment = () => {
    if (!comment.trim()) return;
    haptic('light');
    addComment(post.id, comment.trim());
    setComment('');
  };

  return (
    <div className="p-4 rounded-2xl animate-fade-in" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{post.userAvatar}</span>
        <div className="flex-1">
          <div className="text-sm font-medium">{post.userName}</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>{formatTimestamp(post.timestamp)}</div>
        </div>
        {e2eEnabled && <span className="text-[10px]" style={{ color: 'var(--accent)' }}>\ud83d\udd12</span>}
      </div>
      <p className="text-sm leading-relaxed mb-3">{post.content}</p>
      {post.image && <div className="rounded-xl mb-3 overflow-hidden"><img src={post.image} alt="" className="w-full" /></div>}
      <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--muted)' }}>
        <button onClick={handleLike} className="flex items-center gap-1.5" style={{ color: post.liked ? 'var(--accent)' : 'var(--muted)' }}>
          <svg className="w-4 h-4" fill={post.liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          {post.likes}
        </button>
        <button onClick={() => { haptic('light'); setShowComments(!showComments); }} className="flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8M8 8h8m-8 8h5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {post.comments.length}
        </button>
      </div>
      {showComments && (
        <div className="mt-3 pt-3 border-t space-y-2" style={{ borderColor: 'var(--border)' }}>
          {post.comments.map((c) => (
            <div key={c.id} className="flex items-start gap-2">
              <span className="text-lg">{c.userAvatar}</span>
              <div className="flex-1">
                <span className="text-xs font-medium">{c.userName} </span>
                <span className="text-xs">{c.content}</span>
              </div>
            </div>
          ))}
          <div className="flex gap-2 mt-2">
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleComment()}
              placeholder="Add a comment..."
              className="flex-1 px-3 py-1.5 rounded-full text-xs outline-none"
              style={{ background: 'var(--surface)', color: 'var(--text)' }}
            />
            <button onClick={handleComment} disabled={!comment.trim()} className="text-xs px-2" style={{ color: 'var(--accent)' }}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}
