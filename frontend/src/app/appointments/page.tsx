'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { SidebarLayout } from '@/components/sidebar-layout';
import { formatDateTime, getStatusBadgeClass, getStatusLabel, getAppointmentTypeLabel } from '@/lib/utils';

export default function AppointmentsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date: '', type: 'exam', customerId: '', notes: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  const loadData = () => {
    Promise.all([api.getAppointments(), api.getCustomers()])
      .then(([appts, custs]) => {
        setAppointments(appts);
        setCustomers(custs);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { if (user) loadData(); }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createAppointment({ ...form, date: new Date(form.date).toISOString() });
      setShowForm(false);
      setForm({ date: '', type: 'exam', customerId: '', notes: '' });
      loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Hata oluştu');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu randevuyu silmek istediğinize emin misiniz?')) return;
    try {
      await api.deleteAppointment(id);
      loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Hata oluştu');
    }
  };

  if (authLoading || !user) return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse" style={{ color: 'var(--text-muted)' }}>Yükleniyor...</div></div>;

  return (
    <SidebarLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Randevular</h1>
          <p className="mt-1" style={{ color: 'var(--text-muted)' }}>{appointments.length} randevu</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-accent">{showForm ? 'İptal' : 'Yeni Randevu'}</button>
      </div>

      {error && <div className="p-4 rounded-lg mb-4 text-sm" style={{ background: 'rgba(220, 38, 38, 0.1)', color: 'var(--danger)' }}>{error}</div>}

      {showForm && (
        <div className="enterprise-card p-6 mb-6">
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Müşteri</label>
              <select value={form.customerId} onChange={(e) => setForm({ ...form, customerId: e.target.value })} className="input-field" required>
                <option value="">Seçin</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Tür</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input-field">
                <option value="exam">Göz Muayenesi</option>
                <option value="fitting">Uyum Kontrolü</option>
                <option value="pickup">Teslim</option>
                <option value="follow_up">Kontrol</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Tarih & Saat</label>
              <input type="datetime-local" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Not</label>
              <input type="text" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-field" />
            </div>
            <div className="md:col-span-2"><button type="submit" className="btn-primary">Kaydet</button></div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="animate-pulse" style={{ color: 'var(--text-muted)' }}>Yükleniyor...</div>
      ) : appointments.length === 0 ? (
        <div className="enterprise-card p-12 text-center" style={{ color: 'var(--text-muted)' }}>Randevu bulunamadı</div>
      ) : (
        <div className="space-y-3">
          {appointments.map((appt) => (
            <div key={appt.id} className="enterprise-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  {appt.customer?.firstName} {appt.customer?.lastName}
                </div>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  {getAppointmentTypeLabel(appt.type)} — {formatDateTime(appt.date)}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={getStatusBadgeClass(appt.status)}>{getStatusLabel(appt.status)}</span>
                <button onClick={() => handleDelete(appt.id)} className="text-xs px-3 py-1 rounded-lg" style={{ color: 'var(--danger)' }}>Sil</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </SidebarLayout>
  );
}
