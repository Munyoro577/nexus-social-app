// NEXUS API — Notification routes
import { json, errorResponse, requireAuth, parseBody } from '../lib/utils.js';

export async function handleNotifications(request, ctx) {
  const path = ctx.url.pathname;
  const method = ctx.method;
  if (path === '/api/notifications' && method === 'GET') return listNotifications(ctx);
  if (path === '/api/notifications/read-all' && method === 'POST') return markAllRead(ctx);
  if (path.match(/^\/api\/notifications\/[^/]+\/read$/) && method === 'POST') return markRead(ctx);
  return errorResponse(404, 'NOT_FOUND', 'Notification route not found');
}

async function listNotifications(ctx) {
  const auth = await requireAuth(ctx);
  if (auth.error) return auth.error;
  const result = await ctx.db.prepare('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50').bind(auth.userId).all();
  return json({ notifications: result.results || [] });
}

async function markAllRead(ctx) {
  const auth = await requireAuth(ctx);
  if (auth.error) return auth.error;
  await ctx.db.prepare('UPDATE notifications SET read = 1 WHERE user_id = ?').bind(auth.userId).run();
  return json({ success: true });
}

async function markRead(ctx) {
  const auth = await requireAuth(ctx);
  if (auth.error) return auth.error;
  const notifId = ctx.url.pathname.split('/')[3];
  await ctx.db.prepare('UPDATE notifications SET read = 1 WHERE id = ? AND user_id = ?').bind(notifId, auth.userId).run();
  return json({ success: true });
}
