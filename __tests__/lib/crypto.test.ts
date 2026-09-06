import { encryptMessage, decryptMessage, hasEncryptionKey } from '@/lib/crypto';

describe('Encryption', () => {
  it('encrypts and decrypts messages correctly', async () => {
    const plaintext = 'Hello, World!';
    const encrypted = await encryptMessage(plaintext);
    const decrypted = await decryptMessage(encrypted);
    expect(decrypted).toBe(plaintext);
  });

  it('produces different ciphertext for same plaintext', async () => {
    const plaintext = 'Same message';
    const enc1 = await encryptMessage(plaintext);
    const enc2 = await encryptMessage(plaintext);
    expect(enc1).not.toBe(enc2);
  });

  it('detects when encryption key exists', async () => {
    const hasKey = hasEncryptionKey();
    expect(typeof hasKey).toBe('boolean');
  });
});
