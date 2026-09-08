/**
 * Nexus Service Interfaces
 *
 * Clean boundaries between UI and data. The UI never touches the database directly.
 * Currently backed by mock/localStorage implementations; can be swapped for real
 * API calls to the Cloudflare Workers backend without touching UI components.
 *
 * Architecture:
 *   Nexus UI → Service interfaces → (mock | API) → Backend → Repository → Database
 */

import type { AuthUser } from './auth';
import type { OnboardingStep, OnboardingStatus, OnboardingData } from './onboarding';
import type { Post, Story, Chat, Track, User } from '@/store/useStore';

// ---------------------------------------------------------------------------
// AuthService
// ---------------------------------------------------------------------------
export interface AuthService {
  getStoredSession(): AuthUser | null;
  createSession(provider: string, name: string, email: string, avatar: string): AuthUser;
  clearSession(): void;
}

// ---------------------------------------------------------------------------
// UserService
// ---------------------------------------------------------------------------
export interface UserService {
  getCurrentUser(): User;
  updateProfile(data: Partial<User>): void;
}

// ---------------------------------------------------------------------------
// ProfileService
// ---------------------------------------------------------------------------
export interface ProfileService {
  getProfile(userId: string): Promise<User | null>;
  updateProfile(userId: string, data: Partial<User>): Promise<User>;
}

// ---------------------------------------------------------------------------
// OnboardingService
// ---------------------------------------------------------------------------
export interface OnboardingService {
  getStatus(): OnboardingStatus;
  getStep(): OnboardingStep;
  getData(): OnboardingData;
  advance(step: OnboardingStep, data?: Partial<OnboardingData>): void;
  goBack(step: OnboardingStep): void;
  complete(data?: Partial<OnboardingData>): void;
  reset(): void;
}

// ---------------------------------------------------------------------------
// PostService
// ---------------------------------------------------------------------------
export interface PostService {
  getPosts(): Post[];
  createPost(content: string, image?: string): void;
  toggleLike(postId: string): void;
  addComment(postId: string, content: string): void;
}

// ---------------------------------------------------------------------------
// MessageService
// ---------------------------------------------------------------------------
export interface MessageService {
  getChats(): Chat[];
  sendMessage(chatId: string, content: string): void;
  markChatRead(chatId: string): void;
}

// ---------------------------------------------------------------------------
// AIService
// ---------------------------------------------------------------------------
export interface AIService {
  getModels(): import('@/store/useStore').AIModel[];
  sendMessage(prompt: string): void;
  generateImage(prompt: string): void;
}

// ---------------------------------------------------------------------------
// MediaService
// ---------------------------------------------------------------------------
export interface MediaService {
  getTracks(): Track[];
}

// ---------------------------------------------------------------------------
// PrivacyService
// ---------------------------------------------------------------------------
export interface PrivacyService {
  getSettings(): {
    privateAccount: boolean;
    showOnlineStatus: boolean;
    readReceipts: boolean;
    personalization: boolean;
    aiTraining: boolean;
  };
  updateSettings(data: Partial<{
    privateAccount: boolean;
    showOnlineStatus: boolean;
    readReceipts: boolean;
    personalization: boolean;
    aiTraining: boolean;
  }>): void;
}

// ---------------------------------------------------------------------------
// Service Registry — lazy accessor that reads from the Zustand store
// ---------------------------------------------------------------------------
import { useStore } from '@/store/useStore';
import { getStoredAuth, createSession, clearAuth } from './auth';

export const authService: AuthService = {
  getStoredSession: () => getStoredAuth(),
  createSession: (provider, name, email, avatar) => createSession(provider as any, name, email, avatar),
  clearSession: () => clearAuth(),
};

export const userService: UserService = {
  getCurrentUser: () => useStore.getState().user,
  updateProfile: (data) => useStore.getState().updateProfile(data),
};

export const onboardingService: OnboardingService = {
  getStatus: () => useStore.getState().onboardingStatus,
  getStep: () => useStore.getState().onboardingStep,
  getData: () => useStore.getState().onboardingData,
  advance: (step, data) => useStore.getState().advanceOnboarding(step, data),
  goBack: (step) => useStore.getState().goBackOnboarding(step),
  complete: (data) => useStore.getState().completeOnboarding(data),
  reset: () => useStore.getState().resetOnboarding(),
};

export const postService: PostService = {
  getPosts: () => useStore.getState().posts,
  createPost: (content, image) => useStore.getState().addPost(content, image),
  toggleLike: (postId) => useStore.getState().toggleLike(postId),
  addComment: (postId, content) => useStore.getState().addComment(postId, content),
};

export const messageService: MessageService = {
  getChats: () => useStore.getState().chats,
  sendMessage: (chatId, content) => useStore.getState().sendMessage(chatId, content),
  markChatRead: (chatId) => useStore.getState().markChatRead(chatId),
};

export const mediaService: MediaService = {
  getTracks: () => useStore.getState().tracks,
};

export const privacyService: PrivacyService = {
  getSettings: () => ({
    privateAccount: useStore.getState().ephemeralStorage,
    showOnlineStatus: useStore.getState().onlineStatus,
    readReceipts: useStore.getState().readReceipts,
    personalization: true,
    aiTraining: false,
  }),
  updateSettings: (data) => {
    if (data.showOnlineStatus !== undefined) useStore.getState().setOnlineStatus(data.showOnlineStatus);
    if (data.readReceipts !== undefined) useStore.getState().setReadReceipts(data.readReceipts);
  },
};
