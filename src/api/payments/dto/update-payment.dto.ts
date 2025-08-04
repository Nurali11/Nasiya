import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePaymentDto } from './create-payment.dto';

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {}

export class PayAsYouWishDto {
    @ApiProperty({ example: "12345678" })
    debtorId?: string;

    @ApiProperty({ example: "123455667" })
    debtId?: string;

    @ApiProperty({ example: 2000000, })
    amount?: number;

}