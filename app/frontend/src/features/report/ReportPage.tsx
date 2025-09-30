import { useTranslation } from 'react-i18next';

import { ReportWizard } from '../../components/ReportWizard';

export function ReportPage(): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h2 className="text-xl font-semibold text-slate-700">{t('report.title')}</h2>
      <p className="mt-2 text-sm text-slate-600">{t('report.subtitle')}</p>
      <div className="mt-6">
        <ReportWizard />
      </div>
    </div>
  );
}
