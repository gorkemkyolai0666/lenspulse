import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { PrescriptionsService } from './prescriptions.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('prescriptions')
@UseGuards(JwtAuthGuard)
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Get()
  findAll(@Request() req: any) {
    return this.prescriptionsService.findAll(req.user.shopId);
  }

  @Post()
  create(@Body() dto: CreatePrescriptionDto, @Request() req: any) {
    return this.prescriptionsService.create(dto, req.user.shopId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePrescriptionDto, @Request() req: any) {
    return this.prescriptionsService.update(id, dto, req.user.shopId);
  }
}
