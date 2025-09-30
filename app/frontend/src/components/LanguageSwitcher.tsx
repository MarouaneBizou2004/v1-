import { useTranslation } from 'react-i18next';

const LANGS: Array<{ code: 'en' | 'fr' | 'ar'; label: string }> = [
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
  { code: 'ar', label: 'ع' }
];

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  return (
    <div className="flex items-center gap-2">
      {LANGS.map((lang) => (
        <button
          key={lang.code}
          type="button"
          onClick={() => i18n.changeLanguage(lang.code)}
          className={`rounded px-2 py-1 text-sm font-semibold ${
            i18n.language === lang.code ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};
