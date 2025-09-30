import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000'
});

api.interceptors.request.use(config => {
  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem('accessToken');
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export interface ChatSession {
  _id: string;
  locale: string;
}

export interface ChatMessage {
  _id: string;
  sessionId: string;
  sender: 'user' | 'bot' | 'staff';
  text: string;
  createdAt: string;
}

export async function createChatSession(locale: string): Promise<ChatSession> {
  const { data } = await api.post('/api/chat/session', { locale });
  return data;
}

export async function sendChatMessage(input: {
  sessionId: string;
  sender: 'user' | 'bot' | 'staff';
  text: string;
}): Promise<ChatMessage> {
  const { data } = await api.post('/api/chat/message', input);
  return data;
}

export async function fetchChatHistory(sessionId: string): Promise<ChatMessage[]> {
  const { data } = await api.get(`/api/chat/history/${sessionId}`);
  return data;
}
