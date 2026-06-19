import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('customers')
@UseGuards(JwtAuthGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  findAll(@Request() req: any) {
    return this.customersService.findAll(req.user.shopId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.customersService.findOne(id, req.user.shopId);
  }

  @Post()
  create(@Body() dto: CreateCustomerDto, @Request() req: any) {
    return this.customersService.create(dto, req.user.shopId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCustomerDto, @Request() req: any) {
    return this.customersService.update(id, dto, req.user.shopId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.customersService.remove(id, req.user.shopId);
  }
}
