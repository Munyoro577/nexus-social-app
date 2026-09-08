// NEXUS API — Message routes
import { json, errorResponse, requireAuth, parseBody, generateId } from '../lib/utils.js';

export async function handleMessages(request, ctx) {
  const path = ctx.url.pathname;
  const method = ctx.method;
  if (path === '/api/messages/conversations' && method === 'GET') return listConversations(ctx);
  if (path === '/api/messages/conversations' && method === 'POST') return createConversation(ctx);
  if (path.match(/^\/api\/messages\/[^/]+$/) && method === 'GET') return listMessages(ctx);
  if (path.match(/^\/api\/messages\/[^/]+$/) && method === 'POST') return sendMessage(ctx);
  return errorResponse(404, 'NOT_FOUND', 'Message route not found');
}

async function listConversations(ctx) {
  const auth = await requireAuth(ctx);
  if (auth.error) return auth.error;
  const conversations = await ctx.db.prepare('SELECT c.*, cp2.last_read_at FROM conversations c JOIN conversation_participants cp ON c.id = cp.conversation_id LEFT JOIN conversation_participants cp2 ON c.id = cp2.conversation_id AND cp2.user_id = ? WHERE cp.user_id = ? ORDER BY c.updated_at DESC').bind(auth.userId, auth.userId).all();
  return json({ conversations: conversations.results || [] });
}

async function createConversation(ctx) {
  const auth = await requireAuth(ctx);
  if (auth.error) return auth.error;
  const body = await parseBody(ctx.request);
  if (!body || !body.participantIds || !body.participantIds.length) return errorResponse(400, 'MISSING_PARTICIPANTS', 'At least one participant is required');
  const convId = generateId();
  await ctx.db.prepare('INSERT INTO conversations (id) VALUES (?)').bind(convId).run();
  const allIds = [auth.userId, ...body.participantIds];
  for (const uid of allIds) {
    await ctx.db.prepare('INSERT OR IGNORE INTO conversation_participants (id, conversation_id, user_id) VALUES (?, ?, ?)').bind(generateId(), convId, uid).run();
  }
  return json({ id: convId }, 201);
}

async function listMessages(ctx) {
  const auth = await requireAuth(ctx);
  if (auth.error) return auth.error;
  const convId = ctx.url.pathname.split('/')[3];
  const messages = await ctx.db.prepare('SELECT m.*, u.username as sender_username FROM messages m JOIN users u ON m.sender_id = u.id WHERE m.conversation_id = ? ORDER BY m.created_at ASC').bind(convId).all();
  return json({ messages: messages.results || [] });
}

async function sendMessage(ctx) {
  const auth = await requireAuth(ctx);
  if (auth.error) return auth.error;
  const convId = ctx.url.pathname.split('/')[3];
  const body = await parseBody(ctx.request);
  if (!body || !body.body || !body.body.trim()) return errorResponse(400, 'MISSING_BODY', 'Message body is required');
  const id = generateId();
  await ctx.db.prepare('INSERT INTO messages (id, conversation_id, sender_id, body) VALUES (?, ?, ?, ?)').bind(id, convId, auth.userId, body.body.trim()).run();
  await ctx.db.prepare('UPDATE conversations SET updated_at = ? WHERE id = ?').bind(new Date().toISOString(), convId).run();
  return json({ id, conversationId: convId, senderId: auth.userId, body: body.body.trim() }, 201);
}
