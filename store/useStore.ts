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
  { id: 'u1', name: 'You', username: '@you', avatar: 'ğŸ§‘', bio: 'Living life one post at a time âœ¨', followers: 1248, following: 392, posts: 47 },
];

const seedPosts: Post[] = [
  {
    id: 'p1', userId: 'u2', userName: 'Sarah Chen', userAvatar: 'ğŸ‘©',
    content: 'Just finished my morning hike! The view from Eagle Peak was absolutely worth the 6am start. Nature really is the best therapy ğŸ–ï¸',
    timestamp: Date.now() - 3600000, likes: 247, liked: false,
    comments: [
      { id: 'c1', userName: 'Marcus Lee', userAvatar: 'ğŸ‘¨', content: 'Stunning shot! What camera did you use?', timestamp: Date.now() - 3000000 },
      { id: 'c2', userName: 'Priya K', userAvatar: 'ğŸ‘©â€ğŸ¦°', content: 'Adding this to my bucket list!', timestamp: Date.now() - 1800000 },
    ],
  },
  {
    id: 'p2', userId: 'u3', userName: 'Alex Rivera', userAvatar: 'ğŸ§”',
    content: 'Hot take: pineapple absolutely belongs on pizza and I will die on this hill ğŸ’ğŸ•',
    timestamp: Date.now() - 7200000, likes: 1089, liked: true,
    comments: [
      { id: 'c3', userName: 'Jordan Kim', userAvatar: 'ğŸ§‘â€ğŸ¦±', content: 'This is war.', timestamp: Date.now() - 6000000 },
    ],
  },
  {
    id: 'p3', userId: 'u4', userName: 'Maya Patel', userAvatar: 'ğŸ‘§',
    content: 'Three months into my startup journey. Some days feel impossible, but then I remember why I started. To anyone building something â€” keep going. The world needs what youâ€™re making. ğŸš€',
    timestamp: Date.now() - 14400000, likes: 3421, liked: false,
    comments: [
      { id: 'c4', userName: 'Tom Wright', userAvatar: 'ğŸ‘¨â€ğŸ¦³', content: 'Needed this today. Thank you.', timestamp: Date.now() - 12000000 },
      { id: 'c5', userName: 'Lisa Zhang', userAvatar: 'ğŸ‘©â€ğŸ¦°', content: 'Whatâ€™s the startup about?', timestamp: Date.now() - 10000000 },
      { id: 'c6', userName: 'Maya Patel', userAvatar: 'ğŸ‘§', content: '@Lisa â€” AI tools for small businesses! Will share more soon.', timestamp: Date.now() - 9000000 },
    ],
  },
  {
    id: 'p4', userId: 'u5', userName: 'Kai Johnson', userAvatar: 'ğŸ§‘â€ğŸ¤',
    content: 'New track dropping this Friday. Been working on it for months. Hereâ€™s a sneak peek of the lyrics: "City lights blur into stars, weâ€™re driving through Mars..." ğŸµ',
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
  { id: 's1', userId: 'u2', userName: 'Sarah', userAvatar: 'ğŸ‘©', content: 'Morning vibes â˜€ï¸', bgColor: storyColors[0], timestamp: Date.now() - 1800000, viewed: false },
  { id: 's2', userId: 'u3', userName: 'Alex', userAvatar: 'ğŸ§”', content: 'Pizza night ğŸ•', bgColor: storyColors[1], timestamp: Date.now() - 3600000, viewed: false },
  { id: 's3', userId: 'u4', userName: 'Maya', userAvatar: 'ğŸ‘§', content: 'Building mode ğŸš€', bgColor: storyColors[2], timestamp: Date.now() - 5400000, viewed: false },
  { id: 's4', userId: 'u5', userName: 'Kai', userAvatar: 'ğŸ§‘â€ğŸ¤', content: 'Studio session ğŸµ', bgColor: storyColors[3], timestamp: Date.now() - 7200000, viewed: true },
];

const seedChats: Chat[] = [
  {
    id: 'chat1', contactId: 'u2', contactName: 'Sarah Chen', contactAvatar: 'ğŸ‘©', contactStatus: 'Hey! Are we still on for hiking?',
    messages: [
      { id: 'm1', senderId: 'u2', content: 'Hey! Are we still on for hiking?', timestamp: Date.now() - 7200000, type: 'text', encrypted: true },
      { id: 'm2', senderId: 'me', content: 'Absolutely! 6am at the trailhead?', timestamp: Date.now() - 7000000, type: 'text', encrypted: true },
      { id: 'm3', senderId: 'u2', content: 'Perfect, see you there!', timestamp: Date.now() - 6900000, type: 'text', encrypted: true },
      { id: 'm4', senderId: 'u2', content: 'Donâ€™t forget water ğŸ’§', timestamp: Date.now() - 6800000, type: 'text', encrypted: true },
    ],
    lastMessage: "Don't forget water ğŸ’§", lastMessageTime: Date.now() - 6800000, unread: 2, online: true,
  },
  {
    id: 'chat2', contactId: 'u3', contactName: 'Alex Rivera', contactAvatar: 'ğŸ§”', contactStatus: 'Bro the pizza debate continues...',
    messages: [
      { id: 'm5', senderId: 'u3', content: 'Bro the pizza debate continues...', timestamp: Date.now() - 10800000, type: 'text', encrypted: true },
      { id: 'm6', senderId: 'me', content: 'Pineapple stays. End of discussion ğŸ˜¤', timestamp: Date.now() - 10700000, type: 'text', encrypted: true },
      { id: 'm7', senderId: 'u3', content: 'Weâ€™ll see about that...', timestamp: Date.now() - 10600000, type: 'text', encrypted: true },
    ],
    lastMessage: "We'll see about that...", lastMessageTime: Date.now() - 10600000, unread: 0, online: false,
  },
  {
    id: 'chat3', contactId: 'u4', contactName: 'Maya Patel', contactAvatar: 'ğŸ‘§', contactStatus: 'Thank you so much for the encouragement!',
    messages: [
      { id: 'm8', senderId: 'u4', content: 'Thank you so much for the encouragement!', timestamp: Date.now() - 86400000, type: 'text', encrypted: true },
      { id: 'm9', senderId: 'me', content: 'You earned it. Keep building!', timestamp: Date.now() - 86300000, type: 'text', encrypted: true },
    ],
    lastMessage: 'You earned it. Keep building!', lastMessageTime: Date.now() - 86300000, unread: 0, online: true,
  },
  {
    id: 'chat4', contactId: 'u5', contactName: 'Kai Johnson', contactAvatar: 'ğŸ§‘â€ğŸ¤', contactStatus: 'Wait until you hear the final mix ğŸ”¥',
    messages: [
      { id: 'm10', senderId: 'u5', content: 'Wait until you hear the final mix ğŸ”¥', timestamp: Date.now() - 172800000, type: 'text', encrypted: true },
    ],
    lastMessage: 'Wait until you hear the final mix ğŸ”¥', lastMessageTime: Date.now() - 172800000, unread: 1, online: false,
  },
];

const seedTracks: Track[] = [
  { id: 't1', title: 'Neon Skyline', artist: 'Kai Johnson', album: 'Midnight Drive', duration: 215, cover: 'ğŸŒƒ' },
  { id: 't2', title: 'Through Mars', artist: 'Kai Johnson', album: 'Midnight Drive', duration: 198, cover: 'ğŸª' },
  { id: 't3', title: 'City Lights', artist: 'Luna Echo', album: 'Urban Dreams', duration: 243, cover: 'ğŸŒ†' },
  { id: 't4', title: 'Gravity', artist: 'The Pulse', album: 'Orbit', duration: 187, cover: 'ğŸŒ€' },
  { id: 't5', title: 'Sunset Boulevard', artist: 'Neon Waves', album: 'Golden Hour', duration: 224, cover: 'ğŸŒ…' },
  { id: 't6', title: 'Electric Soul', artist: 'Aria Stone', album: 'Voltage', duration: 256, cover: 'âš¡' },
  { id: 't7', title: 'Lost in Tokyo', artist: 'Future Ghost', album: 'Shibuya', duration: 312, cover: 'ğŸ¯' },
  { id: 't8', title: 'Crystal Clear', artist: 'Maya Patel', alvbum: 'Clarity', duration: 201, cover: 'ğŸ’§' },
];

const autoReplies = [
  'Thatâ€™s awesome! ğŸ˜„',
  'No way, really?',
  'Haha I canâ€™t believe that happened ğŸ˜‚',
  'For sure! Letâ€™s do it.',
  'I was just thinking the same thing!',
  'Tell me more about that.',
  'That sounds amazing ğŸ”¥',
  'Wow, congrats! ğŸ‰',
  'Iâ€™ll let you know soon.',
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
  professional: '[Professional tone]  ',
  friendly: '[Friendly tone]  ',
  creative: '[Creative tone]  ',
  concise: '[Concise]  ',
  academic: '[Academic]  ',
  witty: '[Witty]  ',
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
    response = `Here's an approach I'd suggest:\n\n\n\`\`\`javascript\nfunction example(input) {\n  if (!input) return null;\n  const result = input.map(item => ({\n    ...item,\n    processed: true,\n    timestamp: Date.now()\n  }));\n  return result.filter(r => r.valid !== false);\n}\n\`\`\`\n\nThis handles edge cases, preserves data integrity, and runs in O(n) time. Want me to adapt it for a specific use case?`;
  } else if (p.includes('image') || p.includes('generate') || p.includes('draw') || p.includes('picture')) {
    response = `I can help with image generation! In a production environment, I'd send your prompt to the image model and return a generated image. Here's what I'd create based on "${prompt.slice(0, 80)}":\n\nğŸ¨ A visually stunning composition with vibrant colors, dynamic lighting, and intricate details that capture the essence of your request.`;
  } else if (p.includes('summarize') || p.includes('summary')) {
    response = `Here's a concise summary:\n\nâ€¢ **Key Point 1**: The main idea centers around the core theme\nâ€¢ **Key Point 2**: Supporting details provide context and depth\nâ€¢ **Key Point 3**: The conclusion ties everything together\n\nWould you like me to expand on any of these points?`;
  } else if (p.includes('write') || p.includes('story') || p.includes('poem')) {
    response = `Here's a creative response:\n\nIn the quiet hum of morning light,\nwhere coffee steam meets dawn's first breath,\na story waits within the glow â€”\nnot yet told, but felt.\n\nEach word a brushstroke on the page,\neach line a path through unmarked snow.\nThe pen moves forward, trusting ink\nto find what hearts already know.`;
  } else if (p.includes('explain') || p.includes('what is') || p.includes('how does')) {
    response = `Great question! Let me break this down:\n\n**Overview**: The concept involves several interconnected parts that work together.\n\n**How it works**: Think of it like a well-organized system â€” each component has a specific role, and they communicate through defined interfaces.\n\n**Why it matters**: Understanding this gives you a mental model to reason about similar systems.`;
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

const imageEmojis = ['ğŸŒ…', 'ğŸŒŒ', 'ğŸ–ï¸', 'ğŸŒŠ', 'ğŸŒ¸', 'ğŸ¨', 'âœ¨', 'ğŸ”¥', 'ğŸ’«', 'ğŸŒˆ'];

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
  setOnlineStatus: (v: boolean2 ) => void;

  // AI
  aiPersona: string;
  aiUiStyle: string;
  setAiPersona: (p: string) => void;
  setAiUiStyle: (s: string) => void;

  // Sync & Backup
  syncEnabled: boolean;
  offlineMode: booleanÊ  cloudBackup: booleanÂˆ˜XÚİ\[˜Ü\[Ûˆ›ÛÛX[ƒ°¢6WE7–æ4Væ&ÆVC¢‡c¢&ööÆVâ’Óâfö–C°¢6WDöffÆ–æTÖöFS¢‡c¢&ööÆVâ‚’Óâfö–C°¢6WD6Æ÷VD&6·W¢‡c¢&ööÆVâ’Óâfö–C°¢6WD&6·WVæ7'—F–öã¢‡c¢&ööÆVâ’Óâfö–C° ¢òòW‡W&–Væ6P¢†F–74Væ&ÆVC¢&ööÆVã°¢6÷VæDVæ&ÆVC¢&ööÆVã°¢æ–ÖF–öç4Væ&ÆVC¢&ööÆVã°¢&VGV6VDÖ÷F–öã¢&ööÆVã°¢FF6fW#¢&ööÆVã°¢6WD†F–74Væ&ÆVC¢‡c¢&ööÆVâ‚’Óâfö–C°¢6WE6÷VæDVæ&ÆVC¢‡c¢&ööÆVâ‚’Óâfö–C°¢6WDæ–ÖF–öç4Væ&ÆVC¢‡c¢&ööÆVâ’Óâfö–C°¢6WE&VGV6VDÖ÷F–öã¢‡c¢&ööÆVâ’Óâfö–C°¢6WDFF6fW#¢‡c¢&ööÆVâ’Óâfö–C° ¢òò6ö6–ÂFF¢W6W#¢W6W#°¢÷7G3¢÷7EµÓ°¢7F÷&–W3¢7F÷'•µÓ°¢6†G3¢6†EµÓ°¢G&6·3¢G&6µµÓ°¢7W'&VçEG&6³¢G&6²ÂçVÆÃ°¢—5Æ––æs¢&ööÆVã°¢7W'&VçEF–ÖS¢çVÖ&W#°¢7W'&VçD6†D–C¢7G&–ærÂçVÆÃ°¢Vç&VD6†G3¢çVÖ&W#°¢7F÷'”6öÆ÷'3¢7G&–æuµÓ° ¢òò’Æ–w&÷Væ@¢”ÖöFVÇ3¢”ÖöFVÅµÓ°¢”6öçfW'6F–öç3¢”6öçfW'6F–öåµÓ°¢7W'&VçD6öçfW'6F–öä–C¢7G&–ærÂçVÆÃ°¢—57G&VÖ–æs¢&ööÆVàì(€•¹•É…Ñ•‘%µ…•Ìè•¹•É…Ñ•‘%µ…•mtì(€ÕÍ…•IÁ´è¹Õµ‰•Èì(€ÕÍ…•QÁ´è¹Õµ‰•Èì(€ÕÍ…•IÁè¹Õµ‰•Èì(€Ñ½Ñ…±Q½­•¹ÍUÍ•è¹Õµ‰•Èì(€Ñ½Ñ…±ÍÑ¥µ…Ñ•‘½ÍĞè¹Õµ‰•Èì(€½µÁ…É•5½‘•±èÍÑÉ¥¹œì(€½µÁ…É•5½‘•±èÍÑÉ¥¹œì((€€¼¼••(€…‘‘A½ÍĞè€¡½¹Ñ•¹ĞèÍÑÉ¥¹œ°¥µ…”üèÍÑÉ¥¹œ¤€ôøÙ½¥ì(€Ñ½±•1¥­”è€¡Á½ÍÑ%èÍÑÉ¥¹œ¤€ôøÙ½¥ì(€…‘‘½µµ•¹Ğè€¡Á½ÍÑ%èÍÑÉ¥¹œ°½¹Ñ•¹ĞèÍÑÉ¥¹œ¤€ôøÙ½¥ì((€€¼¼MÑ½É¥•Ì(€…‘‘MÑ½Éäè€¡½¹Ñ•¹ĞèÍÑÉ¥¹œ°‰½±½ÈèÍÑÉ¥¹œ¤€ôøÙ½¥ì(€µ…É­MÑ½ÉåY¥•İ•è€¡ÍÑ½Éå%èÍÑÉ¥¹œ¤€ôøÙ½¥ì((€€¼¼¡…Ğ(€Í•¹‘5•ÍÍ…”è€¡¡…Ñ%èÍÑÉ¥¹œ°½¹Ñ•¹ĞèÍÑÉ¥¹œ¤€ôøÙ½¥ì(€½Á•¹¡…Ğè€¡¡…Ñ%èÍÑÉ¥¹œ¤€ôøÙ½¥ì(€µ…É­¡…ÑI•…è€¡¡…Ñ%èÍÑÉ¥¹œ¤€ôøÙ½¥ì((€€¼¼5ÕÍ¥Œ(€Á±…åQÉ…¬è€¡ÑÉ…¬èQÉ…¬¤€ôøÙ½¥ì(€Ñ½±•A±…äè€ ¤€ôøÙ½¥ì(€¹•áÑQÉ…¬è€ ¤€ôøÙ½¥ì(€ÁÉ•ÙQÉ…¬è€ ¤€ôøÙ½¥ì(€Í•ÑÕÉÉ•¹ÑQ¥µ”è€¡Ñ¥µ”è¹Õµ‰•È¤€ôøÙ½¥ì(€ÕÁ‘…Ñ•AÉ½™¥±”è€¡‘…Ñ„èA…ÉÑ¥…°ñUÍ•Èø¤€ôøÙ½¥ì((€€¼¼$A±…åÉ½Õ¹(€Í•¹‘%5•ÍÍ…”è€¡ÁÉ½µÁĞèÍÑÉ¥¹œ¤€ôøÙ½¥ì(€Í•ÑMåÍÑ•µ%¹ÍÑÉÕÑ¥½¸è€¡¥¹ÍÑÉÕÑ¥½¸èÍÑÉ¥¹œ¤€ôøÙ½¥ì(€É•…Ñ•½¹Ù•ÉÍ…Ñ¥½¸è€¡µ½‘•°èÍÑÉ¥¹œ¤€ôøÙ½¥ì(€Í•Ñ½µÁ…É•5½‘•±Ìè€¡„èÍÑÉ¥¹œ°ˆèÍÑÉ¥¹œ¤€ôøÙ½¥ì(€•¹•É…Ñ•%µ…”è€¡ÁÉ½µÁĞèÍÑÉ¥¹œ¤€ôøÙ½¥ì(€•ÑUÉ±MÕµµ…Éäè€¡ÕÉ°èÍÑÉ¥¹œ¤€ôøÙ½¥ì(€±•…É½¹Ù•ÉÍ…Ñ¥½¸è€ ¤€ôøÙ½¥ì)ô()•áÁ½ÉĞ½¹ÍĞÕÍ•MÑ½É”€ôÉ•…Ñ”ñMÑ½É•MÑ…Ñ”ø ¤ (€Á•ÉÍ¥ÍĞ (€€€€¡Í•Ğ°•Ğ¤€ôø€¡ì(€€€€€€¼¼ÕÑ (€€€€€…ÕÑ¡UÍ•Èè¹Õ±°°(€€€€€Í•ÑÕÑ¡UÍ•Èè€¡ÕÍ•È¤€ôøÍ•Ğ¡ì…ÕÑ¡UÍ•ÈèÕÍ•Èô¤°((€€€€€€¼¼Q¡•µ”(€€€€€Ñ¡•µ•%è€¹•áÕÌœ°(€€€€€½±½É5½‘”è€‘…É¬œ°(€€€€€ÕÍÑ½µA…±•ÑÑ”è¹Õ±°°(€€€€€Í•ÑQ¡•µ•%è€¡¥¤€ôøÍ•Ğ¡ìÑ¡•µ•%è¥ô¤°(€€€€€Í•Ñ½±½É5½‘”è€¡µ½‘”¤€ôøÍ•Ğ¡ì½±½É5½‘”èµ½‘”ô¤°(€€€€€Í•ÑÕÍÑ½µA…±•ÑÑ”è€¡Á…±•ÑÑ”¤€ôøÍ•Ğ¡ìÕÍÑ½µA…±•ÑÑ”èÁ…±•ÑÑ”ô¤°((€€€€€€¼¼M•ÕÉ¥Ñä(€€€€€Í•ÉÙ•É5½‘”è€•¹ÑÉ…±¥é•œ°(€€€€€”É•¹ÉåÁÑ¥½¸èÑÉÕ”°(€€€€€•Á¡•µ•É…±MÑ½É…”è™…±Í”°(€€€€€‰¥½µ•ÑÉ¥¹…‰±•è™…±Í”°(€€€€€Ñİ½…Ñ½É¹…‰±•è™…±Í”°(€€€€€É•…‘I••¥ÁÑÌèÑÉÕ”°(€€€€€½¹±¥¹•MÑ…ÑÕÌèÑÉÕ”°(€€€€€Í•ÑM•ÉÙ•É5½‘”è€¡µ½‘”¤€ôøÍ•Ğ¡ìÍ•ÉÙ•É5½‘”èµ½‘”ô¤°(€€€€€Í•ÑÉ•¹ÉåÁÑ¥½¸è€¡Ø¤€ôøÍ•Ğ¡ì”É•¹ÉåÁÑ¥½¸èØô¤°(€€€€€Í•ÑÁ¡•µ•É…±MÑ½É…”è€¡Ø¤€ôøÍ•Ğ¡ì•Á¡•µ•É…±MÑ½É…”èØô¤°(€€€€€Í•Ñ	¥½µ•ÑÉ¥¹…‰±•è€¡Ø¤€ôøÍ•Ğ¡ì‰¥½µ•ÑÉ¥¹…‰±•èØô¤°(€€€€€Í•ÑQİ½…Ñ½É¹…‰±•è€¡Ø¤€ôøÍ•Ğ¡ìÑİ½…Ñ½É¹…‰±•èØô¤°(€€€€€Í•ÑI•…‘I••¥ÁÑÌè€¡Ø¤€ôøÍ•Ğ¡ìÉ•…‘I••¥ÁÑÌèØô¤°(€€€€€Í•Ñ=¹±¥¹•MÑ…ÑÕÌè€¡Ø¤€ôøÍ•Ğ¡ì½¹±¥¹•MÑ…ÑÕÌèØô¤°((€€€€€€¼¼$A•ÉÍ½¹„(€€€€€…¥A•ÉÍ½¹„è€™É¥•¹‘±äœ°(€€€€€…¥U¥MÑå±”è€ÍÑÕ‘¥¼œ°(€€€€€Í•Ñ¥A•ÉÍ½¹„è€¡À¤€ôøÍ•Ğ¡ì…¥A•ÉÍ½¹„èÀô¤°(€€€€€Í•Ñ¥U¥MÑå±”è€¡Ì¤€ôøÍ•Ğ¡ì…¥U¥MÑå±”èÌô¤°((€€€€€€¼¼Må¹Œ(€€€€€Íå¹¹…‰±•èÑÉÕ”°(€€€€€½™™±¥¹•5½‘”èÑÉÕ”°(€€€€€±½Õ‘	…­ÕÀèÑÉÕ”°(€€€€€‰…­ÕÁ¹ÉåÁÑ¥½¸èÑÉÕ”°(€€€€€Í•ÑMå¹¹…‰±•è€¡Ø¤€ôøÍ•Ğ¡ìÍå¹¹…‰±•èØô¤°(€€€€€Í•Ñ=™™±¥¹•5½‘”è€¡Ø¤€ôøÍ•Ğ¡ì½™™±¥¹•5½‘”èØô¤°(€€€€€Í•Ñ±½Õ‘	…­ÕÀè€¡Ø¤€ôøÍ•Ğ¡ì±½Õ‘	…­ÕÀèØô¤°(€€€€€Í•Ñ	…­ÕÁ¹ÉåÁÑ¥½¸è€¡Ø¤€ôøÍ•Ğ¡ì‰…­ÕÁ¹ÉåÁÑ¥½¸èØô¤°((€€€€€€¼¼áÁ•É¥•¹”(€€€€€¡…ÁÑ¥Í¹…‰±•èÑÉÕ”°(€€€€€Í½Õ¹‘¹…‰±•è™…±Í”°(€€€€€…¹¥µ…Ñ¥½¹Í¹…‰±•èÑÉÕ”°(€€€€€É•‘Õ•‘5½Ñ¥½¸è™…±Í”°(€€€€€‘…Ñ…M…Ù•Èè™…±Í”°(€€€€€Í•Ñ!…ÁÑ¥Í¹…‰±•è€¡Ø¤€ôøìÍ•Ğ¡ì¡…ÁÑ¥Í¹…‰±•èØô¤ìÍ•Ñ!…ÁÑ¥Í¹…‰±•¡Ø¤ìô°(€€€€€Í•ÑM½Õ¹‘¹…‰±•è€¡Ø¤€ôøÍ•Ğ¡ìÍ½Õ¹‘¹…‰±•èØô¤°(€€€€€Í•Ñ¹¥µ…Ñ¥½¹Í¹…‰±•è€¡Ø¤€ôøÍ•Ğ¡ì…¹¥µ…Ñ¥½¹Í¹…‰±•èØô¤°(€€€€€Í•ÑI•‘Õ•‘5½Ñ¥½¸è€¡Ø¤€ôøÍ•Ğ¡ìÉ•‘Õ•‘5½Ñ¥½¸èØô¤°(€€€€€Í•Ñ…Ñ…M…Ù•Èè€¡Ø¤€ôøÍ•Ğ¡ì‘…Ñ…M…Ù•ÈèØô¤°((€€€€€€¼¼M½¥…°(€€€€€ÕÍ•ÈèÍ••‘UÍ•ÉÍlÁt°(€€€€€Á½ÍÑÌèÍ••‘A½ÍÑÌ°(€€€€€ÍÑ½É¥•ÌèÍ••‘MÑ½É¥•Ì°(€€€€€¡…ÑÌèÍ••‘¡…ÑÌ°(€€€€€ÑÉ…­ÌèÍ••‘QÉ…­Ì°(€€€€€ÕÉÉ•¹ÑQÉ…¬è¹Õ±°°(€€€€€¥ÍA±…å¥¹œè™…±Í”°(€€€€€ÕÉÉ•¹ÑQ¥µ”è€À°(€€€€€ÕÉÉ•¹Ñ¡…Ñ%è¹Õ±°°(€€€€€Õ¹É•…‘¡…ÑÌè€Ì°(€€€€€ÍÑ½Éå½±½ÉÌ°((€€€€€€¼¼$(€€€€€…¥5½‘•±Ì°(€€€€€…¥½¹Ù•ÉÍ…Ñ¥½¹Ìèmt°(€€€€€ÕÉÉ•¹Ñ½¹Ù•ÉÍ…Ñ¥½¹%è¹Õ±°°(€€€€€¥ÍMÑÉ•…µ¥¹œè™…±Í”°(€€€€€•¹•É…Ñ•‘%µ…•Ìèmt°(€€€€€ÕÍ…•IÁ´è€À°(€€€€€ÕÍ…•QÁ´è€À°(€€€€€ÕÍ…•IÁè€À°(€€€€€Ñ½Ñ…±Q½­•¹ÍUÍ•è€À°(€€€€€Ñ½Ñ…±ÍÑ¥µ…Ñ•‘½ÍĞè€À°(€€€€€½µÁ…É•5½‘•±è€•µ¥¹¤´È¸ÔµÁÉ¼œ°(€€€€€½µÁ…É•5½‘•±è€•µ¥¹¤´È¸Ôµ™±…Í œ°((€€€€€…‘‘A½ÍĞè€¡½¹Ñ•¹Ğ°¥µ…”¤€ôøì(€€€€€€€½¹ÍĞìÕÍ•Èô€ô•Ğ ¤ì(€€€€€€€½¹ÍĞ¹•İA½ÍĞèA½ÍĞ€ôì¥èÀ‘í…Ñ”¹¹½Ü ¥õ€°ÕÍ•É%è€µ”œ°ÕÍ•É9…µ”èÕÍ•È¹¹…µ”°ÕÍ•ÉÙ…Ñ…ÈèÕÍ•È¹…Ù…Ñ…È°½¹Ñ•¹Ğ°¥µ…”°Ñ¥µ•ÍÑ…µÀè…Ñ”¹¹½Ü ¤°±¥­•Ìè€À°±¥­•è™…±Í”°½µµ•¹ÑÌèmtôì(€€€€€€€Í•Ğ ¡Ì¤€ôø€¡ìÁ½ÍÑÌèm¹•İA½ÍĞ°€¸¸¹Ì¹Á½ÍÑÍtô¤¤ì(€€€€€ô°(€€€€€Ñ½±•1¥­”è€¡Á½ÍÑ%¤€ôøì(€€€€€€€Í•Ğ ¡Ì¤€ôø€¡ìÁ½ÍÑÌèÌ¹Á½ÍÑÌ¹µ…À ¡À¤€ôøÀ¹¥€ôôôÁ½ÍÑ%€üì€¸¸¹À°±¥­•è€…À¹±¥­•°±¥­•ÌèÀ¹±¥­•€üÀ¹±¥­•Ì€´€Ä€èÀ¹±¥­•Ì€¬€Äô€èÀ¤ô¤¤ì(€€€€€ô°(€€€€€…‘‘½µµ•¹Ğè€¡Á½ÍÑ%°½¹Ñ•¹Ğ¤€ôøì(€€€€€€€½¹ÍĞìÕÍ•Èô€ô•Ğ ¤ì(€€€€€€€Í•Ğ ¡Ì¤€ôø€¡ìÁ½ÍÑÌèÌ¹Á½ÍÑÌ¹µ…À ¡À¤€ôøÀ¹¥€ôôôÁ½ÍÑ%€üì€¸¸¹À°½µµ•¹ÑÌèl¸¸¹À¹½µµ•¹ÑÌ°ì¥èŒ‘í…Ñ”¹¹½Ü ¥õ€°ÕÍ•É9…µ”èÕÍ•È¹¹…µ”°ÕÍ•ÉÙ…Ñ…ÈèÕÍ•È¹…Ù…Ñ…È°½¹Ñ•¹Ğ°Ñ¥µ•ÍÑ…µÀè…Ñ”¹¹½Ü ¤õtô€èÀ¤ô¤¤ì(€€€€€ô°(€€€€€…‘‘MÑ½Éäè€¡½¹Ñ•¹Ğ°‰½±½È¤€ôøì(€€€€€€€½¹ÍĞìÕÍ•Èô€ô•Ğ ¤ì(€€€€€€€½¹ÍĞ¹•İMÑ½ÉäèMÑ½Éä€ôì¥èÌ‘í…Ñ”¹¹½Ü ¥õ€°ÕÍ•É%è€µ”œ°ÕÍ•É9…µ”èÕÍ•È¹¹…µ”°ÕÍ•ÉÙ…Ñ…ÈèÕÍ•È¹…Ù…Ñ…È°½¹Ñ•¹Ğ°‰½±½È°Ñ¥µ•ÍÑ…µÀè…Ñ”¹¹½Ü ¤°Ù¥•İ•è™…±Í”ôì(€€€€€€€Í•Ğ ¡Ì¤€ôø€¡ìÍÑ½É¥•Ìèm¹•İMÑ½Éä°€¸¸¹Ì¹ÍÑ½É¥•Ítô¤¤ì(€€€€€ô°(€€€€€µ…É­MÑ½ÉåY¥•İ•è€¡ÍÑ½Éå%¤€ôøì(€€€€€€€Í•Ğ ¡Ì¤€ôø€¡ìÍÑ½É¥•ÌèÌ¹ÍÑ½É¥•Ì¹µ…À ¡ÍĞ¤€ôøÍĞ¹¥€ôôôÍÑ½Éå%€üì€¸¸¹ÍĞ°Ù¥•İ•èÑÉÕ”ô€èÍĞ¤ô¤¤ì(€€€€€ô°(€€€€€Í•¹‘5•ÍÍ…”è€¡¡…Ñ%°½¹Ñ•¹Ğ¤€ôøì(€€€€€€€½¹ÍĞµÍœè5•ÍÍ…”€ôì¥è´‘í…Ñ”¹¹½Ü ¥õ€°Í•¹‘•É%è€µ”œ°½¹Ñ•¹Ğ°Ñ¥µ•ÍÑ…µÀè…Ñ”¹¹½Ü ¤°ÑåÁ”è€Ñ•áĞœ°•¹ÉåÁÑ•è•Ğ ¤¹”É•¹ÉåÁÑ¥½¸ôì(€€€€€€€Í•Ğ ¡Ì¤€ôø€¡ì¡…ÑÌèÌ¹¡…ÑÌ¹µ…À ¡Œ¤€ôøŒ¹¥€ôôô¡…Ñ%€üì€¸¸¹Œ°µ•ÍÍ…•Ìèl¸¸¹Œ¹µ•ÍÍ…•Ì°µÍt°±…ÍÑ5•ÍÍ…”è½¹Ñ•¹Ğ°±…ÍÑ5•ÍÍ…•Q¥µ”èµÍœ¹Ñ¥µ•ÍÑ…µÀô€èŒ¤ô¤¤ì(€€€€€€€Í•ÑQ¥µ•½ÕĞ  ¤€ôøì(€€€€€€€€€½¹ÍĞÉ•Á±ä€ô…ÕÑ½I•Á±¥•Ím5…Ñ ¹™±½½È¡5…Ñ ¹É…¹‘½´ ¤€¨…ÕÑ½I•Á±¥•Ì¹±•¹Ñ ¥tì(€€€€€€€€€½¹ÍĞÉ•Á±å5Íœè5•ÍÍ…”€ôì¥è´‘í…Ñ”¹¹½Ü ¤€¬€Åõ€°Í•¹‘•É%è•Ğ ¤¹¡…ÑÌ¹™¥¹ ¡Œ¤€ôøŒ¹¥€ôôô¡…Ñ%¤ü¹½¹Ñ…Ñ%€üü€ÔÈœ°½¹Ñ•¹ĞèÉ•Á±ä°Ñ¥µ•ÍÑ…µÀè…Ñ”¹¹½Ü ¤°ÑåÁ”è€Ñ•áĞœ°•¹ÉåÁÑ•è•Ğ ¤¹”É•¹ÉåÁÑ¥½¸ôì(€€€€€€€€€Í•Ğ ¡Ì¤€ôø€¡ì¡…ÑÌèÌ¹¡…ÑÌ¹µ…À ¡Œ¤€ôøŒ¹¥€ôôô¡…Ñ%€üì€¸¸¹Œ°µ•ÍÍ…•Ìèl¸¸¹Œ¹µ•ÍÍ…•Ì°É•Á±å5Ít°±…ÍÑ5•ÍÍ…”èÉ•Á±ä°±…ÍÑ5•ÍÍ…•Q¥µ”èÉ•Á±å5Íœ¹Ñ¥µ•ÍÑ…µÀô€èŒ¤ô¤¤ì(€€€€€€€ô°€ÄÔÀÀ€¬5…Ñ ¹É…¹‘½´ ¤€¨€ÈÀÀÀ¤ì(€€€€€ô°(€€€€€½Á•¹¡…Ğè€¡¡…Ñ%¤€ôøìÍ•Ğ¡ìÕÉÉ•¹Ñ¡…Ñ%è¡…Ñ%ô¤ì•Ğ ¤¹µ…É­¡…ÑI•…¡¡…Ñ%¤ìô°(€€€€€µ…É­¡…ÑI•…è€¡¡…Ñ%¤€ôøì(€€€€€€€Í•Ğ ¡Ì¤€ôøì(€€€€€€€€€½¹ÍĞ¡…ÑÌ€ôÌ¹¡…ÑÌ¹µ…À ¡Œ¤€ôøŒ¹¥€ôôô¡…Ñ%€üì€¸¸¹Œ°Õ¹É•…è€Àô€èŒ¤ì(€€€€€€€€€É•ÑÕÉ¸ì¡…ÑÌ°Õ¹É•…‘¡…ÑÌè¡…ÑÌ¹É•‘Õ” ¡ÍÕ´°Œ¤€ôøÍÕ´€¬Œ¹Õ¹É•…°€À¤ôì(€€€€€€€ô¤ì(€€€€€ô°(€€€€€Á±…åQÉ…¬è€¡ÑÉ…¬¤€ôøìÍ•Ğ¡ìÕÉÉ•¹ÑQÉ…¬èÑÉ…¬°¥ÍA±…å¥¹œèÑÉÕ”°ÕÉÉ•¹ÑQ¥µ”è€Àô¤ìô°(€€€€€Ñ½±•A±…äè€ ¤€ôøìÍ•Ğ ¡Ì¤€ôø€¡ì¥ÍA±…å¥¹œè€…Ì¹¥ÍA±…å¥¹œô¤¤ìô°(€€€€€¹•áÑQÉ…¬è€ ¤€ôøì(€€€€€€€½¹ÍĞìÑÉ…­Ì°ÕÉÉ•¹ÑQÉ…¬ô€ô•Ğ ¤ì(€€€€€€€¥˜€ …ÕÉÉ•¹ÑQÉ…¬¤É•ÑÕÉ¸ì(€€€€€€€½¹ÍĞ¥‘à€ôÑÉ…­Ì¹™¥¹‘%¹‘•à ¡Ğ¤€ôøĞ¹¥€ôôôÕÉÉ•¹ÑQÉ…¬¹¥¤ì(€€€€€€€Í•Ğ¡ìÕÉÉ•¹ÑQÉ…¬èÑÉ…­Íl¡¥‘à€¬€Ä¤€”ÑÉ…­Ì¹±•¹Ñ¡t°ÕÉÉ•¹ÑQ¥µ”è€À°¥ÍA±…å¥¹œèÑÉÕ”ô¤ì(€€€€€ô°(€€€€€ÁÉ•ÙQÉ…¬è€ ¤€ôøì(€€€€€€€½¹ÍĞìÑÉ…­Ì°ÕÉÉ•¹ÑQÉ…¬ô€ô•Ğ ¤ì(€€€€€€€¥˜€ …ÕÉÉ•¹ÑQÉ…¬¤É•ÑÕÉ¸ì(€€€€€€€½¹ÍĞ¥‘à€ôÑÉ…­Ì¹™¥¹‘%¹‘•à ¡Ğ¤€ôøĞ¹¥€ôôôÕÉÉ•¹ÑQÉ…¬¹¥¤ì(€€€€€€€Í•Ğ¡ìÕÉÉ•¹ÑQÉ…¬èÑÉ…­Íl¡¥‘à€´€Ä€¬ÑÉ…­Ì¹±•¹Ñ ¤€”ÑÉ…­Ì¹±•¹Ñ¡t°ÕÉÉ•¹ÑQ¥µ”è€À°¥ÍA±…å¥¹œèÑÉÕ”ô¤ì(€€€€€ô°(€€€€€Í•ÑÕÉÉ•¹ÑQ¥µ”è€¡Ñ¥µ”¤€ôøÍ•Ğ¡ìÕÉÉ•¹ÑQ¥µ”èÑ¥µ”ô¤°(€€€€€ÕÁ‘…Ñ•AÉ½™¥±”è€¡‘…Ñ„¤€ôøÍ•Ğ ¡Ì¤€ôø€¡ìÕÍ•Èèì€¸¸¹Ì¹ÕÍ•È°€¸¸¹‘…Ñ„ôô¤¤°((€€€€€É•…Ñ•½¹Ù•ÉÍ…Ñ¥½¸è€¡µ½‘•°¤€ôøì(€€€€€€€½¹ÍĞ½¹Øè%½¹Ù•ÉÍ…Ñ¥½¸€ôì¥è½¹Ø´‘í…Ñ”¹¹½Ü ¥õ€°Ñ¥Ñ±”è€9•Ü½¹Ù•ÉÍ…Ñ¥½¸œ°µ½‘•°°ÍåÍÑ•µ%¹ÍÑÉÕÑ¥½¸è€œœ°µ•ÍÍ…•Ìèmt°É•…Ñ•‘Ğè…Ñ”¹¹½Ü ¤ôì(€€€€€€€Í•Ğ ¡Ì¤€ôø€¡ì…¥½¹Ù•ÉÍ…Ñ¥½¹Ìèm½¹Ø°€¸¸¹Ì¹…¥½¹Ù•ÉÍ…Ñ¥½¹Ít°ÕÉÉ•¹Ñ½¹Ù•ÉÍ…Ñ¥½¹%è½¹Ø¹¥ô¤¤ì(€€€€€ô°(€€€€€Í•ÑMåÍÑ•µ%¹ÍÑÉÕÑ¥½¸è€¡¥¹ÍÑÉÕÑ¥½¸¤€ôøì(€€€€€€€½¹ÍĞìÕÉÉ•¹Ñ½¹Ù•ÉÍ…Ñ¥½¹%°…¥½¹Ù•ÉÍ…Ñ¥½¹Ìô€ô•Ğ ¤ì(€€€€€€€¥˜€ …ÕÉÉ•¹Ñ½¹Ù•ÉÍ…Ñ¥½¹%¤É•ÑÕÉ¸ì(€€€€€€€Í•Ğ¡ì…¥½¹Ù•ÉÍ…Ñ¥½¹Ìè…¥½¹Ù•ÉÍ…Ñ¥½¹Ì¹µ…À ¡Œ¤€ôøŒ¹¥€ôôôÕÉÉ•¹Ñ½¹Ù•ÉÍ…Ñ¥½¹%€üì€¸¸¹Œ°ÍåÍÑ•µ%¹ÍÑÉÕÑ¥½¸è¥¹ÍÑÉÕÑ¥½¸ô€èŒ¤ô¤ì(€€€€€ô°(€€€€€Í•¹‘…%5•ÍÍ…”è€¡ÁÉ½µÁĞ¤€ôøì(€€€€€€€½¹ÍĞìÕÉÉ•¹Ñ½¹Ù•ÉÍ…Ñ¥½¹%°…¥½¹Ù•ÉÍ…Ñ¥½¹Ì°…¥5½‘•±Ì°…¥A•ÉÍ½¹„°Ñ½Ñ…±Q½­•¹ÍUÍ•°Ñ½Ñ…±ÍÑ¥µ…Ñ•‘½ÍĞô€ô•Ğ ¤ì(€€€€€€€¥˜€ …ÕÉÉ•¹Ñ½¹Ù•ÉÍ…Ñ¥½¹%¤É•ÑÕÉ¸ì(€€€€€€€½¹ÍĞ½¹Ø€ô…¥½¹Ù•ÉÍ…Ñ¥½¹Ì¹™¥¹ ¡Œ¤€ôøŒ¹¥€ôôôÕÉÉ•¹Ñ½¹Ù•ÉÍ…Ñ¥½¹%¤ì(€€€€€€€¥˜€ …½¹Ø¤É•ÑÕÉ¸ì(€€€€€€€½¹ÍĞÕÍ•É5Íœè%5•ÍÍ…”€ôì¥è…¤´‘í…Ñ”¹¹½Ü ¥õ€°É½±”è€ÕÍ•Èœ°½¹Ñ•¹ĞèÁÉ½µÁĞ°Ñ¥µ•ÍÑ…µÀè…Ñ”¹¹½Ü ¤ôì(€€€€€€€½¹ÍĞ¥¹ÁÕÑQ½­•¹Ì€ô•ÍÑ¥µ…Ñ•Q½­•¹Ì¡ÁÉ½µÁĞ¤ì(€€€€€€€Í•Ğ ¡Ì¤€ôø€¡ì…¥½¹Ù•ÉÍ…Ñ¥½¹ÌèÌ¹…¥½¹Ù•ÉÍ…Ñ¥½¹Ì¹µ…À ¡Œ¤€ôøŒ¹¥€ôôôÕÉÉ•¹Ñ½¹Ù•ÉÍ…Ñ¥½¹%€üì€¸¸¹Œ°µ•ÍÍ…•Ìèl¸¸¹Œ¹µ•ÍÍ…•Ì°ÕÍ•É5Ít°Ñ¥Ñ±”èŒ¹µ•ÍÍ…•Ì¹±•¹Ñ €ôôô€À€üÁÉ½µÁĞ¹Í±¥” À°€ĞÀ¤€èŒ¹Ñ¥Ñ±”ô€èŒ¤°¥ÍMÑÉ•…µ¥¹œèÑÉÕ”ô¤¤ì(€€€€€€€½¹ÍĞ™Õ±±I•ÍÁ½¹Í”€ô•¹•É…Ñ•%I•ÍÁ½¹Í”¡ÁÉ½µÁĞ°½¹Ø¹µ½‘•°°½¹Ø¹ÍåÍÑ•µ%¹ÍÑÉÕÑ¥½¸°…¥A•ÉÍ½¹„¤ì(€€€€€€€½¹ÍĞ½ÕÑÁÕÑQ½­•¹Ì€ô•ÍÑ¥µ…Ñ•Q½­•¹Ì¡™Õ±±I•ÍÁ½¹Í”¤ì(€€€€€€€½¹ÍĞ±…Ñ•¹ä€ô•ÍÑ¥µ…Ñ•1…Ñ•¹ä¡½¹Ø¹µ½‘•°°½ÕÑÁÕÑQ½­•¹Ì¤ì(€€€€€€€½¹ÍĞµ½‘•°€ô…¥5½‘•±Ì¹™¥¹ ¡´¤€ôø´¹¥€ôôô½¹Ø¹µ½‘•°¤ì(€€€€€€€½¹ÍĞ½ÍĞ€ôµ½‘•°€ü€¡¥¹ÁÕÑQ½­•¹Ì€¼€ÄÀÀÀÀÀÀ¤€¨µ½‘•°¹¥¹ÁÕÑ½ÍĞ€¬€¡½ÕÑÁÕÑQ½­•¹Ì€¼€ÄÀÀÀÀÀÀ¤€¨µ½‘•°¹½ÕÑÁÕÑ½ÍĞ€è€Àì(€€€€€€€Í•ÑQ¥µ•½ÕĞ  ¤€ôøì(€€€€€€€€€½¹ÍĞ…¥5Íœè%5•ÍÍ…”€ôì¥è…¤´‘í…Ñ”¹¹½Ü ¤€¬€Åõ€°É½±”è€µ½‘•°œ°½¹Ñ•¹Ğè™Õ±±I•ÍÁ½¹Í”°µ½‘•°è½¹Ø¹µ½‘•°°Ñ¥µ•ÍÑ…µÀè…Ñ”¹¹½Ü ¤°Ñ½­•¹Ìè¥¹ÁÕÑQ½­•¹Ì€¬½ÕÑÁÕÑQ½­•¹Ì°±…Ñ•¹äôì(€€€€€€€€€Í•Ğ ¡Ì¤€ôø€¡ì¥ÍMÑÉ•…µ¥¹œè™…±Í”°…¥½¹Ù•ÉÍ…Ñ¥½¹ÌèÌ¹…¥½¹Ù•ÉÍ…Ñ¥½¹Ì¹µ…À ¡Œ¤€ôøŒ¹¥€ôôôÕÉÉ•¹Ñ½¹Ù•ÉÍ…Ñ¥½¹%€üì€¸¸¹Œ°µ•ÍÍ…•Ìèl¸¸¹Œ¹µ•ÍÍ…•Ì°…¥5Ítô€èŒ¤°ÕÍ…•IÁ´è5…Ñ ¹µ¥¸¡Ì¹ÕÍ…•IÁ´€¬€Ä°µ½‘•°ü¹ÉÁ´ñğ€ÄÀÀÀ¤°ÕÍ…•QÁ´è5…Ñ ¹µ¥¸¡Ì¹ÕÍ…•QÁ´€¬¥¹ÁÕÑQ½­•¹Ì€¬½ÕÑÁÕÑQ½­•¹Ì°µ½‘•°ü¹ÑÁ´ñğ€ÄÀÀÀÀÀÀ¤°ÕÍ…•IÁè5…Ñ ¹µ¥¸¡Ì¹ÕÍ…•IÁ€¬€Ä°µ½‘•°ü¹ÉÁñğ€ÄÀÀÀ¤°Ñ½Ñ…±Q½­•¹ÍUÍ•èÌ¹Ñ½Ñ…±Q½­•¹ÍUÍ•€¬¥¹ÁÕÑQ½­•¹Ì€¬½ÕÑÁÕÑQ½­•¹Ì°Ñ½Ñ…±ÍÑ¥µ…Ñ•‘½ÍĞèÌ¹Ñ½Ñ…±ÍÑ¥µ…Ñ•‘½ÍĞ€¬½ÍĞô¤¤ì(€€€€€€€ô°±…Ñ•¹ä¤ì(€€€€€ô°(€€€€€Í•Ñ½µÁ…É•5½‘•±Ìè€¡„°ˆ¤€ôøÍ•Ğ¡ì½µÁ…É•5½‘•±è„°½µÁ…É•5½‘•±èˆô¤°(€€€€€•¹•É…Ñ•%µ…”è€¡ÁÉ½µÁĞ¤€ôøì(€€€€€€€½¹ÍĞ¥µœè•¹•É…Ñ•‘%µ…”€ôì¥è¥µœ´‘í…Ñ”¹¹½Ü ¥õ€°ÁÉ½µÁĞ°µ½‘•°è€¹…¹¼µ‰…¹…¹„œ°É…‘¥•¹Ğè¥µ…•É…‘¥•¹ÑÍm5…Ñ ¹™±½½È¡5…Ñ ¹É…¹‘½´ ¤€¨¥µ…•É…‘¥•¹ÑÌ¹±•¹Ñ ¥t°•µ½©¤è¥µ…•µ½©¥Ím5…Ñ ¹™±½½È¡5…Ñ ¹É…¹‘½´ ¤€¨¥µ…•µ½©¥Ì¹±•¹Ñ ¥t°Ñ¥µ•ÍÑ…µÀè…Ñ”¹¹½Ü ¤ôì(€€€€€€€Í•Ğ ¡Ì¤€ôø€¡ì•¹•É…Ñ•‘%µ…•Ìèm¥µœ°€¸¸¹Ì¹•¹•É…Ñ•‘%µ…•Ítô¤¤ì(€€€€€ô°(€€€€€•ÑUÉ±MÕµµ…Éäè€¡ÕÉ°¤€ôøì(€€€€€€€½¹ÍĞÍÕµµ…Éå5Íœè%5•ÍÍ…”€ôì¥è…¤µÕÉ°´‘í…Ñ”¹¹½Ü ¥õ€°É½±”è€µ½‘•°œ°½¹Ñ•¹Ğè$Ù”É•ÑÉ¥•Ù•…¹…¹…±åé•Ñ¡”½¹Ñ•¹Ğ™É½´€‘íÕÉ±ô¹q¹q¸¨©MÕµµ…Éäè¨©q»ŠˆQ¡”Á…”…ÁÁ•…ÉÌÑ¼‰”„İ•ˆÉ•Í½ÕÉ”İ¥Ñ É•±•Ù…¹Ğ½¹Ñ•¹Ñq»Šˆ-•äÑ½Á¥Ì¥¹±Õ‘”Ñ¡”µ…¥¸ÍÕ‰©•Ğµ…ÑÑ•Éq»ŠˆQ¡”½¹Ñ•¹Ğ¥ÌÍÑÉÕÑÕÉ•™½ÈÉ•…‘…‰¥±¥Ñåq¹q¸©9½Ñ”è%¸ÁÉ½‘ÕÑ¥½¸°Ñ¡¥Ìİ½Õ±ÕÍ”Ñ¡”UI0½¹Ñ•áĞÑ½½°Ñ¼™•Ñ É•…°½¹Ñ•¹Ğ¸©€°µ½‘•°è€•µ¥¹¤´È¸Ôµ™±…Í œ°Ñ¥µ•ÍÑ…µÀè…Ñ”¹¹½Ü ¤°Ñ½­•¹Ìè€ÄÔÀ°±…Ñ•¹äè€ÄÈÀÀôì(€€€€€€€½¹ÍĞìÕÉÉ•¹Ñ½¹Ù•ÉÍ…Ñ¥½¹%ô€ô•Ğ ¤ì(€€€€€€€¥˜€ …ÕÉÉ•¹Ñ½¹Ù•ÉÍ…Ñ¥½¹%¤É•ÑÕÉ¸ì(€€€€€€€Í•Ğ ¡Ì¤€ôø€¡ì…¥½¹Ù•ÉÍ…Ñ¥½¹ÌèÌ¹…¥½¹Ù•ÉÍ…Ñ¥½¹Ì¹µ…À ¡Œ¤€ôøŒ¹¥€ôôôÕÉÉ•¹Ñ½¹Ù•ÉÍ…Ñ¥½¹%€üì€¸¸¹Œ°µ•ÍÍ…•Ìèl¸¸¹Œ¹µ•ÍÍ…•Ì°ÍÕµµ…Éå5Ítô€èŒ¤°ÕÍ…•IÁ´èÌ¹ÕÍ…•IÁ´€¬€Ä°Ñ½Ñ…±Q½­•¹ÍUÍ•èÌ¹Ñ½Ñ…±Q½­•¹ÍUÍ•€¬€ÄÔÀô¤¤ì(€€€€€ô°(€€€€€±•…É½¹Ù•ÉÍ…Ñ¥½¸è€ ¤€ôøì(€€€€€€€½¹ÍĞìÕÉÉ•¹Ñ½¹Ù•ÉÍ…Ñ¥½¹%ô€ô•Ğ ¤ì(€€€€€€€¥˜€ …ÕÉÉ•¹Ñ½¹Ù•ÉÍ…Ñ¥½¹%¤É•ÑÕÉ¸ì(€€€€€€€Í•Ğ ¡Ì¤€ôø€¡ì…¥½¹Ù•ÉÍ…Ñ¥½¹ÌèÌ¹…¥½¹Ù•ÉÍ…Ñ¥½¹Ì¹µ…À ¡Œ¤€ôøŒ¹¥€ôôôÕÉÉ•¹Ñ½¹Ù•ÉÍ…Ñ¥½¹%€üì€¸¸¹Œ°µ•ÍÍ…•Ìèmtô€èŒ¤ô¤¤ì(€€€€€ô°(€€€ô¤°(€€€ì(€€€€€¹…µ”è€¹•áÕÌµÍÑ½É…”œ°(€€€€€Á…ÉÑ¥…±¥é”è€¡Ì¤€ôø€¡ì(€€€€€€€ÕÍ•ÈèÌ¹ÕÍ•È°Á½ÍÑÌèÌ¹Á½ÍÑÌ°ÍÑ½É¥•ÌèÌ¹ÍÑ½É¥•Ì°¡…ÑÌèÌ¹¡…ÑÌ°(€€€€€€€•¹•É…Ñ•‘%µ…•ÌèÌ¹•¹•É…Ñ•‘%µ…•Ì°…¥½¹Ù•ÉÍ…Ñ¥½¹ÌèÌ¹…¥½¹Ù•ÉÍ…Ñ¥½¹Ì°(€€€€€€€Ñ½Ñ…±Q½­•¹ÍUÍ•èÌ¹Ñ½Ñ…±Q½­•¹ÍUÍ•°Ñ½Ñ…±ÍÑ¥µ…Ñ•‘½ÍĞèÌ¹Ñ½Ñ…±ÍÑ¥µ…Ñ•‘½ÍĞ°(€€€€€€€Ñ¡•µ•%èÌ¹Ñ¡•µ•%°½±½É5½‘”èÌ¹½±½É5½‘”°ÕÍÑ½µA…±•ÑÑ”èÌ¹ÕÍÑ½µA…±•ÑÑ”°(€€€€€€€Í•ÉÙ•É5½‘”èÌ¹Í•ÉÙ•É5½‘”°”É•¹ÉåÁÑ¥½¸èÌ¹”É•¹ÉåÁÑ¥½¸°•Á¡•µ•É…±MÑ½É…”èÌ¹•Á¡•µ•É…±MÑ½É…”°(€€€€€€€‰¥½µ•ÑÉ¥¹…‰±•èÌ¹‰¥½µ•ÑÉ¥¹…‰±•°Ñİ½…Ñ½É¹…‰±•èÌ¹Ñİ½…Ñ½É¹…‰±•°(€€€€€€€É•…‘I••¥ÁÑÌèÌ¹É•…‘I••¥ÁÑÌ°½¹±¥¹•MÑ…ÑÕÌèÌ¹½¹±¥¹•MÑ…ÑÕÌ°(€€€€€€€…¥A•ÉÍ½¹„èÌ¹…¥A•ÉÍ½¹„°…¥U¥MÑå±”èÌ¹…¥U¥MÑå±”°(€€€€€€€Íå¹¹…‰±•èÌ¹Íå¹¹…‰±•°½™™±¥¹•5½‘”èÌ¹½™™±¥¹•5½‘”°(€€€€€€€±½Õ‘	…­ÕÀèÌ¹±½Õ‘	…­ÕÀ°‰…­ÕÁ¹ÉåÁÑ¥½¸èÌ¹‰…­ÕÁ¹ÉåÁÑ¥½¸°(€€€€€€€¡…ÁÑ¥Í¹…‰±•èÌ¹¡…ÁÑ¥Í¹…‰±•°Í½Õ¹‘¹…‰±•èÌ¹Í½Õ¹‘¹…‰±•°(€€€€€€€…¹¥µ…Ñ¥½¹Í¹…‰±•èÌ¹¥¹¥µ…Ñ¥½¹Í¹…‰±•°É•‘Õ•‘5½Ñ¥½¸èÌ¹É•‘Õ•‘5½Ñ¥½¸°‘…Ñ…M…Ù•ÈèÌ¹‘…Ñ…M…Ù•È°(€€€€€€€…ÕÑ¡UÍ•ÈèÌ¹…ÕÑ¡UÍ•È°(€€€€€ô¤°(€€€ô(€€¤(¤ì(