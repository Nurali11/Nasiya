import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateDebtorDto } from './create-debtor.dto';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateDebtorDto extends PartialType(CreateDebtorDto) {
    @ApiProperty({ example: true })
    @IsBoolean()
    @IsOptional()
    star: boolean
}
