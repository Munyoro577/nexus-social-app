'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { formatTime } from '@/lib/utils';

export default function MusicPage() {
  const { tracks, currentTrack, isPlaying, playTrack, togglePlay, nextTrack, prevTrack } = useStore();
  const [localTime, setLocalTime] = useState(0);

  useEffect(() => {
    if (currentTrack && isPlaying) {
      const interval = setInterval(() => {
        setLocalTime((t) => {
          if (t >= currentTrack.duration) { nextTrack(); return 0; }
          return t + 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => { if (currentTrack) setLocalTime(0); }, [currentTrack]);

  const displayTime = currentTrack ? Math.min(localTime, currentTrack.duration) : 0;

  return (
    <div className="animate-fade-in pb-20">
      {currentTrack ? (
        <div className="px-4 py-6">
          <div className="glass rounded-3xl p-6 text-center">
            <div className="w-48 h-48 mx-auto rounded-2xl gradient-bg flex items-center justify-center text-7xl mb-4 shadow-2xl" style={{ animation: isPlaying ? 'pulse 3s ease-in-out infinite' : 'none' }}>{currentTrack.cover}</div>
            <h2 className="text-xl font-bold">{currentTrack.title}</h2>
            <p className="text-nexus-muted text-sm mt-1">{currentTrack.artist}</p>
            <p className="text-nexus-muted text-xs">{currentTrack.album}</p>
            <div className="mt-6">
              <div className="h-1 bg-nexus-border rounded-full overflow-hidden">
                <div className="h-full gradient-bg transition-all duration-1000" style={{ width: `${(displayTime / currentTrack.duration) * 100}%` }} />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-nexus-muted">{formatTime(displayTime)}</span>
                <span className="text-xs text-nexus-muted">{formatTime(currentTrack.duration)}</span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-6 mt-6">
              <button onClick={prevTrack} className="p-2 text-nexus-muted hover:text-nexus-text">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" /></svg>
              </button>
              <button onClick={togglePlay} className="w-14 h-14 rounded-full gradient-bg flex items-center justify-center shadow-lg">
                {isPlaying ? (
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" /></svg>
                ) : (
                  <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                )}
              </button>
              <button onClick={nextTrack} className="p-2 text-nexus-muted hover:text-nexus-text">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /></svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-4 py-12 text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-nexus-card flex items-center justify-center text-4xl mb-4">🎵</div>
          <h2 className="text-lg font-semibold">Nothing playing</h2>
          <p className="text-nexus-muted text-sm mt-1">Tap a song below to start listening</p>
        </div>
      )}
      <div className="px-4">
        <h2 className="text-sm font-semibold text-nexus-muted uppercase tracking-wide mb-3">Up Next</h2>
        <div className="space-y-1">
          {tracks.map((track) => (
            <button key={track.id} onClick={() => playTrack(track)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${currentTrack?.id === track.id ? 'bg-nexus-card' : 'hover:bg-nexus-card/50'}`}>
              <div className="w-12 h-12 rounded-lg bg-nexus-card flex items-center justify-center text-2xl flex-shrink-0">{track.cover}</div>
              <div className="flex-1 min-w-0 text-left">
                <div className={`text-sm font-medium truncate ${currentTrack?.id === track.id ? 'gradient-text' : ''}`}>{track.title}</div>
                <div className="text-xs text-nexus-muted truncate">{track.artist}</div>
              </div>
              <span className="text-xs text-nexus-muted">{formatTime(track.duration)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
