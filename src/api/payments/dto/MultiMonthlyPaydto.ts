import { ApiProperty } from '@nestjs/swagger';

export class MultiMonthPayDto {
  @ApiProperty({ example: "123456677"})
  debtorId: string;

  @ApiProperty({ example: "12345678"})
  debtId: string;

  @ApiProperty({ example: 2})
  monthsToPay: number;
}