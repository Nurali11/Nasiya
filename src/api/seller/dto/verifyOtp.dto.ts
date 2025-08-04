import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class VerifyOtpDto {
    @ApiProperty({ example: 'alex@gmail.com' })
    @IsString()
    email: string
    @ApiProperty({ example: '123456' })
    otp: string
}