import type { LucideIcon } from 'lucide-react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const EmptyState = ({ icon: Icon = Inbox, title, description, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center text-center gap-2 py-16 px-6 border border-dashed border-ink-200 rounded-card">
    <Icon className="w-8 h-8 text-ink-400 mb-2" strokeWidth={1.5} />
    <p className="font-medium text-ink-800">{title}</p>
    {description && <p className="text-sm text-ink-400 max-w-sm">{description}</p>}
    {action && <div className="mt-3">{action}</div>}
  </div>
);

export default EmptyState;
