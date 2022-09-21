import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateUserDto {

	@IsOptional()
	@IsString()
	password: string;

	@IsNotEmpty()
	@IsString()
	readonly bio: string;

	@IsNotEmpty()
	@IsString()
	@IsUrl()
	readonly image: string;
}
