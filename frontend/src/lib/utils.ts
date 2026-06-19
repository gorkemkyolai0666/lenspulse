import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatDateTime(date: string | Date) {
  return new Date(date).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
}

export function getStatusBadgeClass(status: string): string {
  const map: Record<string, string> = {
    completed: 'badge-success',
    delivered: 'badge-success',
    confirmed: 'badge-success',
    ready: 'badge-gold',
    scheduled: 'badge-info',
    quoted: 'badge-info',
    in_production: 'badge-warning',
    in_progress: 'badge-warning',
    cancelled: 'badge-danger',
    no_show: 'badge-danger',
  };
  return map[status] || 'badge-info';
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    scheduled: 'Planlandı',
    confirmed: 'Onaylandı',
    in_progress: 'Devam Ediyor',
    completed: 'Tamamlandı',
    cancelled: 'İptal',
    no_show: 'Gelmedi',
    quoted: 'Teklif',
    in_production: 'Üretimde',
    ready: 'Hazır',
    delivered: 'Teslim Edildi',
  };
  return labels[status] || status;
}

export function getAppointmentTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    exam: 'Göz Muayenesi',
    fitting: 'Uyum Kontrolü',
    pickup: 'Teslim',
    follow_up: 'Kontrol',
  };
  return labels[type] || type;
}

export function getLensTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    single_vision: 'Tek Odak',
    bifocal: 'Bifokal',
    progressive: 'Progresif',
    blue_light: 'Mavi Işık Filtre',
    photochromic: 'Fotochromik',
    contact: 'Kontakt Lens',
    other: 'Diğer',
  };
  return labels[type] || type;
}
