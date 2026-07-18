import type { ReactNode } from 'react';

const AppLogo = () => (
  <svg width="34" height="34" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect width="32" height="32" rx="8" fill="#2A4B7C"/>
    <rect x="8" y="6" width="13" height="17" rx="1.5" fill="white" fillOpacity="0.15"/>
    <rect x="8" y="6" width="13" height="17" rx="1.5" stroke="white" strokeOpacity="0.45" strokeWidth="1"/>
    <line x1="11" y1="11" x2="18" y2="11" stroke="white" strokeOpacity="0.7" strokeWidth="1" strokeLinecap="round"/>
    <line x1="11" y1="14" x2="18" y2="14" stroke="white" strokeOpacity="0.7" strokeWidth="1" strokeLinecap="round"/>
    <line x1="11" y1="17" x2="15" y2="17" stroke="white" strokeOpacity="0.7" strokeWidth="1" strokeLinecap="round"/>
    <circle cx="21" cy="21" r="7" fill="#2A4B7C"/>
    <circle cx="21" cy="21" r="6" fill="#E8A33D"/>
    <path d="M22.5 16.5L19.5 21H21.5L20.5 25.5L24 20H21.5L22.5 16.5Z" fill="white"/>
  </svg>
);

const AuthLayout = ({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) => (
  <div className="min-h-screen flex items-center justify-center bg-ink-50 px-4">
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2.5 mb-6">
          <AppLogo />
          <span className="font-display text-lg font-semibold text-ink-900">AI Knowledge Base</span>
        </div>
        <h1 className="text-2xl font-display font-semibold text-ink-900">{title}</h1>
        <p className="text-sm text-ink-400 mt-1.5">{subtitle}</p>
      </div>
      <div className="card p-6">{children}</div>
    </div>
  </div>
);

export default AuthLayout;