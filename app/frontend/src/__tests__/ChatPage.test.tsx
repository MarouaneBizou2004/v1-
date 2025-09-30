import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

import i18n from '../i18n';
import { ChatPage } from '../features/chat/ChatPage';

vi.mock('../services/chatService', () => ({
  createSession: vi.fn().mockResolvedValue({ id: 'session', locale: 'en' }),
  fetchHistory: vi.fn().mockResolvedValue([]),
  sendMessage: vi.fn().mockResolvedValue({}),
  subscribeToReports: vi.fn().mockReturnValue({ on: vi.fn(), disconnect: vi.fn() })
}));

describe('ChatPage', () => {
  it('renders chat title', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <ChatPage />
        </MemoryRouter>
      </I18nextProvider>
    );

    expect(await screen.findByText(/City Support Chatbot/i)).toBeInTheDocument();
  });
});
