'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';

export default function ProfilePage() {
  const { user, posts, updateProfile } = useStore();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [username, setUsername] = useState(user.username);

  const handleSave = () => { updateProfile({ name, bio, username }); setEditing(false); };

  return (
    <div className="animate-fade-in pb-20">
      <div className="px-4 py-6 text-center">
        <div className="w-24 h-24 mx-auto rounded-full bg-nexus-card flex items-center justify-center text-5xl mb-3 border-4 border-nexus-border">{user.avatar}</div>
        <h1 className="text-xl font-bold">{user.name}</h1>
        <p className="text-nexus-muted text-sm">{user.username}</p>
        <p className="text-sm mt-2 max-w-xs mx-auto">{user.bio}</p>
        <div className="flex justify-center gap-8 mt-5">
          <div><div className="text-lg font-bold">{user.posts}</div><div className="text-xs text-nexus-muted">Posts</div></div>
          <div><div className="text-lg font-bold">{user.followers.toLocaleString()}</div><div className="text-xs text-nexus-muted">Followers</div></div>
          <div><div className="text-lg font-bold">{user.following}</div><div className="text-xs text-nexus-muted">Following</div></div>
        </div>
        <button onClick={() => setEditing(!editing)} className="mt-5 px-6 py-2 rounded-full glass border border-nexus-border text-sm font-medium hover:bg-nexus-card">
          {editing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>
      {editing && (
        <div className="px-4 py-3 animate-slide-up">
          <div className="glass rounded-2xl p-4 space-y-3">
            <div><label className="text-xs text-nexus-muted">Name</label><input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-nexus-card rounded-lg px-3 py-2 mt-1 text-sm" /></div>
            <div><label className="text-xs text-nexus-muted">Username</label><input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-nexus-card rounded-lg px-3 py-2 mt-1 text-sm" /></div>
            <div><label className="text-xs text-nexus-muted">Bio</label><textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={2} className="w-full bg-nexus-card rounded-lg px-3 py-2 mt-1 text-sm resize-none" /></div>
            <button onClick={handleSave} className="w-full py-2.5 rounded-xl gradient-bg text-white font-medium text-sm">Save Changes</button>
          </div>
        </div>
      )}
      <div className="flex border-t border-nexus-border mt-4">
        <button className="flex-1 py-3 text-sm font-medium text-nexus-accent border-b-2 border-nexus-accent">Posts</button>
        <button className="flex-1 py-3 text-sm font-medium text-nexus-muted">Media</button>
        <button className="flex-1 py-3 text-sm font-medium text-nexus-muted">Likes</button>
      </div>
      <div className="grid grid-cols-3 gap-0.5 mt-0.5">
        {posts.slice(0, 9).map((post) => (
          <div key={post.id} className="aspect-square bg-nexus-card flex items-center justify-center text-xs p-2 text-center">
            <span className="text-nexus-muted line-clamp-3">{post.content.slice(0, 40)}...</span>
          </div>
        ))}
      </div>
    </div>
  );
}
