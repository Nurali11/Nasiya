import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateAuthDto } from './create-auth.dto';
import { IsString } from 'class-validator';

export class UpdateAuthDto extends PartialType(CreateAuthDto) { }
