import { ApiProperty } from "@nestjs/swagger"
import { IsArray, isNumber, IsNumber, IsOptional, IsString } from "class-validator"

export class CreateNasiyaDto {
    @ApiProperty({ example: "Test Sinov" })
    @IsString()
    name: string
    @ApiProperty({example:"10000000"})
    @IsNumber()
    sum:number
    @ApiProperty({ example: "10.10.2024" })
    @IsString()
    startDate: string
    @ApiProperty({ example: 1 })
    @IsNumber()
    period: number
    @ApiProperty({ example: "Iphone 14 Pro, boshlang'ich to'lovi bor" })
    @IsString()
    comment: string
    @ApiProperty({ example: "string" })
    @IsString()
    debtorId: string
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
    images?: string[]
}