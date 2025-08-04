import { ApiProperty } from "@nestjs/swagger";

export class CreatePaymentDto {
    @ApiProperty({ example: "12345678" })
    debtorId: string;
    
    @ApiProperty({ example: "12345678" })
    sellerId: string;
}

export class PayAsYouWishDto {
    @ApiProperty({ example: "12345678" })
    debtorId: string;

    @ApiProperty({ example: "123455667" })
    debtId: string;

    @ApiProperty({ example: 2000000, })
    amount: number;

}
