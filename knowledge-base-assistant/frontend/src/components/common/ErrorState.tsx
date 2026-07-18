import { AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

const ErrorState = ({ message, onRetry }: ErrorStateProps) => (
  <div className="flex flex-col items-center justify-center text-center gap-2 py-16 px-6 border border-signal-error/20 bg-signal-error/5 rounded-card">
    <AlertTriangle className="w-8 h-8 text-signal-error mb-2" strokeWidth={1.5} />
    <p className="font-medium text-ink-800">Something went wrong</p>
    <p className="text-sm text-ink-400 max-w-sm">{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="btn-secondary mt-3">
        Try again
      </button>
    )}
  </div>
);

export default ErrorState;
