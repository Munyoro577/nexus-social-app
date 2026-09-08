// ================================================================
// NEXUS API — Shared utilities
// ================================================================

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

export function errorResponse(status, code, message, details = null) {
  const body = { code, message };
  if (details) body.details = details;
  return json(body, status);
}

export function getRequestContext(request, env, ctx) {
  return {
    request, env, ctx,
    requestId: crypto.randomUUID(),
    db: env.DB,
    url: new URL(request.url),
    method: request.method,
    authToken: getAuthToken(request),
  };
}

export function getAuthToken(request) {
  const auth = request.headers.get('Authorization') || '';
  return auth.startsWith('Bearer ') ? auth.slice(7) : null;
}

export function generateId() { return crypto.randomUUID(); }

export function generateToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

// PBKDF2 password hashing — production-grade, Web Crypto API (Workers-safe)
export async function hashPassword(password, secret) {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iterations = 100000;
  const keyMaterial = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const derivedBits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' }, keyMaterial, 256
  );
  const hashHex = Array.from(new Uint8Array(derivedBits)).map(b => b.toString(16).padStart(2, '0')).join('');
  const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
  return 'pbkdf2$' + iterations + '$' + saltHex + '$' + hashHex;
}

export async function verifyPassword(password, storedHash, secret) {
  if (!storedHash || !storedHash.startsWith('pbkdf2$')) return false;
  const parts = storedHash.split('$');
  const iterations = parseInt(parts[1]);
  const saltHex = parts[2];
  const expectedHash = parts[3];
  const salt = new Uint8Array(saltHex.match(/.{2}/g).map(b => parseInt(b, 16)));
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const derivedBits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' }, keyMaterial, 256
  );
  const hashHex = Array.from(new Uint8Array(derivedBits)).map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex === expectedHash;
}

// HMAC-based session token — signed with JWT_SECRET
export async function createSessionToken(userId, secret) {
  const payload = { userId, iat: Date.now(), exp: Date.now() + 86400000 };
  const payloadStr = btoa(JSON.stringify(payload));
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret || 'dev-secret'), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(payloadStr));
  const sigHex = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
  return payloadStr + '.' + sigHex;
}

export async function verifySessionToken(token, secret) {
  if (!token || !token.includes('.')) return null;
  const [payloadStr, sigHex] = token.split('.');
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret || 'dev-secret'), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const expectedSig = await crypto.subtle.sign('HMAC', key, encoder.encode(payloadStr));
  const expectedHex = Array.from(new Uint8Array(expectedSig)).map(b => b.toString(16).padStart(2, '0')).join('');
  if (sigHex !== expectedHex) return null;
  try {
    const payload = JSON.parse(atob(payloadStr));
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch (e) { return null; }
}

export async function requireAuth(ctxObj) {
  if (!ctxObj.authToken) return { error: errorResponse(401, 'UNAUTHORIZED', 'Authentication required') };
  const payload = await verifySessionToken(ctxObj.authToken, ctxObj.env.JWT_SECRET || 'dev-secret');
  if (!payload) return { error: errorResponse(401, 'INVALID_TOKEN', 'Invalid or expired session') };
  return { userId: payload.userId };
}

export async function parseBody(request) {
  try { return await request.json(); } catch (e) { return null; }
}

export function isValidEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
export function isValidUsername(username) { return username && username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username); }
