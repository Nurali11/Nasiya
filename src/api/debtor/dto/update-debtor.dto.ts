import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateDebtorDto } from './create-debtor.dto';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateDebtorDto extends PartialType(CreateDebtorDto) {
    @ApiProperty()
    @IsString()
    fullname?: string

    @ApiProperty()
    @IsString()
    address?: string

    @ApiProperty()
    @IsString()
    comment?: string
    
    @ApiProperty({
            example: [
                'https://example.com/image1.jpg',
                'https://example.com/image2.jpg',
            ],
            type: [String],
            required: false,
        })
        @IsOptional()
        @IsArray()
        @IsString({ each: true })
        images?: string[];
    
        @ApiProperty({
            example: [
                "+998991234567",
                "+998992144567"]
        })
        phoneNumbers?: string[];

}
