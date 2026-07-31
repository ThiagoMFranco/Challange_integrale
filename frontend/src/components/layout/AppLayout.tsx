import type { ReactNode } from 'react';
import { NavBar, type AppView } from './NavBar';

interface AppLayoutProps {
  activeView: AppView;
  onNavigate: (view: AppView) => void;
  children: ReactNode;
}

export function AppLayout({ activeView, onNavigate, children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar activeView={activeView} onNavigate={onNavigate} />
      <main className="px-4 pb-12 pt-20 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
