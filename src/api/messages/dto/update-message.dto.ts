import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateMessageDto } from './create-message.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateMessageDto extends PartialType(CreateMessageDto) {
    @ApiProperty({ example: false })
    @IsOptional()
    @IsBoolean()
    isSend: boolean
}
