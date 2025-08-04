import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class LoginSellerDto {
    @ApiProperty({ example: 'john@gmail.com' })
    @IsString()
    email: string

    @ApiProperty({ example: '12345' })
    @IsString()
    password: string;
}
