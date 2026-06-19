# LensPulse — Ürün Gereksinim Dokümanı

## Vizyon

LensPulse, Türkiye'deki optik mağazaları ve gözlük atölyeleri için geliştirilmiş dijital yönetim platformudur. Müşteri kayıtlarını, göz reçetelerini, çerçeve-lens siparişlerini ve randevuları tek bir yerden yönetmelerini sağlar.

## Hedef Kitle

- Bağımsız optik mağazaları
- Gözlük atölyeleri
- Optik zincir mağazaları
- Optisyenler

## Sektör

Optik / gözlükçülük

## Tasarım Yönü

**Neo-banking / Enterprise**
- Renk paleti: Navy (#0f172a), Gold (#c9a227)
- Tipografi: Playfair Display (display) + DM Sans (body)
- Sidebar navigasyon, kurumsal kartlar
- Koyu/Açık mod desteği

## Temel Özellikler (MVP)

### 1. Müşteri Yönetimi
- Müşteri kayıt (ad, telefon, e-posta, TC, adres)
- Müşteri arama ve filtreleme

### 2. Reçete Yönetimi
- Göz reçetesi kayıtları (SPH, CYL, AXIS, ADD, PD)
- Doktor bilgisi ve tarih takibi

### 3. Sipariş Yönetimi
- Çerçeve ve lens sipariş takibi
- Durum yönetimi (teklif, onay, üretim, hazır, teslim)
- Fiyat ve ödeme takibi

### 4. Randevu Yönetimi
- Muayene, uyum kontrolü, teslim randevuları
- Durum takibi

### 5. Dashboard
- Toplam müşteri, bugünkü randevu, bekleyen sipariş, teslime hazır

## Teknik Stack

- **Backend:** NestJS, Prisma ORM, PostgreSQL
- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Auth:** JWT tabanlı kimlik doğrulama
- **Deploy:** Railway (backend + DB), Vercel (frontend)

## İş Modeli

B2B SaaS — mağaza bazında aylık abonelik

## Portlar

- Backend: 4036
- Frontend: 3036
