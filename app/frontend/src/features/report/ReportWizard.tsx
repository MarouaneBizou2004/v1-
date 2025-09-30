import { useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { ReportForm } from '../../services/reportService';
import { submitReport } from '../../services/reportService';

const categories: ReportForm['category'][] = ['road', 'lighting', 'sanitation', 'safety', 'other'];

type Step = 1 | 2 | 3 | 4;

const defaultValues: ReportForm = {
  title: '',
  description: '',
  category: 'road',
  location: { lat: 0, lng: 0, address: '' },
  images: []
};

export const ReportWizard = () => {
  const { t, i18n } = useTranslation();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [trackingNumber, setTrackingNumber] = useState<string | null>(null);
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<ReportForm>({ defaultValues });

  const direction = useMemo(() => (i18n.language === 'ar' ? 'rtl' : 'ltr'), [i18n.language]);
  const location = watch('location');

  const onSubmit = handleSubmit(async (data) => {
    const result = await submitReport(data);
    setTrackingNumber(result.trackingNumber);
    setCurrentStep(4);
  });

  const next = () => setCurrentStep((prev) => Math.min((prev + 1) as Step, 4 as Step));
  const back = () => setCurrentStep((prev) => Math.max((prev - 1) as Step, 1 as Step));

  return (
    <div className="rounded-lg bg-white p-6 shadow" dir={direction}>
      <h2 className="mb-4 text-xl font-semibold">{t('report.title')}</h2>
      <p className="mb-6 text-sm text-slate-500">
        {t('report.step', { current: currentStep, total: 4 })}
      </p>
      <form onSubmit={onSubmit} className="space-y-6">
        {currentStep === 1 && (
          <div className="space-y-4">
            <label className="block text-sm font-medium">
              {t('report.category')}
              <select
                {...register('category')}
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium">
              {t('report.titleLabel')}
              <input
                {...register('title', { required: true })}
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              />
              {errors.title && <span className="text-xs text-red-600">Required</span>}
            </label>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <label className="block text-sm font-medium">
              {t('report.location')}
              <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-3">
                <input
                  type="number"
                  step="any"
                  {...register('location.lat', { valueAsNumber: true })}
                  placeholder={t('report.latitude')}
                  className="rounded border border-slate-300 px-3 py-2"
                />
                <input
                  type="number"
                  step="any"
                  {...register('location.lng', { valueAsNumber: true })}
                  placeholder={t('report.longitude')}
                  className="rounded border border-slate-300 px-3 py-2"
                />
                <input
                  {...register('location.address')}
                  placeholder={t('report.address')}
                  className="rounded border border-slate-300 px-3 py-2"
                />
              </div>
            </label>
            <div className="rounded border border-dashed border-slate-300 p-4 text-sm text-slate-500">
              <p>Map integration placeholder – integrate Mapbox/Leaflet here.</p>
              <p className="mt-2">Current coordinates: {location.lat}, {location.lng}</p>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <label className="block text-sm font-medium">
              {t('report.description')}
              <textarea
                {...register('description', { required: true })}
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
                rows={5}
              />
              {errors.description && <span className="text-xs text-red-600">Required</span>}
            </label>
            <Controller
              control={control}
              name="images"
              render={({ field }) => (
                <label className="block text-sm font-medium">
                  {t('report.images')}
                  <input
                    type="file"
                    multiple
                    onChange={(event) => {
                      const files = event.target.files ? Array.from(event.target.files) : [];
                      field.onChange(files);
                    }}
                    className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
                  />
                </label>
              )}
            />
          </div>
        )}

        {currentStep === 4 && trackingNumber && (
          <div className="rounded border border-green-300 bg-green-50 p-4 text-sm text-green-800">
            {t('report.confirmation', { trackingNumber })}
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={back}
            disabled={currentStep === 1}
            className="rounded border border-slate-300 px-4 py-2 text-sm disabled:opacity-50"
          >
            {t('report.back')}
          </button>
          {currentStep < 3 && (
            <button type="button" onClick={next} className="rounded bg-blue-600 px-4 py-2 text-sm text-white">
              {t('report.next')}
            </button>
          )}
          {currentStep === 3 && (
            <button type="submit" className="rounded bg-green-600 px-4 py-2 text-sm text-white">
              {t('report.submit')}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
