// ================================================================
// NEXUS FRONTEND CONFIG
// Centralized configuration — no secrets in client code.
// ================================================================

var NexusConfig = {
  env: "development",
  apiBaseUrl: "/api",
  features: {
    onboarding: true,
    messaging: true,
    ai: true,
    media: true,
    notifications: true,
    devTools: false,
  },
  auth: {
    provider: "mock",
    sessionKey: "nexus_session",
    tokenKey: "nexus_token",
    tokenRefreshInterval: 300000,
  },
  ai: {
    provider: "mock",
    defaultModel: "nexus-1",
    models: [
      { id: "nexus-1", name: "Nexus-1", desc: "Balanced for everyday tasks" },
      { id: "nexus-pro", name: "Nexus Pro", desc: "Advanced reasoning" },
      { id: "nexus-creative", name: "Nexus Creative", desc: "Creative writing" },
    ],
  },
  storage: {
    type: "localStorage",
    keys: {
      onboarding: "nexus_onboarding",
      session: "nexus_session",
      token: "nexus_token",
      preferences: "nexus_preferences",
    },
  },
  breakpoints: { compact: 380, mobile: 768, tablet: 1024, desktop: 1536 },
  useMockFallback: true,
};
