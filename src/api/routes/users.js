// NEXUS API — User & Profile routes
import { json, errorResponse, requireAuth, parseBody, generateId, isValidUsername } from '../lib/utils.js';

export async function handleUsers(request, ctx) {
  const path = ctx.url.pathname;
  const method = ctx.method;
  if (path === '/api/users/me' && method === 'GET') return getMe(ctx);
  if (path === '/api/users/me' && method === 'PUT') return updateMe(ctx);
  if (path === '/api/users/search' && method === 'GET') return searchUsers(ctx);
  if (path.match(/^\/api\/users\/[^/]+$/)) return getUserByUsername(ctx);
  return errorResponse(404, 'NOT_FOUND', 'User route not found');
}

async function getMe(ctx) {
  const auth = await requireAuth(ctx);
  if (auth.error) return auth.error;
  const profile = await ctx.db.prepare('SELECT p.*, u.email, u.email_verified FROM profiles p JOIN users u ON p.user_id = u.id WHERE p.user_id = ?').bind(auth.userId).first();
  if (!profile) return errorResponse(404, 'NOT_FOUND', 'Profile not found');
  return json({ profile });
}

async function updateMe(ctx) {
  const auth = await requireAuth(ctx);
  if (auth.error) return auth.error;
  const body = await parseBody(ctx.request);
  if (!body) return errorResponse(400, 'MISSING_BODY', 'Request body required');
  const updates = [];
  const values = [];
  for (const field of ['display_name', 'bio', 'avatar_url', 'avatar_color', 'avatar_text']) {
    if (body[field] !== undefined) { updates.push(field + ' = ?'); values.push(body[field]); }
  }
  if (updates.length === 0) return json({ success: true });
  values.push(new Date().toISOString());
  values.push(auth.userId);
  await ctx.db.prepare('UPDATE profiles SET ' + updates.join(', ') + ', updated_at = ? WHERE user_id = ?').bind(...values).run();
  return json({ success: true });
}

async function getUserByUsername(ctx) {
  const username = ctx.url.pathname.split('/').pop();
  const profile = await ctx.db.prepare('SELECT * FROM profiles WHERE username = ?').bind(username).first();
  if (!profile) return errorResponse(404, 'NOT_FOUND', 'User not found');
  return json({ profile });
}

async function searchUsers(ctx) {
  const q = ctx.url.searchParams.get('q') || '';
  if (!q) return json({ users: [] });
  const results = await ctx.db.prepare('SELECT id, username, display_name, avatar_color, avatar_text FROM profiles WHERE username LIKE ? OR display_name LIKE ? LIMIT 20').bind('%' + q + '%', '%' + q + '%').all();
  return json({ users: results.results || [] });
}
