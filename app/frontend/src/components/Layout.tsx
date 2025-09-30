import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { LanguageSwitcher } from './LanguageSwitcher';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const direction = i18n.language === 'ar' ? 'rtl' : 'ltr';
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900" dir={direction}>
      <header className="bg-white shadow">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <h1 className="text-2xl font-semibold">MasterMyCity</h1>
          <nav className="flex items-center gap-4">
            <Link
              to="/"
              className={`text-sm font-medium ${location.pathname === '/' ? 'text-blue-600' : 'text-slate-600'}`}
            >
              {t('nav.chat')}
            </Link>
            <Link
              to="/report"
              className={`text-sm font-medium ${location.pathname === '/report' ? 'text-blue-600' : 'text-slate-600'}`}
            >
              {t('nav.report')}
            </Link>
            <LanguageSwitcher />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
};
