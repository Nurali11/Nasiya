import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaymentDto {
  @ApiProperty({ example: 45 })
  @IsNumber()
  money: number;
}