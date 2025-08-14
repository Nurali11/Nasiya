import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateSampleDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  comment: string;
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
