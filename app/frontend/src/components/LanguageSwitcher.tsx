import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
  { code: 'ar', label: 'العربية', rtl: true }
];

export function LanguageSwitcher(): JSX.Element {
  const { i18n } = useTranslation();

  return (
    <div className="flex gap-2">
      {languages.map(lang => (
        <button
          key={lang.code}
          className={`rounded px-2 py-1 text-sm ${i18n.language === lang.code ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'}`}
          onClick={() => {
            document.documentElement.dir = lang.rtl ? 'rtl' : 'ltr';
            void i18n.changeLanguage(lang.code);
          }}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
