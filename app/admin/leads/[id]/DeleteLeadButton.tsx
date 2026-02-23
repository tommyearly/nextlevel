'use client';

import { useRef, useState, useCallback, useEffect } from 'react';

type Props = { leadId: string; leadName: string };

export default function DeleteLeadButton({ leadId, leadName }: Props) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const confirmedRef = useRef(false);

  const handleOpen = useCallback(() => {
    setOpen(true);
    dialogRef.current?.showModal();
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    dialogRef.current?.close();
    triggerRef.current?.focus();
  }, []);

  const handleTriggerClick = useCallback(
    (e: React.FormEvent) => {
      if (!confirmedRef.current) {
        e.preventDefault();
        handleOpen();
      }
    },
    [handleOpen]
  );

  const handleConfirm = useCallback(() => {
    confirmedRef.current = true;
    setOpen(false);
    dialogRef.current?.close();
    const form = document.getElementById(`delete-form-${leadId}`) as HTMLFormElement;
    form?.requestSubmit();
    confirmedRef.current = false;
    triggerRef.current?.focus();
  }, [leadId]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleCancel = (e: Event) => {
      e.preventDefault();
      handleClose();
    };
    dialog.addEventListener('cancel', handleCancel);
    return () => dialog.removeEventListener('cancel', handleCancel);
  }, [handleClose]);

  return (
    <>
      <form
        id={`delete-form-${leadId}`}
        action={`/api/admin/leads/${leadId}/delete`}
        method="POST"
        onSubmit={handleTriggerClick}
      >
        <button
          ref={triggerRef}
          type="submit"
          className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-surface"
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          Delete lead
        </button>
      </form>
      <dialog
        ref={dialogRef}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-desc"
        className="rounded-xl border border-white/10 bg-brand-surface p-6 shadow-xl backdrop:bg-black/50 backdrop:backdrop-blur-sm"
      >
        <h2 id="delete-dialog-title" className="font-heading text-lg font-semibold text-slate-50">
          Delete lead?
        </h2>
        <p id="delete-dialog-desc" className="mt-2 text-slate-400 text-sm">
          Delete &quot;{leadName}&quot;? This cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-surface"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="rounded-lg border border-red-500/50 bg-red-500/20 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-surface"
          >
            Delete
          </button>
        </div>
      </dialog>
    </>
  );
}
