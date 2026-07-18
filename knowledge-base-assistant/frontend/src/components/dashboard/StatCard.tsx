import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  tone?: 'default' | 'warning';
}

const StatCard = ({ label, value, icon: Icon, tone = 'default' }: StatCardProps) => (
  <div className="card p-5">
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs font-mono uppercase tracking-wide text-ink-400">{label}</span>
      <Icon className={`w-4 h-4 ${tone === 'warning' ? 'text-stamp-600' : 'text-ink-400'}`} strokeWidth={1.75} />
    </div>
    <p className="text-3xl font-display font-semibold text-ink-900">{value}</p>
  </div>
);

export default StatCard;
