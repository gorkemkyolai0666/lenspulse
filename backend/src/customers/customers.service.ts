import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(shopId: string) {
    return this.prisma.customer.findMany({
      where: { shopId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, shopId: string) {
    const customer = await this.prisma.customer.findFirst({
      where: { id, shopId },
      include: {
        appointments: { orderBy: { date: 'desc' }, take: 5 },
        orders: { orderBy: { orderDate: 'desc' }, take: 5 },
        prescriptions: { orderBy: { date: 'desc' }, take: 5 },
      },
    });
    if (!customer) throw new NotFoundException('Müşteri bulunamadı');
    return customer;
  }

  async create(dto: CreateCustomerDto, shopId: string) {
    return this.prisma.customer.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        email: dto.email || '',
        tcNo: dto.tcNo || '',
        birthDate: dto.birthDate ? new Date(dto.birthDate) : null,
        address: dto.address || '',
        city: dto.city || '',
        notes: dto.notes || '',
        shopId,
      },
    });
  }

  async update(id: string, dto: UpdateCustomerDto, shopId: string) {
    const customer = await this.prisma.customer.findFirst({ where: { id, shopId } });
    if (!customer) throw new NotFoundException('Müşteri bulunamadı');

    const data: Record<string, unknown> = { ...dto };
    if (dto.birthDate) data.birthDate = new Date(dto.birthDate);

    return this.prisma.customer.update({ where: { id }, data });
  }

  async remove(id: string, shopId: string) {
    const customer = await this.prisma.customer.findFirst({ where: { id, shopId } });
    if (!customer) throw new NotFoundException('Müşteri bulunamadı');

    await this.prisma.order.deleteMany({ where: { customerId: id } });
    await this.prisma.prescription.deleteMany({ where: { customerId: id } });
    await this.prisma.appointment.deleteMany({ where: { customerId: id } });

    return this.prisma.customer.delete({ where: { id } });
  }
}
