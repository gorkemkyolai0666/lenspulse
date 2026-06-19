import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(shopId: string) {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart.getTime() + 86400000);
    const weekEnd = new Date(todayStart.getTime() + 7 * 86400000);

    const [
      totalCustomers,
      todayAppointments,
      weekAppointments,
      pendingOrders,
      readyOrders,
      totalOrders,
      recentCustomers,
      upcomingAppointments,
    ] = await Promise.all([
      this.prisma.customer.count({ where: { shopId } }),
      this.prisma.appointment.count({
        where: { shopId, date: { gte: todayStart, lt: todayEnd } },
      }),
      this.prisma.appointment.count({
        where: { shopId, date: { gte: todayStart, lt: weekEnd } },
      }),
      this.prisma.order.count({
        where: { shopId, status: { in: ['quoted', 'confirmed', 'in_production'] } },
      }),
      this.prisma.order.count({
        where: { shopId, status: 'ready' },
      }),
      this.prisma.order.count({ where: { shopId } }),
      this.prisma.customer.findMany({
        where: { shopId },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      this.prisma.appointment.findMany({
        where: {
          shopId,
          date: { gte: todayStart },
          status: { in: ['scheduled', 'confirmed'] },
        },
        include: { customer: true },
        orderBy: { date: 'asc' },
        take: 5,
      }),
    ]);

    return {
      totalCustomers,
      todayAppointments,
      weekAppointments,
      pendingOrders,
      readyOrders,
      totalOrders,
      recentCustomers,
      upcomingAppointments,
    };
  }
}
