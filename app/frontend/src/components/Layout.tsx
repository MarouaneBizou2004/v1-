import { Outlet, NavLink } from 'react-router-dom';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Layout(): JSX.Element {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <h1 className="text-xl font-semibold text-slate-700">MasterMyCity</h1>
          <nav className="flex items-center gap-4">
            <NavLink className={({ isActive }) => (isActive ? 'text-blue-600 font-medium' : 'text-slate-600')} to="/">
              Chat
            </NavLink>
            <NavLink
              className={({ isActive }) => (isActive ? 'text-blue-600 font-medium' : 'text-slate-600')}
              to="/report"
            >
              Report
            </NavLink>
            <LanguageSwitcher />
          </nav>
        </div>
      </header>
      <main className="mx-auto mt-6 max-w-5xl px-4">
        <Outlet />
      </main>
    </div>
  );
}
