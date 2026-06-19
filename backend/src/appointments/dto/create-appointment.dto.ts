import { IsString, IsOptional, IsDateString, IsNumber, IsEnum } from 'class-validator';

export class CreateAppointmentDto {
  @IsDateString()
  date: string;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsOptional()
  @IsEnum(['exam', 'fitting', 'pickup', 'follow_up'])
  type?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  opticianName?: string;

  @IsString()
  customerId: string;
}
