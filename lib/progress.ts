/** Project progress stages: admin sets one, customer sees it in their dashboard */

export const PROGRESS_STAGES = [
  { id: 'brief_received', label: 'Brief received', customerLabel: "We've got your brief", customerHint: "Your project is in our queue. We'll be in touch soon." },
  { id: 'design_started', label: 'Design in progress', customerLabel: 'Design in progress', customerHint: "We're sketching and designing your site." },
  { id: 'design_review', label: 'Design ready for review', customerLabel: 'Design ready for you', customerHint: 'Take a look at the design and tell us what you think.' },
  { id: 'development', label: 'Building your site', customerLabel: 'Building your site', customerHint: "We're turning the design into your live site." },
  { id: 'your_review', label: 'Ready for your review', customerLabel: 'Ready for your review', customerHint: 'Preview your site above and send us any feedback.' },
  { id: 'revisions', label: 'Revisions in progress', customerLabel: 'Applying your feedback', customerHint: "We're making the changes you asked for." },
  { id: 'final_checks', label: 'Final checks', customerLabel: 'Final checks', customerHint: 'Last checks before we go live.' },
  { id: 'live', label: 'Live!', customerLabel: 'Your site is live!', customerHint: 'Go take a look — your site is live.' },
] as const;

export type ProgressStageId = (typeof PROGRESS_STAGES)[number]['id'];

export function getProgressStage(id: string | null | undefined) {
  if (!id) return null;
  return PROGRESS_STAGES.find((s) => s.id === id) ?? null;
}

export function getProgressStageIndex(id: string | null | undefined): number {
  const idx = PROGRESS_STAGES.findIndex((s) => s.id === id);
  return idx >= 0 ? idx : 0;
}
