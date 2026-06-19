# LensPulse — Dağıtım Kılavuzu

## Demo Hesap

- **E-posta:** demo@kadikoyoptik.com
- **Şifre:** demo123456

## Ortam Değişkenleri

### Backend
- `DATABASE_URL` — PostgreSQL bağlantı dizesi
- `JWT_SECRET` — JWT imzalama anahtarı
- `FRONTEND_URL` — https://lenspulse.vercel.app
- `PORT` — 8080 (Railway production)

### Frontend
- `NEXT_PUBLIC_API_URL` — https://lenspulse-backend-production.up.railway.app/api

## Demo URL'leri

- **Frontend:** https://lenspulse.vercel.app
- **Backend API:** https://lenspulse-backend-production.up.railway.app/api
- **Health Check:** https://lenspulse-backend-production.up.railway.app/api/health

## Yerel Geliştirme

```bash
# Backend
cd backend && npm install --legacy-peer-deps
npx prisma migrate deploy && npx prisma db seed
npm run start:prod

# Frontend
cd frontend && npm install && npm run dev
```

Portlar: Backend 4036, Frontend 3036
