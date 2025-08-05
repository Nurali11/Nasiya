import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class LoginSellerDto {
    @ApiProperty({ example: 'John Doe' })
    @IsString()
    username: string

    @ApiProperty({ example: '12345' })
    @IsString()
    password: string;
}
