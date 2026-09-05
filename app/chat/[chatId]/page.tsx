'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { timeAgo } from '@/lib/utils';

export function generateStaticParams() {
  return [{ chatId: 'chat1' }, { chatId: 'chat2' }, { chatId: 'chat3' }, { chatId: 'chat4' }];
}

export default function ChatConversationPage() {
  const params = useParams();
  const router = useRouter();
  const chatId = params.chatId as string;
  const { chats, sendMessage } = useStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chat = chats.find((c) => c.id === chatId);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chat?.messages.length]);

  if (!chat) {
    return <div className="flex items-center justify-center min-h-screen"><p className="text-nexus-muted">Chat not found</p></div>;
  }

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(chatId, input.trim());
    setInput('');
  };

  return (
    <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 3.5rem)' }}>
      <div className="fixed top-0 left-0 right-0 z-40 glass border-b border-nexus-border">
        <div className="max-w-lg mx-auto flex items-center gap-3 px-4 h-14">
          <button onClick={() => router.push('/chat')} className="p-1">
            <svg className="w-6 h-6 text-nexus-text" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-nexus-card flex items-center justify-center text-xl">{chat.contactAvatar}</div>
            {chat.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-nexus-surface" />}
          </div>
          <div className="flex-1">
            <div className="font-medium text-sm">{chat.contactName}</div>
            <div className="text-xs text-nexus-muted">{chat.online ? 'Online' : 'Last seen recently'}</div>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pt-16 pb-4 space-y-2">
        {chat.messages.map((msg) => {
          const isMe = msg.senderId === 'me';
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-fade-in`}>
              <div className={`max-w-[75%] rounded-2xl px-3.5 py-2 ${isMe ? 'gradient-bg text-white rounded-br-md' : 'bg-nexus-card text-nexus-text rounded-bl-md'}`}>
                <p className="text-sm leading-relaxed">{msg.content}</p>
                <div className={`text-[10px] mt-0.5 ${isMe ? 'text-white/60' : 'text-nexus-muted'}`}>{timeAgo(msg.timestamp)}</div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="fixed bottom-0 left-0 right-0 glass border-t border-nexus-border z-40">
        <div className="max-w-lg mx-auto flex items-center gap-2 px-4 py-3 pb-[72px]">
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Message..." className="flex-1 bg-nexus-card rounded-full px-4 py-2.5 text-sm placeholder:text-nexus-muted" />
          <button onClick={handleSend} disabled={!input.trim()} className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center disabled:opacity-30">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
