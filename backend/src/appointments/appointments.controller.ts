import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  findAll(@Request() req: any) {
    return this.appointmentsService.findAll(req.user.shopId);
  }

  @Post()
  create(@Body() dto: CreateAppointmentDto, @Request() req: any) {
    return this.appointmentsService.create(dto, req.user.shopId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAppointmentDto, @Request() req: any) {
    return this.appointmentsService.update(id, dto, req.user.shopId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.appointmentsService.remove(id, req.user.shopId);
  }
}
