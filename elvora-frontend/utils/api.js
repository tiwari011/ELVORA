const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = async (endpoint, options = {}) => {
  const token = options.admin
    ? localStorage.getItem('adminToken')
    : localStorage.getItem('token');
  
  const headers = { ...(options.headers || {}) };
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) headers.Authorization = `Bearer ${token}`;
  
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: options.method || 'GET',
    headers,
    body: options.body instanceof FormData
      ? options.body
      : options.body ? JSON.stringify(options.body) : undefined,
  });
  
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};