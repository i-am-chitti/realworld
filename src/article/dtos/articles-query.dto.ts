import { IsOptional, IsNumber, Min, IsString, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class ArticlesQueryDto {
  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset?: number;
}
