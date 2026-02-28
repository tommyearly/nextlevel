import { createHmac, timingSafeEqual } from 'crypto';

const ALG = 'sha256';
const SEP = '.';

function getSecret(): string {
  const s =
    process.env.UNSUBSCRIBE_SECRET ||
    process.env.SESSION_SECRET;
  if (!s || s.length < 16) {
    throw new Error('UNSUBSCRIBE_SECRET or SESSION_SECRET must be set (min 16 chars) for unsubscribe links');
  }
  return s;
}

/** Produce a signed token for unsubscribe link: base64(email).hmac */
export function signUnsubscribeToken(email: string): string {
  const secret = getSecret();
  const normalized = email.trim().toLowerCase();
  const payload = Buffer.from(normalized, 'utf8').toString('base64url');
  const sig = createHmac(ALG, secret).update(payload).digest('base64url');
  return `${payload}${SEP}${sig}`;
}

/** Verify token and return email or null */
export function verifyUnsubscribeToken(token: string): string | null {
  try {
    const secret = getSecret();
    const i = token.lastIndexOf(SEP);
    if (i === -1) return null;
    const payload = token.slice(0, i);
    const sig = token.slice(i + 1);
    const expected = createHmac(ALG, secret).update(payload).digest('base64url');
    if (sig.length !== expected.length || !timingSafeEqual(Buffer.from(sig, 'utf8'), Buffer.from(expected, 'utf8'))) {
      return null;
    }
    const email = Buffer.from(payload, 'base64url').toString('utf8');
    return email || null;
  } catch {
    return null;
  }
}
