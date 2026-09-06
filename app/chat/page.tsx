'use client';

import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { encryptMessage, decryptMessage } from '@/lib/crypto';
import { haptic } from '@/lib/haptics';

export default function ChatPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { chats, currentChatId, openChat, sendMessage } = useStore();

  const filteredChats = chats.filter(c =>
    c.contactName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-20" style={{ background: 'var(--bg)' }}>
      <div className="glass sticky top-0 z-30 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-lg mx-auto px-4 py-3">
          <h1 className="text-xl font-bold gradient-text mb-3">Messages</h1>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search conversations..."
            className="w-full px-4 py-2 rounded-full text-sm outline-none"
            style={{ background: 'var(--card)', color: 'var(--text)' }}
          />
        </div>
      </div>

      <div className="max-w-lg mx-auto">
        {currentChatId ? (
          <ChatThread chatId={currentChatId} />
        ) : (
          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {filteredChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => { haptic('selection'); openChat(chat.id); }}
                className="w-full px-4 py-3 hover:opacity-80 transition-opacity text-left"
                style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl">{chat.contactAvatar}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm truncate">{chat.contactName}</p>
                        {chat.online && <span className="w-2 h-2 rounded-full" style={{ background: '#10b981' }} />}
                      </div>
                      <p className="text-xs truncate" style={{ color: 'var(--muted)' }}>{chat.lastMessage}</p>
                    </div>
                  </div>
                  {chat.unread > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      {chat.unread}
                    </span>
                  )}
                </div>
                <div className="text-[10px]" style={{ color: 'var(--muted)' }}>
                  {new Date(chat.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ChatThread({ chatId }: { chatId: string }) {
  const [input, setInput] = useState('');
  const [decryptedMessages, setDecryptedMessages] = useState<Record<string, string>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { chats, sendMessage, openChat } = useStore();
  const chat = chats.find(c => c.id === chatId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat?.messages.length]);

  useEffect(() => {
    (async () => {
      const decrypted: Record<string, string> = {};
      for (const msg of chat?.messages || []) {
        if (msg.encrypted) {
          try {
            decrypted[msg.id] = await decryptMessage(msg.content);
          } catch {
            decrypted[msg.id] = '[Decryption failed]';
          }
        } else {
          decrypted[msg.id] = msg.content;
        }
      }
      setDecryptedMessages(decrypted);
    })();
  }, [chat?.messages]);

  if (!chat) return null;

  const handleSend = async () => {
    if (!input.trim()) return;
    haptic('light');
    sendMessage(chatId, input.trim());
    setInput('');
  };

  return (
    <div className="flex flex-col h-screen" style={{ background: 'var(--bg)' }}>
      <div className="glass sticky top-0 z-30 border-b px-4 py-3" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={() => openChat('')} className="text-2xl">‹</button>
          <div className="flex-1">
            <h2 className="font-bold">{chat.contactName}</h2>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>
              {chat.online ? '🟢 Active now' : '⚫ Away'}
            </p>
          </div>
          <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            🔒 E2E
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {chat.messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div
              className="max-w-[70%] rounded-2xl px-4 py-2 text-sm"
              style={msg.senderId === 'me'
                ? { background: 'var(--gradient)', color: '#fff' }
                : { background: 'var(--card)', color: 'var(--text)', border: '1px solid var(--border)' }
              }
            >
              <div className="break-words">{decryptedMessages[msg.id] || msg.content}</div>
              <div className="text-[10px] mt-1 opacity-70">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="glass border-t px-4 py-3" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-lg mx-auto flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 rounded-full px-4 py-2.5 text-sm outline-none"
            style={{ background: 'var(--card)', color: 'var(--text)' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-30"
            style={{ background: 'var(--gradient)' }}
          >
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.5 1.5H3a1.5 1.5 0 0 0-1.5 1.5v12a1.5 1.5 0 0 0 1.5 1.5h14a1.5 1.5 0 0 0 1.5-1.5V10" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
