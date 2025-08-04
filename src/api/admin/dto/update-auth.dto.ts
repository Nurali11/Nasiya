import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateAuthDto } from './create-auth.dto';
import { IsString } from 'class-validator';

export class UpdateAuthDto extends PartialType(CreateAuthDto) {
    @ApiProperty({ example: "John Doe" })
    @IsString()
    name?: string
    @ApiProperty({ example: "john@gmail.com" })
    @IsString()
    email?: string
    @ApiProperty({ example: "12345" })
    @IsString()
    password?: string
    @ApiProperty({ example: "+998123456789" })
    @IsString()
    phone?: string
}
