import { ApiProperty } from '@nestjs/swagger';

export class RemainingMonthsDto {
  @ApiProperty({
    example: "123456678",
  })
  debtorId: string;

  @ApiProperty({
    example: "12345678"
  })
  debtId: string;
}