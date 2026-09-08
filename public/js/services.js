// ================================================================
// NEXUS SERVICE LAYER
// Each service tries the real API first, falls back to mock data
// when the API is unavailable (development/prototype mode).
// UI calls these services — never touches DB/provider logic directly.
// ================================================================

// --- API Helper ---
var ApiClient = {
  getToken: function() {
    try { return localStorage.getItem(NexusConfig.auth.tokenKey); } catch(e) { return null; }
  },
  setToken: function(token) {
    try { localStorage.setItem(NexusConfig.auth.tokenKey, token); } catch(e) {}
  },
  clearToken: function() {
    try { localStorage.removeItem(NexusConfig.auth.tokenKey); } catch(e) {}
  },
  request: function(path, options) {
    options = options || {};
    var token = ApiClient.getToken();
    var headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = "Bearer " + token;
    options.headers = Object.assign(headers, options.headers || {});
    return fetch(NexusConfig.apiBaseUrl + path, options).then(function(res) {
      if (res.status === 401) { ApiClient.clearToken(); }
      if (!res.ok) throw new Error("API error: " + res.status);
      return res.json();
    });
  },
  post: function(path, body) {
    return ApiClient.request(path, { method: "POST", body: JSON.stringify(body || {}) });
  },
  put: function(path, body) {
    return ApiClient.request(path, { method: "PUT", body: JSON.stringify(body || {}) });
  },
  get: function(path) {
    return ApiClient.request(path, { method: "GET" });
  },
  tryApiThenMock: function(apiCall, mockFn) {
    if (NexusConfig.useMockFallback) {
      return mockFn().catch(function() { return mockFn(); });
    }
    return apiCall().catch(function(err) {
      console.warn("API call failed, using mock:", err);
      return mockFn();
    });
  },
};

// --- Storage Service ---
var StorageService = {
  get: function(key) {
    try { return JSON.parse(localStorage.getItem(key)); }
    catch(e) { return null; }
  },
  set: function(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); return true; }
    catch(e) { console.warn("Storage write failed:", e); return false; }
  },
  remove: function(key) {
    try { localStorage.removeItem(key); } catch(e) {}
  },
};

// --- Auth Service ---
var AuthService = {
  _session: null,
  isAuthenticated: function() { return !!ApiClient.getToken(); },
  getSession: function() {
    if (AuthService._session) return AuthService._session;
    AuthService._session = StorageService.get(NexusConfig.storage.keys.session);
    return AuthService._session;
  },
  getCurrentUser: function() {
    var s = AuthService.getSession();
    return s ? s.user : null;
  },
  signIn: function(email, password) {
    return ApiClient.tryApiThenMock(
      function() { return ApiClient.post("/auth/sign-in", { email: email, password: password }).then(function(res) {
        ApiClient.setToken(res.token);
        StorageService.set(NexusConfig.storage.keys.session, { user: res.user, token: res.token });
        AuthService._session = { user: res.user, token: res.token };
        return res;
      }); },
      function() {
        return new Promise(function(resolve) {
          setTimeout(function() {
            var session = { token: "mock_" + Date.now(), user: { id: "u1", email: email, username: email.split("@")[0] } };
            ApiClient.setToken(session.token);
            StorageService.set(NexusConfig.storage.keys.session, session);
            AuthService._session = session;
            resolve(session);
          }, 600);
        });
      }
    );
  },
  signUp: function(email, username, password) {
    return ApiClient.tryApiThenMock(
      function() { return ApiClient.post("/auth/sign-up", { email: email, username: username, password: password }).then(function(res) {
        ApiClient.setToken(res.token);
        StorageService.set(NexusConfig.storage.keys.session, { user: res.user, token: res.token });
        AuthService._session = { user: res.user, token: res.token };
        return res;
      }); },
      function() {
        return new Promise(function(resolve) {
          setTimeout(function() {
            var session = { token: "mock_" + Date.now(), user: { id: "u1", email: email, username: username } };
            ApiClient.setToken(session.token);
            StorageService.set(NexusConfig.storage.keys.session, session);
            AuthService._session = session;
            resolve(session);
          }, 600);
        });
      }
    );
  },
  signOut: function() {
    return ApiClient.tryApiThenMock(
      function() { return ApiClient.post("/auth/sign-out").then(function() { AuthService._clearSession(); }); },
      function() { return new Promise(function(resolve) { AuthService._clearSession(); resolve(); }); }
    );
  },
  _clearSession: function() {
    AuthService._session = null;
    ApiClient.clearToken();
    StorageService.remove(NexusConfig.storage.keys.session);
  },
};

// --- User Service ---
var UserService = {
  getProfile: function(userId) {
    return ApiClient.tryApiThenMock(
      function() { return ApiClient.get("/users/me").then(function(res) { return res.profile; }); },
      function() { return Promise.resolve({
        userId: userId || "u1", displayName: "Alinda Sarvam", username: "alinda",
        avatarText: "A", avatarColor: "linear-gradient(135deg,#6366f1,#8b5cf6)",
        bio: "", followersCount: 142, followingCount: 89, postsCount: 27, verified: false,
      }); }
    );
  },
  updateProfile: function(updates) {
    return ApiClient.tryApiThenMock(
      function() { return ApiClient.put("/users/me", updates); },
      function() { return Promise.resolve(Object.assign({ userId: "u1" }, updates)); }
    );
  },
  searchUsers: function(query) {
    return ApiClient.tryApiThenMock(
      function() { return ApiClient.get("/users/search?q=" + encodeURIComponent(query)).then(function(res) { return res.users; }); },
      function() { return Promise.resolve([]); }
    );
  },
};

// --- Post Service ---
var PostService = {
  _cache: null,
  getFeed: function() {
    return ApiClient.tryApiThenMock(
      function() { return ApiClient.get("/posts").then(function(res) { PostService._cache = res.posts; return res.posts; }); },
      function() {
        if (PostService._cache) return Promise.resolve(PostService._cache);
        PostService._cache = [
          { id: "p1", authorName: "Riya Sharma", authorHandle: "@riya", authorAvatar: "R", authorColor: "linear-gradient(135deg,#ec4899,#8b5cf6)", body: "Just shipped a new feature at work. Three months of effort finally live. Grateful for the team that made it happen.", likes: 142, comments: 23, shares: 12, liked: false, saved: false, createdAt: "2026-09-07T08:00:00Z" },
          { id: "p2", authorName: "Arjun Mehta", authorHandle: "@arjun", authorAvatar: "A", authorColor: "linear-gradient(135deg,#22c55e,#6366f1)", body: "Morning run at Cubbon Park. The city looks different at 6 AM.", likes: 89, comments: 8, shares: 5, liked: false, saved: false, createdAt: "2026-09-07T06:30:00Z" },
          { id: "p3", authorName: "Priya Nair", authorHandle: "@priya", authorAvatar: "P", authorColor: "linear-gradient(135deg,#f59e0b,#ef4444)", body: "Reading Sapiens for the third time. Each pass reveals something new.", likes: 256, comments: 41, shares: 28, liked: false, saved: false, createdAt: "2026-09-06T22:00:00Z" },
          { id: "p4", authorName: "Karthik Reddy", authorHandle: "@karthik", authorAvatar: "K", authorColor: "linear-gradient(135deg,#6366f1,#22c55e)", body: "Built a Chrome extension this weekend that blocks attention-harvesting UI patterns. Open source.", likes: 318, comments: 52, shares: 67, liked: false, saved: false, createdAt: "2026-09-06T18:00:00Z" },
        ];
        return Promise.resolve(PostService._cache);
      }
    );
  },
  create: function(body, mediaUrl) {
    return ApiClient.tryApiThenMock(
      function() { return ApiClient.post("/posts", { body: body, media_url: mediaUrl }).then(function(post) { PostService._cache = null; return post; }); },
      function() {
        var post = { id: "p" + Date.now(), authorName: "Alinda Sarvam", authorHandle: "@alinda", authorAvatar: "A", authorColor: "linear-gradient(135deg,#6366f1,#8b5cf6)", body: body, mediaUrl: mediaUrl, likes: 0, comments: 0, shares: 0, liked: false, saved: false };
        if (PostService._cache) PostService._cache.unshift(post);
        return Promise.resolve(post);
      }
    );
  },
  toggleLike: function(postId) {
    return ApiClient.tryApiThenMock(
      function() { return ApiClient.post("/posts/" + postId + "/like").then(function() {
        if (PostService._cache) PostService._cache.forEach(function(p) { if (p.id === postId) { p.liked = !p.liked; p.likes += p.liked ? 1 : -1; } });
      }); },
      function() {
        if (!PostService._cache) return Promise.resolve();
        PostService._cache.forEach(function(p) { if (p.id === postId) { p.liked = !p.liked; p.likes += p.liked ? 1 : -1; } });
        return Promise.resolve();
      }
    );
  },
  toggleSave: function(postId) {
    return ApiClient.tryApiThenMock(
      function() { return ApiClient.post("/posts/" + postId + "/save").then(function(res) {
        if (PostService._cache) PostService._cache.forEach(function(p) { if (p.id === postId) p.saved = res.saved; });
      }); },
      function() {
        if (!PostService._cache) return Promise.resolve();
        PostService._cache.forEach(function(p) { if (p.id === postId) p.saved = !p.saved; });
        return Promise.resolve();
      }
    );
  },
};

// --- Message Service ---
var MessageService = {
  _conversations: null,
  getConversations: function() {
    return ApiClient.tryApiThenMock(
      function() { return ApiClient.get("/messages/conversations").then(function(res) { MessageService._conversations = res.conversations; return res.conversations; }); },
      function() {
        if (MessageService._conversations) return Promise.resolve(MessageService._conversations);
        MessageService._conversations = [
          { id: "c1", participantName: "Riya Sharma", participantAvatar: "R", participantColor: "linear-gradient(135deg,#ec4899,#8b5cf6)", lastMessage: "Did you see the deployment?", unreadCount: 2 },
          { id: "c2", participantName: "Arjun Mehta", participantAvatar: "A", participantColor: "linear-gradient(135deg,#22c55e,#6366f1)", lastMessage: "Thanks for the recommendation!", unreadCount: 1 },
          { id: "c3", participantName: "Design Team", participantAvatar: "D", participantColor: "linear-gradient(135deg,#f59e0b,#ef4444)", lastMessage: "New mockups ready for review", unreadCount: 0 },
        ];
        return Promise.resolve(MessageService._conversations);
      }
    );
  },
  getMessages: function(convId) {
    return ApiClient.tryApiThenMock(
      function() { return ApiClient.get("/messages/" + convId).then(function(res) { return res.messages; }); },
      function() { return Promise.resolve([
        { id: "m1", conversationId: convId, body: "Hey! How are you doing?", sent: false },
        { id: "m2", conversationId: convId, body: "Good! Just finished the project.", sent: true },
        { id: "m3", conversationId: convId, body: "That is awesome! Did you see the deployment?", sent: false },
      ]); }
    );
  },
  send: function(convId, body) {
    return ApiClient.tryApiThenMock(
      function() { return ApiClient.post("/messages/" + convId, { body: body }); },
      function() { return Promise.resolve({ id: "m" + Date.now(), conversationId: convId, body: body, sent: true }); }
    );
  },
};

// --- AI Service ---
var AIService = {
  _personas: [
    { id: "general", emoji: "✨", name: "General Assistant", desc: "Helps with anything" },
    { id: "creative", emoji: "🎨", name: "Creative Writer", desc: "Stories, poems, ideas" },
    { id: "analyst", emoji: "📊", name: "Data Analyst", desc: "Insights and analysis" },
    { id: "coder", emoji: "💻", name: "Code Helper", desc: "Programming assistance" },
  ],
  getPersonas: function() {
    return ApiClient.tryApiThenMock(
      function() { return ApiClient.get("/ai/personas").then(function(res) { return res.personas; }); },
      function() { return Promise.resolve(AIService._personas); }
    );
  },
  chat: function(persona, message) {
    return ApiClient.tryApiThenMock(
      function() { return ApiClient.post("/ai/messages", { message: message, persona: persona }).then(function(res) { return { body: res.response, tokens: res.tokens }; }); },
      function() { return new Promise(function(resolve) {
        setTimeout(function() {
          var responses = {
            general: "I understand. Let me help you with that. Based on what you shared, I would suggest breaking the problem into smaller steps.",
            creative: "Here is a creative take: imagine a world where every notification carries a secret message.",
            analyst: "Looking at the data patterns, there is a 23% increase in engagement during evening hours.",
            coder: "You can solve this with a debounce function. Wrap your handler in a 300ms debounce.",
          };
          resolve({ body: responses[persona] || responses.general, tokens: 42 });
        }, 800);
      }); }
    );
  },
  streamResponse: function(message, onChunk, onDone) {
    var fullResponse = "I understand your question. In Nexus, all data is protected by AES-GCM 256-bit encryption. Whether you are using centralized or decentralized mode, your information remains private and secure. The key exchange happens client-side via Diffie-Hellman, ensuring no intermediary can access your data.";
    var words = fullResponse.split(" ");
    var i = 0;
    var interval = setInterval(function() {
      if (i < words.length) { onChunk(words[i] + " "); i++; }
      else { clearInterval(interval); onDone(); }
    }, 40);
    return interval;
  },
};

// --- Media Service ---
var MediaService = {
  _items: null,
  getMedia: function(type) {
    return ApiClient.tryApiThenMock(
      function() { return ApiClient.get("/media?type=" + (type || "image")).then(function(res) { return res.media; }); },
      function() {
        if (MediaService._items) return Promise.resolve(MediaService._items);
        var items = [];
        var titles = ["Sunset","Morning Coffee","City Lights","Nature Trail","Studio Session","Ocean View","Mountain Peak","Urban Art"];
        for (var i = 0; i < 12; i++) items.push({ id: "med" + i, type: i % 4 === 3 ? "video" : "image", title: titles[i % titles.length] });
        MediaService._items = items;
        return Promise.resolve(items);
      }
    );
  },
  upload: function(file) {
    return ApiClient.tryApiThenMock(
      function() { return ApiClient.post("/media", { name: file.name, type: file.type }); },
      function() { return Promise.resolve({ id: "med" + Date.now(), type: file.type.startsWith("video") ? "video" : "image", title: file.name }); }
    );
  },
};

// --- Notification Service ---
var NotificationService = {
  _items: null,
  getNotifications: function() {
    return ApiClient.tryApiThenMock(
      function() { return ApiClient.get("/notifications").then(function(res) { return res.notifications; }); },
      function() {
        if (NotificationService._items) return Promise.resolve(NotificationService._items);
        NotificationService._items = [
          { id: "n1", type: "like", title: "Riya Sharma liked your post", body: "About the morning run at Cubbon Park", read: false },
          { id: "n2", type: "follow", title: "Arjun Mehta started following you", body: "", read: false },
          { id: "n3", type: "comment", title: "Priya Nair commented on your post", body: "This is really insightful!", read: true },
          { id: "n4", type: "mention", title: "Karthik Reddy mentioned you", body: "Thanks @alinda for the help", read: true },
        ];
        return Promise.resolve(NotificationService._items);
      }
    );
  },
  markRead: function(notifId) {
    return ApiClient.tryApiThenMock(
      function() { return ApiClient.post("/notifications/" + notifId + "/read"); },
      function() {
        if (!NotificationService._items) return Promise.resolve();
        NotificationService._items.forEach(function(n) { if (n.id === notifId) n.read = true; });
        return Promise.resolve();
      }
    );
  },
  markAllRead: function() {
    return ApiClient.tryApiThenMock(
      function() { return ApiClient.post("/notifications/read-all"); },
      function() {
        if (!NotificationService._items) return Promise.resolve();
        NotificationService._items.forEach(function(n) { n.read = true; });
        return Promise.resolve();
      }
    );
  },
};

// --- Onboarding Service ---
var OnboardingService = {
  get: function() {
    return ApiClient.tryApiThenMock(
      function() { return ApiClient.get("/onboarding"); },
      function() { return Promise.resolve(StorageService.get(NexusConfig.storage.keys.onboarding) || null); }
    );
  },
  update: function(state) {
    return ApiClient.tryApiThenMock(
      function() { return ApiClient.put("/onboarding", state); },
      function() { StorageService.set(NexusConfig.storage.keys.onboarding, state); return Promise.resolve({ success: true }); }
    );
  },
  complete: function() {
    return ApiClient.tryApiThenMock(
      function() { return ApiClient.post("/onboarding/complete"); },
      function() { return Promise.resolve({ success: true }); }
    );
  },
};
