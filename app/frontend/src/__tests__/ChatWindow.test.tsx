import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';

import i18n from '../i18n/config';
import { ChatWindow } from '../components/ChatWindow';

const messages = [
  {
    _id: '1',
    sessionId: 's1',
    sender: 'bot' as const,
    text: 'Hello!',
    createdAt: new Date().toISOString()
  }
];

describe('ChatWindow', () => {
  it('renders messages and sends new message', async () => {
    const handleSend = vi.fn().mockResolvedValue(undefined);
    render(
      <I18nextProvider i18n={i18n}>
        <ChatWindow messages={messages} onSend={handleSend} />
      </I18nextProvider>
    );

    expect(screen.getByText('Hello!')).toBeInTheDocument();

    const input = screen.getByPlaceholderText('Describe the issue...');
    fireEvent.change(input, { target: { value: 'New message' } });
    fireEvent.click(screen.getByText('Send'));

    await waitFor(() => expect(handleSend).toHaveBeenCalledWith('New message'));
  });
});
