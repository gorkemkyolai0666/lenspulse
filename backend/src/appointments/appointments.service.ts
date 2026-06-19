import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(shopId: string) {
    return this.prisma.appointment.findMany({
      where: { shopId },
      include: { customer: true },
      orderBy: { date: 'asc' },
    });
  }

  async create(dto: CreateAppointmentDto, shopId: string) {
    return this.prisma.appointment.create({
      data: {
        date: new Date(dto.date),
        duration: dto.duration || 30,
        type: (dto.type as any) || 'exam',
        notes: dto.notes || '',
        opticianName: dto.opticianName || '',
        customerId: dto.customerId,
        shopId,
      },
      include: { customer: true },
    });
  }

  async update(id: string, dto: UpdateAppointmentDto, shopId: string) {
    const appointment = await this.prisma.appointment.findFirst({ where: { id, shopId } });
    if (!appointment) throw new NotFoundException('Randevu bulunamadı');

    const data: Record<string, unknown> = { ...dto };
    if (dto.date) data.date = new Date(dto.date);
    if (dto.status) data.status = dto.status as any;
    if (dto.type) data.type = dto.type as any;

    return this.prisma.appointment.update({
      where: { id },
      data,
      include: { customer: true },
    });
  }

  async remove(id: string, shopId: string) {
    const appointment = await this.prisma.appointment.findFirst({ where: { id, shopId } });
    if (!appointment) throw new NotFoundException('Randevu bulunamadı');
    return this.prisma.appointment.delete({ where: { id } });
  }
}
