'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { haptic } from '@/lib/haptics';
import Link from 'next/link';

export default function ProfilePage() {
  const user = useStore((s) => s.user);
  const authUser = useStore((s) => s.authUser);
  const updateProfile = useStore((s) => s.updateProfile);
  const posts = useStore((s) => s.posts);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const myPosts = posts.filter((p) => p.userId === 'me');

  const handleSave = () => {
    haptic('success');
    updateProfile({ name, bio });
    setEditing(false);
  };

  return (
    <div className="min-h-screen pb-20" style={{ background: 'var(--bg)' }}>
      <div className="glass sticky top-0 z-30 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold gradient-text">Profile</h1>
          <Link href="/settings" onClick={() => haptic('light')} className="text-sm" style={{ color: 'var(--accent)' }}>Settings</Link>
        </div>
      </div>
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <div className="text-6xl mb-3">{user.avatar}</div>
          {editing ? (
            <div className="space-y-2">
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full text-center px-4 py-2 rounded-xl" style={{ background: 'var(--card)', color: 'var(--text)' }} />
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={2} className="w-full text-center px-4 py-2 rounded-xl resize-none" style={{ background: 'var(--card)', color: 'var(--text)' }} />
              <button onClick={handleSave} className="px-6 py-2 rounded-xl text-sm font-medium" style={{ background: 'var(--gradient)', color: '#fff' }}>Save</button>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>{user.bio}</p>
              {authUser && <p className="text-xs mt-1" style={{ color: 'var(--accent)' }}>{authUser.email}</p>}
              <button onClick={() => { haptic('light'); setEditing(true); }} className="mt-2 text-xs px-4 py-1.5 rounded-full" style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)' }}>Edit Profile</button>
            </>
          )}
        </div>
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="text-center p-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="text-xl font-bold">{user.posts}</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>Posts</div>
          </div>
          <div className="text-center p-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="text-xl font-bold">{user.followers.toLocaleString()}</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>Followers</div>
          </div>
          <div className="text-center p-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="text-xl font-bold">{user.following}</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>Following</div>
          </div>
        </div>
        {myPosts.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase" style={{ color: 'var(--muted)' }}>My Posts</h3>
            {myPosts.map((p) => (
              <div key={p.id} className="p-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                <div className="text-sm">{p.content}</div>
                <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{p.likes} likes</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
