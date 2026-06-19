const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4036/api';

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('lenspulse_token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401 && typeof window !== 'undefined') {
    localStorage.removeItem('lenspulse_token');
    localStorage.removeItem('lenspulse_user');
    window.location.href = '/login';
    throw new Error('Oturum süresi doldu');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Bir hata oluştu' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  health: () => fetchAPI('/health'),

  login: (email: string, password: string) =>
    fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  register: (data: { email: string; password: string; firstName: string; lastName: string; shopName: string; city?: string }) =>
    fetchAPI('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  me: () => fetchAPI('/auth/me'),

  dashboardStats: () => fetchAPI('/dashboard/stats'),

  getCustomers: () => fetchAPI('/customers'),
  getCustomer: (id: string) => fetchAPI(`/customers/${id}`),
  createCustomer: (data: Record<string, unknown>) => fetchAPI('/customers', { method: 'POST', body: JSON.stringify(data) }),
  updateCustomer: (id: string, data: Record<string, unknown>) => fetchAPI(`/customers/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteCustomer: (id: string) => fetchAPI(`/customers/${id}`, { method: 'DELETE' }),

  getAppointments: () => fetchAPI('/appointments'),
  createAppointment: (data: Record<string, unknown>) => fetchAPI('/appointments', { method: 'POST', body: JSON.stringify(data) }),
  updateAppointment: (id: string, data: Record<string, unknown>) => fetchAPI(`/appointments/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteAppointment: (id: string) => fetchAPI(`/appointments/${id}`, { method: 'DELETE' }),

  getOrders: () => fetchAPI('/orders'),
  createOrder: (data: Record<string, unknown>) => fetchAPI('/orders', { method: 'POST', body: JSON.stringify(data) }),
  updateOrder: (id: string, data: Record<string, unknown>) => fetchAPI(`/orders/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  getPrescriptions: () => fetchAPI('/prescriptions'),
  createPrescription: (data: Record<string, unknown>) => fetchAPI('/prescriptions', { method: 'POST', body: JSON.stringify(data) }),
  updatePrescription: (id: string, data: Record<string, unknown>) => fetchAPI(`/prescriptions/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
};
