import { FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { ChatMessage } from '../services/chatApi';

interface Props {
  messages: ChatMessage[];
  onSend: (text: string) => Promise<void>;
}

export function ChatWindow({ messages, onSend }: Props): JSX.Element {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!input.trim()) return;
    try {
      setIsSending(true);
      await onSend(input.trim());
      setInput('');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex h-full flex-col rounded-lg bg-white shadow">
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map(message => (
          <div key={message._id ?? message.createdAt} className="rounded border border-slate-200 p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">{t(`chat.sender.${message.sender}`)}</span>
              <span className="text-xs text-slate-400">
                {new Date(message.createdAt ?? Date.now()).toLocaleTimeString()}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-700">{message.text}</p>
          </div>
        ))}
        {messages.length === 0 && <p className="text-center text-sm text-slate-500">{t('chat.empty')}</p>}
      </div>
      <form onSubmit={handleSubmit} className="border-t border-slate-200 p-4">
        <div className="flex gap-2">
          <input
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            value={input}
            placeholder={t('chat.placeholder')}
            onChange={event => setInput(event.target.value)}
          />
          <button
            type="submit"
            disabled={isSending}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {isSending ? t('chat.sending') : t('chat.send')}
          </button>
        </div>
      </form>
    </div>
  );
}
