import { cn } from '../../utils/cn';

export type AppView = 'cadastro' | 'listagem';

interface NavItem {
  key: AppView;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { key: 'cadastro', label: 'Cadastro' },
  { key: 'listagem', label: 'Listagem' },
];

interface NavBarProps {
  activeView: AppView;
  onNavigate: (view: AppView) => void;
}

export function NavBar({ activeView, onNavigate }: NavBarProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-14 max-w-6xl items-center gap-1 px-4 sm:px-6 lg:px-8">
        <span className="mr-4 shrink-0 text-sm font-semibold text-slate-900">Integrale Leads</span>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => onNavigate(item.key)}
            aria-current={activeView === item.key ? 'page' : undefined}
            className={cn(
              'rounded-md px-3 py-2 text-sm font-medium transition-colors',
              activeView === item.key
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            )}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
