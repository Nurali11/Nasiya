import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, IsUUID, Min } from "class-validator";

export class CreatePaymentDto {
    @ApiProperty({ example: "uuid" })
    @IsString()
    @IsUUID()
    debtId: string;
}

export class AnyQuantityDto {
    @ApiProperty({ example: "123455667" })
    @IsString()
    @IsUUID()
    debtId: string;

    @ApiProperty({ example: 1000000, })
    @IsNumber()
    @Min(1)
    amount: number;
}
