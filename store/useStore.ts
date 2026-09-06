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
    content: 'Three months into my startup journey. Some days feel impossible, but then I remember why I started. To anyone building something \u2014 keep going. The world needs what you\u2019re making. \ud83d\ude80',
    timestamp: Date.now() - 14400000, likes: 3421, liked: false,
    comments: [
      { id: 'c4', userName: 'Tom Wright', userAvatar: '\ud83d\udc68\u200d\ud83e\uddb3', content: 'Needed this today. Thank you.', timestamp: Date.now() - 12000000 },
      { id: 'c5', userName: 'Lisa Zhang', userAvatar: '\ud83d\udc69\u200d\ud83e\uddb0', content: 'What\u2019s the startup about?', timestamp: Date.now() - 10000000 },
      { id: 'c6', userName: 'Maya Patel', userAvatar: '\ud83d\udc67', content: '@Lisa \u2014 AI tools for small businesses! Will share more soon.', timestamp: Date.now() - 9000000 },
    ],
  },
  {
    id: 'p4', userId: 'u5', userName: 'Kai Johnson', userAvatar: '\ud83e\uddd1\u200d\ud83c\udfa4',
    content: 'New track dropping this Friday. Been working on it for months. Here\u2019s a sneak peek of the lyrics: "City lights blur into stars, we\u2019re driving through Mars..." \ud83c\udfb5',
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
  { id: 's1', userId: 'u2', userName: 'Sarah', userAvatar: '\ud83d\udc69', content: 'Morning vibes \u2600\ufe0f', bgColor: storyColors[0], timestamp: Date.now() - 1800000, viewed: false },
  { id: 's2', userId: 'u3', userName: 'Alex', userAvatar: '\ud83e\uddd4', content: 'Pizza night \ud83c\udf55', bgColor: storyColors[1], timestamp: Date.now() - 3600000, viewed: false },
  { id: 's3', userId: 'u4', userName: 'Maya', userAvatar: '\ud83d\udc67', content: 'Building mode \ud83d\ude80', bgColor: storyColors[2], timestamp: Date.now() - 5400000, viewed: false },
  { id: 's4', userId: 'u5', userName: 'Kai', userAvatar: '\ud83e\uddd1\u200d\ud83c\udfa4', content: 'Studio session \ud83c\udfb5', bgColor: storyColors[3], timestamp: Date.now() - 7200000, viewed: true },
];

const seedChats: Chat[] = [
  {
    id: 'chat1', contactId: 'u2', contactName: 'Sarah Chen', contactAvatar: '\ud83d\udc69', contactStatus: 'Hey! Are we still on for hiking?',
    messages: [
      { id: 'm1', senderId: 'u2', content: 'Hey! Are we still on for hiking?', timestamp: Date.now() - 7200000, type: 'text', encrypted: true },
      { id: 'm2', senderId: 'me', content: 'Absolutely! 6am at the trailhead?', timestamp: Date.now() - 7000000, type: 'text', encrypted: true },
      { id: 'm3', senderId: 'u2', content: 'Perfect, see you there!', timestamp: Date.now() - 6900000, type: 'text', encrypted: true },
      { id: 'm4', senderId: 'u2', content: 'Don\u2019t forget water \ud83d\udca7', timestamp: Date.now() - 6800000, type: 'text', encrypted: true },
    ],
    lastMessage: "Don't forget water \ud83d\udca7", lastMessageTime: Date.now() - 6800000, unread: 2, online: true,
  },
  {
    id: 'chat2', contactId: 'u3', contactName: 'Alex Rivera', contactAvatar: '\ud83e\uddd4', contactStatus: 'Bro the pizza debate continues...',
    messages: [
      { id: 'm5', senderId: 'u3', content: 'Bro the pizza debate continues...', timestamp: Date.now() - 10800000, type: 'text', encrypted: true },
      { id: 'm6', senderId: 'me', content: 'Pineapple stays. End of discussion \ud83d\ude24', timestamp: Date.now() - 10700000, type: 'text', encrypted: true },
      { id: 'm7', senderId: 'u3', content: 'We\u2019ll see about that...', timestamp: Date.now() - 10600000, type: 'text', encrypted: true },
    ],
    lastMessage: "We'll see about that...", lastMessageTime: Date.now() - 10600000, unread: 0, online: false,
  },
  {
    id: 'chat3', contactId: 'u4', contactName: 'Maya Patel', contactAvatar: '\ud83d\udc67', contactStatus: 'Thank you so much for the encouragement!',
    messages: [
      { id: 'm8', senderId: 'u4', content: 'Thank you so much for the encouragement!', timestamp: Date.now() - 86400000, type: 'text', encrypted: true },
      { id: 'm9', senderId: 'me', content: 'You earned it. Keep building!', timestamp: Date.now() - 86300000, type: 'text', encrypted: true },
    ],
    lastMessage: 'You earned it. Keep building!', lastMessageTime: Date.now() - 86300000, unread: 0, online: true,
  },
  {
    id: 'chat4', contactId: 'u5', contactName: 'Kai Johnson', contactAvatar: '\ud83e\uddd1\u200d\ud83c\udfa4', contactStatus: 'Wait until you hear the final mix \ud83d\udd25',
    messages: [
      { id: 'm10', senderId: 'u5', content: 'Wait until you hear the final mix \ud83d\udd25', timestamp: Date.now() - 172800000, type: 'text', encrypted: true },
    ],
    lastMessage: 'Wait until you hear the final mix \ud83d\udd25', lastMessageTime: Date.now() - 172800000, unread: 1, online: false,
  },
];

const seedTracks: Track[] = [
  { id: 't1', title: 'Neon Skyline', artist: 'Kai Johnson', album: 'Midnight Drive', duration: 215, cover: '\ud83c\udf03' },
  { id: 't2', title: 'Through Mars', artist: 'Kai Johnson', album: 'Midnight Drive', duration: 198, cover: '\ud83e\ude90' },
  { id: 't3', title: 'City Lights', artist: 'Luna Echo', album: 'Urban Dreams', duration: 243, cover: '\ud83c\udf06' },
  { id: 't4', title: 'Gravity', artist: 'The Pulse', album: 'Orbit', duration: 187, cover: '\ud83c\udf00' },
  { id: 't5', title: 'Sunset Boulevard', artist: 'Neon Waves', album: 'Golden Hour', duration: 224, cover: '\ud83c\udf05' },
  { id: 't6', title: 'Electric Soul', artist: 'Aria Stone', album: 'Voltage', duration: 256, cover: '\u26a1' },
  { id: 't7', title: 'Lost in Tokyo', artist: 'Future Ghost', album: 'Shibuya', duration: 312, cover: '\ud83c\udfef' },
  { id: 't8', title: 'Crystal Clear', artist: 'Maya Patel', album: 'Clarity', duration: 201, cover: '\ud83d\udc8e' },
];

const autoReplies = [
  'That\u2019s awesome! \ud83d\ude04',
  'No way, really?',
  'Haha I can\u2019t believe that happened \ud83d\ude02',
  'For sure! Let\u2019s do it.',
  'I was just thinking the same thing!',
  'Tell me more about that.',
  'That sounds amazing \ud83d\udd25',
  'Wow, congrats! \ud83c\udf89',
  'I\u2019ll let you know soon.',
  'Sounds good to me!',
];

const aiModels: AIModel[] = [
  { id: 'gemini-3', name: 'Gemini 3 Pro', description: 'Most capable model for complex reasoning', contextWindow: 2000000, inputCost: 1.25, outputCost: 5.0, rpm: 1000, tpm: 1000000, rpd: 1000, badge: 'Preview', color: '#4285f4' },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', description: 'Best for coding and long-context tasks', contextWindow: 1000000, inputCost: 1.25, outputCost: 5.0, rpm: 1000, tpm: 1000000, rpd: 1000, badge: 'Stable', color: '#6366f1' },
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', description: 'Fast and cost-efficient for high-volume', contextWindow: 1000000, inputCost: 0.075, outputCost: 0.3, rpm: 4000, tpm: 2000000, rpd: 2000, badge: 'Stable', color: '#8b5cf6' },
  { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash-Lite', description: 'Lowest latency, lowest cost', contextWindow: 1000000, inputCost: 0.0375, outputCost: 0.15, rpm: 4000, tpm: 4000000, rpd: 6000, badge: 'Stable', color: '#ec4899' },
  { id: 'nano-banana', name: 'Nano Banana', description: 'High-quality image generation', contextWindow: 480000, inputCost: 0.35, outputCost: 0.0, rpm: 200, tpm: 0, rpd: 200, badge: 'Preview', color: '#f59e0b' },
  { id: 'veo', name: 'Veo 3.1', description: 'High-fidelity video generation', contextWindow: 0, inputCost: 0.35, outputCost: 0.0, rpm: 100, tpm: 0, rpd: 100, badge: 'Preview', color: '#10b981' },
];

const personaPrefixes: Record<string, string> = {
  professional: '[Professional tone] ',
  friendly: '[Friendly tone] ',
  creative: '[Creative tone] ',
  concise: '[Concise] ',
  academic: '[Academic] ',
  witty: '[Witty] ',
};

function generateAIResponse(prompt: string, modelId: string, systemInstruction: string, persona: string): string {
  const p = prompt.toLowerCase();
  const prefix = personaPrefixes[persona] || '';

  let response = '';

  if (p.includes('hello') || p.includes('hi ') || p === 'hi') {
    response = `Hello! I'm ${aiModels.find(m => m.id === modelId)?.name || 'Gemini'}. `;
    if (systemInstruction) response += `I'm operating with your custom instructions in mind. `;
    response += `How can I help you today? I can assist with writing, analysis, coding, math, creative tasks, and more.`;
  } else if (p.includes('code') || p.includes('function') || p.includes('program')) {
    response = `Here's an approach I'd suggest:\n\n\`\`\`javascript\nfunction example(input) {\n  if (!input) return null;\n  const result = input.map(item => ({\n    ...item,\n    processed: true,\n    timestamp: Date.now()\n  }));\n  return result.filter(r => r.valid !== false);\n}\n\`\`\`\n\nThis handles edge cases, preserves data integrity, and runs in O(n) time. Want me to adapt it for a specific use case?`;
  } else if (p.includes('image') || p.includes('generate') || p.includes('draw') || p.includes('picture')) {
    response = `I can help with image generation! In a production environment, I'd send your prompt to the image model and return a generated image. Here's what I'd create based on "${prompt.slice(0, 80)}":\n\n\ud83c\udfa8 A visually stunning composition with vibrant colors, dynamic lighting, and intricate details that capture the essence of your request.`;
  } else if (p.includes('summarize') || p.includes('summary')) {
    response = `Here's a concise summary:\n\n\u2022 **Key Point 1**: The main idea centers around the core theme\n\u2022 **Key Point 2**: Supporting details provide context and depth\n\u2022 **Key Point 3**: The conclusion ties everything together\n\nWould you like me to expand on any of these points?`;
  } else if (p.includes('write') || p.includes('story') || p.includes('poem')) {
    response = `Here's a creative response:\n\nIn the quiet hum of morning light,\nwhere coffee steam meets dawn's first breath,\na story waits within the glow \u2014\nnot yet told, but felt.\n\nEach word a brushstroke on the page,\neach line a path through unmarked snow.\nThe pen moves forward, trusting ink\nto find what hearts already know.`;
  } else if (p.includes('explain') || p.includes('what is') || p.includes('how does')) {
    response = `Great question! Let me break this down:\n\n**Overview**: The concept involves several interconnected parts that work together.\n\n**How it works**: Think of it like a well-organized system \u2014 each component has a specific role, and they communicate through defined interfaces.\n\n**Why it matters**: Understanding this gives you a mental model to reason about similar systems.`;
  } else {
    response = `I've processed your prompt: "${prompt.slice(0, 100)}"\n\nBased on my analysis, here's what I can tell you:\n\nThis is a simulated response from ${aiModels.find(m => m.id === modelId)?.name || 'Gemini'}. In a production environment, I'd connect to the actual Gemini API and provide a detailed, accurate response with real reasoning.\n\nWould you like me to elaborate?`;
  }

  return prefix + response;
}

function estimateTokens(text: string): number { return Math.ceil(text.length / 4); }
function estimateLatency(modelId: string, tokens: number): number {
  if (modelId.includes('flash-lite')) return 200 + Math.random() * 300;
  if (modelId.includes('flash')) return 400 + Math.random() * 500;
  if (modelId.includes('nano') || modelId.includes('veo')) return 3000 + Math.random() * 2000;
  return 800 + Math.random() * 1200;
}

const imageGradients = [
  'linear-gradient(135deg, #667eea, #764ba2)',
  'linear-gradient(135deg, #f093fb, #f5576c)',
  'linear-gradient(135deg, #4facfe, #00f2fe)',
  'linear-gradient(135deg, #43e97b, #38f9d7)',
  'linear-gradient(135deg, #fa709a, #fee140)',
  'linear-gradient(135deg, #30cfd0, #330867)',
  'linear-gradient(135deg, #a8edea, #fed6e3)',
  'linear-gradient(135deg, #ff9a9e, #fecfef)',
];

const imageEmojis = ['\ud83c\udf05', '\ud83c\udf0c', '\ud83c\udfd6\ufe0f', '\ud83c\udf0a', '\ud83c\udf38', '\ud83c\udfa8', '\u2728', '\ud83d\udd25', '\ud83d\udcab', '\ud83c\udf08'];

interface StoreState {
  // Auth
  authUser: AuthUser | null;
  setAuthUser: (user: AuthUser | null) => void;

  // Theme & Appearance
  themeId: ThemeId;
  colorMode: ColorMode;
  customPalette: Record<string, string> | null;
  setThemeId: (id: ThemeId) => void;
  setColorMode: (mode: ColorMode) => void;
  setCustomPalette: (palette: Record<string, string>) => void;

  // Security & Privacy
  serverMode: 'centralized' | 'decentralized';
  e2eEncryption: boolean;
  ephemeralStorage: boolean;
  biometricEnabled: boolean;
  twoFactorEnabled: boolean;
  readReceipts: boolean;
  onlineStatus: boolean;
  setServerMode: (mode: 'centralized' | 'decentralized') => void;
  setE2eEncryption: (v: boolean) => void;
  setEphemeralStorage: (v: boolean) => void;
  setBiometricEnabled: (v: boolean) => void;
  setTwoFactorEnabled: (v: boolean) => void;
  setReadReceipts: (v: boolean) => void;
  setOnlineStatus: (v: boolean) => void;

  // AI
  aiPersona: string;
  aiUiStyle: string;
  setAiPersona: (p: string) => void;
  setAiUiStyle: (s: string) => void;

  // Sync & Backup
  syncEnabled: boolean;
  offlineMode: boolean;
  cloudBackup: boolean;
  backupEncryption: boolean;
  setSyncEnabled: (v: boolean) => void;
  setOfflineMode: (v: boolean) => void;
  setCloudBackup: (v: boolean) => void;
  setBackupEncryption: (v: boolean) => void;

  // Experience
  hapticsEnabled: boolean;
  soundEnabled: boolean;
  animationsEnabled: boolean;
  reducedMotion: boolean;
  dataSaver: boolean;
  setHapticsEnabled: (v: boolean) => void;
  setSoundEnabled: (v: boolean) => void;
  setAnimationsEnabled: (v: boolean) => void;
  setReducedMotion: (v: boolean) => void;
  setDataSaver: (v: boolean) => void;

  // Social data
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

  // AI Playground
  aiModels: AIModel[];
  aiConversations: AIConversation[];
  currentConversationId: string | null;
  isStreaming: boolean;
  generatedImages: GeneratedImage[];
  usageRpm: number;
  usageTpm: number;
  usageRpd: number;
  totalTokensUsed: number;
  totalEstimatedCost: number;
  compareModelA: string;
  compareModelB: string;

  // Feed
  addPost: (content: string, image?: string) => void;
  toggleLike: (postId: string) => void;
  addComment: (postId: string, content: string) => void;

  // Stories
  addStory: (content: string, bgColor: string) => void;
  markStoryViewed: (storyId: string) => void;

  // Chat
  sendMessage: (chatId: string, content: string) => void;
  openChat: (chatId: string) => void;
  markChatRead: (chatId: string) => void;

  // Music
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setCurrentTime: (time: number) => void;
  updateProfile: (data: Partial<User>) => void;

  // AI Playground
  sendAIMessage: (prompt: string) => void;
  setSystemInstruction: (instruction: string) => void;
  createConversation: (model: string) => void;
  setCompareModels: (a: string, b: string) => void;
  generateImage: (prompt: string) => void;
  getUrlSummary: (url: string) => void;
  clearConversation: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Auth
      authUser: null,
      setAuthUser: (user) => set({ authUser: user }),

      // Theme
      themeId: 'nexus',
      colorMode: 'dark',
      customPalette: null,
      setThemeId: (id) => set({ themeId: id }),
      setColorMode: (mode) => set({ colorMode: mode }),
      setCustomPalette: (palette) => set({ customPalette: palette }),

      // Security
      serverMode: 'centralized',
      e2eEncryption: true,
      ephemeralStorage: false,
      biometricEnabled: false,
      twoFactorEnabled: false,
      readReceipts: true,
      onlineStatus: true,
      setServerMode: (mode) => set({ serverMode: mode }),
      setE2eEncryption: (v) => set({ e2eEncryption: v }),
      setEphemeralStorage: (v) => set({ ephemeralStorage: v }),
      setBiometricEnabled: (v) => set({ biometricEnabled: v }),
      setTwoFactorEnabled: (v) => set({ twoFactorEnabled: v }),
      setReadReceipts: (v) => set({ readReceipts: v }),
      setOnlineStatus: (v) => set({ onlineStatus: v }),

      // AI Persona
      aiPersona: 'friendly',
      aiUiStyle: 'studio',
      setAiPersona: (p) => set({ aiPersona: p }),
      setAiUiStyle: (s) => set({ aiUiStyle: s }),

      // Sync
      syncEnabled: true,
      offlineMode: true,
      cloudBackup: true,
      backupEncryption: true,
      setSyncEnabled: (v) => set({ syncEnabled: v }),
      setOfflineMode: (v) => set({ offlineMode: v }),
      setCloudBackup: (v) => set({ cloudBackup: v }),
      setBackupEncryption: (v) => set({ backupEncryption: v }),

      // Experience
      hapticsEnabled: true,
      soundEnabled: false,
      animationsEnabled: true,
      reducedMotion: false,
      dataSaver: false,
      setHapticsEnabled: (v) => { set({ hapticsEnabled: v }); setHapticsEnabled(v); },
      setSoundEnabled: (v) => set({ soundEnabled: v }),
      setAnimationsEnabled: (v) => set({ animationsEnabled: v }),
      setReducedMotion: (v) => set({ reducedMotion: v }),
      setDataSaver: (v) => set({ dataSaver: v }),

      // Social
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

      // AI
      aiModels,
      aiConversations: [],
      currentConversationId: null,
      isStreaming: false,
      generatedImages: [],
      usageRpm: 0,
      usageTpm: 0,
      usageRpd: 0,
      totalTokensUsed: 0,
      totalEstimatedCost: 0,
      compareModelA: 'gemini-2.5-pro',
      compareModelB: 'gemini-2.5-flash',

      addPost: (content, image) => {
        const { user } = get();
        const newPost: Post = { id: `p${Date.now()}`, userId: 'me', userName: user.name, userAvatar: user.avatar, content, image, timestamp: Date.now(), likes: 0, liked: false, comments: [] };
        set((s) => ({ posts: [newPost, ...s.posts] }));
      },
      toggleLike: (postId) => {
        set((s) => ({ posts: s.posts.map((p) => p.id === postId ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p) }));
      },
      addComment: (postId, content) => {
        const { user } = get();
        set((s) => ({ posts: s.posts.map((p) => p.id === postId ? { ...p, comments: [...p.comments, { id: `c${Date.now()}`, userName: user.name, userAvatar: user.avatar, content, timestamp: Date.now() }] } : p) }));
      },
      addStory: (content, bgColor) => {
        const { user } = get();
        const newStory: Story = { id: `s${Date.now()}`, userId: 'me', userName: user.name, userAvatar: user.avatar, content, bgColor, timestamp: Date.now(), viewed: false };
        set((s) => ({ stories: [newStory, ...s.stories] }));
      },
      markStoryViewed: (storyId) => {
        set((s) => ({ stories: s.stories.map((st) => st.id === storyId ? { ...st, viewed: true } : st) }));
      },
      sendMessage: (chatId, content) => {
        const msg: Message = { id: `m${Date.now()}`, senderId: 'me', content, timestamp: Date.now(), type: 'text', encrypted: get().e2eEncryption };
        set((s) => ({ chats: s.chats.map((c) => c.id === chatId ? { ...c, messages: [...c.messages, msg], lastMessage: content, lastMessageTime: msg.timestamp } : c) }));
        setTimeout(() => {
          const reply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
          const replyMsg: Message = { id: `m${Date.now() + 1}`, senderId: get().chats.find((c) => c.id === chatId)?.contactId ?? 'u2', content: reply, timestamp: Date.now(), type: 'text', encrypted: get().e2eEncryption };
          set((s) => ({ chats: s.chats.map((c) => c.id === chatId ? { ...c, messages: [...c.messages, replyMsg], lastMessage: reply, lastMessageTime: replyMsg.timestamp } : c) }));
        }, 1500 + Math.random() * 2000);
      },
      openChat: (chatId) => { set({ currentChatId: chatId }); get().markChatRead(chatId); },
      markChatRead: (chatId) => {
        set((s) => {
          const chats = s.chats.map((c) => c.id === chatId ? { ...c, unread: 0 } : c);
          return { chats, unreadChats: chats.reduce((sum, c) => sum + c.unread, 0) };
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
      setCurrentTime: (time) => set({ currentTime: time }),
      updateProfile: (data) => set((s) => ({ user: { ...s.user, ...data } })),

      createConversation: (model) => {
        const conv: AIConversation = { id: `conv-${Date.now()}`, title: 'New conversation', model, systemInstruction: '', messages: [], createdAt: Date.now() };
        set((s) => ({ aiConversations: [conv, ...s.aiConversations], currentConversationId: conv.id }));
      },
      setSystemInstruction: (instruction) => {
        const { currentConversationId, aiConversations } = get();
        if (!currentConversationId) return;
        set({ aiConversations: aiConversations.map((c) => c.id === currentConversationId ? { ...c, systemInstruction: instruction } : c) });
      },
      sendAIMessage: (prompt) => {
        const { currentConversationId, aiConversations, aiModels, aiPersona, totalTokensUsed, totalEstimatedCost } = get();
        if (!currentConversationId) return;
        const conv = aiConversations.find((c) => c.id === currentConversationId);
        if (!conv) return;
        const userMsg: AIMessage = { id: `ai-${Date.now()}`, role: 'user', content: prompt, timestamp: Date.now() };
        const inputTokens = estimateTokens(prompt);
        set((s) => ({ aiConversations: s.aiConversations.map((c) => c.id === currentConversationId ? { ...c, messages: [...c.messages, userMsg], title: c.messages.length === 0 ? prompt.slice(0, 40) : c.title } : c), isStreaming: true }));
        const fullResponse = generateAIResponse(prompt, conv.model, conv.systemInstruction, aiPersona);
        const outputTokens = estimateTokens(fullResponse);
        const latency = estimateLatency(conv.model, outputTokens);
        const model = aiModels.find((m) => m.id === conv.model);
        const cost = model ? (inputTokens / 1000000) * model.inputCost + (outputTokens / 1000000) * model.outputCost : 0;
        setTimeout(() => {
          const aiMsg: AIMessage = { id: `ai-${Date.now() + 1}`, role: 'model', content: fullResponse, model: conv.model, timestamp: Date.now(), tokens: inputTokens + outputTokens, latency };
          set((s) => ({ isStreaming: false, aiConversations: s.aiConversations.map((c) => c.id === currentConversationId ? { ...c, messages: [...c.messages, aiMsg] } : c), usageRpm: Math.min(s.usageRpm + 1, model?.rpm || 1000), usageTpm: Math.min(s.usageTpm + inputTokens + outputTokens, model?.tpm || 1000000), usageRpd: Math.min(s.usageRpd + 1, model?.rpd || 1000), totalTokensUsed: s.totalTokensUsed + inputTokens + outputTokens, totalEstimatedCost: s.totalEstimatedCost + cost }));
        }, latency);
      },
      setCompareModels: (a, b) => set({ compareModelA: a, compareModelB: b }),
      generateImage: (prompt) => {
        const img: GeneratedImage = { id: `img-${Date.now()}`, prompt, model: 'nano-banana', gradient: imageGradients[Math.floor(Math.random() * imageGradients.length)], emoji: imageEmojis[Math.floor(Math.random() * imageEmojis.length)], timestamp: Date.now() };
        set((s) => ({ generatedImages: [img, ...s.generatedImages] }));
      },
      getUrlSummary: (url) => {
        const summaryMsg: AIMessage = { id: `ai-url-${Date.now()}`, role: 'model', content: `I've retrieved and analyzed the content from ${url}.\n\n**Summary:**\n\u2022 The page appears to be a web resource with relevant content\n\u2022 Key topics include the main subject matter\n\u2022 The content is structured for readability\n\n*Note: In production, this would use the URL Context tool to fetch real content.*`, model: 'gemini-2.5-flash', timestamp: Date.now(), tokens: 150, latency: 1200 };
        const { currentConversationId } = get();
        if (!currentConversationId) return;
        set((s) => ({ aiConversations: s.aiConversations.map((c) => c.id === currentConversationId ? { ...c, messages: [...c.messages, summaryMsg] } : c), usageRpm: s.usageRpm + 1, totalTokensUsed: s.totalTokensUsed + 150 }));
      },
      clearConversation: () => {
        const { currentConversationId } = get();
        if (!currentConversationId) return;
        set((s) => ({ aiConversations: s.aiConversations.map((c) => c.id === currentConversationId ? { ...c, messages: [] } : c) }));
      },
    }),
    {
      name: 'nexus-storage',
      partialize: (s) => ({
        user: s.user, posts: s.posts, stories: s.stories, chats: s.chats,
        generatedImages: s.generatedImages, aiConversations: s.aiConversations,
        totalTokensUsed: s.totalTokensUsed, totalEstimatedCost: s.totalEstimatedCost,
        themeId: s.themeId, colorMode: s.colorMode, customPalette: s.customPalette,
        serverMode: s.serverMode, e2eEncryption: s.e2eEncryption, ephemeralStorage: s.ephemeralStorage,
        biometricEnabled: s.biometricEnabled, twoFactorEnabled: s.twoFactorEnabled,
        readReceipts: s.readReceipts, onlineStatus: s.onlineStatus,
        aiPersona: s.aiPersona, aiUiStyle: s.aiUiStyle,
        syncEnabled: s.syncEnabled, offlineMode: s.offlineMode,
        cloudBackup: s.cloudBackup, backupEncryption: s.backupEncryption,
        hapticsEnabled: s.hapticsEnabled, soundEnabled: s.soundEnabled,
        animationsEnabled: s.animationsEnabled, reducedMotion: s.reducedMotion, dataSaver: s.dataSaver,
        authUser: s.authUser,
      }),
    }
  )
);
