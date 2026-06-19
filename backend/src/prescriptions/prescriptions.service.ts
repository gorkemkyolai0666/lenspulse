import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';

@Injectable()
export class PrescriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(shopId: string) {
    return this.prisma.prescription.findMany({
      where: { shopId },
      include: { customer: true },
      orderBy: { date: 'desc' },
    });
  }

  async create(dto: CreatePrescriptionDto, shopId: string) {
    return this.prisma.prescription.create({
      data: {
        customerId: dto.customerId,
        sphR: dto.sphR ?? 0,
        sphL: dto.sphL ?? 0,
        cylR: dto.cylR ?? 0,
        cylL: dto.cylL ?? 0,
        axisR: dto.axisR ?? 0,
        axisL: dto.axisL ?? 0,
        addR: dto.addR ?? 0,
        addL: dto.addL ?? 0,
        pd: dto.pd ?? 62,
        doctorName: dto.doctorName || '',
        date: new Date(dto.date),
        notes: dto.notes || '',
        shopId,
      },
      include: { customer: true },
    });
  }

  async update(id: string, dto: UpdatePrescriptionDto, shopId: string) {
    const prescription = await this.prisma.prescription.findFirst({ where: { id, shopId } });
    if (!prescription) throw new NotFoundException('Reçete bulunamadı');

    const data: Record<string, unknown> = { ...dto };
    if (dto.date) data.date = new Date(dto.date);

    return this.prisma.prescription.update({
      where: { id },
      data,
      include: { customer: true },
    });
  }
}
