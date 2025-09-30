import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';

import type { ChatMessage } from '../../services/chatService';
import { createSession, fetchHistory, sendMessage, subscribeToReports } from '../../services/chatService';

interface ChatForm {
  message: string;
}

export const ChatPage = () => {
  const { t, i18n } = useTranslation();
  const { register, handleSubmit, reset } = useForm<ChatForm>();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    createSession(i18n.language).then((session) => {
      setSessionId(session.id);
      fetchHistory(session.id).then(setMessages).catch(() => setMessages([]));
    });
  }, [i18n.language]);

  useEffect(() => {
    const socket = subscribeToReports();
    socket.on('report:created', (payload: { id: string }) => {
      setNotifications((prev) => [`New report created: ${payload.id}`, ...prev].slice(0, 3));
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const submit = handleSubmit(async (form) => {
    if (!sessionId) return;
    const optimistic: ChatMessage = { sender: 'user', text: form.message };
    setMessages((prev) => [...prev, optimistic]);
    reset();
    try {
      await sendMessage({ sessionId, sender: 'user', text: form.message });
    } catch (error) {
      setNotifications((prev) => [`Failed to send message`, ...prev].slice(0, 3));
    }
  });

  const direction = useMemo(() => (i18n.language === 'ar' ? 'rtl' : 'ltr'), [i18n.language]);

  return (
    <div className="grid gap-6 md:grid-cols-[2fr_1fr]" dir={direction}>
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold">{t('chat.title')}</h2>
        <div className="mb-4 flex h-80 flex-col gap-3 overflow-y-auto border border-slate-200 p-3">
          {messages.map((message, index) => (
            <div
              key={`${message.text}-${index}`}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                  message.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-800'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={submit} className="flex gap-2">
          <input
            {...register('message', { required: true })}
            placeholder={t('chat.placeholder')}
            className="flex-1 rounded border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          />
          <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white">
            {t('chat.send')}
          </button>
        </form>
      </div>
      <aside className="flex flex-col gap-4">
        <div className="rounded-lg bg-white p-4 shadow">
          <h3 className="mb-2 text-lg font-semibold">{t('report.title')}</h3>
          <p className="mb-4 text-sm text-slate-600">
            {t('chat.startReport')}
          </p>
          <a
            href="/report"
            className="block rounded bg-green-600 px-4 py-2 text-center text-sm font-semibold text-white"
          >
            {t('report.title')}
          </a>
        </div>
        <div className="rounded-lg bg-white p-4 shadow">
          <h3 className="mb-2 text-lg font-semibold">Realtime</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            {notifications.length === 0 ? <li>No notifications yet.</li> : null}
            {notifications.map((note, index) => (
              <li key={`${note}-${index}`}>{note}</li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
};
