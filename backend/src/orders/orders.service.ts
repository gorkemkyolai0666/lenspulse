import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(shopId: string) {
    return this.prisma.order.findMany({
      where: { shopId },
      include: { customer: true, prescription: true },
      orderBy: { orderDate: 'desc' },
    });
  }

  async create(dto: CreateOrderDto, shopId: string) {
    return this.prisma.order.create({
      data: {
        customerId: dto.customerId,
        prescriptionId: dto.prescriptionId || null,
        frameBrand: dto.frameBrand || '',
        frameModel: dto.frameModel || '',
        lensType: (dto.lensType as any) || 'single_vision',
        lensCoating: dto.lensCoating || '',
        totalPrice: dto.totalPrice || 0,
        paidAmount: dto.paidAmount || 0,
        orderDate: new Date(dto.orderDate),
        deliveryDate: dto.deliveryDate ? new Date(dto.deliveryDate) : null,
        notes: dto.notes || '',
        shopId,
      },
      include: { customer: true, prescription: true },
    });
  }

  async update(id: string, dto: UpdateOrderDto, shopId: string) {
    const order = await this.prisma.order.findFirst({ where: { id, shopId } });
    if (!order) throw new NotFoundException('Sipariş bulunamadı');

    const data: Record<string, unknown> = { ...dto };
    if (dto.lensType) data.lensType = dto.lensType as any;
    if (dto.status) data.status = dto.status as any;
    if (dto.deliveryDate) data.deliveryDate = new Date(dto.deliveryDate);

    return this.prisma.order.update({
      where: { id },
      data,
      include: { customer: true, prescription: true },
    });
  }
}
