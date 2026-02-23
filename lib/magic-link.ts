import { createHash, randomBytes } from 'crypto';
import { prisma } from './db';

const TOKEN_BYTES = 32;
const TTL_MINUTES = 30;

function hashToken(token: string): string {
  return createHash('sha256').update(token, 'utf8').digest('hex');
}

export async function createMagicLink(
  email: string,
  role: 'customer' | 'admin'
): Promise<string> {
  const token = randomBytes(TOKEN_BYTES).toString('base64url');
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + TTL_MINUTES * 60 * 1000);
  await prisma.magicLinkToken.create({
    data: { tokenHash, email, role, expiresAt },
  });
  return token;
}

type ConsumeResult =
  | { ok: true; email: string; role: 'customer' | 'admin' }
  | { ok: false; reason: string };

export async function consumeMagicLink(token: string): Promise<ConsumeResult> {
  const tokenHash = hashToken(token);
  const row = await prisma.magicLinkToken.findUnique({
    where: { tokenHash },
  });
  if (!row) return { ok: false, reason: 'invalid' };
  if (row.usedAt) return { ok: false, reason: 'used' };
  if (row.expiresAt < new Date()) return { ok: false, reason: 'expired' };
  await prisma.magicLinkToken.update({
    where: { id: row.id },
    data: { usedAt: new Date() },
  });
  return {
    ok: true,
    email: row.email,
    role: row.role as 'customer' | 'admin',
  };
}

/** Delete expired or used magic link tokens. Call from Vercel Cron or manually. */
export async function cleanupExpiredMagicLinks(): Promise<{ deleted: number }> {
  const result = await prisma.magicLinkToken.deleteMany({
    where: {
      OR: [{ expiresAt: { lt: new Date() } }, { usedAt: { not: null } }],
    },
  });
  return { deleted: result.count };
}
