/**
 * Session authentication utilities using HMAC-SHA256 signatures.
 * Uses Web Crypto API — compatible with both Node.js and Edge runtimes.
 */

export const SESSION_COOKIE_NAME = 'bytefolio_session';

/** 7-day session lifetime */
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function getSecret(): string {
  const secret =
    process.env.SESSION_SECRET ||
    process.env.ADMIN_PASSWORD;

  if (!secret) {
    console.warn(
      '[auth] SESSION_SECRET env var is not set. Using a weak fallback — ' +
        'set SESSION_SECRET in your .env.local for production.'
    );
    return 'bytefolio-dev-secret-please-set-SESSION_SECRET-in-env';
  }
  return secret;
}

async function getKey(): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

function arrayBufferToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToUint8Array(hex: string): Uint8Array {
  const bytes = new Uint8Array(Math.floor(hex.length / 2));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

function encodeBase64Url(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function decodeBase64Url(b64url: string): string {
  const padded =
    b64url.replace(/-/g, '+').replace(/_/g, '/') +
    '=='.slice(0, (4 - (b64url.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

/**
 * Signs a session token for the given admin email.
 * Returns a `base64url(payload).hexSignature` string.
 */
export async function signSession(email: string): Promise<string> {
  const payload = JSON.stringify({ email, iat: Date.now() });
  const key = await getKey();
  const encoder = new TextEncoder();
  const sigBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  const sig = arrayBufferToHex(sigBuffer);
  return `${encodeBase64Url(payload)}.${sig}`;
}

/**
 * Verifies a session token and returns the admin email if valid, or null if tampered/missing.
 */
export async function verifySession(token: string): Promise<string | null> {
  try {
    const dotIndex = token.lastIndexOf('.');
    if (dotIndex === -1) return null;

    const payloadB64 = token.slice(0, dotIndex);
    const sig = token.slice(dotIndex + 1);

    const payloadStr = decodeBase64Url(payloadB64);
    const key = await getKey();
    const encoder = new TextEncoder();
    const sigBytes = hexToUint8Array(sig);

    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes.buffer as ArrayBuffer,
      encoder.encode(payloadStr)
    );

    if (!valid) return null;

    const parsed = JSON.parse(payloadStr) as { email?: unknown };
    return typeof parsed.email === 'string' ? parsed.email : null;
  } catch {
    return null;
  }
}
