'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse" style={{ color: 'var(--text-muted)' }}>Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(180deg, var(--bg-primary) 0%, #e2e8f0 100%)' }}>
      <header className="enterprise-card mx-4 mt-4 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg" style={{ background: 'linear-gradient(135deg, #c9a227, #d4af37)', color: '#0f172a' }}>
            L
          </div>
          <span className="font-display text-xl font-bold" style={{ color: 'var(--text-primary)' }}>LensPulse</span>
        </div>
        <nav className="flex items-center gap-3">
          <Link href="/login" className="btn-secondary text-sm">Giriş Yap</Link>
          <Link href="/register" className="btn-accent text-sm">Kayıt Ol</Link>
        </nav>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-6 badge-gold">
                Optik & Gözlük Atölyesi SaaS
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-6 leading-tight" style={{ color: 'var(--text-primary)' }}>
                Mağazanızı<br />
                <span style={{ color: 'var(--accent)' }}>Profesyonelce</span> Yönetin
              </h1>
              <p className="text-lg mb-8" style={{ color: 'var(--text-muted)' }}>
                Müşteri kayıtları, göz reçeteleri, çerçeve-lens siparişleri ve randevu takibini tek platformda birleştirin.
              </p>
              <div className="flex gap-4">
                <Link href="/register" className="btn-accent px-8 py-3">Hemen Başlayın</Link>
                <Link href="/login" className="btn-secondary px-8 py-3">Demo Hesap</Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: '👓', label: 'Reçete Takibi', desc: 'SPH, CYL, AXIS kayıtları' },
                { icon: '📦', label: 'Sipariş Yönetimi', desc: 'Çerçeve ve cam takibi' },
                { icon: '📅', label: 'Randevu', desc: 'Muayene ve teslim planı' },
                { icon: '👥', label: 'Müşteri CRM', desc: 'Tam müşteri geçmişi' },
              ].map((item) => (
                <div key={item.label} className="enterprise-card p-5">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{item.label}</div>
                  <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center py-6 text-sm" style={{ color: 'var(--text-muted)' }}>
        LensPulse &copy; 2026 — Optik mağaza yönetim platformu
      </footer>
    </div>
  );
}
