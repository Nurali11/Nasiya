import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class DebtDateDto {
    @ApiProperty({
        example: "07.08.2025",
        required: true
    })
    @IsString()
    endDate: string
}