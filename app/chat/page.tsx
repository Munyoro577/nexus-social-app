'use client';

import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import { timeAgo } from '@/lib/utils';

export default function ChatListPage() {
  const { chats, openChat } = useStore();
  const router = useRouter();

  const handleOpen = (chatId: string) => {
    openChat(chatId);
    router.push(`/chat/${chatId}`);
  };

  return (
    <div className="animate-fade-in">
      <div className="px-4 py-3">
        <div className="glass rounded-xl px-4 py-2.5 flex items-center gap-2">
          <svg className="w-4 h-4 text-nexus-muted" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input placeholder="Search chats..." className="flex-1 bg-transparent text-sm placeholder:text-nexus-muted" />
        </div>
      </div>
      <div className="px-4 pb-2">
        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          {chats.filter((c) => c.online).map((chat) => (
            <button key={`online-${chat.id}`} onClick={() => handleOpen(chat.id)} className="flex-shrink-0 flex flex-col items-center gap-1">
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-nexus-card flex items-center justify-center text-2xl">{chat.contactAvatar}</div>
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-nexus-bg" />
              </div>
              <span className="text-xs text-nexus-muted truncate max-w-[60px]">{chat.contactName.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="h-px bg-nexus-border mx-4 my-2" />
      <div>
        {chats.map((chat) => (
          <button key={chat.id} onClick={() => handleOpen(chat.id)} className="w-full px-4 py-3 flex items-center gap-3 hover:bg-nexus-card/30 transition-all">
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-nexus-card flex items-center justify-center text-2xl">{chat.contactAvatar}</div>
              {chat.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-nexus-bg" />}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm truncate">{chat.contactName}</span>
                <span className="text-xs text-nexus-muted flex-shrink-0 ml-2">{timeAgo(chat.lastMessageTime)}</span>
              </div>
              <div className="flex items-center justify-between mt-0.5">
                <span className={`text-xs truncate ${chat.unread > 0 ? 'text-nexus-text font-medium' : 'text-nexus-muted'}`}>{chat.lastMessage}</span>
                {chat.unread > 0 && <span className="ml-2 flex-shrink-0 min-w-[18px] h-[18px] px-1 gradient-bg rounded-full text-[10px] font-bold text-white flex items-center justify-center">{chat.unread}</span>}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
