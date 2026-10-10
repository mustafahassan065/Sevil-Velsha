import { NavLink, Outlet, Link } from 'react-router-dom';
import { Logo, Page } from '../../components/ui';

const TABS = [
  ['/admin', 'Overview', true],
  ['/admin/rituals', 'Rituals', false],
  ['/admin/people', 'Users & emails', false],
  ['/admin/certificate', 'Certificate', false],
];

export default function AdminLayout() {
  return (
    <Page>
      <header className="border-b border-[#E7DFCF] bg-[#FFFDF9]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="rounded-full bg-[#16324A] px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">Admin</span>
          </div>
          <Link to="/dashboard" className="text-sm font-semibold text-[#1E4D6B] underline">
            Back to site
          </Link>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4">
          {TABS.map(([to, label, end]) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold ${
                  isActive ? 'border-[#1E4D6B] text-[#1E4D6B]' : 'border-transparent text-[#6E7B82] hover:text-[#16324A]'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </Page>
  );
}