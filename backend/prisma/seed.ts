import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const demoEmail = 'demo@kadikoyoptik.com';

  const existingUser = await prisma.user.findUnique({
    where: { email: demoEmail },
  });

  if (existingUser) {
    console.log('Demo kullanıcı zaten mevcut.');
    return;
  }

  const shop = await prisma.shop.create({
    data: {
      name: 'Kadıköy Optik & Gözlük Atölyesi',
      address: 'Caferağa Mah. Moda Cad. No:78',
      city: 'İstanbul',
      district: 'Kadıköy',
      phone: '0216 456 78 90',
      email: 'info@kadikoyoptik.com',
      taxNo: 'OPT-34-2024-0078',
    },
  });

  const passwordHash = await bcrypt.hash('demo123456', 12);

  await prisma.user.create({
    data: {
      email: demoEmail,
      passwordHash,
      firstName: 'Emre',
      lastName: 'Korkmaz',
      role: 'admin',
      specialty: 'Optisyen',
      shopId: shop.id,
    },
  });

  const customer1 = await prisma.customer.create({
    data: {
      firstName: 'Aylin',
      lastName: 'Yıldız',
      phone: '0532 111 22 33',
      email: 'aylin.yildiz@email.com',
      address: 'Fenerbahçe Mah. Bağdat Cad. No:120',
      city: 'İstanbul',
      shopId: shop.id,
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      firstName: 'Murat',
      lastName: 'Şahin',
      phone: '0533 444 55 66',
      email: 'murat.sahin@email.com',
      address: 'Acıbadem Mah. Atatürk Cad. No:85',
      city: 'İstanbul',
      shopId: shop.id,
    },
  });

  const customer3 = await prisma.customer.create({
    data: {
      firstName: 'Selin',
      lastName: 'Arslan',
      phone: '0535 777 88 99',
      email: 'selin.arslan@email.com',
      address: 'Koşuyolu Mah. İnönü Cad. No:33',
      city: 'İstanbul',
      shopId: shop.id,
    },
  });

  const customer4 = await prisma.customer.create({
    data: {
      firstName: 'Can',
      lastName: 'Demirtaş',
      phone: '0542 333 44 55',
      email: 'can.demirtas@email.com',
      address: 'Göztepe Mah. Fahrettin Kerim Gökay Cad. No:15',
      city: 'İstanbul',
      shopId: shop.id,
    },
  });

  const now = new Date();
  const tomorrow = new Date(now.getTime() + 86400000);
  const nextWeek = new Date(now.getTime() + 7 * 86400000);

  const rx1 = await prisma.prescription.create({
    data: {
      sphR: -2.25,
      sphL: -2.0,
      cylR: -0.75,
      cylL: -0.5,
      axisR: 90,
      axisL: 85,
      pd: 63,
      doctorName: 'Dr. Hande Özkan',
      date: new Date(now.getTime() - 10 * 86400000),
      notes: 'Progresif cam önerildi',
      customerId: customer1.id,
      shopId: shop.id,
    },
  });

  const rx2 = await prisma.prescription.create({
    data: {
      sphR: -1.5,
      sphL: -1.75,
      cylR: -0.25,
      cylL: -0.25,
      axisR: 180,
      axisL: 175,
      pd: 61,
      doctorName: 'Dr. Hande Özkan',
      date: new Date(now.getTime() - 5 * 86400000),
      customerId: customer2.id,
      shopId: shop.id,
    },
  });

  await prisma.prescription.create({
    data: {
      sphR: -3.0,
      sphL: -2.75,
      cylR: -1.0,
      cylL: -0.75,
      axisR: 45,
      axisL: 50,
      addR: 2.0,
      addL: 2.0,
      pd: 64,
      doctorName: 'Dr. Hande Özkan',
      date: new Date(now.getTime() - 20 * 86400000),
      notes: 'Bifokal cam',
      customerId: customer3.id,
      shopId: shop.id,
    },
  });

  await prisma.appointment.createMany({
    data: [
      {
        date: tomorrow,
        duration: 30,
        type: 'exam',
        status: 'scheduled',
        notes: 'Göz muayenesi ve reçete kontrolü',
        opticianName: 'Emre Korkmaz',
        customerId: customer1.id,
        shopId: shop.id,
      },
      {
        date: tomorrow,
        duration: 20,
        type: 'fitting',
        status: 'confirmed',
        notes: 'Progresif cam uyum kontrolü',
        opticianName: 'Emre Korkmaz',
        customerId: customer2.id,
        shopId: shop.id,
      },
      {
        date: nextWeek,
        duration: 15,
        type: 'pickup',
        status: 'scheduled',
        notes: 'Gözlük teslimi',
        opticianName: 'Emre Korkmaz',
        customerId: customer3.id,
        shopId: shop.id,
      },
    ],
  });

  await prisma.order.createMany({
    data: [
      {
        frameBrand: 'Ray-Ban',
        frameModel: 'RB5154 Clubmaster',
        lensType: 'progressive',
        lensCoating: 'Anti-refle + Mavi ışık filtre',
        status: 'in_production',
        totalPrice: 8500,
        paidAmount: 4000,
        orderDate: new Date(now.getTime() - 7 * 86400000),
        deliveryDate: nextWeek,
        notes: 'Altın detaylı çerçeve',
        customerId: customer1.id,
        prescriptionId: rx1.id,
        shopId: shop.id,
      },
      {
        frameBrand: 'Oakley',
        frameModel: 'OX8156',
        lensType: 'single_vision',
        lensCoating: 'Anti-refle',
        status: 'ready',
        totalPrice: 4200,
        paidAmount: 4200,
        orderDate: new Date(now.getTime() - 14 * 86400000),
        deliveryDate: tomorrow,
        customerId: customer2.id,
        prescriptionId: rx2.id,
        shopId: shop.id,
      },
      {
        frameBrand: 'Vogue',
        frameModel: 'VO4195S',
        lensType: 'blue_light',
        lensCoating: 'Mavi ışık filtre',
        status: 'quoted',
        totalPrice: 2800,
        paidAmount: 0,
        orderDate: now,
        customerId: customer4.id,
        shopId: shop.id,
      },
      {
        frameBrand: 'Silhouette',
        frameModel: '5515',
        lensType: 'photochromic',
        lensCoating: 'Fotochromik + Anti-refle',
        status: 'delivered',
        totalPrice: 12000,
        paidAmount: 12000,
        orderDate: new Date(now.getTime() - 30 * 86400000),
        deliveryDate: new Date(now.getTime() - 20 * 86400000),
        customerId: customer3.id,
        shopId: shop.id,
      },
    ],
  });

  console.log('Demo veriler başarıyla oluşturuldu.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
