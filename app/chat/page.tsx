'use client';

import { useStore } from '@/store/useStore';
import Link from 'next/link';
import { haptic } from '@/lib/haptics';
import { formatTimestamp } from '@/lib/utils';

export default function ChatListPage() {
  const chats = useStore((s) => s.chats);
  const e2eEnabled = useStore((s) => s.e2eEncryption);

  return (
    <div className="min-h-screen pb-20" style={{ background: 'var(--bg)' }}>
      <div className="glass sticky top-0 z-30 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-lg mx-auto px-4 py-3">
          <h1 className="text-xl font-bold gradient-text">Chats</h1>
        </div>
      </div>
      <div className="max-w-lg mx-auto px-4 py-4 space-y-2">
        {chats.map((c) => (
          <Link
            key={c.id}
            href={`/chat/${c.id}`}
            onClick={() => haptic('light')}
            className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <div className="relative">
              <span className="text-2xl">{c.contactAvatar}</span>
              {c.online && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2" style={{ borderColor: 'var(--card)' }} />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium truncate">{c.contactName}</span>
                {e2eEnabled && <span className="text-[10px]" style={{ color: 'var(--accent)' }}>\ud83d\udd12</span>}
              </div>
              <div className="text-xs truncate" style={{ color: 'var(--muted)' }}>{c.lastMessage} \u00b7 {formatTimestamp(c.lastMessageTime)}</div>
            </div>
            {c.unread > 0 && (
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: 'var(--accent)' }}>
                {c.unread}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
