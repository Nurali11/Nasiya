import { IsOptional, IsEnum, IsString, IsInt, Min, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { FilterDto } from 'src/common/dto/filter.dto';

export class SampleFilterDto extends FilterDto {
  @IsOptional()
  status?: boolean;

  @IsOptional()
  @IsString()
  sortBy?: 'createdAt' | 'text' = 'createdAt';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}
