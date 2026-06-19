'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { SidebarLayout } from '@/components/sidebar-layout';
import { formatDateTime, getStatusBadgeClass, getStatusLabel, getAppointmentTypeLabel } from '@/lib/utils';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      api.dashboardStats()
        .then(setStats)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (authLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse" style={{ color: 'var(--text-muted)' }}>Yükleniyor...</div></div>;
  }

  return (
    <SidebarLayout>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Merhaba, {user.firstName}</h1>
        <p className="mt-1" style={{ color: 'var(--text-muted)' }}>Optik mağazanızın güncel durumu</p>
      </div>

      {error && <div className="p-4 rounded-lg mb-6 text-sm" style={{ background: 'rgba(220, 38, 38, 0.1)', color: 'var(--danger)' }}>{error}</div>}

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="stat-card animate-pulse"><div className="h-4 rounded w-20 mb-3" style={{ background: 'var(--border-color)' }} /><div className="h-8 rounded w-12" style={{ background: 'var(--border-color)' }} /></div>
          ))}
        </div>
      ) : stats && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="stat-card">
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Toplam Müşteri</span>
              <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{stats.totalCustomers}</span>
            </div>
            <div className="stat-card">
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Bugünkü Randevu</span>
              <span className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>{stats.todayAppointments}</span>
            </div>
            <div className="stat-card">
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Bekleyen Sipariş</span>
              <span className="text-3xl font-bold" style={{ color: 'var(--warning)' }}>{stats.pendingOrders}</span>
            </div>
            <div className="stat-card">
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Teslime Hazır</span>
              <span className="text-3xl font-bold" style={{ color: 'var(--success)' }}>{stats.readyOrders}</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="enterprise-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Yaklaşan Randevular</h2>
                <Link href="/appointments" className="text-sm font-medium" style={{ color: 'var(--accent)' }}>Tümü</Link>
              </div>
              {stats.upcomingAppointments?.length === 0 ? (
                <p className="text-sm py-4 text-center" style={{ color: 'var(--text-muted)' }}>Yaklaşan randevu bulunmuyor</p>
              ) : (
                <div className="space-y-3">
                  {stats.upcomingAppointments?.map((appt: any) => (
                    <div key={appt.id} className="flex items-center justify-between p-3 rounded-lg border" style={{ borderColor: 'var(--border-color)' }}>
                      <div>
                        <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                          {appt.customer?.firstName} {appt.customer?.lastName}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{getAppointmentTypeLabel(appt.type)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{formatDateTime(appt.date)}</div>
                        <span className={getStatusBadgeClass(appt.status)}>{getStatusLabel(appt.status)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="enterprise-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Son Müşteriler</h2>
                <Link href="/customers" className="text-sm font-medium" style={{ color: 'var(--accent)' }}>Tümü</Link>
              </div>
              {stats.recentCustomers?.length === 0 ? (
                <p className="text-sm py-4 text-center" style={{ color: 'var(--text-muted)' }}>Henüz müşteri kaydı bulunmuyor</p>
              ) : (
                <div className="space-y-3">
                  {stats.recentCustomers?.map((customer: any) => (
                    <div key={customer.id} className="flex items-center justify-between p-3 rounded-lg border" style={{ borderColor: 'var(--border-color)' }}>
                      <div>
                        <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                          {customer.firstName} {customer.lastName}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{customer.phone}</div>
                      </div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{customer.city || '—'}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </SidebarLayout>
  );
}
