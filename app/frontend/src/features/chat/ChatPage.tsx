import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { io, Socket } from 'socket.io-client';

import { ChatWindow } from '../../components/ChatWindow';
import { createChatSession, fetchChatHistory, sendChatMessage } from '../../services/chatApi';
import type { ChatMessage, ChatSession } from '../../services/chatApi';

let socket: Socket | null = null;

export function ChatPage(): JSX.Element {
  const { t, i18n } = useTranslation();
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    void (async () => {
      const newSession = await createChatSession(i18n.language);
      setSession(newSession);
      const history = await fetchChatHistory(newSession._id);
      setMessages(history);
    })();
  }, [i18n.language]);

  useEffect(() => {
    if (!socket) {
      socket = io(import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000');
    }
    return () => {
      socket?.disconnect();
      socket = null;
    };
  }, []);

  const handleSend = async (text: string) => {
    if (!session) return;
    const message = await sendChatMessage({ sessionId: session._id, sender: 'user', text });
    setMessages(prev => [...prev, message]);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <ChatWindow messages={messages} onSend={handleSend} />
      <div className="rounded-lg bg-white p-4 shadow">
        <h2 className="text-lg font-semibold text-slate-700">{t('notifications.title')}</h2>
        <p className="mt-2 text-sm text-slate-600">{t('notifications.subtitle')}</p>
        <ul className="mt-4 space-y-2 text-sm text-slate-600">
          <li>{t('notifications.realtime')}</li>
          <li>{t('notifications.multilingual')}</li>
          <li>{t('notifications.tracking')}</li>
        </ul>
      </div>
    </div>
  );
}
