import GlassCard from '@/components/GlassCard';
import FeedbackForm from '@/app/dashboard/FeedbackForm';
import { PROGRESS_STAGES } from '@/lib/progress';
import type { ProgressStageId } from '@/lib/progress';

type Stage = { id: ProgressStageId; customerLabel: string; customerHint: string };

type Props = {
  projectUrl: string | null;
  currentStage: Stage | null;
  currentStageIndex: number;
  customerFeedback: string | null;
  customerFeedbackAt: Date | null;
};

export default function ProgressSection({
  projectUrl,
  currentStage,
  currentStageIndex,
  customerFeedback,
  customerFeedbackAt,
}: Props) {
  return (
    <GlassCard className="p-6 sm:p-8 mt-6">
      <h2 className="font-heading text-lg font-semibold text-slate-50 mb-4">Your project progress</h2>
      {projectUrl ? (
        <div className="mb-6">
          <p className="text-slate-400 text-sm mb-2">Preview your site</p>
          <a
            href={projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-accent-blue/20 hover:bg-accent-blue/30 border border-accent-blue/40 px-4 py-2.5 text-sm font-medium text-accent-blue transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-surface"
          >
            View your site
            <span className="text-xs" aria-hidden>↗</span>
          </a>
        </div>
      ) : (
        <p className="text-slate-500 text-sm mb-4">A preview link will appear here when your site is ready to view.</p>
      )}
      {currentStage ? (
        <>
          <p className="text-slate-400 text-sm mb-3">Current stage</p>
          <div className="rounded-xl bg-white/5 border border-white/10 p-4 mb-4">
            <p className="font-heading font-semibold text-slate-50">{currentStage.customerLabel}</p>
            <p className="text-slate-400 text-sm mt-1">{currentStage.customerHint}</p>
            {currentStage.id === 'your_review' && (
              <FeedbackForm existingFeedback={customerFeedback} existingFeedbackAt={customerFeedbackAt} />
            )}
          </div>
        </>
      ) : (
        <p className="text-slate-500 text-sm mb-4">We&apos;ll update the stage as we work on your site.</p>
      )}
      <div className="space-y-2" role="list" aria-label="Project stages">
        {PROGRESS_STAGES.map((stage, idx) => {
          const isDone = currentStage ? idx < currentStageIndex : false;
          const isCurrent = currentStage ? idx === currentStageIndex : false;
          return (
            <div
              key={stage.id}
              role="listitem"
              className={`flex items-start gap-3 rounded-lg px-3 py-2 text-sm ${
                isCurrent ? 'bg-accent-blue/15 border border-accent-blue/40' : 'bg-white/5 border border-transparent'
              } ${isDone ? 'opacity-80' : ''}`}
            >
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  isDone ? 'bg-emerald-500/30 text-emerald-300' : isCurrent ? 'bg-accent-blue text-white' : 'bg-white/10 text-slate-400'
                }`}
                aria-hidden
              >
                {isDone ? '✓' : idx + 1}
              </span>
              <div>
                <p className={isCurrent ? 'text-slate-100 font-medium' : 'text-slate-400'}>{stage.customerLabel}</p>
                {isCurrent && <p className="text-slate-500 text-xs mt-0.5">{stage.customerHint}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
