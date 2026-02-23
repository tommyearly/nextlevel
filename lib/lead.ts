import { prisma } from '@/lib/db';
import type { Prisma } from '@prisma/client';

/** Session shape needed to resolve the current lead (from getSessionFromCookie / getSessionFromRequest) */
type SessionForLead = { email: string; leadId?: string };

type LeadWithTicketMessages = Prisma.LeadGetPayload<{
  include: { ticketMessages: true };
}>;

/**
 * Resolve the lead for a customer session.
 * Uses leadId when present (after magic link), otherwise finds most recent by email.
 */
export async function getLeadForSession(
  session: SessionForLead,
  options: { includeTicketMessages: true }
): Promise<LeadWithTicketMessages | null>;

export async function getLeadForSession(
  session: SessionForLead,
  options?: { includeTicketMessages?: false }
): Promise<Awaited<ReturnType<typeof prisma.lead.findFirst>>>;

export async function getLeadForSession(
  session: SessionForLead,
  options?: { includeTicketMessages?: boolean }
) {
  return prisma.lead.findFirst({
    where: session.leadId
      ? { id: session.leadId, email: session.email }
      : { email: session.email },
    orderBy: { createdAt: 'desc' },
    ...(options?.includeTicketMessages && {
      include: { ticketMessages: { orderBy: { createdAt: 'asc' as const } } },
    }),
  });
}
