import { IsEmail, IsNotEmpty, IsString, IsArray, IsOptional } from 'class-validator';

export class CreateArticleDto {

	@IsNotEmpty()
	@IsString()
	readonly title: string;

	@IsNotEmpty()
	@IsString()
	readonly description: string;

	@IsNotEmpty()
	@IsString()
	readonly body: string;

	@IsArray()
	@IsOptional()
	readonly tagList: string[];
  }
