'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { SidebarLayout } from '@/components/sidebar-layout';

export default function CustomersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', email: '', city: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  const loadCustomers = () => {
    api.getCustomers().then(setCustomers).catch((e) => setError(e.message)).finally(() => setLoading(false));
  };

  useEffect(() => { if (user) loadCustomers(); }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createCustomer(form);
      setShowForm(false);
      setForm({ firstName: '', lastName: '', phone: '', email: '', city: '' });
      loadCustomers();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Hata oluştu');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu müşteriyi silmek istediğinize emin misiniz?')) return;
    try {
      await api.deleteCustomer(id);
      loadCustomers();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Hata oluştu');
    }
  };

  const filtered = customers.filter((c) =>
    `${c.firstName} ${c.lastName} ${c.phone}`.toLowerCase().includes(search.toLowerCase())
  );

  if (authLoading || !user) return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse" style={{ color: 'var(--text-muted)' }}>Yükleniyor...</div></div>;

  return (
    <SidebarLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Müşteriler</h1>
          <p className="mt-1" style={{ color: 'var(--text-muted)' }}>{customers.length} kayıtlı müşteri</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-accent">{showForm ? 'İptal' : 'Yeni Müşteri'}</button>
      </div>

      {error && <div className="p-4 rounded-lg mb-4 text-sm" style={{ background: 'rgba(220, 38, 38, 0.1)', color: 'var(--danger)' }}>{error}</div>}

      {showForm && (
        <div className="enterprise-card p-6 mb-6">
          <h2 className="font-display text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Yeni Müşteri</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Ad" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="input-field" required />
            <input type="text" placeholder="Soyad" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="input-field" required />
            <input type="tel" placeholder="Telefon" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" required />
            <input type="email" placeholder="E-posta" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" />
            <input type="text" placeholder="Şehir" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input-field" />
            <div className="md:col-span-2"><button type="submit" className="btn-primary">Kaydet</button></div>
          </form>
        </div>
      )}

      <input type="search" placeholder="Müşteri ara..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field mb-4 max-w-md" aria-label="Müşteri ara" />

      {loading ? (
        <div className="animate-pulse" style={{ color: 'var(--text-muted)' }}>Yükleniyor...</div>
      ) : filtered.length === 0 ? (
        <div className="enterprise-card p-12 text-center" style={{ color: 'var(--text-muted)' }}>Müşteri bulunamadı</div>
      ) : (
        <div className="enterprise-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border-color)' }}>
                <th className="text-left p-4 font-medium" style={{ color: 'var(--text-muted)' }}>Ad Soyad</th>
                <th className="text-left p-4 font-medium hidden md:table-cell" style={{ color: 'var(--text-muted)' }}>Telefon</th>
                <th className="text-left p-4 font-medium hidden lg:table-cell" style={{ color: 'var(--text-muted)' }}>Şehir</th>
                <th className="text-right p-4 font-medium" style={{ color: 'var(--text-muted)' }}>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b last:border-0" style={{ borderColor: 'var(--border-color)' }}>
                  <td className="p-4 font-medium" style={{ color: 'var(--text-primary)' }}>{c.firstName} {c.lastName}</td>
                  <td className="p-4 hidden md:table-cell" style={{ color: 'var(--text-secondary)' }}>{c.phone}</td>
                  <td className="p-4 hidden lg:table-cell" style={{ color: 'var(--text-muted)' }}>{c.city || '—'}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(c.id)} className="text-xs px-3 py-1 rounded-lg" style={{ color: 'var(--danger)' }}>Sil</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SidebarLayout>
  );
}
