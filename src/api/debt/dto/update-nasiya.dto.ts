import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateNasiyaDto } from './create-nasiya.dto';

export class UpdateNasiyaDto extends PartialType(CreateNasiyaDto) { }
