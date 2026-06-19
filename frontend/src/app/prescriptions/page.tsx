'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { SidebarLayout } from '@/components/sidebar-layout';
import { formatDate } from '@/lib/utils';

export default function PrescriptionsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      api.getPrescriptions().then(setPrescriptions).catch((e) => setError(e.message)).finally(() => setLoading(false));
    }
  }, [user]);

  if (authLoading || !user) return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse" style={{ color: 'var(--text-muted)' }}>Yükleniyor...</div></div>;

  return (
    <SidebarLayout>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Reçeteler</h1>
        <p className="mt-1" style={{ color: 'var(--text-muted)' }}>{prescriptions.length} reçete kaydı</p>
      </div>

      {error && <div className="p-4 rounded-lg mb-4 text-sm" style={{ background: 'rgba(220, 38, 38, 0.1)', color: 'var(--danger)' }}>{error}</div>}

      {loading ? (
        <div className="animate-pulse" style={{ color: 'var(--text-muted)' }}>Yükleniyor...</div>
      ) : prescriptions.length === 0 ? (
        <div className="enterprise-card p-12 text-center" style={{ color: 'var(--text-muted)' }}>Reçete bulunamadı</div>
      ) : (
        <div className="grid gap-4">
          {prescriptions.map((rx) => (
            <div key={rx.id} className="enterprise-card p-5">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                <div>
                  <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    {rx.customer?.firstName} {rx.customer?.lastName}
                  </div>
                  <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    {rx.doctorName || 'Doktor belirtilmemiş'} — {formatDate(rx.date)}
                  </div>
                </div>
                <div className="text-sm badge-gold">PD: {rx.pd} mm</div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="p-3 rounded-lg border" style={{ borderColor: 'var(--border-color)' }}>
                  <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Sağ Göz (SPH/CYL/AXIS)</div>
                  <div style={{ color: 'var(--text-primary)' }}>{rx.sphR} / {rx.cylR} / {rx.axisR}°</div>
                </div>
                <div className="p-3 rounded-lg border" style={{ borderColor: 'var(--border-color)' }}>
                  <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Sol Göz (SPH/CYL/AXIS)</div>
                  <div style={{ color: 'var(--text-primary)' }}>{rx.sphL} / {rx.cylL} / {rx.axisL}°</div>
                </div>
                <div className="p-3 rounded-lg border" style={{ borderColor: 'var(--border-color)' }}>
                  <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Add (Sağ/Sol)</div>
                  <div style={{ color: 'var(--text-primary)' }}>{rx.addR} / {rx.addL}</div>
                </div>
                <div className="p-3 rounded-lg border" style={{ borderColor: 'var(--border-color)' }}>
                  <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Not</div>
                  <div style={{ color: 'var(--text-secondary)' }}>{rx.notes || '—'}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </SidebarLayout>
  );
}
