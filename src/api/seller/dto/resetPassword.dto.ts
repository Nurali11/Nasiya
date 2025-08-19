import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ResetPasswordDto {
    @ApiProperty({ example: 'john@gmail.com' })
    @IsString()
    email: string;

    @ApiProperty({ example: '54321' })
    @IsString()
    newPassword: string;
}