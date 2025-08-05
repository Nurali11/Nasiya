import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString, IsUUID } from 'class-validator';

export class PayForMonths {
  @ApiProperty({
    example: "12345678"
  })
  @IsString()
  @IsUUID()
  debtId: string;

  @ApiProperty({
    example: [1, 2, 3]
  })
  @IsArray()
  @IsNumber({}, { each: true })
  monthsToPay: number[]
}