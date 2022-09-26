import { Type } from "class-transformer";
import { IsNumber, IsString } from "class-validator";

export class DeleteCommentDto {

	@IsString()
	slug: string;


	@Type(() => Number)
	@IsNumber()
	id: number;
}
