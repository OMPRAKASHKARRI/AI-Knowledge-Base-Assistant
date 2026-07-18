import type { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileStack, MessageSquare, History, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/documents', label: 'Documents', icon: FileStack },
  { to: '/chat', label: 'Ask AI', icon: MessageSquare },
  { to: '/history', label: 'History', icon: History },
];

const AppLogo = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
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

const MainLayout = ({ children }: { children: ReactNode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-ink-50">
      <aside className="w-64 shrink-0 border-r border-ink-200 bg-white flex flex-col">

        <div className="flex items-center gap-2.5 px-5 h-[68px] border-b border-ink-200">
          <AppLogo />
          <div className="leading-tight">
            <span className="block font-display text-sm font-semibold text-ink-900 tracking-tight">
              AI Knowledge Base
            </span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive ? 'bg-ledger-50 text-ledger-600' : 'text-ink-600 hover:bg-ink-100'
                }`
              }
            >
              <Icon className="w-4 h-4" strokeWidth={1.75} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-ink-200">
          <div className="px-3 py-2 mb-1">
            <p className="text-sm font-medium text-ink-800 truncate">{user?.name}</p>
            <p className="text-xs text-ink-400 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-ink-600 hover:bg-ink-100 transition-colors"
          >
            <LogOut className="w-4 h-4" strokeWidth={1.75} />
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-8 py-8">{children}</div>
      </main>
    </div>
  );
};

export default MainLayout;