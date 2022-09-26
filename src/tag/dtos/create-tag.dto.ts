import {IsString, IsNotEmpty, IsOptional} from 'class-validator';

export class CreateTagDto {

	@IsNotEmpty()
	@IsString()
	name: string;

	@IsOptional()
	@IsString()
	description?: string;

}
