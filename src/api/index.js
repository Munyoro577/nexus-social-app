// ================================================================
// NEXUS API — Cloudflare Workers entry point
// Routes: /api/auth, /api/users, /api/posts, /api/messages, /api/ai, /api/media, /api/notifications
// ================================================================

import { handleAuth } from './routes/auth.js';
import { handleUsers } from './routes/users.js';
import { handlePosts } from './routes/posts.js';
import { handleMessages } from './routes/messages.js';
import { handleAI } from './routes/ai.js';
import { handleMedia } from './routes/media.js';
import { handleNotifications } from './routes/notifications.js';
import { handleOnboarding } from './routes/onboarding.js';
import { corsHeaders, errorResponse, getRequestContext } from './lib/utils.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (!path.startsWith('/api/')) {
      return serveStatic(path, env);
    }

    const ctxObj = getRequestContext(request, env, ctx);
    const route = path.split('/')[2];

    try {
      switch (route) {
        case 'auth': return await handleAuth(request, ctxObj);
        case 'users': return await handleUsers(request, ctxObj);
        case 'posts': return await handlePosts(request, ctxObj);
        case 'messages': return await handleMessages(request, ctxObj);
        case 'ai': return await handleAI(request, ctxObj);
        case 'media': return await handleMedia(request, ctxObj);
        case 'notifications': return await handleNotifications(request, ctxObj);
        case 'onboarding': return await handleOnboarding(request, ctxObj);
        default: return errorResponse(404, 'NOT_FOUND', 'API route not found');
      }
    } catch (err) {
      console.error('API error:', err);
      return errorResponse(500, 'INTERNAL_ERROR', 'An unexpected error occurred', { requestId: ctxObj.requestId });
    }
  }
};

async function serveStatic(path, env) {
  const cleanPath = path === '/' ? '/index.html' : path;
  try {
    if (env.ASSETS) {
      return env.ASSETS.fetch(new Request('https://static' + cleanPath));
    }
    return new Response('Static files are served by Cloudflare Pages in production.', {
      headers: { 'Content-Type': 'text/plain' }
    });
  } catch (e) {
    return new Response('Not found', { status: 404 });
  }
}
