import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateSampleDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    comment: string
}
