import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  posts: number;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  image?: string;
  timestamp: number;
  likes: number;
  liked: boolean;
  comments: Comment[];
}

export interface Comment {
  id: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: number;
}

export interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  bgColor: string;
  timestamp: number;
  viewed: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: number;
  type: 'text' | 'image' | 'voice';
}

export interface Chat {
  id: string;
  contactId: string;
  contactName: string;
  contactAvatar: string;
  contactStatus: string;
  messages: Message[];
  lastMessage: string;
  lastMessageTime: number;
  unread: number;
  online: boolean;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  cover: string;
}

const seedUsers: User[] = [
  { id: 'u1', name: 'You', username: '@you', avatar: '🧑', bio: 'Living life one post at a time ✨', followers: 1248, following: 392, posts: 47 },
];

const seedPosts: Post[] = [
  {
    id: 'p1', userId: 'u2', userName: 'Sarah Chen', userAvatar: '👩',
    content: 'Just finished my morning hike! The view from Eagle Peak was absolutely worth the 6am start. Nature really is the best therapy 🏔️',
    timestamp: Date.now() - 3600000, likes: 247, liked: false,
    comments: [
      { id: 'c1', userName: 'Marcus Lee', userAvatar: '👨', content: 'Stunning shot! What camera did you use?', timestamp: Date.now() - 3000000 },
      { id: 'c2', userName: 'Priya K', userAvatar: '👩‍🦰', content: 'Adding this to my bucket list!', timestamp: Date.now() - 1800000 },
    ],
  },
  {
    id: 'p2', userId: 'u3', userName: 'Alex Rivera', userAvatar: '🧔',
    content: 'Hot take: pineapple absolutely belongs on pizza and I will die on this hill 🍍🍕',
    timestamp: Date.now() - 7200000, likes: 1089, liked: true,
    comments: [
      { id: 'c3', userName: 'Jordan Kim', userAvatar: '🧑‍🦱', content: 'This is war.', timestamp: Date.now() - 6000000 },
    ],
  },
  {
    id: 'p3', userId: 'u4', userName: 'Maya Patel', userAvatar: '👧',
    content: 'Three months into my startup journey. Some days feel impossible, but then I remember why I started. To anyone building something — keep going. The world needs what you\'re making. 🚀',
    timestamp: Date.now() - 14400000, likes: 3421, liked: false,
    comments: [
      { id: 'c4', userName: 'Tom Wright', userAvatar: '👨‍🦳', content: 'Needed this today. Thank you.', timestamp: Date.now() - 12000000 },
      { id: 'c5', userName: 'Lisa Zhang', userAvatar: '👩‍🦰', content: 'What\'s the startup about?', timestamp: Date.now() - 10000000 },
      { id: 'c6', userName: 'Maya Patel', userAvatar: '👧', content: '@Lisa — AI tools for small businesses! Will share more soon.', timestamp: Date.now() - 9000000 },
    ],
  },
  {
    id: 'p4', userId: 'u5', userName: 'Kai Johnson', userAvatar: '🧑‍🎤',
    content: 'New track dropping this Friday. Been working on it for months. Here\'s a sneak peek of the lyrics: "City lights blur into stars, we\'re driving through Mars..." 🎵',
    timestamp: Date.now() - 21600000, likes: 876, liked: false,
    comments: [],
  },
];

const storyColors = [
  'linear-gradient(135deg, #6366f1, #8b5cf6)',
  'linear-gradient(135deg, #ec4899, #f59e0b)',
  'linear-gradient(135deg, #10b981, #06b6d4)',
  'linear-gradient(135deg, #f59e0b, #ef4444)',
  'linear-gradient(135deg, #8b5cf6, #ec4899)',
];

const seedStories: Story[] = [
  { id: 's1', userId: 'u2', userName: 'Sarah', userAvatar: '👩', content: 'Morning vibes ☀️', bgColor: storyColors[0], timestamp: Date.now() - 1800000, viewed: false },
  { id: 's2', userId: 'u3', userName: 'Alex', userAvatar: '🧔', content: 'Pizza night 🍕', bgColor: storyColors[1], timestamp: Date.now() - 3600000, viewed: false },
  { id: 's3', userId: 'u4', userName: 'Maya', userAvatar: '👧', content: 'Building mode 🚀', bgColor: storyColors[2], timestamp: Date.now() - 5400000, viewed: false },
  { id: 's4', userId: 'u5', userName: 'Kai', userAvatar: '🧑‍🎤', content: 'Studio session 🎵', bgColor: storyColors[3], timestamp: Date.now() - 7200000, viewed: true },
];

const seedChats: Chat[] = [
  {
    id: 'chat1', contactId: 'u2', contactName: 'Sarah Chen', contactAvatar: '👩', contactStatus: 'Hey! Are we still on for hiking?',
    messages: [
      { id: 'm1', senderId: 'u2', content: 'Hey! Are we still on for hiking?', timestamp: Date.now() - 7200000, type: 'text' },
      { id: 'm2', senderId: 'me', content: 'Absolutely! 6am at the trailhead?', timestamp: Date.now() - 7000000, type: 'text' },
      { id: 'm3', senderId: 'u2', content: 'Perfect, see you there!', timestamp: Date.now() - 6900000, type: 'text' },
      { id: 'm4', senderId: 'u2', content: 'Don\'t forget water 💧', timestamp: Date.now() - 6800000, type: 'text' },
    ],
    lastMessage: "Don't forget water 💧", lastMessageTime: Date.now() - 6800000, unread: 2, online: true,
  },
  {
    id: 'chat2', contactId: 'u3', contactName: 'Alex Rivera', contactAvatar: '🧔', contactStatus: 'Bro the pizza debate continues...',
    messages: [
      { id: 'm5', senderId: 'u3', content: 'Bro the pizza debate continues...', timestamp: Date.now() - 10800000, type: 'text' },
      { id: 'm6', senderId: 'me', content: 'Pineapple stays. End of discussion 😤', timestamp: Date.now() - 10700000, type: 'text' },
      { id: 'm7', senderId: 'u3', content: 'We\'ll see about that...', timestamp: Date.now() - 10600000, type: 'text' },
    ],
    lastMessage: "We'll see about that...", lastMessageTime: Date.now() - 10600000, unread: 0, online: false,
  },
  {
    id: 'chat3', contactId: 'u4', contactName: 'Maya Patel', contactAvatar: '👧', contactStatus: 'Thank you so much for the encouragement!',
    messages: [
      { id: 'm8', senderId: 'u4', content: 'Thank you so much for the encouragement!', timestamp: Date.now() - 86400000, type: 'text' },
      { id: 'm9', senderId: 'me', content: 'You earned it. Keep building!', timestamp: Date.now() - 86300000, type: 'text' },
    ],
    lastMessage: 'You earned it. Keep building!', lastMessageTime: Date.now() - 86300000, unread: 0, online: true,
  },
  {
    id: 'chat4', contactId: 'u5', contactName: 'Kai Johnson', contactAvatar: '🧑‍🎤', contactStatus: 'Wait until you hear the final mix 🔥',
    messages: [
      { id: 'm10', senderId: 'u5', content: 'Wait until you hear the final mix 🔥', timestamp: Date.now() - 172800000, type: 'text' },
    ],
    lastMessage: 'Wait until you hear the final mix 🔥', lastMessageTime: Date.now() - 172800000, unread: 1, online: false,
  },
];

const seedTracks: Track[] = [
  { id: 't1', title: 'Neon Skyline', artist: 'Kai Johnson', album: 'Midnight Drive', duration: 215, cover: '🌃' },
  { id: 't2', title: 'Through Mars', artist: 'Kai Johnson', album: 'Midnight Drive', duration: 198, cover: '🪐' },
  { id: 't3', title: 'City Lights', artist: 'Luna Echo', album: 'Urban Dreams', duration: 243, cover: '🌆' },
  { id: 't4', title: 'Gravity', artist: 'The Pulse', album: 'Orbit', duration: 187, cover: '🌀' },
  { id: 't5', title: 'Sunset Boulevard', artist: 'Neon Waves', album: 'Golden Hour', duration: 224, cover: '🌅' },
  { id: 't6', title: 'Electric Soul', artist: 'Aria Stone', album: 'Voltage', duration: 256, cover: '⚡' },
  { id: 't7', title: 'Lost in Tokyo', artist: 'Future Ghost', album: 'Shibuya', duration: 312, cover: '🗼' },
  { id: 't8', title: 'Crystal Clear', artist: 'Maya Patel', album: 'Clarity', duration: 201, cover: '💎' },
];

const autoReplies = [
  'That\'s awesome! 😄',
  'No way, really?',
  'Haha I can\'t believe that happened 😂',
  'For sure! Let\'s do it.',
  'I was just thinking the same thing!',
  'Tell me more about that.',
  'That sounds amazing 🔥',
  'Wow, congrats! 🎉',
  'I\'ll let you know soon.',
  'Sounds good to me!',
];

interface StoreState {
  user: User;
  posts: Post[];
  stories: Story[];
  chats: Chat[];
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  currentChatId: string | null;
  unreadChats: number;
  storyColors: string[];
  addPost: (content: string, image?: string) => void;
  toggleLike: (postId: string) => void;
  addComment: (postId: string, content: string) => void;
  addStory: (content: string, bgColor: string) => void;
  markStoryViewed: (storyId: string) => void;
  sendMessage: (chatId: string, content: string) => void;
  openChat: (chatId: string) => void;
  markChatRead: (chatId: string) => void;
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setCurrentTime: (time: number) => void;
  updateProfile: (data: Partial<User>) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      user: seedUsers[0],
      posts: seedPosts,
      stories: seedStories,
      chats: seedChats,
      tracks: seedTracks,
      currentTrack: null,
      isPlaying: false,
      currentTime: 0,
      currentChatId: null,
      unreadChats: 3,
      storyColors,

      addPost: (content, image) => {
        const { user } = get();
        const newPost: Post = {
          id: `p${Date.now()}`, userId: 'me', userName: user.name, userAvatar: user.avatar,
          content, image, timestamp: Date.now(), likes: 0, liked: false, comments: [],
        };
        set((s) => ({ posts: [newPost, ...s.posts] }));
      },

      toggleLike: (postId) => {
        set((s) => ({
          posts: s.posts.map((p) =>
            p.id === postId ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
          ),
        }));
      },

      addComment: (postId, content) => {
        const { user } = get();
        set((s) => ({
          posts: s.posts.map((p) =>
            p.id === postId
              ? { ...p, comments: [...p.comments, { id: `c${Date.now()}`, userName: user.name, userAvatar: user.avatar, content, timestamp: Date.now() }] }
              : p
          ),
        }));
      },

      addStory: (content, bgColor) => {
        const { user } = get();
        const newStory: Story = {
          id: `s${Date.now()}`, userId: 'me', userName: user.name, userAvatar: user.avatar,
          content, bgColor, timestamp: Date.now(), viewed: false,
        };
        set((s) => ({ stories: [newStory, ...s.stories] }));
      },

      markStoryViewed: (storyId) => {
        set((s) => ({
          stories: s.stories.map((st) => st.id === storyId ? { ...st, viewed: true } : st),
        }));
      },

      sendMessage: (chatId, content) => {
        const msg: Message = { id: `m${Date.now()}`, senderId: 'me', content, timestamp: Date.now(), type: 'text' };
        set((s) => ({
          chats: s.chats.map((c) =>
            c.id === chatId ? { ...c, messages: [...c.messages, msg], lastMessage: content, lastMessageTime: msg.timestamp } : c
          ),
        }));

        setTimeout(() => {
          const reply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
          const replyMsg: Message = {
            id: `m${Date.now() + 1}`, senderId: get().chats.find((c) => c.id === chatId)?.contactId ?? 'u2',
            content: reply, timestamp: Date.now(), type: 'text',
          };
          set((s) => ({
            chats: s.chats.map((c) =>
              c.id === chatId ? { ...c, messages: [...c.messages, replyMsg], lastMessage: reply, lastMessageTime: replyMsg.timestamp } : c
            ),
          }));
        }, 1500 + Math.random() * 2000);
      },

      openChat: (chatId) => {
        set({ currentChatId: chatId });
        get().markChatRead(chatId);
      },

      markChatRead: (chatId) => {
        set((s) => {
          const chats = s.chats.map((c) => c.id === chatId ? { ...c, unread: 0 } : c);
          const unreadChats = chats.reduce((sum, c) => sum + c.unread, 0);
          return { chats, unreadChats };
        });
      },

      playTrack: (track) => { set({ currentTrack: track, isPlaying: true, currentTime: 0 }); },
      togglePlay: () => { set((s) => ({ isPlaying: !s.isPlaying })); },
      nextTrack: () => {
        const { tracks, currentTrack } = get();
        if (!currentTrack) return;
        const idx = tracks.findIndex((t) => t.id === currentTrack.id);
        set({ currentTrack: tracks[(idx + 1) % tracks.length], currentTime: 0, isPlaying: true });
      },
      prevTrack: () => {
        const { tracks, currentTrack } = get();
        if (!currentTrack) return;
        const idx = tracks.findIndex((t) => t.id === currentTrack.id);
        set({ currentTrack: tracks[(idx - 1 + tracks.length) % tracks.length], currentTime: 0, isPlaying: true });
      },
      setCurrentTime: (time) => { set({ currentTime: time }); },
      updateProfile: (data) => { set((s) => ({ user: { ...s.user, ...data } })); },
    }),
    {
      name: 'nexus-storage',
      partialize: (s) => ({ user: s.user, posts: s.posts, stories: s.stories, chats: s.chats }),
    }
  )
);
