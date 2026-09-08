# Nexus — Social + AI

Full-stack social platform with built-in AI assistant.

## Stack

- **Frontend:** Vanilla JS, CSS custom properties, responsive grid layout
- **Backend:** Cloudflare Workers (Edge)
- **Database:** Cloudflare D1 (SQLite-compatible)
- **Auth:** Abstracted service layer (currently mock, ready for real provider)
- **AI:** Abstracted service layer (currently mock, ready for real provider)

## Project Structure

```
nexus/
├── public/                  # Frontend (static assets)
│   ├── index.html           # App entry point
│   ├── css/
│   │   └── styles.css       # Design tokens + responsive system
│   └── js/
│       ├── config.js        # Centralized configuration
│       ├── services.js      # Service layer (API + mock fallback)
│       └── app.js           # Application logic, onboarding, rendering
├── src/
│   ├── api/
│   │   ├── index.js         # Workers entry point, router
│   │   ├── lib/
│   │   │   └── utils.js     # Shared utilities (auth, CORS, validation)
│   │   └── routes/
│   │       ├── auth.js      # POST /sign-up, /sign-in, /sign-out, GET /session
│   │       ├── users.js     # GET/PUT /users/me, search
│   │       ├── posts.js     # GET/POST /posts, like/save
│   │       ├── messages.js  # conversations, messages
│   │       ├── ai.js        # personas, conversations, messages, usage
│   │       ├── media.js     # list, upload
│   │       ├── notifications.js # list, mark read
│   │       └── onboarding.js    # get, update, complete
│   └── db/
│       └── schema.sql       # D1 database schema (16 tables)
├── package.json
├── wrangler.toml            # Cloudflare Workers config
├── .dev.vars.example        # Environment variables template
└── .gitignore
```

## Setup

```bash
# Install dependencies
npm install

# Create D1 database
wrangler d1 create nexus-db
# Update database_id in wrangler.toml with the returned ID

# Run migrations
npm run db:migrate:local

# Set secrets
wrangler secret put JWT_SECRET

# Start dev server
npm run dev
```

## Architecture

### Data Flow
```
UI → Service Client → API Endpoint → Backend Service → Repository → Database
```

### Service Boundaries
- AuthService, UserService, PostService, MessageService, AIService, MediaService, NotificationService, OnboardingService

### Database Entities
users, profiles, onboarding, interests, user_interests, follows, posts, comments, reactions, conversations, conversation_participants, messages, ai_conversations, ai_messages, ai_usage, media, notifications, privacy_settings, sessions

## Development Status

- **Onboarding:** Working state machine with localStorage persistence, API sync when authenticated
- **Responsive:** CSS Grid app shell, 5 breakpoint tiers, matchMedia + visualViewport
- **Backend:** API routes defined, D1 schema ready, auth abstraction in place
- **Auth:** Mock implementation (clearly labeled), ready for real provider
- **AI:** Mock implementation, ready for real provider
- **Security:** Secrets server-side only, no secrets in client code

## Next Steps

1. Deploy D1 database and run schema migration
2. Replace mock auth with real email/password or OAuth provider
3. Replace mock AI with real LLM provider (OpenAI/Anthropic/Google)
4. Configure R2 for media uploads
5. Deploy to Cloudflare Workers + Pages
