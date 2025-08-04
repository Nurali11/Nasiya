import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class CreateAuthDto {
    @ApiProperty({example:"John Doe"})
    @IsString()
    name:string
    @ApiProperty({example:"john@gmail.com"})
    @IsString()
    email:string
    @ApiProperty({example:"12345"})
    @IsString()
    password:string
    @ApiProperty({example:"+998123456789"})
    @IsString()
    phone:string
}
