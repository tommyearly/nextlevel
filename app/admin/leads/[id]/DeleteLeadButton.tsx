'use client';

type Props = { leadId: string; leadName: string };

export default function DeleteLeadButton({ leadId, leadName }: Props) {
  const handleSubmit = (e: React.FormEvent) => {
    if (!confirm(`Delete lead "${leadName}"? This cannot be undone.`)) {
      e.preventDefault();
    }
  };

  return (
    <form action={`/api/admin/leads/${leadId}/delete`} method="POST" onSubmit={handleSubmit}>
      <button
        type="submit"
        className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-surface"
      >
        Delete lead
      </button>
    </form>
  );
}
