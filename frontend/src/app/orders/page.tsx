'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { SidebarLayout } from '@/components/sidebar-layout';
import { formatCurrency, formatDate, getStatusBadgeClass, getStatusLabel, getLensTypeLabel } from '@/lib/utils';

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      api.getOrders().then(setOrders).catch((e) => setError(e.message)).finally(() => setLoading(false));
    }
  }, [user]);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await api.updateOrder(id, { status });
      const updated = await api.getOrders();
      setOrders(updated);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Hata oluştu');
    }
  };

  if (authLoading || !user) return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse" style={{ color: 'var(--text-muted)' }}>Yükleniyor...</div></div>;

  return (
    <SidebarLayout>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Siparişler</h1>
        <p className="mt-1" style={{ color: 'var(--text-muted)' }}>{orders.length} sipariş kaydı</p>
      </div>

      {error && <div className="p-4 rounded-lg mb-4 text-sm" style={{ background: 'rgba(220, 38, 38, 0.1)', color: 'var(--danger)' }}>{error}</div>}

      {loading ? (
        <div className="animate-pulse" style={{ color: 'var(--text-muted)' }}>Yükleniyor...</div>
      ) : orders.length === 0 ? (
        <div className="enterprise-card p-12 text-center" style={{ color: 'var(--text-muted)' }}>Sipariş bulunamadı</div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="enterprise-card p-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    {order.customer?.firstName} {order.customer?.lastName}
                  </div>
                  <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                    {order.frameBrand} {order.frameModel} — {getLensTypeLabel(order.lensType)}
                  </div>
                  <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    Sipariş: {formatDate(order.orderDate)}
                    {order.deliveryDate && ` · Teslim: ${formatDate(order.deliveryDate)}`}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-bold" style={{ color: 'var(--accent)' }}>{formatCurrency(order.totalPrice)}</span>
                  <span className={getStatusBadgeClass(order.status)}>{getStatusLabel(order.status)}</span>
                  {order.status === 'in_production' && (
                    <button onClick={() => handleStatusUpdate(order.id, 'ready')} className="btn-secondary text-xs">Hazır İşaretle</button>
                  )}
                  {order.status === 'ready' && (
                    <button onClick={() => handleStatusUpdate(order.id, 'delivered')} className="btn-accent text-xs">Teslim Et</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </SidebarLayout>
  );
}
