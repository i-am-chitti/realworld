import { IsOptional, IsNumber, Min, IsString, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CommentsQueryDto {

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
