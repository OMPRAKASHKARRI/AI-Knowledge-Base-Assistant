interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog = ({
  title,
  message,
  confirmLabel = 'Confirm',
  isLoading,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => (
  <div className="fixed inset-0 bg-ink-900/40 flex items-center justify-center z-50 px-4">
    <div className="card w-full max-w-sm p-6 bg-white">
      <h2 className="font-display font-semibold text-lg text-ink-900 mb-2">{title}</h2>
      <p className="text-sm text-ink-600 mb-6">{message}</p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="btn-secondary flex-1" disabled={isLoading}>
          Cancel
        </button>
        <button onClick={onConfirm} className="btn-danger flex-1" disabled={isLoading}>
          {isLoading ? 'Deleting…' : confirmLabel}
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmDialog;
