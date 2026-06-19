import { IsString, IsOptional, IsNumber, IsDateString, IsEnum } from 'class-validator';

export class UpdateOrderDto {
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
  @IsEnum(['quoted', 'confirmed', 'in_production', 'ready', 'delivered', 'cancelled'])
  status?: string;

  @IsOptional()
  @IsNumber()
  totalPrice?: number;

  @IsOptional()
  @IsNumber()
  paidAmount?: number;

  @IsOptional()
  @IsDateString()
  deliveryDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
