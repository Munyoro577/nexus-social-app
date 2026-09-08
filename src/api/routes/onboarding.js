// NEXUS API — Onboarding routes
import { json, errorResponse, requireAuth, parseBody } from '../lib/utils.js';

export async function handleOnboarding(request, ctx) {
  const path = ctx.url.pathname;
  const method = ctx.method;
  if (path === '/api/onboarding' && method === 'GET') return getOnboarding(ctx);
  if (path === '/api/onboarding' && method === 'PUT') return updateOnboarding(ctx);
  if (path === '/api/onboarding/complete' && method === 'POST') return completeOnboarding(ctx);
  return errorResponse(404, 'NOT_FOUND', 'Onboarding route not found');
}

async function getOnboarding(ctx) {
  const auth = await requireAuth(ctx);
  if (auth.error) return auth.error;
  const result = await ctx.db.prepare('SELECT * FROM onboarding WHERE user_id = ?').bind(auth.userId).first();
  if (!result) return json({ status: 'not_started', step: 'welcome' });
  return json({ status: result.status, step: result.step, startedAt: result.started_at, completedAt: result.completed_at, data: JSON.parse(result.data || '{}') });
}

async function updateOnboarding(ctx) {
  const auth = await requireAuth(ctx);
  if (auth.error) return auth.error;
  const body = await parseBody(ctx.request);
  if (!body) return errorResponse(400, 'MISSING_BODY', 'Request body required');
  const updates = [];
  const values = [];
  if (body.status) { updates.push('status = ?'); values.push(body.status); }
  if (body.step) { updates.push('step = ?'); values.push(body.step); }
  if (body.status === 'in_progress' && !body.startedAt) { updates.push('started_at = ?'); values.push(new Date().toISOString()); }
  if (body.data) { updates.push('data = ?'); values.push(JSON.stringify(body.data)); }
  updates.push('updated_at = ?'); values.push(new Date().toISOString());
  values.push(auth.userId);
  await ctx.db.prepare('UPDATE onboarding SET ' + updates.join(', ') + ' WHERE user_id = ?').bind(...values).run();
  return json({ success: true });
}

async function completeOnboarding(ctx) {
  const auth = await requireAuth(ctx);
  if (auth.error) return auth.error;
  const now = new Date().toISOString();
  await ctx.db.prepare('UPDATE onboarding SET status = ?, step = ?, completed_at = ?, updated_at = ? WHERE user_id = ?').bind('completed', 'complete', now, now, auth.userId).run();
  return json({ success: true, completedAt: now });
}
