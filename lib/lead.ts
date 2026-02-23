import { prisma } from '@/lib/db';

/** Session shape needed to resolve the current lead (from getSessionFromCookie / getSessionFromRequest) */
type SessionForLead = { email: string; leadId?: string };

/**
 * Resolve the lead for a customer session.
 * Uses leadId when present (after magic link), otherwise finds most recent by email.
 */
export async function getLeadForSession<T extends SessionForLead>(
  session: T,
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
