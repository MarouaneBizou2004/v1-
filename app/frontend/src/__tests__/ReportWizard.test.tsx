import { fireEvent, render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { vi } from 'vitest';

import i18n from '../i18n';
import { ReportWizard } from '../features/report/ReportWizard';

vi.mock('../services/reportService', () => ({
  submitReport: vi.fn().mockResolvedValue({ id: '1', trackingNumber: 'ABC123', status: 'new' })
}));

describe('ReportWizard', () => {
  it('advances steps and submits', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ReportWizard />
      </I18nextProvider>
    );

    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Broken streetlight' } });
    fireEvent.click(screen.getByText(/Next/i));

    fireEvent.change(screen.getByPlaceholderText(/Latitude/i), { target: { value: '48.8566' } });
    fireEvent.change(screen.getByPlaceholderText(/Longitude/i), { target: { value: '2.3522' } });
    fireEvent.click(screen.getByText(/Next/i));

    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: 'Light near the main square is broken.' }
    });
    fireEvent.click(screen.getByText(/Submit/i));

    expect(await screen.findByText(/Tracking number/i)).toBeInTheDocument();
  });
});
