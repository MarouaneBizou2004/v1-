import { io, type Socket } from 'socket.io-client';

import api from './apiClient';

export interface ChatMessage {
  id?: string;
  sender: 'user' | 'bot' | 'staff';
  text: string;
  createdAt?: string;
}

export const createSession = async (locale: string) => {
  const response = await api.post('/api/chat/session', { locale });
  return response.data as { id: string; locale: string };
};

export const sendMessage = async (message: ChatMessage & { sessionId: string }) => {
  const response = await api.post('/api/chat/message', message);
  return response.data;
};

export const fetchHistory = async (sessionId: string) => {
  const response = await api.get(`/api/chat/history/${sessionId}`);
  return response.data as ChatMessage[];
};

export const subscribeToReports = () => {
  const socket: Socket = io(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}/reports`);
  return socket;
};
