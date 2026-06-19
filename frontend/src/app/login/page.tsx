'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Giriş başarısız');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail('demo@kadikoyoptik.com');
    setPassword('demo123456');
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12" style={{ background: 'var(--bg-sidebar)' }}>
        <div className="max-w-md">
          <div className="w-14 h-14 rounded-lg flex items-center justify-center font-bold text-2xl mb-6" style={{ background: 'linear-gradient(135deg, #c9a227, #d4af37)', color: '#0f172a' }}>
            L
          </div>
          <h2 className="font-display text-3xl font-bold mb-4" style={{ color: 'var(--text-sidebar)' }}>
            Optik işletmeniz için kurumsal yönetim
          </h2>
          <p style={{ color: 'var(--text-sidebar-muted)' }}>
            Reçete, sipariş ve müşteri verilerinizi güvenle yönetin. LensPulse ile mağazanızı dijitalleştirin.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="enterprise-card w-full max-w-md p-8">
          <div className="mb-8">
            <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Giriş Yap</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>LensPulse hesabınıza giriş yapın</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg text-sm" style={{ background: 'rgba(220, 38, 38, 0.1)', color: 'var(--danger)' }}>
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>E-posta</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="ornek@optik.com" required autoComplete="email" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Şifre</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" placeholder="En az 6 karakter" required autoComplete="current-password" />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>

            <button type="button" onClick={fillDemo} className="btn-secondary w-full text-sm">
              Demo Hesap Bilgilerini Doldur
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
            Hesabınız yok mu?{' '}
            <Link href="/register" className="font-medium" style={{ color: 'var(--accent)' }}>Kayıt Olun</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
