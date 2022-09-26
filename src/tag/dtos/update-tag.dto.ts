import { IsString, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateTagDto {

	@IsOptional()
	@IsString()
	name?: string;

	@IsOptional()
	@IsString()
	description?: string;

}


export class UpdateTagPram {
	@Type(() => Number)
	@IsNumber()
	id: number;
}
