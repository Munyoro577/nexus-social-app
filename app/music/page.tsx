'use client';

import { useStore } from '@/store/useStore';
import { haptic } from '@/lib/haptics';
import { useEffect, useState } from 'react';

export default function MusicPage() {
  const { tracks, currentTrack, isPlaying, currentTime, playTrack, togglePlay, nextTrack, prevTrack, setCurrentTime } = useStore();
  const [displayTime, setDisplayTime] = useState(0);

  useEffect(() => {
    if (!isPlaying || !currentTrack) return;
    const interval = setInterval(() => {
      setCurrentTime(Math.min(currentTime + 1, currentTrack.duration));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack, currentTime, setCurrentTime]);

  useEffect(() => {
    setDisplayTime(currentTime);
  }, [currentTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen pb-20" style={{ background: 'var(--bg)' }}>
      {currentTrack ? (
        <>
          <div className="h-[300px] flex items-center justify-center" style={{
            background: 'linear-gradient(135deg, var(--gradient))',
          }}>
            <div className="text-8xl animate-bounce">{currentTrack.cover}</div>
          </div>

          <div className="max-w-lg mx-auto px-4 py-6">
            <h2 className="text-2xl font-bold text-center">{currentTrack.title}</h2>
            <p className="text-center text-sm" style={{ color: 'var(--muted)' }}>{currentTrack.artist}</p>
            <p className="text-center text-xs mt-1" style={{ color: 'var(--muted)' }}>{currentTrack.album}</p>

            <div className="mt-6 space-y-2">
              <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--card)' }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    background: 'var(--gradient)',
                    width: `${(displayTime / currentTrack.duration) * 100}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
                <span>{formatTime(displayTime)}</span>
                <span>{formatTime(currentTrack.duration)}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 mt-8">
              <button
                onClick={() => { haptic('light'); prevTrack(); }}
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
              >
                ⏮
              </button>
              <button
                onClick={() => { haptic('medium'); togglePlay(); }}
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: 'var(--gradient)', color: '#fff' }}
              >
                {isPlaying ? '⏸' : '▶'}
              </button>
              <button
                onClick={() => { haptic('light'); nextTrack(); }}
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
              >
                ⏭
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center" style={{ height: 'calc(100vh - 80px)' }}>
          <div className="text-6xl mb-4">🎵</div>
          <p className="text-center" style={{ color: 'var(--muted)' }}>Select a track to play</p>
        </div>
      )}

      <div className="max-w-lg mx-auto px-4 py-6">
        <h3 className="font-bold mb-4">All Tracks ({tracks.length})</h3>
        <div className="space-y-2">
          {tracks.map((track) => (
            <button
              key={track.id}
              onClick={() => { haptic('selection'); playTrack(track); }}
              className="w-full p-3 rounded-xl text-left transition-all"
              style={{
                background: currentTrack?.id === track.id ? 'var(--gradient)' : 'var(--card)',
                color: currentTrack?.id === track.id ? '#fff' : 'var(--text)',
                border: `1px solid ${currentTrack?.id === track.id ? 'transparent' : 'var(--border)'}`,
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{track.cover}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{track.title}</p>
                  <p className="text-xs opacity-70 truncate">{track.artist}</p>
                </div>
                <span className="text-xs opacity-70 whitespace-nowrap">3:{Math.floor(track.duration / 60).toString().padStart(2, '0')}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
