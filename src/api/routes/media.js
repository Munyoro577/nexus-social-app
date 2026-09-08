// NEXUS API — Media routes
import { json, errorResponse, requireAuth, generateId } from '../lib/utils.js';

export async function handleMedia(request, ctx) {
  const path = ctx.url.pathname;
  const method = ctx.method;
  if (path === '/api/media' && method === 'GET') return listMedia(ctx);
  if (path === '/api/media' && method === 'POST') return uploadMedia(ctx);
  return errorResponse(404, 'NOT_FOUND', 'Media route not found');
}

async function listMedia(ctx) {
  const type = ctx.url.searchParams.get('type') || 'image';
  const result = await ctx.db.prepare('SELECT * FROM media WHERE type = ? ORDER BY created_at DESC LIMIT 50').bind(type).all();
  return json({ media: result.results || [] });
}

async function uploadMedia(ctx) {
  const auth = await requireAuth(ctx);
  if (auth.error) return auth.error;
  return json({ id: generateId(), url: null, message: 'Media upload requires R2 bucket configuration' }, 201);
}
