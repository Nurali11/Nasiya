import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsOptional, IsString } from "class-validator"

export class CreateDebtorDto {
    @ApiProperty({ example: "John Doe" })
    @IsString()
    fullname: string

    @ApiProperty({ example: "Tashkent Chilonzor" })
    @IsString()
    address: string

    @ApiProperty({ example: "this comment is about debtor" })
    @IsString()
    comment: string

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
