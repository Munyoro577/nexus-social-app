// NEXUS API — Post routes
import { json, errorResponse, requireAuth, parseBody, generateId } from '../lib/utils.js';

export async function handlePosts(request, ctx) {
  const path = ctx.url.pathname;
  const method = ctx.method;
  if (path === '/api/posts' && method === 'GET') return listPosts(ctx);
  if (path === '/api/posts' && method === 'POST') return createPost(ctx);
  if (path.match(/^\/api\/posts\/[^/]+\/like$/) && method === 'POST') return toggleLike(ctx);
  if (path.match(/^\/api\/posts\/[^/]+\/save$/) && method === 'POST') return toggleSave(ctx);
  return errorResponse(404, 'NOT_FOUND', 'Post route not found');
}

async function listPosts(ctx) {
  const limit = Math.min(parseInt(ctx.url.searchParams.get('limit') || '20'), 50);
  const offset = parseInt(ctx.url.searchParams.get('offset') || '0');
  const posts = await ctx.db.prepare('SELECT p.*, pr.display_name, pr.username, pr.avatar_color, pr.avatar_text FROM posts p JOIN profiles pr ON p.author_id = pr.user_id ORDER BY p.created_at DESC LIMIT ? OFFSET ?').bind(limit, offset).all();
  return json({ posts: posts.results || [] });
}

async function createPost(ctx) {
  const auth = await requireAuth(ctx);
  if (auth.error) return auth.error;
  const body = await parseBody(ctx.request);
  if (!body || !body.body || !body.body.trim()) return errorResponse(400, 'MISSING_BODY', 'Post body is required');
  const id = generateId();
  await ctx.db.prepare('INSERT INTO posts (id, author_id, body, media_url) VALUES (?, ?, ?, ?)').bind(id, auth.userId, body.body.trim(), body.media_url || null).run();
  await ctx.db.prepare('UPDATE profiles SET posts_count = posts_count + 1 WHERE user_id = ?').bind(auth.userId).run();
  return json({ id, authorId: auth.userId, body: body.body.trim(), mediaUrl: body.media_url || null }, 201);
}

async function toggleLike(ctx) {
  const auth = await requireAuth(ctx);
  if (auth.error) return auth.error;
  const postId = ctx.url.pathname.split('/')[3];
  const existing = await ctx.db.prepare('SELECT id FROM reactions WHERE user_id = ? AND target_id = ? AND target_type = ? AND type = ?').bind(auth.userId, postId, 'post', 'like').first();
  if (existing) {
    await ctx.db.prepare('DELETE FROM reactions WHERE id = ?').bind(existing.id).run();
    await ctx.db.prepare('UPDATE posts SET likes_count = MAX(0, likes_count - 1) WHERE id = ?').bind(postId).run();
    return json({ liked: false });
  } else {
    await ctx.db.prepare('INSERT INTO reactions (id, user_id, target_id, target_type, type) VALUES (?, ?, ?, ?, ?)').bind(generateId(), auth.userId, postId, 'post', 'like').run();
    await ctx.db.prepare('UPDATE posts SET likes_count = likes_count + 1 WHERE id = ?').bind(postId).run();
    return json({ liked: true });
  }
}

async function toggleSave(ctx) {
  const auth = await requireAuth(ctx);
  if (auth.error) return auth.error;
  const postId = ctx.url.pathname.split('/')[3];
  const existing = await ctx.db.prepare('SELECT id FROM reactions WHERE user_id = ? AND target_id = ? AND target_type = ? AND type = ?').bind(auth.userId, postId, 'post', 'save').first();
  if (existing) {
    await ctx.db.prepare('DELETE FROM reactions WHERE id = ?').bind(existing.id).run();
    return json({ saved: false });
  } else {
    await ctx.db.prepare('INSERT INTO reactions (id, user_id, target_id, target_type, type) VALUES (?, ?, ?, ?, ?)').bind(generateId(), auth.userId, postId, 'post', 'save').run();
    return json({ saved: true });
  }
}
