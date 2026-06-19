import { IsString, IsOptional, IsNumber, IsDateString, IsEnum } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  customerId: string;

  @IsOptional()
  @IsString()
  prescriptionId?: string;

  @IsOptional()
  @IsString()
  frameBrand?: string;

  @IsOptional()
  @IsString()
  frameModel?: string;

  @IsOptional()
  @IsEnum(['single_vision', 'bifocal', 'progressive', 'blue_light', 'photochromic', 'contact', 'other'])
  lensType?: string;

  @IsOptional()
  @IsString()
  lensCoating?: string;

  @IsOptional()
  @IsNumber()
  totalPrice?: number;

  @IsOptional()
  @IsNumber()
  paidAmount?: number;

  @IsDateString()
  orderDate: string;

  @IsOptional()
  @IsDateString()
  deliveryDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
