import { IsOptional } from "class-validator";
import { PaginationDto } from "./pagination.dto";

export class FilterDto extends PaginationDto {
  @IsOptional()
  search?: string;
}