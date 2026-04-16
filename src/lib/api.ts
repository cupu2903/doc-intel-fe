import { supabase } from '@/lib/supabase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function getHeaders() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return {
    'Content-Type': 'application/json',
    Authorization: session ? `Bearer ${session.access_token}` : '',
  };
}

export const api = {
  async get(endpoint: string) {
    const headers = await getHeaders();
    const res = await fetch(`${API_URL}${endpoint}`, { headers });
    if (!res.ok) throw new Error('API request failed');
    return res.json();
  },

  async post(endpoint: string, body: any) {
    const headers = await getHeaders();
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error('API request failed');
    return res.json();
  },

  async upload(file: File) {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_URL}/documents`, {
      method: 'POST',
      headers: {
        Authorization: session ? `Bearer ${session.access_token}` : '',
      },
      body: formData,
    });
    if (!res.ok) throw new Error('Upload failed');
    return res.json();
  },

  async delete(endpoint: string) {
    const headers = await getHeaders();
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
    });
    if (!res.ok) throw new Error('Delete failed');
    return res.json();
  },
};
