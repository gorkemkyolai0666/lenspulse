'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';

const navItems = [
  { href: '/dashboard', label: 'Panel', icon: '◈' },
  { href: '/customers', label: 'Müşteriler', icon: '◉' },
  { href: '/appointments', label: 'Randevular', icon: '◷' },
  { href: '/orders', label: 'Siparişler', icon: '◫' },
  { href: '/prescriptions', label: 'Reçeteler', icon: '◎' },
];

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { isDark, toggle } = useTheme();

  return (
    <div className="min-h-screen flex">
      <aside
        className="hidden md:flex w-64 flex-col fixed inset-y-0 left-0 z-30"
        style={{ background: 'var(--bg-sidebar)' }}
      >
        <div className="p-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <Link href="/dashboard" className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg"
              style={{ background: 'linear-gradient(135deg, #c9a227, #d4af37)', color: '#0f172a' }}
            >
              L
            </div>
            <div>
              <div className="font-display font-bold text-lg" style={{ color: 'var(--text-sidebar)' }}>
                LensPulse
              </div>
              <div className="text-xs" style={{ color: 'var(--text-sidebar-muted)' }}>
                Optik Yönetim
              </div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                style={{
                  background: active ? 'rgba(201, 162, 39, 0.15)' : 'transparent',
                  color: active ? '#d4af37' : 'var(--text-sidebar)',
                }}
              >
                <span aria-hidden="true">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-sidebar)' }}>
            {user?.firstName} {user?.lastName}
          </div>
          <div className="text-xs mb-3" style={{ color: 'var(--text-sidebar-muted)' }}>
            {user?.email}
          </div>
          <div className="flex gap-2">
            <button
              onClick={toggle}
              className="flex-1 py-2 rounded-lg text-xs transition-colors"
              style={{ background: 'var(--bg-sidebar-hover)', color: 'var(--text-sidebar)' }}
              aria-label="Tema değiştir"
            >
              {isDark ? '☀️ Açık' : '🌙 Koyu'}
            </button>
            <button
              onClick={() => {
                logout();
                router.push('/login');
              }}
              className="flex-1 py-2 rounded-lg text-xs transition-colors"
              style={{ background: 'var(--bg-sidebar-hover)', color: 'var(--text-sidebar-muted)' }}
            >
              Çıkış
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 md:ml-64">
        <header
          className="md:hidden sticky top-0 z-20 px-4 py-3 flex items-center justify-between border-b"
          style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
        >
          <span className="font-display font-bold" style={{ color: 'var(--text-primary)' }}>
            LensPulse
          </span>
          <div className="flex gap-2 overflow-x-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs px-2 py-1 rounded"
                style={{
                  color: pathname === item.href ? 'var(--accent)' : 'var(--text-muted)',
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </header>
        <main className="p-4 md:p-8 max-w-7xl">{children}</main>
      </div>
    </div>
  );
}
