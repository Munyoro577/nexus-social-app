'use client';

import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { haptic } from '@/lib/haptics';
import { formatTimestamp } from '@/lib/utils';
import Link from 'next/link';

export default function ChatConversation({ chatId }: { chatId: string }) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chat = useStore((s) => s.chats.find((c) => c.id === chatId));
  const sendMessage = useStore((s) => s.sendMessage);
  const openChat = useStore((s) => s.openChat);
  const e2eEnabled = useStore((s) => s.e2eEncryption);

  useEffect(() => {
    openChat(chatId);
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat?.messages.length]);

  const handleSend = () => {
    if (!input.trim()) return;
    haptic('light');
    sendMessage(chatId, input.trim());
    setInput('');
  };

  if (!chat) return <div className="min-h-screen flex items-center justify-center" style={{ color: 'var(--muted)' }}>Chat not found</div>;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      <div className="glass sticky top-0 z-30 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/chat" onClick={() => haptic('light')}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <span className="text-2xl">{chat.contactAvatar}</span>
          <div className="flex-1">
            <div className="text-sm font-medium">{chat.contactName}</div>
            <div className="text-xs" style={{ color: chat.online ? 'var(--accent)' : 'var(--muted)' }}>{chat.online ? 'Online' : 'Last seen recently'}</div>
          </div>
          {e2eEnabled && (
            <div className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--accent)' }}>
              <span>\ud83d\udd12</span> E2E
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto max-w-lg mx-auto w-full px-4 py-4 space-y-2">
        {chat.messages.map((m) => (
          <div key={m.id} className={`flex ${m.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${m.senderId === 'me' ? 'rounded-br-sm' : 'rounded-bl-sm'}`}
              style={m.senderId === 'me'
                ? { background: 'var(--gradient)', color: '#fff' }
                : { background: 'var(--card)', color: 'var(--text)', border: '1px solid var(--border)' }
              }
            >
              {m.content}
              {m.encrypted && <span className="text-[8px] ml-1 opacity-50">\ud83d\udd12</span>}
              <div className={`text-[8px] mt-0.5 ${m.senderId === 'me' ? 'text-white/50' : ''}`} style={m.senderId !== 'me' ? { color: 'var(--muted)' } : {}}>
                {formatTimestamp(m.timestamp)}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="fixed bottom-0 left-0 right-0 glass border-t z-40" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-lg mx-auto flex items-center gap-2 px-4 py-3 pb-[72px]">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2.5 rounded-full text-sm outline-none"
            style={{ background: 'var(--card)', color: 'var(--text)' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-30"
            style={{ background: 'var(--gradient)', color: '#fff' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
