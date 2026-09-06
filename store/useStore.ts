import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ThemeId, ColorMode } from '@/lib/themes';
import { AuthUser } from '@/lib/auth';
import { setHapticsEnabled } from '@/lib/haptics';

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
  encrypted?: boolean;
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

export interface AIModel {
  id: string;
  name: string;
  description: string;
  contextWindow: number;
  inputCost: number;
  outputCost: number;
  rpm: number;
  tpm: number;
  rpd: number;
  badge: string;
  color: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  model?: string;
  timestamp: number;
  tokens?: number;
  latency?: number;
}

export interface AIConversation {
  id: string;
  title: string;
  model: string;
  systemInstruction: string;
  messages: AIMessage[];
  createdAt: number;
}

export interface GeneratedImage {
  id: string;
  prompt: string;
  model: string;
  gradient: string;
  emoji: string;
  timestamp: number;
}

const seedUsers: User[] = [
  { id: 'u1', name: 'You', username: '@you', avatar: '\ud83e\uddd1', bio: 'Living life one post at a time \u2728', followers: 1248, following: 392, posts: 47 },
];

const seedPosts: Post[] = [
  {
    id: 'p1', userId: 'u2', userName: 'Sarah Chen', userAvatar: '\ud83d\udc69',
    content: 'Just finished my morning hike! The view from Eagle Peak was absolutely worth the 6am start. Nature really is the best therapy \ud83c\udfd6\ufe0f',
    timestamp: Date.now() - 3600000, likes: 247, liked: false,
    comments: [
      { id: 'c1', userName: 'Marcus Lee', userAvatar: '\ud83d\udc68', content: 'Stunning shot! What camera did you use?', timestamp: Date.now() - 3000000 },
      { id: 'c2', userName: 'Priya K', userAvatar: '\ud83d\udc69\u200d\ud83e\uddb0', content: 'Adding this to my bucket list!', timestamp: Date.now() - 1800000 },
    ],
  },
  {
    id: 'p2', userId: 'u3', userName: 'Alex Rivera', userAvatar: '\ud83e\uddd4',
    content: 'Hot take: pineapple absolutely belongs on pizza and I will die on this hill \ud83c\udf52\ud83c\udf55',
    timestamp: Date.now() - 7200000, likes: 1089, liked: true,
    comments: [
      { id: 'c3', userName: 'Jordan Kim', userAvatar: '\ud83e\uddd1\u200d\ud83e\uddb1', content: 'This is war.', timestamp: Date.now() - 6000000 },
    ],
  },
  {
    id: 'p3', userId: 'u4', userName: 'Maya Patel', userAvatar: '\ud83d\udc67',
    content: 'Three months into my startup journey. Some days feel impossible, but then I remember why I started. To anyone building something \u2014 keep going. The world needs wha