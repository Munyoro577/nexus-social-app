// ================================================================
// NEXUS API — Auth routes: /api/auth/*
// POST /api/auth/sign-up   — create account
// POST /api/auth/sign-in   — authenticate
// POST /api/auth/sign-out  — end session
// GET  /api/auth/session   — get current session
// ================================================================

import { json, errorResponse, parseBody, generateId, hashPassword, verifyPassword, createSessionToken, verifySessionToken, isValidEmail, isValidUsername } from '../lib/utils.js';

export async function handleAuth(request, ctx) {
  const path = ctx.url.pathname;
  const method = ctx.method;
  if (path === '/api/auth/sign-up' && method === 'POST') return signUp(ctx);
  if (path === '/api/auth/sign-in' && method === 'POST') return signIn(ctx);
  if (path === '/api/auth/sign-out' && method === 'POST') return signOut(ctx);
  if (path === '/api/auth/session' && method === 'GET') return getSession(ctx);
  return errorResponse(404, 'NOT_FOUND', 'Auth route not found');
}

async function signUp(ctx) {
  const body = await parseBody(ctx.request);
  if (!body || !body.email || !body.username || !body.password) return errorResponse(400, 'MISSING_FIELDS', 'Email, username, and password are required');
  if (!isValidEmail(body.email)) return errorResponse(400, 'INVALID_EMAIL', 'Please enter a valid email address');
  if (!isValidUsername(body.username)) return errorResponse(400, 'INVALID_USERNAME', 'Username must be at least 3 characters and contain only letters, numbers, and underscores');
  const db = ctx.db;
  const userId = generateId();
  const secret = ctx.env.JWT_SECRET || 'dev-secret';
  const passwordHash = await hashPassword(body.password, secret);
  try {
    await db.prepare('INSERT INTO users (id, email, username, password_hash) VALUES (?, ?, ?, ?)').bind(userId, body.email.toLowerCase(), body.username.toLowerCase(), passwordHash).run();
    await db.prepare('INSERT INTO profiles (id, user_id, display_name, username) VALUES (?, ?, ?, ?)').bind(generateId(), userId, body.username, body.username.toLowerCase()).run();
    await db.prepare('INSERT INTO privacy_settings (id, user_id) VALUES (?, ?)').bind(generateId(), userId).run();
    await db.prepare('INSERT INTO onboarding (id, user_id) VALUES (?, ?)').bind(generateId(), userId).run();
    const token = await createSessionToken(userId, secret);
    await db.prepare('INSERT INTO sessions (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)').bind(generateId(), userId, token, new Date(Date.now() + 86400000).toISOString()).run();
    return json({ token, user: { id: userId, email: body.email, username: body.username } }, 201);
  } catch (e) {
    if (e.message && e.message.includes('UNIQUE')) {
      if (e.message.includes('email')) return errorResponse(409, 'EMAIL_TAKEN', 'An account with this email already exists');
      if (e.message.includes('username')) return errorResponse(409, 'USERNAME_TAKEN', 'This username is already taken');
    }
    console.error('Sign-up error:', e);
    return errorResponse(500, 'INTERNAL_ERROR', 'Could not create account');
  }
}

async function signIn(ctx) {
  const body = await parseBody(ctx.request);
  if (!body || !body.email || !body.password) return errorResponse(400, 'MISSING_FIELDS', 'Email and password are required');
  const db = ctx.db;
  const secret = ctx.env.JWT_SECRET || 'dev-secret';
  const user = await db.prepare('SELECT * FROM users WHERE email = ?').bind(body.email.toLowerCase()).first();
  if (!user) return errorResponse(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
  const valid = await verifyPassword(body.password, user.password_hash, secret);
  if (!valid) return errorResponse(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
  const token = await createSessionToken(user.id, secret);
  await db.prepare('INSERT INTO sessions (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)').bind(generateId(), user.id, token, new Date(Date.now() + 86400000).toISOString()).run();
  return json({ token, user: { id: user.id, email: user.email, username: user.username } });
}

async function signOut(ctx) {
  if (!ctx.authToken) return json({ success: true });
  await ctx.db.prepare('DELETE FROM sessions WHERE token = ?').bind(ctx.authToken).run();
  return json({ success: true });
}

async function getSession(ctx) {
  if (!ctx.authToken) return json({ authenticated: false });
  const secret = ctx.env.JWT_SECRET || 'dev-secret';
  const payload = await verifySessionToken(ctx.authToken, secret);
  if (!payload) return json({ authenticated: false });
  const user = await ctx.db.prepare('SELECT id, email, username FROM users WHERE id = ?').bind(payload.userId).first();
  if (!user) return json({ authenticated: false });
  return json({ authenticated: true, user });
}
