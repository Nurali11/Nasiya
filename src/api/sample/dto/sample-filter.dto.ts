import { IsOptional, IsEnum, IsString, IsInt, Min, IsBoolean, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { FilterDto } from 'src/common/dto/filter.dto';

export class SampleFilterDto extends FilterDto {
  @IsOptional()
  @IsUUID()
  sellerId?: string;

  @IsOptional()
  status?: boolean;

  @IsOptional()
  @IsString()
  sortBy?: 'createdAt' | 'text' = 'createdAt';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}
