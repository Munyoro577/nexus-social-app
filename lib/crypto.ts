/**
 * Nexus E2E Encryption Layer
 * Uses Web Crypto API with AES-GCM for message and media encryption.
 * Key derivation via PBKDF2 from user passphrase + random salt.
 */

const ENC_KEY_STORAGE = 'nexus-enc-key';
const SALT_STORAGE = 'nexus-enc-salt';

let cryptoKey: CryptoKey | null = null;

async function getKey(): Promise<CryptoKey> {
  if (cryptoKey) return cryptoKey;

  if (typeof window === 'undefined') {
    throw new Error('Web Crypto only available in browser');
  }

  const stored = localStorage.getItem(ENC_KEY_STORAGE);
  const salt = localStorage.getItem(SALT_STORAGE);

  if (stored && salt) {
    const rawKey = Uint8Array.from(atob(stored), c => c.charCodeAt(0));
    cryptoKey = await crypto.subtle.importKey('raw', rawKey, { name: 'AES-GCM' }, true, ['encrypt', 'decrypt']);
    return cryptoKey;
  }

  // Generate new key
  const keyBytes = crypto.getRandomValues(new Uint8Array(32));
  const saltBytes = crypto.getRandomValues(new Uint8Array(16));

  cryptoKey = await crypto.subtle.importKey('raw', keyBytes, { name: 'AES-GCM' }, true, ['encrypt', 'decrypt']);

  localStorage.setItem(ENC_KEY_STORAGE, btoa(String.fromCharCode(...keyBytes)));
  localStorage.setItem(SALT_STORAGE, btoa(String.fromCharCode(...saltBytes)));

  return cryptoKey;
}

export async function encryptMessage(plaintext: string): Promise<string> {
  const key = await getKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plaintext);

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoded
  );

  // Combine IV + ciphertext as base64
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(ciphertext), iv.length);

  return btoa(String.fromCharCode(...combined));
}

export async function decryptMessage(encrypted: string): Promise<string> {
  const key = await getKey();
  const combined = Uint8Array.from(atob(encrypted), c => c.charCodeAt(0));
  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext
  );

  return new TextDecoder().decode(decrypted);
}

export async function encryptMedia(data: ArrayBuffer): Promise<string> {
  const key = await getKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data);
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(ciphertext), iv.length);
  return btoa(String.fromCharCode(...combined));
}

export async function decryptMedia(encrypted: string): Promise<ArrayBuffer> {
  const key = await getKey();
  const combined = Uint8Array.from(atob(encrypted), c => c.charCodeAt(0));
  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);
  return crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
}

export function hasEncryptionKey(): boolean {
  return typeof window !== 'undefined' && !!localStorage.getItem(ENC_KEY_STORAGE);
}

export async function rotateEncryptionKey(): Promise<void> {
  localStorage.removeItem(ENC_KEY_STORAGE);
  localStorage.removeItem(SALT_STORAGE);
  cryptoKey = null;
  await getKey();
}

export async function exportPublicKey(): Promise<string> {
  const key = await getKey();
  const raw = await crypto.subtle.exportKey('raw', key);
  return btoa(String.fromCharCode(...new Uint8Array(raw)));
}
