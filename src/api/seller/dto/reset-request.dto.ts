import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ResetRequestDto {
    @ApiProperty({ example: 'john@gmail.com' })
    @IsString()
    email: string

}