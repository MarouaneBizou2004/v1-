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

export interface ReportResponse {
  _id: string;
  title: string;
  status: string;
  trackingNumber?: string;
}

export async function submitReport(payload: FormData): Promise<ReportResponse> {
  const { data } = await api.post('/api/reports', payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
}
