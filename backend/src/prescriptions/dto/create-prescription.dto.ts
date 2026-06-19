import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class CreatePrescriptionDto {
  @IsString()
  customerId: string;

  @IsOptional()
  @IsNumber()
  sphR?: number;

  @IsOptional()
  @IsNumber()
  sphL?: number;

  @IsOptional()
  @IsNumber()
  cylR?: number;

  @IsOptional()
  @IsNumber()
  cylL?: number;

  @IsOptional()
  @IsNumber()
  axisR?: number;

  @IsOptional()
  @IsNumber()
  axisL?: number;

  @IsOptional()
  @IsNumber()
  addR?: number;

  @IsOptional()
  @IsNumber()
  addL?: number;

  @IsOptional()
  @IsNumber()
  pd?: number;

  @IsOptional()
  @IsString()
  doctorName?: string;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
