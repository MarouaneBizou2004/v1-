import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { submitReport } from '../services/reportApi';

type Step = 1 | 2 | 3 | 4;

interface ReportFormValues {
  category: 'road' | 'lighting' | 'sanitation' | 'safety' | 'other';
  title: string;
  lat: number;
  lng: number;
  address?: string;
  description: string;
  images: FileList | null;
}

export function ReportWizard(): JSX.Element {
  const { t } = useTranslation();
  const [step, setStep] = useState<Step>(1);
  const [trackingId, setTrackingId] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ReportFormValues>({
    defaultValues: {
      category: 'road',
      title: '',
      lat: 0,
      lng: 0,
      address: '',
      description: '',
      images: null
    }
  });

  const onSubmit = handleSubmit(async values => {
    const payload = new FormData();
    payload.append('title', values.title);
    payload.append('description', values.description);
    payload.append('category', values.category);
    payload.append('location[lat]', String(values.lat));
    payload.append('location[lng]', String(values.lng));
    if (values.address) payload.append('location[address]', values.address);
    if (values.images) {
      Array.from(values.images).forEach(file => payload.append('images', file));
    }
    const report = await submitReport(payload);
    setTrackingId(report._id);
    setStep(4);
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        {[1, 2, 3, 4].map(current => (
          <span key={current} className={current === step ? 'font-semibold text-blue-600' : ''}>
            {t(`report.steps.${current}`)}
          </span>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-600">
            {t('report.fields.category')}
            <select className="mt-1 w-full rounded border border-slate-300 px-3 py-2" {...register('category')}>
              <option value="road">{t('report.categories.road')}</option>
              <option value="lighting">{t('report.categories.lighting')}</option>
              <option value="sanitation">{t('report.categories.sanitation')}</option>
              <option value="safety">{t('report.categories.safety')}</option>
              <option value="other">{t('report.categories.other')}</option>
            </select>
          </label>
          <label className="block text-sm font-medium text-slate-600">
            {t('report.fields.title')}
            <input
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              {...register('title', { required: true })}
            />
            {errors.title && <span className="text-xs text-red-600">{t('report.errors.title')}</span>}
          </label>
          <div className="flex justify-end">
            <button className="rounded bg-blue-600 px-4 py-2 text-sm text-white" onClick={() => setStep(2)}>
              {t('report.next')}
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <p className="text-sm text-slate-600">{t('report.mapHelper')}</p>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-slate-600">
              {t('report.fields.latitude')}
              <input
                type="number"
                step="any"
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
                {...register('lat', { valueAsNumber: true })}
              />
            </label>
            <label className="block text-sm font-medium text-slate-600">
              {t('report.fields.longitude')}
              <input
                type="number"
                step="any"
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
                {...register('lng', { valueAsNumber: true })}
              />
            </label>
          </div>
          <label className="block text-sm font-medium text-slate-600">
            {t('report.fields.addressOptional')}
            <input className="mt-1 w-full rounded border border-slate-300 px-3 py-2" {...register('address')} />
          </label>
          <div className="flex justify-between">
            <button className="rounded bg-slate-200 px-4 py-2 text-sm" onClick={() => setStep(1)}>
              {t('report.back')}
            </button>
            <button className="rounded bg-blue-600 px-4 py-2 text-sm text-white" onClick={() => setStep(3)}>
              {t('report.next')}
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <form className="space-y-4" onSubmit={onSubmit}>
          <label className="block text-sm font-medium text-slate-600">
            {t('report.fields.description')}
            <textarea
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              rows={4}
              {...register('description', { required: true })}
            />
            {errors.description && <span className="text-xs text-red-600">{t('report.errors.description')}</span>}
          </label>
          <label className="block text-sm font-medium text-slate-600">
            {t('report.fields.images')}
            <input type="file" multiple {...register('images')} />
          </label>
          <div className="flex justify-between">
            <button className="rounded bg-slate-200 px-4 py-2 text-sm" type="button" onClick={() => setStep(2)}>
              {t('report.back')}
            </button>
            <button className="rounded bg-blue-600 px-4 py-2 text-sm text-white" type="submit">
              {t('report.submit')}
            </button>
          </div>
        </form>
      )}

      {step === 4 && trackingId && (
        <div className="space-y-2 text-center">
          <h3 className="text-lg font-semibold text-slate-700">{t('report.confirmation')}</h3>
          <p className="text-sm text-slate-600">{t('report.tracking', { id: trackingId })}</p>
          <button className="rounded bg-blue-600 px-4 py-2 text-sm text-white" onClick={() => setStep(1)}>
            {t('report.reportAnother')}
          </button>
        </div>
      )}
    </div>
  );
}
