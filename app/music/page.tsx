'use client';

import { useStore } from '@/store/useStore';
import { haptic } from '@/lib/haptics';
import { formatTime } from '@/lib/utils';

export default function MusicPage() {
  const tracks = useStore((s) => s.tracks);
  const currentTrack = useStore((s) => s.currentTrack);
  const isPlaying = useStore((s) => s.isPlaying);
  const currentTime = useStore((s) => s.currentTime);
  const playTrack = useStore((s) => s.playTrack);
  const togglePlay = useStore((s) => s.togglePlay);
  const nextTrack = useStore((s) => s.nextTrack);
  const prevTrack = useStore((s) => s.prevTrack);

  const handlePlay = (track: typeof tracks[0]) => {
    haptic('medium');
    if (currentTrack?.id === track.id) { togglePlay(); }
    else { playTrack(track); }
  };

  return (
    <div className="min-h-screen pb-20" style={{ background: 'var(--bg)' }}>
      <div className="glass sticky top-0 z-30 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-lg mx-auto px-4 py-3">
          <h1 className="text-xl font-bold gradient-text">Music</h1>
        </div>
      </div>
      <div className="max-w-lg mx-auto px-4 py-4">
        {/* Player */}
        {currentTrack && (
          <div className="mb-6 p-6 rounded-2xl text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="text-7xl mb-4">{currentTrack.cover}</div>
            <div className="text-lg font-bold">{currentTrack.title}</div>
            <div className="text-sm" style={{ color: 'var(--muted)' }}>{currentTrack.artist}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{currentTrack.album}</div>
            {/* Progress */}
            <div className="mt-4 h-1 rounded-full overflow-hidden" style={{ background: 'var(--surface)' }}>
              <div className="h-full rounded-full" style={{ width: `${(currentTime / currentTrack.duration) * 100}%`, background: 'var(--gradient)' }} />
            </div>
            <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--muted)' }}>
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(currentTrack.duration)}</span>
            </div>
            {/* Controls */}
            <div className="flex items-center justify-center gap-6 mt-4">
              <button onClick={() => { haptic('light'); prevTrack(); }}>
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6V6zm3.5 6l8.5 6V6l-8.5 6z" /></svg>
              </button>
              <button onClick={() => { haptic('medium'); togglePlay(); }} className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'var(--gradient)' }}>
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  {isPlaying ? <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" /> : <path d="M8 5v14l11-7L8 5z" />}
                </svg>
              </button>
              <button onClick={() => { haptic('light'); nextTrack(); }}>
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /></svg>
              </button>
            </div>
          </div>
        )}
        {/* Track list */}
        <div className="space-y-1">
          {tracks.map((t, i) => (
            <button
              key={t.id}
              onClick={() => handlePlay(t)}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all hover:opacity-80"
              style={{ background: currentTrack?.id === t.id ? 'var(--surface)' : 'transparent' }}
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl" style={{ background: 'var(--card)' }}>{t.cover}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate" style={{ color: currentTrack?.id === t.id ? 'var(--accent)' : 'var(--text)' }}>{t.title}</div>
                <div className="text-xs truncate" style={{ color: 'var(--muted)' }}>{t.artist} \u00b7 {formatTime(t.duration)}</div>
              </div>
              {currentTrack?.id === t.id && isPlaying && <div className="flex items-end gap-0.5 h-4">
                {[0,1,2].map(j => <div key={j} className="w-0.5 rounded-full" style={{ background: 'var(--accent)', height: '100%', animation: `wave 0.5s ease-in-out ${j*0.1}s infinite` }} />)}
              </div>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
