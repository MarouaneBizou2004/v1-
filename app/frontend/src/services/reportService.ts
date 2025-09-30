import api from './apiClient';

export interface ReportForm {
  title: string;
  description: string;
  category: 'road' | 'lighting' | 'sanitation' | 'safety' | 'other';
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  images: File[];
}

export const submitReport = async (form: ReportForm) => {
  const data = new FormData();
  data.append('title', form.title);
  data.append('description', form.description);
  data.append('category', form.category);
  data.append('location', JSON.stringify(form.location));
  form.images.forEach((file) => data.append('images', file));
  const response = await api.post('/api/reports', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data as { id: string; trackingNumber: string; status: string };
};
