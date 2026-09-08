// NEXUS API — AI routes: /api/ai/*
import { json, errorResponse, requireAuth, parseBody, generateId } from '../lib/utils.js';

const PERSONAS = [
  { id: 'general', emoji: '✨', name: 'General Assistant', desc: 'Helps with anything' },
  { id: 'creative', emoji: '🎨', name: 'Creative Writer', desc: 'Stories, poems, ideas' },
  { id: 'analyst', emoji: '📊', name: 'Data Analyst', desc: 'Insights and analysis' },
  { id: 'coder', emoji: '💻', name: 'Code Helper', desc: 'Programming assistance' },
];

export async function handleAI(request, ctx) {
  const path = ctx.url.pathname;
  const method = ctx.method;
  if (path === '/api/ai/personas' && method === 'GET') return json({ personas: PERSONAS });
  if (path === '/api/ai/conversations' && method === 'GET') return listConversations(ctx);
  if (path === '/api/ai/conversations' && method === 'POST') return createConversation(ctx);
  if (path === '/api/ai/messages' && method === 'POST') return sendMessage(ctx);
  if (path === '/api/ai/usage' && method === 'GET') return getUsage(ctx);
  return errorResponse(404, 'NOT_FOUND', 'AI route not found');
}

async function listConversations(ctx) {
  const auth = await requireAuth(ctx);
  if (auth.error) return auth.error;
  const result = await ctx.db.prepare('SELECT * FROM ai_conversations WHERE user_id = ? ORDER BY created_at DESC').bind(auth.userId).all();
  return json({ conversations: result.results || [] });
}

async function createConversation(ctx) {
  const auth = await requireAuth(ctx);
  if (auth.error) return auth.error;
  const body = await parseBody(ctx.request) || {};
  const id = generateId();
  await ctx.db.prepare('INSERT INTO ai_conversations (id, user_id, persona, model, title) VALUES (?, ?, ?, ?, ?)').bind(id, auth.userId, body.persona || 'general', body.model || 'nexus-1', body.title || 'New Conversation').run();
  return json({ id }, 201);
}

async function sendMessage(ctx) {
  const auth = await requireAuth(ctx);
  if (auth.error) return auth.error;
  const body = await parseBody(ctx.request);
  if (!body || !body.message) return errorResponse(400, 'MISSING_MESSAGE', 'Message is required');
  const userMsgId = generateId();
  const convId = body.conversationId || null;
  if (convId) {
    await ctx.db.prepare('INSERT INTO ai_messages (id, conversation_id, role, body, tokens) VALUES (?, ?, ?, ?, ?)').bind(userMsgId, convId, 'user', body.message, 0).run();
  }
  const persona = body.persona || 'general';
  const responses = {
    general: 'I understand. Let me help you with that. Based on what you shared, I would suggest breaking the problem into smaller steps.',
    creative: 'Here is a creative take: imagine a world where every notification carries a secret message, and only those who pause long enough can decode it.',
    analyst: 'Looking at the data patterns, there is a 23% increase in engagement during evening hours. I recommend scheduling between 6-9 PM.',
    coder: 'You can solve this with a debounce function. Wrap your handler in a 300ms debounce to prevent excessive calls.',
  };
  const responseText = responses[persona] || responses.general;
  if (convId) {
    const aiMsgId = generateId();
    await ctx.db.prepare('INSERT INTO ai_messages (id, conversation_id, role, body, tokens) VALUES (?, ?, ?, ?, ?)').bind(aiMsgId, convId, 'assistant', responseText, 42).run();
    const period = new Date().toISOString().slice(0, 7);
    await ctx.db.prepare('INSERT INTO ai_usage (id, user_id, total_tokens, total_requests, period) VALUES (?, ?, 42, 1, ?) ON CONFLICT(user_id, period) DO UPDATE SET total_tokens = total_tokens + 42, total_requests = total_requests + 1, updated_at = datetime(\'now\')').bind(generateId(), auth.userId, period).run();
  }
  return json({ response: responseText, tokens: 42 });
}

async function getUsage(ctx) {
  const auth = await requireAuth(ctx);
  if (auth.error) return auth.error;
  const period = new Date().toISOString().slice(0, 7);
  const usage = await ctx.db.prepare('SELECT * FROM ai_usage WHERE user_id = ? AND period = ?').bind(auth.userId, period).first();
  return json({ usage: usage || { total_tokens: 0, total_requests: 0, monthly_limit: 100000 } });
}
